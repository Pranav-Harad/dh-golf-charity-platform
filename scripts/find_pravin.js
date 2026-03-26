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

async function findPravin() {
  const { data: users } = await supabase.from('users').select('id, full_name, email')
  const pravin = users.find(u => u.full_name.toLowerCase().includes('pravin'))
  if (pravin) {
    console.log('PRAVIN_ID:', pravin.id)
  } else {
    console.log('PRAVIN NOT FOUND')
  }
}

findPravin()
