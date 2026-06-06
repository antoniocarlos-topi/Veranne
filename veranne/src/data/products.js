/*
============================================================
VERANNE — Produtos
MVP: dados locais | Futuro: Supabase
Imagens: URLs externas (Unsplash) | Futuro: painel admin
============================================================
*/

export const CATEGORIES = [
  { id: 'todos', label: 'Todos', slug: 'todos' },
  { id: 'aneis', label: 'Anéis', slug: 'aneis' },
  { id: 'colares', label: 'Colares', slug: 'colares' },
  { id: 'pulseiras', label: 'Pulseiras', slug: 'pulseiras' },
  { id: 'brincos', label: 'Brincos', slug: 'brincos' },
]

export const products = [
  // ANÉIS
  {
    id: '001',
    slug: 'anel-venus',
    name: 'Anel Vênus',
    category: 'aneis',
    price: 89.9,
    originalPrice: null,
    installments: 3,
    description:
      'Design minimalista inspirado na elegância clássica. Acabamento polido que reflete a luz com suavidade, ideal para o uso diário ou ocasiões especiais.',
    material: 'Aço Inox 316L banhado a ouro 18k',
    sizes: ['15', '16', '17', '18', '19', '20'],
    colors: [{ name: 'Dourado', hex: '#C9A96E' }],
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80',
    ],
    featured: true,
    isNew: true,
    inStock: true,
    tags: ['novo', 'destaque'],
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: '002',
    slug: 'anel-aurora',
    name: 'Anel Aurora',
    category: 'aneis',
    price: 119.9,
    originalPrice: 149.9,
    installments: 3,
    description:
      'Anel de design contemporâneo com acabamento fosco e detalhes polidos. Uma peça que une modernidade e sofisticação.',
    material: 'Aço Inox 316L banhado a prata',
    sizes: ['15', '16', '17', '18', '19', '20'],
    colors: [{ name: 'Prata', hex: '#C0C0C0' }],
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    ],
    featured: true,
    isNew: false,
    inStock: true,
    tags: ['promoção'],
    rating: 4.6,
    reviewCount: 18,
  },
  {
    id: '003',
    slug: 'anel-celeste',
    name: 'Anel Celeste',
    category: 'aneis',
    price: 79.9,
    originalPrice: null,
    installments: 2,
    description:
      'Delicado e feminino, o Anel Celeste é perfeito para quem busca elegância no minimalismo. Ideal para usar em conjunto ou isolado.',
    material: 'Aço Inox 316L',
    sizes: ['15', '16', '17', '18', '19', '20'],
    colors: [{ name: 'Prata', hex: '#C0C0C0' }],
    images: [
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    ],
    featured: false,
    isNew: true,
    inStock: true,
    tags: ['novo'],
    rating: 4.7,
    reviewCount: 11,
  },
  {
    id: '004',
    slug: 'anel-luna',
    name: 'Anel Luna',
    category: 'aneis',
    price: 99.9,
    originalPrice: null,
    installments: 3,
    description:
      'Inspirado nas fases da lua, este anel traz um símbolo delicado em alto relevo. Para mulheres que carregam mistério e elegância.',
    material: 'Aço Inox 316L banhado a ouro rosé 18k',
    sizes: ['15', '16', '17', '18', '19', '20'],
    colors: [{ name: 'Rosé', hex: '#E8B4A0' }],
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',
    ],
    featured: false,
    isNew: false,
    inStock: false,
    tags: [],
    rating: 4.9,
    reviewCount: 32,
  },

  // COLARES
  {
    id: '005',
    slug: 'colar-serenite',
    name: 'Colar Sérénité',
    category: 'colares',
    price: 159.9,
    originalPrice: null,
    installments: 3,
    description:
      'Colar de corrente delicada com pingente minimalista. Comprimento regulável para usar em diferentes estilos e decotes.',
    material: 'Aço Inox 316L banhado a ouro 18k',
    sizes: ['45cm', '50cm'],
    colors: [{ name: 'Dourado', hex: '#C9A96E' }],
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    ],
    featured: true,
    isNew: true,
    inStock: true,
    tags: ['novo', 'destaque'],
    rating: 4.9,
    reviewCount: 41,
  },
  {
    id: '006',
    slug: 'colar-perola',
    name: 'Colar Pérola',
    category: 'colares',
    price: 189.9,
    originalPrice: 229.9,
    installments: 3,
    description:
      'Corrente fina com pérola sintética de alta qualidade. Sofisticação atemporal para qualquer ocasião, do casual ao formal.',
    material: 'Aço Inox 316L e pérola sintética',
    sizes: ['40cm', '45cm', '50cm'],
    colors: [{ name: 'Prata', hex: '#C0C0C0' }],
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    ],
    featured: true,
    isNew: false,
    inStock: true,
    tags: ['promoção', 'destaque'],
    rating: 4.7,
    reviewCount: 29,
  },
  {
    id: '007',
    slug: 'colar-minimal',
    name: 'Colar Minimal',
    category: 'colares',
    price: 129.9,
    originalPrice: null,
    installments: 3,
    description:
      'A essência do minimalismo em uma peça. Corrente ultra-fina com acabamento espelhado. Para quem prefere o discreto e sofisticado.',
    material: 'Aço Inox 316L banhado a prata',
    sizes: ['40cm', '45cm'],
    colors: [{ name: 'Prata', hex: '#C0C0C0' }],
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    ],
    featured: false,
    isNew: true,
    inStock: true,
    tags: ['novo'],
    rating: 4.5,
    reviewCount: 15,
  },
  {
    id: '008',
    slug: 'colar-lumiere',
    name: 'Colar Lumière',
    category: 'colares',
    price: 219.9,
    originalPrice: null,
    installments: 4,
    description:
      'Colar de corrente grossa com design contemporâneo. Uma declaração de estilo para mulheres que não passam despercebidas.',
    material: 'Aço Inox 316L banhado a ouro 18k',
    sizes: ['45cm', '50cm', '55cm'],
    colors: [{ name: 'Dourado', hex: '#C9A96E' }],
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
    ],
    featured: false,
    isNew: false,
    inStock: true,
    tags: [],
    rating: 4.8,
    reviewCount: 22,
  },

  // PULSEIRAS
  {
    id: '009',
    slug: 'pulseira-eden',
    name: 'Pulseira Eden',
    category: 'pulseiras',
    price: 99.9,
    originalPrice: null,
    installments: 2,
    description:
      'Pulseira delicada com charm exclusivo VERANNE. Leveza e feminilidade para o seu pulso. Perfeita para combinar com outras peças.',
    material: 'Aço Inox 316L banhado a ouro 18k',
    sizes: ['P (15-17cm)', 'M (17-19cm)', 'G (19-21cm)'],
    colors: [{ name: 'Dourado', hex: '#C9A96E' }],
    images: [
      'https://images.unsplash.com/photo-1573408301185-9519f94815b1?w=800&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
    ],
    featured: true,
    isNew: false,
    inStock: true,
    tags: ['destaque'],
    rating: 4.6,
    reviewCount: 33,
  },
  {
    id: '010',
    slug: 'pulseira-riviera',
    name: 'Pulseira Riviera',
    category: 'pulseiras',
    price: 129.9,
    originalPrice: 159.9,
    installments: 3,
    description:
      'Inspirada na elegância das praias da Riviera Francesa. Elos finos e delicados com fecho borboleta. Sofisticação no seu pulso.',
    material: 'Aço Inox 316L banhado a prata',
    sizes: ['P (15-17cm)', 'M (17-19cm)', 'G (19-21cm)'],
    colors: [{ name: 'Prata', hex: '#C0C0C0' }],
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9519f94815b1?w=800&q=80',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
    ],
    featured: false,
    isNew: true,
    inStock: true,
    tags: ['novo', 'promoção'],
    rating: 4.7,
    reviewCount: 19,
  },
  {
    id: '011',
    slug: 'pulseira-aurora',
    name: 'Pulseira Aurora',
    category: 'pulseiras',
    price: 89.9,
    originalPrice: null,
    installments: 2,
    description:
      'Pulseira rígida de design moderno e atemporal. Acabamento polido que complementa qualquer look, do dia à noite.',
    material: 'Aço Inox 316L',
    sizes: ['Único (ajustável)'],
    colors: [{ name: 'Prata', hex: '#C0C0C0' }, { name: 'Preto', hex: '#1a1a1a' }],
    images: [
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9519f94815b1?w=800&q=80',
    ],
    featured: false,
    isNew: false,
    inStock: true,
    tags: [],
    rating: 4.4,
    reviewCount: 8,
  },
  {
    id: '012',
    slug: 'pulseira-belle',
    name: 'Pulseira Belle',
    category: 'pulseiras',
    price: 149.9,
    originalPrice: null,
    installments: 3,
    description:
      'Conjunto de três pulseiras finas vendidas juntas. Use todas ao mesmo tempo para um look moderno ou separadas para versatilidade máxima.',
    material: 'Aço Inox 316L banhado a ouro rosé 18k',
    sizes: ['P (15-17cm)', 'M (17-19cm)', 'G (19-21cm)'],
    colors: [{ name: 'Rosé', hex: '#E8B4A0' }],
    images: [
      'https://images.unsplash.com/photo-1573408301185-9519f94815b1?w=800&q=80',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    ],
    featured: true,
    isNew: true,
    inStock: true,
    tags: ['novo', 'destaque'],
    rating: 4.9,
    reviewCount: 47,
  },

  // BRINCOS
  {
    id: '013',
    slug: 'brinco-arc',
    name: 'Brinco Arc',
    category: 'brincos',
    price: 79.9,
    originalPrice: null,
    installments: 2,
    description:
      'Argola de design geométrico moderno. Leve e confortável para o uso diário. Um clássico contemporâneo da VERANNE.',
    material: 'Aço Inox 316L banhado a ouro 18k',
    sizes: ['Único'],
    colors: [{ name: 'Dourado', hex: '#C9A96E' }],
    images: [
      'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
    ],
    featured: true,
    isNew: false,
    inStock: true,
    tags: ['destaque'],
    rating: 4.8,
    reviewCount: 56,
  },
  {
    id: '014',
    slug: 'brinco-goutte',
    name: 'Brinco Goutte',
    category: 'brincos',
    price: 109.9,
    originalPrice: 139.9,
    installments: 3,
    description:
      'Brinco pendente em formato de gota com acabamento espelhado. Movimento elegante que valoriza o rosto e o pescoço.',
    material: 'Aço Inox 316L banhado a prata',
    sizes: ['Único'],
    colors: [{ name: 'Prata', hex: '#C0C0C0' }],
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
      'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
    ],
    featured: false,
    isNew: true,
    inStock: true,
    tags: ['novo', 'promoção'],
    rating: 4.6,
    reviewCount: 21,
  },
  {
    id: '015',
    slug: 'brinco-etoile',
    name: 'Brinco Étoile',
    category: 'brincos',
    price: 89.9,
    originalPrice: null,
    installments: 2,
    description:
      'Brinco de pressão com estrela em alto relevo. Delicado e versátil, perfeito para quem prefere peças discretas com personalidade.',
    material: 'Aço Inox 316L banhado a ouro 18k',
    sizes: ['Único'],
    colors: [{ name: 'Dourado', hex: '#C9A96E' }],
    images: [
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
      'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
    ],
    featured: false,
    isNew: false,
    inStock: true,
    tags: [],
    rating: 4.5,
    reviewCount: 14,
  },
  {
    id: '016',
    slug: 'brinco-lumiere',
    name: 'Brinco Lumière',
    category: 'brincos',
    price: 139.9,
    originalPrice: null,
    installments: 3,
    description:
      'Brinco chandelier com design luxuoso e movimento elegante. Para ocasiões especiais em que você quer brilhar com sofisticação.',
    material: 'Aço Inox 316L banhado a ouro rosé 18k',
    sizes: ['Único'],
    colors: [{ name: 'Rosé', hex: '#E8B4A0' }],
    images: [
      'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
    ],
    featured: true,
    isNew: true,
    inStock: true,
    tags: ['novo', 'destaque'],
    rating: 4.9,
    reviewCount: 38,
  },
]

// ── Funções de acesso (preparadas para trocar implementação pelo Supabase)
export function getAllProducts() {
  return products
}

export function getProductBySlug(slug) {
  return products.find(p => p.slug === slug) || null
}

export function getProductsByCategory(category) {
  if (!category || category === 'todos') return products
  return products.filter(p => p.category === category)
}

export function getFeaturedProducts() {
  return products.filter(p => p.featured && p.inStock)
}

export function getNewProducts() {
  return products.filter(p => p.isNew && p.inStock)
}

export function getRelatedProducts(product, limit = 4) {
  return products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, limit)
}

export function searchProducts(query) {
  const q = (query || '').toLowerCase()
  return products.filter(
    p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  )
}
