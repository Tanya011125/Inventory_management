import React from 'react';
import styles from './components/styles.module.css';
import Header from './components/header';
import Sidebar from './components/sidebar';
import Footer from './components/footer';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function DashboardChoice() {
  const navigate = useNavigate();

  return (
    <div className={styles.inventoryLayout}>
      <Sidebar />
      <div className={styles.inventoryMain}>
        <Header />
        <div className={styles.page}>
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/user/dashboard">COMPLAINTS REGISTRY</Link>
            </div>
            <div className={styles.card}>
              <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/user/spares">SPARES MANAGEMENT</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>

    </div>
  )
}
