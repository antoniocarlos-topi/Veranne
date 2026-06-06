import fs from 'fs'

const envFile = fs.readFileSync('.env', 'utf8')
const env = {}
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=')
  if (key) env[key.trim()] = val.join('=').trim()
})

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_ANON_KEY

const product = {
    slug: 'anel-venus',
    name: 'Anel Vênus',
    category: 'aneis',
    price: 89.9,
    original_price: null,
    installments: 3,
    description: 'Design minimalista',
    material: 'Aço Inox',
    sizes: ['15', '16'],
    colors: [{ name: 'Prata', hex: '#E0E0E0' }],
    images: ['https://example.com/img.jpg'],
    featured: false,
    is_new: true,
    in_stock: true,
    tags: ['anel', 'prata'],
    rating: 4.8,
    review_count: 15,
    id: 'test_uuid_123'
}

fetch(`${supabaseUrl}/rest/v1/products`, {
  method: 'POST',
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify(product)
}).then(res => res.json()).then(console.log).catch(console.error)
