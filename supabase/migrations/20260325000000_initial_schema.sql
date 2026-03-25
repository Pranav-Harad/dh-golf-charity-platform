-- Enums
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'lapsed');
CREATE TYPE subscription_plan AS ENUM ('monthly', 'yearly');
CREATE TYPE draw_type AS ENUM ('random', 'algorithmic');
CREATE TYPE draw_status AS ENUM ('simulation', 'published');
CREATE TYPE match_type AS ENUM ('5_match', '4_match', '3_match');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE payout_status AS ENUM ('pending', 'paid');

-- charities
CREATE TABLE charities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    image_url TEXT,
    upcoming_events JSONB DEFAULT '[]',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- users
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    subscription_status subscription_status DEFAULT 'inactive',
    subscription_plan subscription_plan,
    subscription_renewal_date TIMESTAMPTZ,
    charity_id UUID REFERENCES charities(id) ON DELETE SET NULL,
    charity_contribution_percent INT DEFAULT 10 CHECK (charity_contribution_percent >= 10 AND charity_contribution_percent <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- scores
CREATE TABLE scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    score INT NOT NULL CHECK (score >= 1 AND score <= 45),
    score_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- draws
CREATE TABLE draws (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month TEXT NOT NULL,
    draw_numbers INT[] NOT NULL CHECK (array_length(draw_numbers, 1) <= 5),
    draw_type draw_type NOT NULL,
    status draw_status DEFAULT 'simulation',
    jackpot_rollover BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- winners
CREATE TABLE winners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    draw_id UUID REFERENCES draws(id) ON DELETE CASCADE NOT NULL,
    match_type match_type NOT NULL,
    prize_amount NUMERIC NOT NULL DEFAULT 0,
    proof_url TEXT,
    verification_status verification_status DEFAULT 'pending',
    payout_status payout_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- prize_pools
CREATE TABLE prize_pools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_id UUID REFERENCES draws(id) ON DELETE CASCADE NOT NULL,
    total_pool NUMERIC NOT NULL DEFAULT 0,
    five_match_pool NUMERIC NOT NULL DEFAULT 0,
    four_match_pool NUMERIC NOT NULL DEFAULT 0,
    three_match_pool NUMERIC NOT NULL DEFAULT 0,
    jackpot_carried_forward NUMERIC DEFAULT 0
);

-- RLS setup
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE prize_pools ENABLE ROW LEVEL SECURITY;

-- users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- scores policies
CREATE POLICY "Users can view own scores" ON scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scores" ON scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scores" ON scores FOR DELETE USING (auth.uid() = user_id);

-- charities policies
CREATE POLICY "Anyone can view charities" ON charities FOR SELECT USING (true);

-- draws policies
CREATE POLICY "Anyone can view published draws" ON draws FOR SELECT USING (status = 'published');

-- winners policies
CREATE POLICY "Users can view own winnings" ON winners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own proof" ON winners FOR UPDATE USING (auth.uid() = user_id);

-- prize_pools policies
CREATE POLICY "Anyone can view prize pools" ON prize_pools FOR SELECT USING (true);

-- Functions
CREATE OR REPLACE FUNCTION check_max_scores()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT count(*) FROM scores WHERE user_id = NEW.user_id) >= 5 THEN
        DELETE FROM scores WHERE id IN (
            SELECT id FROM scores WHERE user_id = NEW.user_id ORDER BY created_at ASC LIMIT 1
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_limit_user_scores
BEFORE INSERT ON scores
FOR EACH ROW
EXECUTE FUNCTION check_max_scores();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, charity_id, charity_contribution_percent)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown User'),
    NULLIF(new.raw_user_meta_data->>'charity_id', '')::uuid,
    COALESCE((new.raw_user_meta_data->>'charity_contribution_percent')::int, 10)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
