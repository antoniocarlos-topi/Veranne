import React from 'react'
import Layout from '../../components/Layout/Layout.jsx'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <Layout>
      <div className={styles.wrap}>
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.code}>404</p>
            <h1 className={styles.title}>Página não encontrada</h1>
            <p className={styles.text}>
              A página que você procurava não existe ou foi movida.
            </p>
            <div className={styles.actions}>
              <a className={styles.primaryBtn} href="/">
                Voltar para a loja
              </a>
              <a className={styles.secondaryBtn} href="/contato">
                Falar com a VERANNE
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
