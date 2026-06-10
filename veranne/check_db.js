import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wcpkeijikkihlphvxkrq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjcGtlaWppa2tpaGxwaHZ4a3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2ODI4NTQsImV4cCI6MjA5NjI1ODg1NH0.rdvhKdrc6l8t8LMQDEiXCbZYMkUjl7Jbe6UMRxbndJ8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data: home, error: errHome } = await supabase.from('homepage_config').select('banner1, banner2, categories').single()
  console.log('Banners e Categories do Banco:', JSON.stringify(home, null, 2))
  if (errHome) console.error(errHome)
}
run()
