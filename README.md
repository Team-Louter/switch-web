# Switch

학교 기반 **멘토링 커뮤니티 플랫폼** Louter의 웹 클라이언트입니다.

멘토(LEADER/MENTOR)와 멘티(MENTEE)가 함께 성장할 수 있는 통합 플랫폼으로, 커뮤니티 게시판, 멘토링 Q&A, 일정 관리, 학습 리포트 등 역할별 맞춤 기능을 제공합니다.

## 목차

1. [기술 스택](#기술-스택)
2. [주요 기능](#주요-기능)
3. [아키텍처](#아키텍처)
4. [시작하기](#시작하기)
5. [개발 규칙](#개발-규칙)
6. [커밋 컨벤션](#커밋-컨벤션)

## 기술 스택

### Core

- **React** 19
- **TypeScript** 5.9 (strict mode)
- **Vite** 7 (빌드 도구)
- **React Router** 7 (동적/역할 기반 라우팅)

### 상태 & 데이터

- **Zustand** (경량 상태관리)
- **Axios** (HTTP 클라이언트)
- **Firebase** (FCM 푸시알림)

### UI & 스타일

- **styled-components** 6.3 (CSS-in-JS + 토큰 기반 테마)
- **FullCalendar** 6 (일정 관리 UI)
- **react-icons** (아이콘)
- **react-easy-crop** (이미지 크롭)

### 마크다운 & 콘텐츠

- **markdown-it** (마크다운 파서)
- **remark-gfm** (GitHub Flavored Markdown)
- **react-markdown** (React 컴포넌트)
- **react-syntax-highlighter** + **highlight.js** (코드 문법 강조)
- **DOMPurify** (XSS 방지)

### 개발 도구

- **ESLint** + **Prettier** (코드 정적 분석)
- **TypeScript strict mode** (타입 안정성)

## 주요 기능

### 🔐 인증 & 계정

- **이메일 기반 회원가입**: 인증코드 검증 → 추가정보 입력
- **Google OAuth**: 소셜 로그인
- **토큰 기반 인증**: Bearer Token + 자동 갱신 (401 시 투명 처리)
- **비밀번호 재설정**: 이메일 링크 기반
- **회원 탈퇴**: 이메일 인증 후 처리

### 💬 커뮤니티 게시판

- **9개 카테고리**: 공지, 잡담, 질문 등 체계적 분류
- **마크다운 지원**: 코드 블록(언어별 강조), 테이블, 체크리스트, 비디오 임베딩(video: 형식)
- **고정글 기능**: 중요 글 상단 노출
- **페이지네이션**: 게시글 10개씩 로드
- **댓글 시스템**: 대댓글 지원 (depth 기반)
- **좋아요 기능**: 사용자별 추적
- **파일 업로드**: Blob URL 변환 후 서버 저장

### 📅 캘린더 & 일정관리

- **FullCalendar 기반**: 월단위 일정 뷰
- **일정 CRUD**: 생성, 수정, 삭제
- **스켈레톤 로딩**: 로딩 중 부드러운 UI
- **이벤트 상세 카드**: 클릭 시 드래그 가능한 카드로 표시

### 🎓 멘토링 Q&A

- **역할 기반**: LEADER/MENTOR이 답변, MENTEE가 질문
- **상태 관리**: PAUSED, ACTIVE, DONE
- **파일 첨부**: 질문/답변에 파일 포함 가능

### 📝 학습 & 리포트

- **역할별 분기**:
  - **LEADER/MENTOR**: 리포트 작성 페이지
  - **MENTEE**: 리포트 조회 페이지
- **주차별 리포트**: week number 기반 체계화
- **개인 학습 vs 클럽 활동**: 내용 구분 저장
- **클럽 리포트**: Study 페이지에서 일정 선택 후 생성

### 👤 프로필 관리

- **기본 정보**: 이름, 학년, 반, 번호
- **소셜 링크**: GitHub, LinkedIn URL
- **프로필 이미지**: react-easy-crop으로 세밀한 크롭 편집
- **전공 태그**: 다중선택
- **통계**: 작성글, 댓글, 받은 좋아요 수
- **멤버 관리** (LEADER 전용): 역할 변경, 퇴출

### 🔔 푸시알림 & 알림

- **Firebase FCM**: 포그라운드/백그라운드 모두 지원
- **Toast 시스템**: 에러/성공/경고 3종류 (자동 닫힘)

## 아키텍처

### 디렉토리 구조

```
src/
├── app/                    # 앱 초기화, 라우팅, FCM 관리
├── pages/                  # 페이지 컴포넌트 (55개)
│   ├── Main/              # 대시보드
│   ├── Community/         # 게시판
│   ├── Mentoring/         # Q&A
│   ├── Calendar/          # 일정
│   ├── Study/             # 학습/리포트
│   ├── Profile/           # 프로필
│   └── Auth/              # 인증
├── components/
│   └── common/            # 공통 UI 컴포넌트
├── api/                   # API 엔드포인트 (Post, Comment, Auth, User, Event, Study, Fcm 등)
├── hooks/                 # 커스텀 훅
├── store/                 # Zustand 전역 상태
├── styles/                # 스타일 시스템 (테마, 토큰, 전역 스타일)
├── types/                 # TypeScript 타입 정의
├── utils/                 # 유틸리티 함수 (날짜, 마크다운, 이미지 등)
└── constants/             # 상수 定義
```

### 핵심 패턴

- **역할 기반 라우팅**: StudyPageSelector로 LEADER/MENTOR/MENTEE 페이지 동적 선택
- **API 인터셉터**: 401 에러 시 토큰 자동 갱신 + 요청 대기열 관리
- **스켈레톤 로딩**: 데이터 도착 전까지 placeholder UI 표시
- **반응형 디자인**: 모바일 메뉴 + 스크롤 감지 상단바 숨김

### 특별한 구현

#### **토큰 자동 갱신**

- 요청 인터셉터: `localStorage`에서 토큰 자동 추가 (Bearer)
- 응답 인터셉터: 401 에러 시 `/auth/refresh` 호출
- 대기열 관리: 중복 refresh 방지, 모든 대기 중인 요청 처리

#### **마크다운 완전 지원**

- 코드 블록 언어별 하이라이팅
- 표, 체크리스트, 링크 자동화
- 비디오 임베딩 (video: 형식)
- XSS 방지 (DOMPurify)
- 코드 블록 복사 버튼

#### **권한 기반 UI**

- KebabMenu의 `visible` prop으로 동적 노출
- 역할별 페이지 분기 (StudyPageSelector)
- LEADER 전용 멤버 관리 모달

## 시작하기

### 요구사항

- Node.js 16+ (npm 패키지 매니저)

### 설치

```bash
npm i
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버는 기본값으로 `http://localhost:5173`에서 실행됩니다.

**Hot Module Replacement (HMR)** 활성: 파일 저장 시 자동 새로고침

### 환경변수 설정

프로젝트 루트에 `.env.local` (개발) 또는 `.env.production` (배포) 파일을 생성:

### 배포

Vercel에서 자동으로 빌드 및 배포합니다. Pull Request 생성 시 Preview 배포, 메인 브랜치 머지 시 프로덕션 배포가 자동으로 진행됩니다.

## 개발 규칙

### TypeScript & 코드 구조

- **strict mode** 활성: 모든 타입을 명시적으로 지정
- **폴더별 역할**: `app` → `pages` → `components` → `api` → `store` → `hooks` → `types`
- **재사용성**: API 함수, 로직은 중복 작성 금지 (이미 있으면 재사용)

### 스타일링

- **styled-components** + **토큰 기반 테마** 우선
- **3개 이상 스타일**: 인라인 스타일 금지
- 색상/폰트: `styles/` 토큰에서 가져오기

### API 호출

- 모든 API는 `src/api/` Axios 인스턴스 사용
- Bearer 토큰 자동 추가 (인터셉터)
- 401 응답 시 자동 로그아웃

### Hooks

- 이름은 `use`로 시작
- UI 반환 금지 (로직만)

### 주석

- **함수 상단**: 함수 설명 작성
- **변수 옆**: 변수 설명 권장
- **JSX 내부**: 최소화 (조건부 렌더링은 조건 설명)

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 파일/컴포넌트 | PascalCase | `ProfileCard.tsx` |
| 함수/변수/상수 | camelCase | `formatDate, userData` |
| 이벤트 핸들러 | handle{Event} | `handleClick`, `handleSubmit` |
| 콜백 props | on{Event} | `onClick`, `onSubmit` |
| Boolean 변수 | is/has/can/should | `isLoading`, `isLoggedIn` |
| Dummy 데이터 | dummy{Usage} | `dummyPosts`, `dummyUser` |
| 유틸/토큰 파일 | camelCase 또는 snake_case | `formatDate.ts`, `color_tokens.ts` |

### 브랜치 네이밍

```
feature/#issueNumber-description     # 기능/화면 추가
fix/#issueNumber-description         # 버그 수정
refactor/#issueNumber-description    # 구조 개선
style/#issueNumber-description       # 스타일 작업
```

## 커밋 컨벤션

형식: `{type}: {description}`

### Type 종류

| Type | 설명 |
|------|------|
| `feat` | 컴포넌트/페이지/기능 추가 |
| `style` | CSS 수정/추가 (로직 변경 없음) |
| `update` | 사소한 코드 수정 |
| `fix` | 오류 로직 수정 |
| `delete` | 파일/함수/컴포넌트 삭제 |
| `refactor` | 코드 정리/컴포넌트화/구조 정리 |
| `WIP` | 작업 중 (중간 커밋, 오류 해결 공유용) |

### 예시

```
feat: 멘토링 Q&A 페이지 추가
```

---

**마지막 업데이트**: 2026-04-09
