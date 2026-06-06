import React from 'react'
import styles from './Toast.module.css'

export default function Toast({ message, visible, type = 'success' }) {
  if (!visible) return null

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.message}>{message}</span>
    </div>
  )
}