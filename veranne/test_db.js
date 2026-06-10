import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wcpkeijikkihlphvxkrq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjcGtlaWppa2tpaGxwaHZ4a3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2ODI4NTQsImV4cCI6MjA5NjI1ODg1NH0.rdvhKdrc6l8t8LMQDEiXCbZYMkUjl7Jbe6UMRxbndJ8'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data: home, error: errHome } = await supabase.from('homepage_config').select('*')
  console.log('Homepage:', JSON.stringify(home, null, 2))
  if (errHome) console.error(errHome)

  const { data: prods, error: errProds } = await supabase.from('products').select('id,name,category').eq('category', 'conjuntos')
  console.log('Produtos conjuntos:', prods)
  if (errProds) console.error(errProds)

  const { data: prods2, error: errProds2 } = await supabase.from('products').select('id,name,category')
  console.log('Categorias no DB:', [...new Set(prods2?.map(p => p.category) || [])])
}
run()
