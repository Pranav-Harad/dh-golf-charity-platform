const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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
