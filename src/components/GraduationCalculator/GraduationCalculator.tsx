import { useMemo, useState } from 'react'
import type { GraduationRequirement } from '../../types'
import styles from './GraduationCalculator.module.css'

interface GraduationCalculatorProps {
  graduation: GraduationRequirement
}

type CategoryKey =
  | 'majorRequired'
  | 'majorElective'
  | 'generalRequired'
  | 'generalElective'
  | 'free'

interface CategoryConfig {
  key: CategoryKey
  label: string
  required: number
}

type Inputs = Record<CategoryKey, string>

const EMPTY_INPUTS: Inputs = {
  majorRequired: '',
  majorElective: '',
  generalRequired: '',
  generalElective: '',
  free: '',
}

function toNumber(value: string): number {
  if (value.trim() === '') return 0
  const n = Number(value)
  if (Number.isNaN(n) || n < 0) return 0
  return n
}

export default function GraduationCalculator({ graduation }: GraduationCalculatorProps) {
  const [inputs, setInputs] = useState<Inputs>(EMPTY_INPUTS)

  const specifiedRequired =
    graduation.majorRequired +
    graduation.majorElective +
    graduation.generalRequired +
    graduation.generalElective
  const freeRequired = Math.max(0, graduation.totalCredits - specifiedRequired)

  const categories: CategoryConfig[] = useMemo(
    () => [
      { key: 'majorRequired', label: '전공필수', required: graduation.majorRequired },
      { key: 'majorElective', label: '전공선택', required: graduation.majorElective },
      { key: 'generalRequired', label: '기초교양', required: graduation.generalRequired },
      { key: 'generalElective', label: '경험교양', required: graduation.generalElective },
      { key: 'free', label: '일반선택', required: freeRequired },
    ],
    [graduation, freeRequired],
  )

  const earnedByKey = useMemo(() => {
    const result: Record<CategoryKey, number> = {
      majorRequired: toNumber(inputs.majorRequired),
      majorElective: toNumber(inputs.majorElective),
      generalRequired: toNumber(inputs.generalRequired),
      generalElective: toNumber(inputs.generalElective),
      free: toNumber(inputs.free),
    }
    return result
  }, [inputs])

  const totalEarned =
    earnedByKey.majorRequired +
    earnedByKey.majorElective +
    earnedByKey.generalRequired +
    earnedByKey.generalElective +
    earnedByKey.free

  const totalRemaining = Math.max(0, graduation.totalCredits - totalEarned)
  const progress = Math.min(100, Math.round((totalEarned / graduation.totalCredits) * 100))
  const isComplete = totalEarned >= graduation.totalCredits

  const handleChange = (key: CategoryKey, value: string) => {
    // 숫자/빈 문자열만 허용
    if (value === '' || /^\d{0,3}$/.test(value)) {
      setInputs((prev) => ({ ...prev, [key]: value }))
    }
  }

  const handleReset = () => setInputs(EMPTY_INPUTS)

  return (
    <div className={styles.calculator}>
      <div className={styles.intro}>
        <p className={styles.introText}>
          현재까지 이수한 학점을 카테고리별로 입력하면 졸업까지 남은 학점이 자동으로 계산됩니다.
        </p>
        <button type="button" className={styles.resetBtn} onClick={handleReset}>
          초기화
        </button>
      </div>

      {/* 결과 요약 */}
      <div className={styles.summary}>
        <div className={styles.summaryLabel}>졸업까지 남은 학점</div>
        <div className={styles.summaryNumbers}>
          <span className={styles.remaining}>{totalRemaining}</span>
          <span className={styles.remainingUnit}>학점</span>
        </div>
        <div className={styles.summaryMeta}>
          현재 {totalEarned}학점 / 졸업기준 {graduation.totalCredits}학점
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
        <div className={styles.progressText}>
          {isComplete ? '졸업 기준 학점을 모두 충족했습니다.' : `진행률 ${progress}%`}
        </div>
      </div>

      {/* 카테고리별 입력 */}
      <div className={styles.table}>
        <div className={`${styles.row} ${styles.headRow}`}>
          <span>카테고리</span>
          <span className={styles.colInput}>이수 학점</span>
          <span className={styles.colRequired}>필요</span>
          <span className={styles.colShort}>부족</span>
        </div>
        {categories.map((cat) => {
          const earned = earnedByKey[cat.key]
          const short = Math.max(0, cat.required - earned)
          const met = earned >= cat.required && cat.required > 0
          return (
            <label key={cat.key} className={styles.row}>
              <span className={styles.catLabel}>{cat.label}</span>
              <span className={styles.colInput}>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={styles.input}
                  value={inputs[cat.key]}
                  onChange={(e) => handleChange(cat.key, e.target.value)}
                  placeholder="0"
                  aria-label={`${cat.label} 이수 학점`}
                />
              </span>
              <span className={styles.colRequired}>{cat.required}</span>
              <span className={`${styles.colShort} ${met ? styles.met : ''}`}>
                {met ? '충족' : short}
              </span>
            </label>
          )
        })}
      </div>

      <p className={styles.note}>
        ※ 전과시 새로운 학과의 전공필수로 인정받지 못하는 수업은 일반선택으로 인정됩니다.
      </p>
    </div>
  )
}
