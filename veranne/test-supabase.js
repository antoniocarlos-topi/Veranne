import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

function toSnakeCase(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj
  const result = {}
  for (const key of Object.keys(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    result[snakeKey] = obj[key]
  }
  return result
}

const product = {
    slug: 'anel-venus',
    name: 'Anel Vênus',
    category: 'aneis',
    price: 89.9,
    originalPrice: null,
    installments: 3,
    description: 'Design minimalista',
    material: 'Aço Inox',
    sizes: ['15', '16'],
    colors: [{ name: 'Prata', hex: '#E0E0E0' }],
    images: ['https://example.com/img.jpg'],
    featured: false,
    isNew: true,
    inStock: true,
    tags: ['anel', 'prata'],
    rating: 4.8,
    reviewCount: 15
}

async function test() {
  const { data, error } = await supabase
    .from('products')
    .insert([toSnakeCase(product)])
    .select()
    .maybeSingle()
  
  if (error) {
    console.error('SUPABASE ERROR:', error)
  } else {
    console.log('SUCCESS:', data)
  }
}

test()
