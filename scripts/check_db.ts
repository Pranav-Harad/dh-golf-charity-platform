import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkData() {
  console.log('Checking Active Users...')
  const { data: users } = await supabase.from('users').select('id, full_name, email, subscription_status').eq('subscription_status', 'active')
  console.log(users)

  console.log('\nChecking Recent Scores...')
  const { data: scores } = await supabase.from('scores').select('*, users(full_name)').order('created_at', { ascending: false }).limit(20)
  // @ts-ignore
  console.log(scores?.map(s => ({ user: s.users?.full_name, score: s.score, created_at: s.created_at })))
}

checkData()
