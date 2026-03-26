INSERT INTO storage.buckets (id, name, public) 
VALUES ('winner-proofs', 'winner-proofs', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'winner-proofs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view proofs"
ON storage.objects FOR SELECT
USING ( bucket_id = 'winner-proofs' );
