import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wcpkeijikkihlphvxkrq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjcGtlaWppa2tpaGxwaHZ4a3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2ODI4NTQsImV4cCI6MjA5NjI1ODg1NH0.rdvhKdrc6l8t8LMQDEiXCbZYMkUjl7Jbe6UMRxbndJ8'
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

async function run() {
  const formData = {
    name: 'Teste Conjunto',
    category: 'conjuntos',
    price: 150.00,
    installments: 3,
    description: 'Conjunto top',
    material: 'ouro',
    sizes: [],
    colors: [],
    images: [],
    featured: false,
    isNew: false,
    inStock: true,
    tags: []
  }

  const newProductData = {
    id:            `prod_${Date.now()}`,
    slug: 'teste-conjunto',
    name:          formData.name,
    category:      formData.category,
    price:         Number(formData.price),
    original_price: null,
    installments:  Number(formData.installments) || 1,
    description:   formData.description || '',
    material:      formData.material || '',
    sizes:         formData.sizes || [],
    colors:        formData.colors || [],
    images:        formData.images || [],
    featured:      formData.featured || false,
    is_new:        formData.isNew !== false,
    in_stock:      formData.inStock !== false,
    tags:          formData.tags || [],
    rating:        0,
    review_count:  0,
  }

  const { data, error } = await supabase
    .from('products')
    .insert([toSnakeCase(newProductData)])
    .select()
    .maybeSingle()
  
  if (error) {
    console.error('Erro de Insert do Supabase:', error)
  } else {
    console.log('Insert OK:', data)
  }
}
run()
