import React from 'react'
import styles from '../AdminPages.module.css'

export default function AdminCupons() {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Cupons</h2>
      <p className={styles.muted}>
        Em construção. Nesta fase, o painel suporta apenas a estrutura/rota.
      </p>

      <div className={styles.card}>
        <p className={styles.small}>
          Próxima fase: criar, listar, ativar/desativar e aplicar cupons no checkout.
        </p>
      </div>
    </div>
  )
}
