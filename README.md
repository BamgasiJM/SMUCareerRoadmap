# 세명대학교 전공 탐색 사이트

**Career Guidance Program — 전공·진로 안내**

전과 희망 학생 및 자율전공 입학 후 전공을 선택하는 학생을 위한 전공 탐색 웹사이트입니다.  
전공별 소개, 필요 이수학점, 졸업요건, 진출 분야 등을 한 곳에서 확인할 수 있습니다.

---

## 개요

| 항목 | 내용 |
|---|---|
| 대상 | 전과 희망 학생, 자율전공 입학 후 전공 선택 학생 |
| 주요 기능 | 전공 탐색, 단과대 필터, 키워드 검색, 졸업요건 확인, 이수체계 조회 |
| 데이터 방식 | JSON 파일 (추후 DB 연동 예정) |
| 배포 대상 | 세명대학교 홈페이지 연결 또는 임베드 |

---

## 기술 스택

| 분류 | 기술 | 버전 |
|---|---|---|
| UI | React | 19 |
| 번들러 | Vite | 6 |
| 언어 | TypeScript | 5.8 |
| 라우팅 | React Router | 7 |
| 데이터 fetching | TanStack Query | 5 |
| 전역 상태 | Zustand | 5 |
| 스타일 | CSS Modules | — |
| 폰트 | Noto Sans KR (Google Fonts) | — |

별도 UI 라이브러리 없이 순수 CSS로 구현합니다.

---

## 로컬 실행

```bash
# 1. 의존성 설치 (최초 1회)
npm install

# 2. 개발 서버 실행
npm run dev
# → http://localhost:5173

# 3. 프로덕션 빌드
npm run build
```

---

## 파일 구성

```
smu-major-guide/
│
├── index.html                          # HTML 진입점, Google Fonts 로드
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .gitignore
│
├── public/
│   └── data/
│       ├── majors.json                 # 전체 학과 목록 및 단과대 정보
│       └── requirements/
│           ├── ai-computer.json        # 학과별 상세 데이터 (학과 id와 파일명 일치)
│           └── {학과id}.json          # 나머지 학과 파일 (직접 추가 필요)
│
└── src/
    ├── main.tsx                        # 앱 진입점, QueryClient 초기화
    ├── App.tsx                         # 라우터 및 페이지 라우팅 정의
    ├── vite-env.d.ts                   # CSS 모듈 타입 선언
    │
    ├── styles/
    │   └── variables.css               # 전역 CSS 변수 (컬러, 폰트, 간격 등)
    │
    ├── types/
    │   └── index.ts                    # 전체 TypeScript 타입 정의
    │
    ├── api/
    │   └── majors.ts                   # fetch 함수 모음 — DB 연동 시 이 파일만 수정
    │
    ├── store/
    │   └── filterStore.ts              # Zustand 스토어 (검색어, 단과대 필터 상태)
    │
    ├── components/
    │   ├── Header/
    │   │   ├── Header.tsx
    │   │   └── Header.module.css
    │   ├── FilterBar/
    │   │   ├── FilterBar.tsx           # 검색 입력, 단과대 필터 버튼
    │   │   └── FilterBar.module.css
    │   └── MajorCard/
    │       ├── MajorCard.tsx           # 전공 카드 (클릭 시 상세 페이지 이동)
    │       └── MajorCard.module.css
    │
    └── pages/
        ├── HomePage.tsx                # 메인 — 단과대별 카드 그리드
        ├── HomePage.module.css
        ├── MajorDetailPage.tsx         # 상세 — 졸업요건, 이수체계, 진출분야
        └── MajorDetailPage.module.css
```

---

## 실제 데이터 입력 방법

### 1. 학과 목록 수정 — `public/data/majors.json`

전체 학과의 기본 정보를 관리합니다. 학과를 추가하거나 학점·태그를 수정할 때 이 파일을 편집합니다.

```json
{
  "colleges": [
    { "id": "humanities", "name": "인문예술대학", "nameEn": "College of Humanities & Arts" }
  ],
  "majors": [
    {
      "id": "ai-computer",         // 고유 ID — requirements 파일명과 반드시 일치
      "collegeId": "humanities",   // colleges 배열의 id 중 하나
      "name": "AI컴퓨터학부",
      "totalCredits": 130,
      "tags": ["AI", "컴퓨터", "취업률상위"]
    }
  ]
}
```

**`id` 값은 영문 소문자와 하이픈만 사용합니다.** 이 값이 URL 경로(`/major/ai-computer`)와 상세 데이터 파일명(`ai-computer.json`)에 그대로 사용됩니다.

---

### 2. 학과 상세 데이터 추가 — `public/data/requirements/{학과id}.json`

각 학과의 상세 정보를 담는 파일입니다. `majors.json`의 `id` 값과 **파일명이 정확히 일치**해야 합니다.

현재 예시 파일인 `ai-computer.json`을 복사하여 내용을 수정하는 방식으로 나머지 학과 파일을 추가합니다.

```json
{
  "id": "ai-computer",
  "name": "AI컴퓨터학부",
  "collegeId": "ai",
  "overview": "학과 소개 텍스트",
  "contacts": {
    "office": "미래관 401호",
    "phone": "043-649-1234",
    "email": "aicomputer@semyung.ac.kr"
  },
  "graduation": {
    "totalCredits": 130,
    "majorRequired": 45,       // 전공필수 학점
    "majorElective": 24,       // 전공선택 학점
    "generalRequired": 30,     // 교양필수 학점
    "generalElective": 15,     // 교양선택 학점
    "thesis": false,           // 졸업논문/작품 필요 여부
    "note": "캡스톤디자인 6학점 포함 필수"  // 선택 항목
  },
  "requiredCourses": [
    {
      "year": 1,               // 학년 (1~4)
      "semester": 1,           // 학기 (1 또는 2)
      "name": "프로그래밍기초",
      "credits": 3,
      "isRequired": true       // true: 전공필수 / false: 전공선택
    }
  ],
  "careers": ["소프트웨어엔지니어", "AI 엔지니어"],
  "transferNotes": "전과 시 유의사항 텍스트 (선택 항목)"
}
```

상세 데이터 파일이 없는 학과는 카드 클릭 시 "준비 중" 안내 화면이 표시됩니다.

---

### 3. 데이터 적용 흐름 요약

```
majors.json 수정/추가
    → 메인 페이지 카드에 즉시 반영

requirements/{id}.json 추가
    → 해당 학과 카드 클릭 시 상세 페이지에 반영
```

---

## 향후 작업 목록

### 단기 — 콘텐츠 입력

- [ ] `public/data/requirements/` 에 나머지 34개 학과 JSON 파일 추가
- [ ] 각 학과 `overview`, `contacts`, `requiredCourses` 실제 데이터로 채우기
- [ ] 건축학과 등 5년제 학과 이수체계 예외 처리 확인

### 중기 — 기능 개선

- [ ] 상세 데이터 없는 학과의 "준비 중" UI 개선
- [ ] 페이지 상단 히어로 섹션 추가 여부 결정
- [ ] 학교 홈페이지 임베드 방식 확정 (iframe vs 서브도메인 배포)

### 장기 — 기능 확장

#### 이수학점 계산기
학생이 현재까지 이수한 학점을 직접 입력하면, 선택한 전공 기준으로 잔여 필요학점을 항목별(전공필수, 전공선택, 교양 등)로 계산하여 보여주는 기능입니다.
- 입력: 현재 이수 학점 (항목별)
- 출력: 졸업까지 필요한 잔여 학점 (항목별)
- 구현 방향: 클라이언트 단순 계산으로 처리 가능, 별도 서버 불필요

#### 방문자 수 집계
사이트 방문자 수를 집계하여 화면 하단 또는 구석에 표시하는 기능입니다.
- 구현 방향: DB 연동 이후 서버 측 카운터 API 연동이 자연스러운 시점
- DB 연동 전 임시 방안: [Firebase Realtime Database](https://firebase.google.com/) 또는 [Supabase](https://supabase.com/) 무료 플랜으로 카운터 구현 가능

---

## DB 연동 시 수정 위치

`src/api/majors.ts` 의 `queryFn` 내부 URL만 교체하면 됩니다. TanStack Query가 로딩·에러·캐싱을 자동 처리하므로 컴포넌트 코드는 수정하지 않아도 됩니다.

```ts
// 변경 전 (JSON 파일)
queryFn: () => fetch('/data/majors.json').then(r => r.json())

// 변경 후 (REST API)
queryFn: () => fetch('https://api.semyung.ac.kr/majors').then(r => r.json())
```
