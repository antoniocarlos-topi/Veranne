import React from 'react'
import styles from './SizeModal.module.css'

export default function SizeModal({ sizes = [], onClose, onSelect, productName }) {
  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="Selecionar tamanho">
      <div
        className={styles.modal}
        onClick={e => {
          e.stopPropagation()
        }}
      >
        <div className={styles.header}>
          <div className={styles.title}>Escolha o tamanho</div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className={styles.sub}>
          {productName ? <span>{productName}</span> : <span>Selecione para continuar</span>}
        </div>

        <div className={styles.sizeGrid}>
          {sizes.map(s => (
            <button
              key={s}
              type="button"
              className={styles.sizeBtn}
              onClick={() => onSelect(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.secondaryBtn} onClick={onClose}>
            Voltar
          </button>
        </div>
      </div>

      <div
        className={styles.clickCatcher}
        onClick={() => {
          onClose?.()
        }}
        aria-hidden="true"
      />
    </div>
  )
}
