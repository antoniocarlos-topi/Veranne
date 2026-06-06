// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'

import { AuthProvider } from './context/AuthContext'
import { ProductsProvider } from './context/ProductsContext'
import { HomepageProvider } from './context/HomepageContext'
import { ConfigProvider } from './context/ConfigContext'
import { CouponsProvider } from './context/CouponsContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { CartProvider } from './context/CartContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <ProductsProvider>
        <HomepageProvider>
          <ConfigProvider>
            <CouponsProvider>
              <FavoritesProvider>
                <CartProvider>
                  <App />
                </CartProvider>
              </FavoritesProvider>
            </CouponsProvider>
          </ConfigProvider>
        </HomepageProvider>
      </ProductsProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
