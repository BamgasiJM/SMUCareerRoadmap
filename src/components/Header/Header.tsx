import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandSmu}>SMU</span>
          <span className={styles.brandName}>세명대학교</span>
        </div>
        <div className={styles.title}>
          <h1 className={styles.titleMain}>전공 탐색</h1>
          <p className={styles.titleSub}>
            Career Guidance Program — 전공·진로 안내
          </p>
        </div>
      </div>
    </header>
  )
}
