import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop/ScrollToTop.jsx'
import AppEntry from './components/AppEntry/AppEntry.jsx'
import { PageTransition } from './components/PageTransition/PageTransition.jsx'

import Home from './pages/Home/Home.jsx'
import Shop from './pages/Shop/Shop.jsx'
import Product from './pages/Product/Product.jsx'
import Cart from './pages/Cart/Cart.jsx'
import Favorites from './pages/Favorites/Favorites.jsx'
import About from './pages/About/About.jsx'
import Contact from './pages/Contact/Contact.jsx'
import Privacy from './pages/Policies/Privacy.jsx'
import Exchange from './pages/Policies/Exchange.jsx'
import Terms from './pages/Policies/Terms.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'

// Auth & Account
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import ForgotPassword from './pages/Auth/ForgotPassword.jsx'
import MyAccount from './pages/Account/MyAccount.jsx'

import AdminLogin from './pages/Admin/AdminLogin.jsx'
import AdminLayout from './pages/Admin/components/AdminLayout/AdminLayout.jsx'
import Dashboard from './pages/Admin/pages/Dashboard/Dashboard.jsx'
import ProductsList from './pages/Admin/pages/ProductsList/ProductsList.jsx'
import ProductForm from './pages/Admin/pages/ProductForm/ProductForm.jsx'
import HomepageManager from './pages/Admin/pages/HomepageManager/HomepageManager.jsx'
import PromotionsManager from './pages/Admin/pages/PromotionsManager/PromotionsManager.jsx'
import CouponsManager from './pages/Admin/pages/CouponsManager/CouponsManager.jsx'
import SettingsManager from './pages/Admin/pages/SettingsManager/SettingsManager.jsx'

const STORAGE_KEY = 'veranne_admin'

function isAdminAuthenticated() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return false

  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return false

    const authValue = parsed.authenticated
    if (typeof authValue === 'boolean') return authValue
    if (typeof authValue === 'string') return authValue.toLowerCase() === 'true'
    if (typeof authValue === 'number') return authValue === 1

    return Boolean(authValue)
  } catch {
    return false
  }
}

function AdminProtectedRoute({ children }) {
  const location = useLocation()
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />
  }
  return children
}

// Determina se a rota é do admin (não deve mostrar AppEntry)
function isAdminRoute(pathname) {
  return pathname.startsWith('/admin')
}

function AppRoutes() {
  const location = useLocation()
  const adminRoute = isAdminRoute(location.pathname)

  return (
    <>
      <ScrollToTop />
      {/* AppEntry envolve o site normal — não aplica no painel admin */}
      {adminRoute ? (
        <Routes>
          {/* Admin Login — público */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Admin Panel — protegido */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="produtos" element={<ProductsList />} />
            <Route path="produtos/novo" element={<ProductForm />} />
            <Route path="produtos/editar/:id" element={<ProductForm />} />
            <Route path="homepage" element={<HomepageManager />} />
            <Route path="promocoes" element={<PromotionsManager />} />
            <Route path="cupons" element={<CouponsManager />} />
            <Route path="configuracoes" element={<SettingsManager />} />
          </Route>
        </Routes>
      ) : (
        <AppEntry>
          <PageTransition>
            <Routes>
              {/* Rotas públicas da loja */}
              <Route path="/" element={<Home />} />
              <Route path="/loja" element={<Shop />} />
              <Route path="/produto/:slug" element={<Product />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/favoritos" element={<Favorites />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/privacidade" element={<Privacy />} />
              <Route path="/trocas" element={<Exchange />} />
              <Route path="/termos" element={<Terms />} />

              {/* Auth & Conta */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/esqueci-senha" element={<ForgotPassword />} />
              <Route path="/minha-conta" element={<MyAccount />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </AppEntry>
      )}
    </>
  )
}

export default function App() {
  return <AppRoutes />
}