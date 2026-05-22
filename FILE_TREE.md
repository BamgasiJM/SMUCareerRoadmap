# 1. 압축 해제 후 폴더로 이동
cd smu-major-guide

# 2. 패키지 설치 (최초 1회)
npm install

# 3. 개발 서버 실행
npm run dev
→ http://localhost:5173 에서 확인


smu-major-guide/
│
├── index.html                          ← HTML 진입점 (Google Fonts 로드)
├── package.json                        ← 의존성 정의
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│
├── public/
│   └── data/
│       ├── majors.json                 ← 전체 학과 목록 (35개)
│       └── requirements/
│           └── ai-computer.json        ← 학과 상세 예시 (나머지는 직접 추가)
│
└── src/
    ├── main.tsx                        ← QueryClient 설정, 앱 마운트
    ├── App.tsx                         ← BrowserRouter + Routes 정의
    ├── vite-env.d.ts                   ← CSS 모듈 타입 선언
    │
    ├── styles/
    │   └── variables.css               ← 전체 CSS 변수 (컬러, 폰트, 간격)
    │
    ├── types/
    │   └── index.ts                    ← Major, MajorDetail, College 등 타입
    │
    ├── api/
    │   └── majors.ts                   ← fetch 함수 (DB 연동 시 여기만 수정)
    │
    ├── store/
    │   └── filterStore.ts              ← Zustand (검색어, 단과대 필터 상태)
    │
    ├── components/
    │   ├── Header/
    │   │   ├── Header.tsx
    │   │   └── Header.module.css
    │   ├── FilterBar/
    │   │   ├── FilterBar.tsx           ← 검색 + 단과대 필터 버튼
    │   │   └── FilterBar.module.css
    │   └── MajorCard/
    │       ├── MajorCard.tsx           ← 전공 카드 (클릭 시 상세 이동)
    │       └── MajorCard.module.css
    │
    └── pages/
        ├── HomePage.tsx                ← 카드 그리드 + 단과대별 섹션
        ├── HomePage.module.css
        ├── MajorDetailPage.tsx         ← 졸업요건, 이수체계, 진출분야
        └── MajorDetailPage.module.css