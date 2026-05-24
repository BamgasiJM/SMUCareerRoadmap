import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.title}>
          <h1 className={styles.titleMain}>전공·진로 탐색</h1>
          <p className={styles.titleSub}>
            Career Guidance Program
          </p>
        </div>
      </div>
    </header>
  );
}
