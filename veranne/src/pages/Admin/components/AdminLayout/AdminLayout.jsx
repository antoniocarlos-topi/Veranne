import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../AdminSidebar/AdminSidebar.jsx'
import AdminHeader from '../AdminHeader/AdminHeader.jsx'
import styles from './AdminLayout.module.css'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={styles.layout}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.main}>
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}