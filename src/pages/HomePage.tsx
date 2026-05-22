import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchMajors } from '../api/majors'
import { useFilterStore } from '../store/filterStore'
import FilterBar from '../components/FilterBar/FilterBar'
import MajorCard from '../components/MajorCard/MajorCard'
import type { Major } from '../types'
import styles from './HomePage.module.css'

export default function HomePage() {
  const { searchQuery, selectedCollege } = useFilterStore()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['majors'],
    queryFn: fetchMajors,
    staleTime: 1000 * 60 * 10, // 10분 캐시
  })

  // 필터링 로직
  const filteredMajors = useMemo<Major[]>(() => {
    if (!data) return []
    return data.majors.filter((major) => {
      const matchCollege =
        selectedCollege === 'all' || major.collegeId === selectedCollege
      const query = searchQuery.trim().toLowerCase()
      const matchSearch =
        !query ||
        major.name.toLowerCase().includes(query) ||
        major.tags.some((tag) => tag.toLowerCase().includes(query))
      return matchCollege && matchSearch
    })
  }, [data, searchQuery, selectedCollege])

  if (isLoading) return <div className={styles.status}>데이터를 불러오는 중...</div>
  if (isError || !data) return <div className={styles.status}>데이터를 불러오지 못했습니다.</div>

  const collegeMap = Object.fromEntries(data.colleges.map((c) => [c.id, c]))

  return (
    <div>
      <FilterBar
        colleges={data.colleges}
        totalCount={data.majors.length}
        filteredCount={filteredMajors.length}
      />

      <main className={styles.main}>
        {filteredMajors.length === 0 ? (
          <div className={styles.empty}>
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          // 단과대별로 그룹핑하여 표시
          selectedCollege !== 'all' ? (
            <section className={styles.section}>
              <div className={styles.grid}>
                {filteredMajors.map((major) => (
                  <MajorCard
                    key={major.id}
                    major={major}
                    college={collegeMap[major.collegeId]!}
                  />
                ))}
              </div>
            </section>
          ) : (
            data.colleges.map((college) => {
              const collegeMajors = filteredMajors.filter(
                (m) => m.collegeId === college.id
              )
              if (collegeMajors.length === 0) return null
              return (
                <section key={college.id} className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{college.name}</h2>
                    <span className={styles.sectionEn}>{college.nameEn}</span>
                    <span className={styles.sectionCount}>{collegeMajors.length}개 학과</span>
                  </div>
                  <div className={styles.grid}>
                    {collegeMajors.map((major) => (
                      <MajorCard
                        key={major.id}
                        major={major}
                        college={college}
                      />
                    ))}
                  </div>
                </section>
              )
            })
          )
        )}
      </main>
    </div>
  )
}
