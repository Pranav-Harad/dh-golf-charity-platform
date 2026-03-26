const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

function getEnv(key) {
  const envFile = fs.readFileSync('.env.local', 'utf8')
  const match = envFile.match(new RegExp(`${key}=(.*)`))
  return match ? match[1].trim() : null
}

const supabase = createClient(
  getEnv('NEXT_PUBLIC_SUPABASE_URL'),
  getEnv('SUPABASE_SERVICE_ROLE_KEY')
)

async function injectScores() {
  const pravinId = '0e240392-1dd0-41aa-a707-993a1872a6a5'
  const today = new Date().toISOString().split('T')[0]
  
  console.log('Injecting scores for Pravin...')
  const { data, error } = await supabase.from('scores').insert([
    { user_id: pravinId, score: 16, score_date: today },
    { user_id: pravinId, score: 30, score_date: today }
  ]).select()
  
  if (error) {
    console.error('Error injecting scores:', error)
  } else {
    console.log('Successfully injected scores:', data)
  }
}

injectScores()
