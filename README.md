# Catch Us

Catch Us는 사진 서비스와 관리자 대시보드를 위한 pnpm Turborepo입니다.

## 프로젝트 구조

### 애플리케이션

- `apps/web`: 사용자용 사진 서비스 (`http://localhost:3000`)
- `apps/admin`: 관리자 대시보드 (`http://localhost:3001`)

### 패키지

- `packages/ui`: 애플리케이션에서 공유하는 UI 컴포넌트
- `packages/auth`: 인증 관련 공통 로직
- `packages/core`: 도메인 모델과 공통 비즈니스 로직
- `packages/db`: 데이터베이스 연결과 데이터 접근 계층
- `packages/eslint-config`: 공유 ESLint 설정
- `packages/typescript-config`: 공유 TypeScript 설정

## 시작하기

```bash
pnpm install
pnpm dev
```

## 명령

```bash
pnpm install
pnpm dev
pnpm lint
pnpm check-types
pnpm build
```

개별 애플리케이션만 실행하려면 다음 명령을 사용합니다.

```bash
pnpm turbo run dev --filter=@repo/web
pnpm turbo run dev --filter=@repo/admin
```

## 현재 범위

현재 저장소는 모노레포 골격만 제공합니다. Supabase 연동, 지도 기능, 이미지 분석, 임베딩 생성, 검색 기능은 후속 작업에서 구현합니다.
