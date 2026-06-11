const { createClient } = require('@supabase/supabase-js');
const s = createClient('https://wcpkeijikkihlphvxkrq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjcGtlaWppa2tpaGxwaHZ4a3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2ODI4NTQsImV4cCI6MjA5NjI1ODg1NH0.rdvhKdrc6l8t8LMQDEiXCbZYMkUjl7Jbe6UMRxbndJ8');

function toSnakeCase(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const result = {};
  for (const key of Object.keys(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    result[snakeKey] = obj[key];
  }
  return result;
}

const product = {
  id: 'prod_' + Date.now(),
  slug: 'teste-upsert',
  name: 'Teste Upsert',
  category: 'conjuntos',
  price: 100,
  original_price: null,
  installments: 1,
  description: 'desc',
  material: 'mat',
  sizes: [],
  colors: [],
  images: [],
  featured: false,
  is_new: false,
  in_stock: true,
  tags: [],
  rating: 0,
  review_count: 0
};

s.from('products').upsert([toSnakeCase(product)], { onConflict: 'slug', ignoreDuplicates: true }).select().single().then(console.log).catch(console.error);
