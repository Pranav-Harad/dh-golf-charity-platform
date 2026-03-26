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

async function checkData() {
  const { data: users } = await supabase.from('users').select('id, full_name, email, subscription_status').eq('subscription_status', 'active')
  console.log('ACTIVE_USERS:', JSON.stringify(users))

  const { data: scores } = await supabase.from('scores').select('*, users(full_name)').order('created_at', { ascending: false }).limit(20)
  console.log('RECENT_SCORES:', JSON.stringify(scores))
}

checkData()
