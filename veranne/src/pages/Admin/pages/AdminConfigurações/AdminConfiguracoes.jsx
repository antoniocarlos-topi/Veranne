import React from 'react'
import styles from '../AdminPages.module.css'

export default function AdminConfiguracoes() {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Configurações</h2>
      <p className={styles.muted}>
        Em construção. Nesta fase, o painel ainda não edita configurações.
      </p>

      <div className={styles.card}>
        <p className={styles.small}>
          Próxima fase: dados da loja, políticas e preferências do site.
        </p>
      </div>
    </div>
  )
}
