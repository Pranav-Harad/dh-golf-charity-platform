const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://rcusdiwrnqcufyfcsvrp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjdXNkaXdybnFjdWZ5ZmNzdnJwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQzMzc3MiwiZXhwIjoyMDkwMDA5NzcyfQ.knJEPNFGigsfdU_0rILrIswYUxj4EDOL6YGSjlcy5T8'
)

async function injectScores() {
  const pravinId = 'c0663471-124b-44ea-81ff-1834220ec29d'
  
  console.log('Injecting scores for Pravin...')
  const { data, error } = await supabase.from('scores').insert([
    { user_id: pravinId, score: 16 },
    { user_id: pravinId, score: 30 }
  ]).select()
  
  if (error) {
    console.error('Error injecting scores:', error)
  } else {
    console.log('Successfully injected scores:', data)
  }
}

injectScores()
