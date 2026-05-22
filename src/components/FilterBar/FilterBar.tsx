import type { College } from '../../types'
import { useFilterStore } from '../../store/filterStore'
import styles from './FilterBar.module.css'

interface FilterBarProps {
  colleges: College[]
  totalCount: number
  filteredCount: number
}

// 단과대별 포인트 컬러 클래스 매핑
const collegeColorClass: Record<string, string> = {
  humanities: styles.tagHumanities,
  social:     styles.tagSocial,
  ai:         styles.tagAi,
  health:     styles.tagHealth,
}

export default function FilterBar({ colleges, totalCount, filteredCount }: FilterBarProps) {
  const { searchQuery, selectedCollege, setSearchQuery, setSelectedCollege, reset } = useFilterStore()

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        {/* 검색 */}
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>◎</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="학과명 또는 키워드 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className={styles.clearBtn} onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>

        {/* 단과대 필터 */}
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${selectedCollege === 'all' ? styles.filterActive : ''}`}
            onClick={() => setSelectedCollege('all')}
          >
            전체
          </button>
          {colleges.map((college) => (
            <button
              key={college.id}
              className={`${styles.filterBtn} ${collegeColorClass[college.id] ?? ''} ${selectedCollege === college.id ? styles.filterActive : ''}`}
              onClick={() => setSelectedCollege(college.id)}
            >
              {college.name}
            </button>
          ))}
        </div>

        {/* 결과 수 + 초기화 */}
        <div className={styles.meta}>
          <span className={styles.count}>
            {filteredCount === totalCount
              ? `총 ${totalCount}개 학과`
              : `${filteredCount} / ${totalCount}개 학과`}
          </span>
          {(searchQuery || selectedCollege !== 'all') && (
            <button className={styles.resetBtn} onClick={reset}>
              필터 초기화
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
