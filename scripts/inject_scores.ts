import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function injectScores() {
  const pravinId = 'c0663471-124b-44ea-81ff-1834220ec29d' // FROM PREVIOUS SCRIPT OUTPUT
  
  // The winning numbers in the screenshot are: 5 - 16 - 30 - 31 - 33
  // Pravin already has 5. We need to add 16 and 30.
  
  console.log('Injecting scores for Pravin...')
  const { error } = await supabase.from('scores').insert([
    { user_id: pravinId, score: 16 },
    { user_id: pravinId, score: 30 }
  ])
  
  if (error) console.error(error)
  else console.log('Successfully injected scores!')
}

injectScores()
