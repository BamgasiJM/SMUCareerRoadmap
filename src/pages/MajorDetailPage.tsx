import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchMajors, fetchMajorDetail } from '../api/majors'
import type { RequiredCourse } from '../types'
import GraduationCalculator from '../components/GraduationCalculator/GraduationCalculator'
import styles from './MajorDetailPage.module.css'

// 학년/학기별로 그룹핑
function groupCoursesByYear(courses: RequiredCourse[]) {
  const map = new Map<number, { sem1: RequiredCourse[]; sem2: RequiredCourse[] }>()
  courses.forEach((course) => {
    if (!map.has(course.year)) map.set(course.year, { sem1: [], sem2: [] })
    const entry = map.get(course.year)!
    if (course.semester === 1) entry.sem1.push(course)
    else entry.sem2.push(course)
  })
  return Array.from(map.entries()).sort(([a], [b]) => a - b)
}

export default function MajorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: listData } = useQuery({
    queryKey: ['majors'],
    queryFn: fetchMajors,
    staleTime: 1000 * 60 * 10,
  })

  const { data: detail, isLoading, isError } = useQuery({
    queryKey: ['major', id],
    queryFn: () => fetchMajorDetail(id!),
    enabled: !!id,
  })

  if (isLoading) return <div className={styles.status}>불러오는 중...</div>

  if (isError || !detail) {
    return (
      <div className={styles.notFound}>
        <p>해당 학과의 상세 정보가 아직 준비되지 않았습니다.</p>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← 목록으로 돌아가기
        </button>
      </div>
    )
  }

  const college = listData?.colleges.find((c) => c.id === detail.collegeId)
  const grouped = groupCoursesByYear(detail.requiredCourses)

  const { graduation: g } = detail
  const specifiedCredits =
    g.majorRequired + g.majorElective + g.generalRequired + g.generalElective

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* 뒤로가기 */}
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← 전공 목록
        </button>

        {/* 헤딩 */}
        <div className={styles.heading}>
          {college && (
            <span className={styles.collegeLabel}>{college.name}</span>
          )}
          <h1 className={styles.majorName}>{detail.name}</h1>
          <p className={styles.overview}>{detail.overview}</p>
        </div>

        {/* 연락처 */}
        <div className={styles.contacts}>
          <span>📍 {detail.contacts.office}</span>
          {detail.contacts.phone && <span>☎ {detail.contacts.phone}</span>}
          {detail.contacts.email && <span>✉ {detail.contacts.email}</span>}
        </div>

        {/* 졸업요건 요약 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>졸업 요건</h2>
          <div className={styles.creditGrid}>
            <div className={styles.creditItem}>
              <span className={styles.creditLabel}>총 이수학점</span>
              <span className={styles.creditValue}>{g.totalCredits}</span>
            </div>
            <div className={styles.creditItem}>
              <span className={styles.creditLabel}>전공필수</span>
              <span className={styles.creditValue}>{g.majorRequired}</span>
            </div>
            <div className={styles.creditItem}>
              <span className={styles.creditLabel}>전공선택</span>
              <span className={styles.creditValue}>{g.majorElective}</span>
            </div>
            <div className={styles.creditItem}>
              <span className={styles.creditLabel}>교양필수</span>
              <span className={styles.creditValue}>{g.generalRequired}</span>
            </div>
            <div className={styles.creditItem}>
              <span className={styles.creditLabel}>교양선택</span>
              <span className={styles.creditValue}>{g.generalElective}</span>
            </div>
            <div className={styles.creditItem}>
              <span className={styles.creditLabel}>자유학점</span>
              <span className={styles.creditValue}>{g.totalCredits - specifiedCredits}</span>
            </div>
          </div>
          {g.note && <p className={styles.note}>※ {g.note}</p>}
        </section>

        {/* 필요학점 계산기 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>필요학점 계산기</h2>
          <GraduationCalculator graduation={g} />
        </section>

        {/* 이수체계 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>이수체계 (전공필수 중심)</h2>
          <div className={styles.courseTable}>
            {grouped.map(([year, sems]) => (
              <div key={year} className={styles.courseRow}>
                <div className={styles.courseYear}>{year}학년</div>
                <div className={styles.courseSems}>
                  {/* 1학기 */}
                  <div className={styles.courseSem}>
                    <span className={styles.semLabel}>1학기</span>
                    <div className={styles.courseList}>
                      {sems.sem1.length > 0 ? sems.sem1.map((c) => (
                        <div key={c.name} className={`${styles.courseChip} ${c.isRequired ? styles.required : ''}`}>
                          <span>{c.name}</span>
                          <span className={styles.chipCredits}>{c.credits}학점</span>
                        </div>
                      )) : <span className={styles.empty}>-</span>}
                    </div>
                  </div>
                  {/* 2학기 */}
                  <div className={styles.courseSem}>
                    <span className={styles.semLabel}>2학기</span>
                    <div className={styles.courseList}>
                      {sems.sem2.length > 0 ? sems.sem2.map((c) => (
                        <div key={c.name} className={`${styles.courseChip} ${c.isRequired ? styles.required : ''}`}>
                          <span>{c.name}</span>
                          <span className={styles.chipCredits}>{c.credits}학점</span>
                        </div>
                      )) : <span className={styles.empty}>-</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.legend}>
            <span className={`${styles.legendDot} ${styles.required}`} /> 전공필수
            &nbsp;&nbsp;
            <span className={styles.legendDot} /> 전공선택
          </p>
        </section>

        {/* 진출 분야 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>졸업 후 진출 분야</h2>
          <div className={styles.careerList}>
            {detail.careers.map((career) => (
              <span key={career} className={styles.careerChip}>{career}</span>
            ))}
          </div>
        </section>

        {/* 전과 안내 */}
        {detail.transferNotes && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>전과 / 자율전공 유의사항</h2>
            <p className={styles.transferNote}>{detail.transferNotes}</p>
          </section>
        )}

      </div>
    </div>
  )
}
