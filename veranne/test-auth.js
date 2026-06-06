import fs from 'fs'

const envFile = fs.readFileSync('.env', 'utf8')
const env = {}
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=')
  if (key) env[key.trim()] = val.join('=').trim()
})

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_ANON_KEY

fetch(`${supabaseUrl}/auth/v1/signup`, {
  method: 'POST',
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: `teste_${Date.now()}@veranne.com`,
    password: 'password123',
    data: { name: 'Test User' }
  })
}).then(res => res.json()).then(console.log).catch(console.error)
