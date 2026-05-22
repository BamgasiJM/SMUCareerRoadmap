import { useNavigate } from 'react-router-dom'
import type { Major, College } from '../../types'
import styles from './MajorCard.module.css'

interface MajorCardProps {
  major: Major
  college: College
}

// 단과대별 포인트 컬러 클래스
const collegeAccentClass: Record<string, string> = {
  humanities: styles.accentHumanities,
  social:     styles.accentSocial,
  ai:         styles.accentAi,
  health:     styles.accentHealth,
}

export default function MajorCard({ major, college }: MajorCardProps) {
  const navigate = useNavigate()

  return (
    <article
      className={styles.card}
      onClick={() => navigate(`/major/${major.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/major/${major.id}`)}
      aria-label={`${major.name} 상세보기`}
    >
      {/* 단과대 컬러 바 */}
      <div className={`${styles.colorBar} ${collegeAccentClass[major.collegeId] ?? ''}`} />

      <div className={styles.body}>
        {/* 단과대 라벨 */}
        <span className={`${styles.collegeLabel} ${collegeAccentClass[major.collegeId] ?? ''}`}>
          {college.name}
        </span>

        {/* 학과명 */}
        <h2 className={styles.majorName}>{major.name}</h2>

        {/* 총 이수학점 */}
        <div className={styles.credits}>
          <span className={styles.creditsLabel}>총 이수학점</span>
          <span className={styles.creditsValue}>{major.totalCredits}학점</span>
        </div>

        {/* 태그 */}
        <div className={styles.tags}>
          {major.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.link}>상세보기 →</span>
      </div>
    </article>
  )
}
