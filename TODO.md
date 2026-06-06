# VERANNE — Fase 1 (Fundação Visual e Estrutura Base)

- [ ] Criar estrutura base do projeto (Vite/React/Router) em `veranne/`
- [ ] Criar `src/styles/variables.css` com todas as variáveis de design
- [ ] Criar `src/styles/global.css` (imports + resets + utilitários)
- [ ] Criar componentes: `Header`, `Footer`, `Layout` com CSS Modules
- [ ] Criar contextos: `CartContext`, `FavoritesContext` com persistência localStorage
- [ ] Criar camada de dados: `src/data/products.js` (compatível com Supabase futuro)
- [ ] Criar stub de Supabase: `src/services/supabase.js` (export null, com comentário)
- [ ] Criar páginas placeholder com `Layout`:
  - [ ] Home, Shop, Product, Cart, Favorites
  - [ ] About, Contact, Policies (Privacy/Exchange/Terms)
- [ ] Implementar rotas no `src/App.jsx` com React Router DOM v6
- [ ] Criar `ProtectedRoute` para rotas admin
- [ ] Implementar Admin: `AdminLogin`, `AdminDashboard` + autenticação local (admin/veranne2025)
- [ ] Integrar Header com contadores do Cart/Favorites e detecção de link ativo
- [ ] Rodar `npm run dev` para garantir que compila sem erros
- [ ] Listar arquivos criados ao final
