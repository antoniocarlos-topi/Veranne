import fs from 'fs';
const path = './src/data/products.js';
let content = fs.readFileSync(path, 'utf8');

const updates = [
  { id: '001', colors: "    colors: [{ name: 'Dourado', hex: '#C9A96E' }]," },
  { id: '002', colors: "    colors: [{ name: 'Prata', hex: '#C0C0C0' }]," },
  { id: '003', colors: "    colors: [{ name: 'Prata', hex: '#C0C0C0' }]," },
  { id: '004', colors: "    colors: [{ name: 'Rosé', hex: '#E8B4A0' }]," },
  { id: '005', colors: "    colors: [{ name: 'Dourado', hex: '#C9A96E' }]," },
  { id: '006', colors: "    colors: [{ name: 'Prata', hex: '#C0C0C0' }]," },
  { id: '007', colors: "    colors: [{ name: 'Prata', hex: '#C0C0C0' }]," },
  { id: '008', colors: "    colors: [{ name: 'Dourado', hex: '#C9A96E' }]," },
  { id: '009', colors: "    colors: [{ name: 'Dourado', hex: '#C9A96E' }]," },
  { id: '010', colors: "    colors: [{ name: 'Prata', hex: '#C0C0C0' }]," },
  { id: '011', colors: "    colors: [{ name: 'Prata', hex: '#C0C0C0' }, { name: 'Preto', hex: '#1a1a1a' }]," },
  { id: '012', colors: "    colors: [{ name: 'Rosé', hex: '#E8B4A0' }]," },
  { id: '013', colors: "    colors: [{ name: 'Dourado', hex: '#C9A96E' }]," },
  { id: '014', colors: "    colors: [{ name: 'Prata', hex: '#C0C0C0' }]," },
  { id: '015', colors: "    colors: [{ name: 'Dourado', hex: '#C9A96E' }]," },
  { id: '016', colors: "    colors: [{ name: 'Rosé', hex: '#E8B4A0' }]," }
];

updates.forEach(u => {
  const regex = new RegExp(`(id: '${u.id}',[\\s\\S]*?sizes: \\[.*?\\],)`);
  content = content.replace(regex, `$1\n${u.colors}`);
});

fs.writeFileSync(path, content);
