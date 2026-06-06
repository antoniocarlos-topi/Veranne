import React, { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';

export default function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const lastVisit = localStorage.getItem('veranne_last_visit');

    if (lastVisit !== today) {
      setShow(true);
      localStorage.setItem('veranne_last_visit', today);

      const t = window.setTimeout(() => {
        setShow(false);
      }, 2000); // 2 segundos total

      return () => window.clearTimeout(t);
    }
  }, []);

  if (!show) return null;

  return (
    <div className={styles.splash}>
      <div className={styles.logo}>VERANNE</div>
    </div>
  );
}
