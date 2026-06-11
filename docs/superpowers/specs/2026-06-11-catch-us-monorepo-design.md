# Catch Us 모노레포 설계

## 목표

`/Users/minwoo/workspaces/catch-us` 경로 자체를 pnpm 기반 Turborepo로
초기화한다. 별도의 `catch-us` 하위 디렉터리는 만들지 않는다. 저장소에는
Next.js App Router 애플리케이션 2개와 향후 제품 개발을 위한 공유 패키지
경계를 구성한다.

이번 단계에서는 실행 가능한 애플리케이션 골격만 만든다. Supabase 연결,
지도 SDK 설치, 임베딩 모델 선정 및 실행, 이미지 처리, 실제 제품 기능은
구현하지 않는다.

## 초기화 전략

현재 저장소 루트에 공식 `create-turbo` 스타터를 적용한 뒤, 생성된 예제를
승인된 패키지 구조로 재구성한다. 모노레포 검증에 필요하지 않은 데모 코드는
제거한다.

패키지 매니저는 pnpm을 사용한다. 워크스페이스 루트 패키지는 `private`으로
설정하며 저장소 수준의 도구만 포함한다.

## 저장소 구조

```text
catch-us/
├── apps/
│   ├── web/
│   └── admin/
├── packages/
│   ├── ui/
│   ├── auth/
│   ├── core/
│   ├── db/
│   ├── eslint-config/
│   └── typescript-config/
├── docs/
│   └── superpowers/
│       └── specs/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
└── README.md
```

### 애플리케이션

- `apps/web`: Next.js App Router 기반 사용자용 사진 서비스 골격
- `apps/admin`: Next.js App Router 기반 관리자 대시보드 골격
- 두 애플리케이션은 서로의 파일을 직접 import하지 않는다.
- 공유 기능은 반드시 선언된 `@repo/*` 워크스페이스 의존성을 통해 사용한다.

### 공유 패키지

- `@repo/ui`: 공유 shadcn/ui 컴포넌트, 훅, 유틸리티, 전역 스타일을 위한
  JIT TypeScript 패키지
- `@repo/auth`: 인증과 권한 경계를 미리 정의하는 최소 JIT 패키지
- `@repo/core`: 공유 도메인 타입과 규칙의 경계를 미리 정의하는 최소 JIT
  패키지
- `@repo/db`: Supabase/Postgres 데이터 접근 경계를 미리 정의하는 최소 JIT
  패키지
- `@repo/eslint-config`: 공유 ESLint 설정
- `@repo/typescript-config`: 공유 TypeScript 설정

`auth`, `core`, `db`에는 타입이 지정된 유효한 API를 노출하고
애플리케이션에서 패키지를 사용할 수 있는지 검증하는 최소 코드만 둔다.
외부 서비스를 설치하거나 초기화하지 않는다.

## 패키지 경계

모든 워크스페이스는 자체 `package.json`을 가진다. 내부 의존성은
`workspace:*`를 사용하며 각 소비 패키지가 직접 선언한다. 패키지는 지원하는
진입점만 `exports`로 공개한다. 소비자는 상대 경로로 다른 패키지 내부에
접근할 수 없다.

공유 런타임 패키지는 JIT 방식으로 구성한다. TypeScript 소스를 직접
export하므로 별도의 컴파일이나 watch 프로세스가 필요하지 않다. 두 Next.js
애플리케이션은 공유 패키지를 transpile하도록 설정한다.

Next.js와 React 같은 애플리케이션 런타임 의존성은 해당 애플리케이션 또는
직접 사용하는 패키지에 둔다. 루트에는 Turborepo와 같은 저장소 수준의 개발
도구만 둔다.

## Turborepo 작업 구성

실제 작업 명령은 각 애플리케이션 또는 패키지가 소유한다. 루트 스크립트는
`turbo run`으로 실행을 위임하기만 한다.

- `build`: `^build`로 의존 패키지의 빌드를 먼저 실행한다. Next.js 산출물인
  `.next/**`는 캐시하되 `.next/cache/**`는 제외한다.
- `dev`: 캐시하지 않는 애플리케이션 개발 서버용 persistent task로 구성한다.
- `lint`: 각 워크스페이스의 lint 스크립트를 실행한다.
- `check-types`: 각 워크스페이스의 TypeScript 검증을 실행한다.

lint와 타입 검사는 가능한 범위에서 병렬로 실행한다. 다만 의존 패키지의
소스가 변경되면 캐시가 올바르게 무효화되어야 한다. 이 동작에 필요하다면
Turborepo transit node 패턴을 사용한다.

루트 스크립트에서 워크스페이스 디렉터리를 직접 순회하거나 패키지 빌드를
수동으로 연결하지 않는다.

## 공유 UI

`packages/ui`가 다음 항목을 소유한다.

- shadcn/ui 기본 컴포넌트
- 공유 훅
- `cn` 유틸리티
- 공유 Tailwind CSS v4 전역 스타일

`apps/web`, `apps/admin`, `packages/ui`에 서로 호환되는 `components.json`을
둔다. alias는 공유 기본 컴포넌트가 `@repo/ui`에 생성되도록 설정하고,
애플리케이션 전용 복합 컴포넌트는 각 애플리케이션 내부에 유지한다.

소비자는 공개된 경로만 사용한다.

```ts
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
```

초기 스캐폴드에는 공유 `Button` 컴포넌트 하나만 추가한다. 각
애플리케이션의 최소 홈 화면에서 이 컴포넌트를 렌더링하여 패키지 해석,
스타일, transpile 설정을 검증한다. shadcn 스타일, 기본 색상, 아이콘
라이브러리, CSS 변수 설정은 모든 워크스페이스에서 동일하게 유지한다.

## 초기 데이터 흐름

이번 단계에는 제품 데이터 흐름이 없다. 각 애플리케이션은 다음 항목을
import한다.

- `@repo/ui`의 공유 UI 컴포넌트
- `@repo/auth`의 부작용 없는 타입 지정 export
- `@repo/core`의 부작용 없는 타입 지정 export
- `@repo/db`의 부작용 없는 타입 지정 export

이 import들은 외부 서비스 연결을 암시하지 않으면서 아키텍처 경계를
검증하기 위한 것이다.

## 오류 처리

이번 스캐폴드에는 네트워크 또는 데이터베이스 작업이 없으므로 런타임 오류
처리는 Next.js의 기본 동작 범위로 제한한다. 설정 오류는 fallback import나
선언되지 않은 의존성으로 숨기지 않고 설치, lint, 타입 검사 또는 빌드
단계에서 실패하도록 한다.

## 완료 조건

다음 조건을 모두 만족하면 구현이 완료된 것으로 본다.

1. 저장소 루트가 `/Users/minwoo/workspaces/catch-us`로 유지된다.
2. `catch-us/catch-us` 형태의 중첩 디렉터리가 존재하지 않는다.
3. `pnpm install`이 성공한다.
4. `pnpm lint`가 성공한다.
5. `pnpm check-types`가 성공한다.
6. `pnpm build`로 두 애플리케이션이 모두 빌드된다.
7. 두 애플리케이션에서 공유 `@repo/ui` Button을 렌더링한다.
8. 두 애플리케이션에서 `@repo/auth`, `@repo/core`, `@repo/db`의 타입 지정
   export를 정상적으로 해석한다.
9. Turborepo가 의도한 워크스페이스 task graph를 인식한다.
10. `README.md`에 저장소 구조와 주요 명령어를 기록한다.

## 이번 범위에서 제외하는 항목

- Supabase 프로젝트 설정, 스키마, RLS, 스토리지, Postgres 인덱스
- 인증 공급자와 게스트 접근 정책
- 사진 공개 및 비공개 관리
- 이미지 메타데이터 추출과 역지오코딩
- TMAP, 카카오맵, 구글맵 연동
- 이미지, 키워드, 얼굴, 유사도 임베딩 모델 선정
- 벡터 저장 및 검색
- 업로드, 갤러리, 지도, 검색, 관리자 제품 화면
- 배포 및 CI 설정
