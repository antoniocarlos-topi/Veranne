// ============================================================
// VERANNE — Minha Conta
// Rota protegida: redireciona para intro se não logado
// 4 tabs: Pedidos, Favoritos, Dados, Sair
// TODO: buscar pedidos de tabela orders no Supabase
// ============================================================

import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx'
import Layout from '../../components/Layout/Layout.jsx'
import styles from './MyAccount.module.css'

export default function MyAccount() {
  const { user, isAuthenticated, logout, updateUser } = useAuth()
  const { favorites } = useFavorites()
  const [activeTab, setActiveTab] = useState('pedidos')
  const [nameField, setNameField] = useState(user?.name || '')
  const [saveMsg, setSaveMsg] = useState('')

  // Rota protegida — se não logado, redirecionar
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Visitante'

  // Formatar data de membro
  const memberSince = user?.loginAt
    ? new Date(user.loginAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : 'hoje'

  function handleSaveData(e) {
    e.preventDefault()
    if (!nameField.trim() || nameField.trim().length < 2) {
      setSaveMsg('Nome deve ter pelo menos 2 caracteres.')
      return
    }
    updateUser({ name: nameField.trim() })
    setSaveMsg('Dados salvos com sucesso! ✓')
    setTimeout(() => setSaveMsg(''), 3000)
    // TODO: atualizar via supabase.from('users').update({ name: nameField })
  }

  const tabs = [
    { id: 'pedidos', label: 'Pedidos' },
    { id: 'favoritos', label: 'Favoritos' },
    { id: 'dados', label: 'Meus Dados' },
  ]

  return (
    <Layout>
      <div className={styles.page}>
        <div className="container">

          {/* ─── Cabeçalho da conta ─────────────────────────── */}
          <div className={styles.accountHeader}>
            <h1 className={styles.accountTitle}>
              Olá, {firstName} <span className={styles.sparkle}>✦</span>
            </h1>
            <p className={styles.accountMeta}>
              {user?.email && <span>{user.email}</span>}
              {user?.email && <span className={styles.metaDot}>·</span>}
              <span>Membro desde {memberSince}</span>
            </p>
          </div>

          {/* ─── Tabs ──────────────────────────────────────── */}
          <div className={styles.tabsRow} role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
                id={`tab-${tab.id}`}
              >
                {tab.label}
                {tab.id === 'favoritos' && favorites.length > 0 && (
                  <span className={styles.tabCount}>{favorites.length}</span>
                )}
              </button>
            ))}

            <button
              className={`${styles.tab} ${styles.tabLogout}`}
              onClick={logout}
              id="account-logout-btn"
            >
              Sair
            </button>
          </div>

          {/* ─── Conteúdo das Tabs ─────────────────────────── */}
          <div className={styles.tabContent}>

            {/* Tab: Pedidos */}
            {activeTab === 'pedidos' && (
              <div className={styles.panel} role="tabpanel" aria-labelledby="tab-pedidos">
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon} aria-hidden="true">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M5 8h14M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8m-4 4v4" stroke="#C0C0C0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className={styles.emptyTitle}>Nenhum pedido ainda</h2>
                  <p className={styles.emptyText}>
                    Que tal explorar nossa coleção e encontrar a peça perfeita para você?
                  </p>
                  <Link to="/loja" className={styles.cta} id="account-explore-btn">
                    Ver Coleção
                  </Link>
                  {/* TODO: buscar dados da tabela orders no Supabase */}
                  {/* supabase.from('orders').select('*').eq('user_id', user.id) */}
                </div>
              </div>
            )}

            {/* Tab: Favoritos */}
            {activeTab === 'favoritos' && (
              <div className={styles.panel} role="tabpanel" aria-labelledby="tab-favoritos">
                {favorites.length > 0 ? (
                  <ProductGrid products={favorites} />
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon} aria-hidden="true">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21s-7-4.534-9.5-8.5C.5 8.5 2.5 5.5 6 5.5c1.9 0 3.2 1 4 2 .8-1 2.1-2 4-2 3.5 0 5.5 3 3.5 7-2.5 3.966-9.5 8.5-9.5 8.5Z" stroke="#C0C0C0" strokeWidth="1.5" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 className={styles.emptyTitle}>Nenhum favorito ainda</h2>
                    <p className={styles.emptyText}>
                      Salve as peças que você amou para encontrá-las facilmente.
                    </p>
                    <Link to="/loja" className={styles.cta} id="account-favorites-explore-btn">
                      Explorar Coleção
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Meus Dados */}
            {activeTab === 'dados' && (
              <div className={styles.panel} role="tabpanel" aria-labelledby="tab-dados">
                <h2 className={styles.panelTitle}>Meus Dados</h2>

                <form onSubmit={handleSaveData} className={styles.dataForm} noValidate>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="data-name">Nome</label>
                    <input
                      id="data-name"
                      type="text"
                      className={styles.fieldInput}
                      value={nameField}
                      onChange={e => setNameField(e.target.value)}
                      autoComplete="name"
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="data-email">E-mail</label>
                    <input
                      id="data-email"
                      type="email"
                      className={`${styles.fieldInput} ${styles.fieldInputReadonly}`}
                      value={user?.email || ''}
                      readOnly
                      aria-readonly="true"
                    />
                    <span className={styles.fieldNote}>
                      A edição de e-mail estará disponível em breve.
                    </span>
                  </div>

                  <button type="submit" className={styles.saveBtn} id="account-save-btn">
                    Salvar alterações
                  </button>

                  {saveMsg && (
                    <p className={`${styles.saveMsg} ${saveMsg.includes('✓') ? styles.saveMsgSuccess : styles.saveMsgError}`}>
                      {saveMsg}
                    </p>
                  )}
                </form>

                <p className={styles.dataNote}>
                  {/* TODO: integrar com supabase.from('users').update() */}
                  A edição completa de dados estará disponível em breve.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  )
}
