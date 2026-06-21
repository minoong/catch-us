# Catch Us 관리자 대시보드 레이아웃 설계

## 배경

`apps/admin`은 현재 공유 패키지 연결을 확인하는 최소 화면만 제공한다. 이번
작업에서는 실제 데이터나 운영 기능을 연결하기 전에, 관리자 기능을 일관되게
확장할 수 있는 공통 대시보드 레이아웃과 개요 화면의 정적 구조를 만든다.

UI는 임의 구현하지 않고 shadcn 공식 registry의 `@shadcn/dashboard-01` 블록과
공식 컴포넌트를 CLI로 설치한 뒤 Catch Us에 맞게 구성한다. 관리자 앱 내부의
제품 코드는 Feature-Sliced Design(FSD) 규칙을 따르되, Next.js와 이름이 겹치는
`pages` Layer는 사용하지 않는다.

## 목표

1. `apps/admin`에 재사용 가능한 관리자 공통 셸을 만든다.
2. 승인된 균형형 개요 레이아웃을 목업 데이터로 구현한다.
3. 기능별 메뉴와 route를 만들고 후속 기능을 추가할 위치를 고정한다.
4. 데스크톱과 모바일에서 탐색 가능한 반응형 구조를 제공한다.
5. 라이트 테마와 다크 테마를 모두 지원한다.
6. 이후 Supabase, Supabase Auth, 사진 처리 기능을 붙여도 화면 구조를 다시
   만들지 않도록 경계를 분명히 한다.

## 이번 범위

### 포함

- shadcn `@shadcn/dashboard-01` 기반 공통 Sidebar와 Header
- 데스크톱에서 접을 수 있는 Sidebar
- 모바일에서 Sheet 형태로 동작하는 메뉴
- 현재 route를 반영하는 활성 메뉴와 Breadcrumb
- 라이트/다크 테마 전환
- 관리자 Avatar와 Dropdown Menu
- 기능별 8개 메뉴와 route
- 개요 화면의 지표 카드, 차트 영역, 최근 사진 테이블
- 타입이 정의된 목업 데이터
- 나머지 route의 공통 준비 상태 화면

### 제외

- Supabase 및 Supabase Auth
- 로그인과 회원가입 화면
- 이미지 업로드와 파일 저장
- EXIF 메타데이터 추출
- TMAP, Geoapify, Google Maps 연동
- 공개/비공개 상태 변경
- 검색, 임베딩, 얼굴 인식
- 실제 차트 필터와 테이블 편집
- 서버 데이터 요청, mutation, 캐시

## 확정한 접근법

### shadcn 하이브리드

`@shadcn/dashboard-01`을 CLI로 설치해 검증된 대시보드 구조를 확보한다. CLI가
생성한 파일은 그대로 방치하지 않고 책임에 따라 재배치한다.

- 범용 shadcn UI primitive는 `packages/ui`에 둔다.
- Catch Us 관리자 전용 조합은 `apps/admin/src/widgets`에 둔다.
- route 파일은 화면 구현을 포함하지 않고 Widget을 연결한다.
- 생성 파일의 import alias, 아이콘, composition을 repo 규칙에 맞게 검토한다.

블록 전체를 데모 구조 그대로 유지하는 방식과 primitive를 처음부터 다시
조립하는 방식은 사용하지 않는다. 전자는 제품 경계가 흐려지고, 후자는 공식
블록이 이미 해결한 레이아웃을 중복 구현하기 때문이다.

## 아키텍처

### Next.js와 FSD 경계

Next.js App Router의 `app` 디렉터리는 framework route로만 사용한다. FSD
Layer는 `src` 아래에 둔다. 사용자 결정에 따라 FSD `pages` Layer와 루트
`pages` 디렉터리는 모두 만들지 않는다.

FSD는 필요한 Layer만 도입한다. 이번 작업에서는 `app`, `widgets`, `shared`만
사용하고, 실제 비즈니스 기능이 생기기 전까지 `features`와 `entities`를 만들지
않는다.

```text
apps/admin/
├── app/
│   ├── layout.tsx
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── photos/page.tsx
│       ├── people/page.tsx
│       ├── map/page.tsx
│       ├── search/page.tsx
│       ├── guests/page.tsx
│       ├── jobs/page.tsx
│       └── settings/page.tsx
└── src/
    ├── app/
    │   └── providers/
    ├── widgets/
    │   ├── admin-shell/
    │   ├── overview-dashboard/
    │   ├── photos-screen/
    │   ├── people-screen/
    │   ├── map-screen/
    │   ├── search-screen/
    │   ├── guests-screen/
    │   ├── jobs-screen/
    │   └── settings-screen/
    └── shared/
        ├── config/
        └── lib/
```

### 의존성 규칙

- Next.js route는 필요한 Widget의 Public API만 import한다.
- Widget Slice는 다른 Widget Slice를 import하지 않는다.
- 공통 셸과 화면 Widget의 조합은 route layout과 route page가 담당한다.
- 각 Slice는 `index.ts`를 Public API로 제공한다.
- `src/shared`는 비즈니스 규칙을 포함하지 않는다.
- 앱 내부 코드는 다른 앱이나 패키지의 내부 경로를 참조하지 않는다.
- 범용 UI는 `@repo/ui`의 공개 export만 사용한다.

## route와 메뉴

| 메뉴             | route       | 이번 작업                |
| ---------------- | ----------- | ------------------------ |
| 개요             | `/`         | 균형형 대시보드 레이아웃 |
| 사진 관리        | `/photos`   | 준비 상태 화면           |
| 인물             | `/people`   | 준비 상태 화면           |
| 위치·지도        | `/map`      | 준비 상태 화면           |
| 검색·임베딩      | `/search`   | 준비 상태 화면           |
| 게스트·접근 관리 | `/guests`   | 준비 상태 화면           |
| 처리 작업        | `/jobs`     | 준비 상태 화면           |
| 설정             | `/settings` | 준비 상태 화면           |

메뉴 정보는 `src/shared/config` 한 곳에서 관리한다. Sidebar와 Breadcrumb는 같은
설정을 사용해 label, href, icon이 서로 달라지지 않게 한다.

## 공통 셸

공통 셸은 shadcn Sidebar 조합을 사용한다.

- `SidebarProvider`
- `AppSidebar`
- `SidebarInset`
- `SidebarTrigger`
- Breadcrumb
- Theme Toggle
- Avatar와 Dropdown Menu

데스크톱에서는 Sidebar를 펼치거나 아이콘 상태로 접을 수 있다. 모바일에서는
동일 메뉴가 Sheet로 열린다. 활성 메뉴는 현재 pathname을 기준으로 계산한다.

## 개요 화면

승인된 A안인 균형형 레이아웃을 사용한다.

### 지표 카드

- 전체 사진
- 공개 사진
- 비공개 사진
- 처리 중 사진

### 차트 영역

- 업로드 추이
- 공개/비공개 비율

### 최근 사진

최근 사진 Data Table은 다음 열을 표현한다.

- 썸네일
- 파일명 또는 제목
- 소유자
- 공개 상태
- 위치
- 처리 상태
- 촬영 날짜

이번 작업에서는 표시만 하며 필터, 정렬, 페이지네이션, 상태 변경은 구현하지
않는다.

## 목업 데이터

개요 Widget의 `model` Segment에 타입과 목업 데이터를 둔다. UI 컴포넌트에
숫자, 차트 데이터, 테이블 행을 직접 작성하지 않는다.

향후 Supabase 연결 시 목업 데이터 공급부를 query 결과 mapper로 교체하되,
Widget UI의 입력 타입은 가능한 한 유지한다.

## 반응형 동작

데스크톱 우선으로 설계하지만 모바일에서도 모든 메뉴에 접근할 수 있어야 한다.

- 지표 카드는 화면 폭에 따라 4열에서 2열, 1열로 전환한다.
- 차트는 좁은 화면에서 세로로 배치한다.
- 최근 사진 테이블은 모바일에서 핵심 필드 중심의 리스트 또는 카드로 전환한다.
- Sidebar는 모바일 Sheet로 전환한다.
- 테마 전환과 관리자 메뉴는 모바일 Header에서도 접근 가능해야 한다.

## 테마와 접근성

- 기존 `packages/ui/src/styles/globals.css`의 semantic token을 사용한다.
- raw color로 라이트/다크 값을 중복 지정하지 않는다.
- Sidebar와 Dropdown Menu는 키보드로 조작 가능해야 한다.
- 아이콘 단독 버튼에는 접근 가능한 이름을 제공한다.
- 차트는 색만으로 의미를 구분하지 않고 label 또는 설명을 제공한다.
- 활성 메뉴는 색상 외에도 상태를 식별할 수 있어야 한다.

## 오류와 준비 상태

이번 범위에는 서버 요청이 없으므로 네트워크 오류 처리는 구현하지 않는다.
미구현 route는 빈 화면 대신 shadcn `Empty`를 사용해 기능 이름과 후속 작업
범위를 명확히 보여준다. 존재하지 않는 route는 Next.js 기본 not-found 처리를
사용한다.

## 후속 기능 요구사항

아래 내용은 이번 구현에서 제외하지만 이후 페이지별 설계와 구현에서 유지한다.

### 사진 업로드와 위치

- 여러 이미지를 드래그앤드롭 또는 파일 선택으로 업로드한다.
- 업로드 기본 공개 상태는 `public`이다.
- EXIF GPS가 있으면 위도와 경도를 자동 추출한다.
- 위치가 없는 사진은 단일, 다중, 전체 선택으로 위치를 지정할 수 있다.
- 선택한 여러 사진에 같은 위치를 일괄 적용할 수 있다.
- 위치가 원래 존재하지 않는 화면 캡처 등은 단순 `위치 제외` 체크로 처리한다.
- 위치가 지정되지 않았고 `위치 제외`도 선택하지 않은 사진이 남아 있으면 최종
  업로드를 허용하지 않는다.

### 지오코딩과 지도

- 국내 역지오코딩은 TMAP을 사용한다.
- 해외 역지오코딩은 Geoapify를 사용한다.
- 지도와 사진 마커는 Google Maps를 사용한다.
- 같은 좌표의 사진만 하나의 마커로 묶는다.
- 서로 가까울 뿐 좌표가 다른 사진은 개별 마커로 표시한다.
- 지도와 위치 기반 검색에서 `위치 제외` 사진은 제외한다.
- 일반 갤러리, 날짜, 키워드, 인물 검색에는 `위치 제외` 사진도 포함한다.

### 확장 예정 Layer

실제 기능이 생길 때만 다음 Slice를 검토한다.

- `features/upload-photos`
- `features/assign-photo-location`
- `features/change-photo-visibility`
- `entities/photo`
- `entities/person`
- `entities/guest`

이 이름은 후속 설계에서 책임이 확정된 뒤 생성하며, 이번 작업에서 빈 디렉터리로
미리 만들지 않는다.

## 검증

구현 완료 전 다음을 확인한다.

1. shadcn CLI 생성 파일과 import alias를 검토한다.
2. `pnpm lint`가 성공한다.
3. `pnpm check-types`가 성공한다.
4. `pnpm format:check`가 성공한다.
5. `pnpm build`가 성공한다.
6. `pnpm build-storybook`이 성공한다.
7. 데스크톱과 모바일에서 Sidebar와 route 이동을 확인한다.
8. 라이트와 다크 테마를 확인한다.
9. Sidebar의 키보드 탐색과 활성 메뉴를 확인한다.

## 완료 조건

- `apps/admin` 첫 화면이 승인된 균형형 대시보드 레이아웃을 표시한다.
- 8개 메뉴가 모두 route와 연결된다.
- 공통 셸과 화면 Widget이 FSD import 규칙을 지킨다.
- FSD `pages` Layer와 디렉터리를 사용하지 않는다.
- shadcn 범용 UI가 `packages/ui`에 위치한다.
- 미구현 기능을 실제 동작처럼 위장하지 않는다.
- 모든 정적 검증과 production build가 성공한다.

## 참고 자료

- [shadcn Dashboard](https://ui.shadcn.com/examples/dashboard)
- [shadcn Sidebar](https://ui.shadcn.com/docs/components/radix/sidebar)
- [Feature-Sliced Design 개요](https://fsd.how/kr/docs/get-started/overview/)
- [FSD Next.js 적용 가이드](https://fsd.how/kr/docs/guides/tech/with-nextjs/)
- [FSD Layer](https://fsd.how/kr/docs/reference/layers/)
