// ===================================================
// 세명대학교 전공탐색 — 타입 정의
// ===================================================

export type CollegeId =
  | 'humanities'
  | 'social'
  | 'ai'
  | 'health'

export interface College {
  id: CollegeId
  name: string
  nameEn: string
}

export interface Major {
  id: string
  collegeId: CollegeId
  name: string
  totalCredits: number
  tags: string[]
}

// 상세 페이지용 타입
export interface RequiredCourse {
  year: number
  semester: 1 | 2
  name: string
  credits: number
  isRequired: boolean
}

export interface GraduationRequirement {
  totalCredits: number
  majorRequired: number
  majorElective: number
  generalRequired: number
  generalElective: number
  thesis: boolean
  note?: string
}

export interface MajorDetail {
  id: string
  name: string
  collegeId: CollegeId
  overview: string
  contacts: {
    office: string
    phone?: string
    email?: string
  }
  graduation: GraduationRequirement
  requiredCourses: RequiredCourse[]
  careers: string[]
  transferNotes?: string
}
