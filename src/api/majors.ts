// ===================================================
// DB 연동 시 이 파일의 fetch URL만 교체
// ===================================================

import type { College, Major, MajorDetail } from '../types'

interface MajorsData {
  colleges: College[]
  majors: Major[]
}

// 전공 목록 + 단과대 목록 fetch
export const fetchMajors = async (): Promise<MajorsData> => {
  const res = await fetch('/data/majors.json')
  if (!res.ok) throw new Error('전공 데이터를 불러오지 못했습니다.')
  return res.json() as Promise<MajorsData>
}

// 전공 상세 fetch
export const fetchMajorDetail = async (id: string): Promise<MajorDetail> => {
  const res = await fetch(`/data/requirements/${id}.json`)
  if (!res.ok) throw new Error('전공 상세 정보를 불러오지 못했습니다.')
  return res.json() as Promise<MajorDetail>
}
