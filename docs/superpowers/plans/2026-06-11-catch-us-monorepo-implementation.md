# Catch Us 모노레포 구현 계획

> **에이전트 작업자 필수 하위 스킬:** 이 계획을 작업별로 구현할 때
> `superpowers:subagent-driven-development` 사용을 권장하며, 대안으로
> `superpowers:executing-plans`를 사용할 수 있다. 모든 단계는 체크박스
> (`- [ ]`)로 진행 상태를 추적한다.

**목표:** 현재 `/Users/minwoo/workspaces/catch-us` 루트를 pnpm 기반
Turborepo로 구성하고, 공유 shadcn/ui 패키지를 사용하는 Next.js `web` 및
`admin` 앱을 실행 가능한 상태로 만든다.

**아키텍처:** 공식 `create-turbo` 결과를 임시 경로에 생성해 현재 버전의
설정 기준으로 사용하되, 기존 루트의 Git 이력과 설계 문서, `.agents` 자료는
보존한다. 애플리케이션은 `apps/*`, 공유 코드는 `packages/*`에 두며 모든
내부 의존성은 `workspace:*`와 공개 `exports`를 통해서만 연결한다. UI,
인증, 도메인, 데이터베이스 패키지는 별도 빌드가 없는 JIT TypeScript
패키지로 구성한다.

**기술 스택:** pnpm, Turborepo, Next.js App Router, React, TypeScript,
Tailwind CSS v4, shadcn/ui, ESLint

---

## 파일 구성

### 루트

- `package.json`: 루트 메타데이터와 `turbo run` 위임 스크립트
- `pnpm-workspace.yaml`: `apps/*`, `packages/*` 워크스페이스 선언
- `turbo.json`: build, dev, lint, check-types task graph
- `.gitignore`: Node.js, Next.js, Turbo 산출물 제외
- `README.md`: 구조와 개발 명령 문서

### 공유 설정

- `packages/typescript-config/package.json`: TypeScript 설정 패키지 메타데이터
- `packages/typescript-config/base.json`: 모든 패키지의 엄격한 공통 설정
- `packages/typescript-config/nextjs.json`: Next.js 앱 설정
- `packages/typescript-config/react-library.json`: React JIT 패키지 설정
- `packages/eslint-config/package.json`: ESLint 설정 패키지 메타데이터
- `packages/eslint-config/base.js`: TypeScript 공통 lint 설정
- `packages/eslint-config/next.js`: Next.js 앱 lint 설정
- `packages/eslint-config/react-internal.js`: React 공유 패키지 lint 설정

### 공유 런타임 패키지

- `packages/auth/package.json`: `@repo/auth` 공개 API와 task 선언
- `packages/auth/tsconfig.json`: 공통 TypeScript 설정 확장
- `packages/auth/eslint.config.js`: 공통 ESLint 설정 연결
- `packages/auth/src/index.ts`: 인증 경계 식별용 타입과 상수
- `packages/core/package.json`: `@repo/core` 공개 API와 task 선언
- `packages/core/tsconfig.json`: 공통 TypeScript 설정 확장
- `packages/core/eslint.config.js`: 공통 ESLint 설정 연결
- `packages/core/src/index.ts`: 도메인 경계 식별용 타입과 상수
- `packages/db/package.json`: `@repo/db` 공개 API와 task 선언
- `packages/db/tsconfig.json`: 공통 TypeScript 설정 확장
- `packages/db/eslint.config.js`: 공통 ESLint 설정 연결
- `packages/db/src/index.ts`: 데이터 계층 식별용 타입과 상수

### 공유 UI

- `packages/ui/package.json`: UI 공개 경로와 UI 의존성
- `packages/ui/tsconfig.json`: React JIT 패키지 TypeScript 설정
- `packages/ui/eslint.config.js`: React 공유 패키지 lint 설정
- `packages/ui/components.json`: shadcn/ui 생성 대상과 alias
- `packages/ui/src/components/button.tsx`: 최초 공유 shadcn Button
- `packages/ui/src/lib/utils.ts`: `cn` 유틸리티
- `packages/ui/src/styles/globals.css`: Tailwind v4와 공통 CSS 변수

### 애플리케이션

- `apps/web/package.json`: 사용자 앱 의존성과 task
- `apps/web/next.config.ts`: 공유 패키지 transpile 설정
- `apps/web/tsconfig.json`: Next.js TypeScript 설정
- `apps/web/eslint.config.js`: Next.js lint 설정
- `apps/web/components.json`: shadcn 모노레포 alias
- `apps/web/postcss.config.mjs`: Tailwind v4 PostCSS 설정
- `apps/web/app/layout.tsx`: 공통 스타일과 앱 메타데이터
- `apps/web/app/page.tsx`: 공유 패키지 import 검증 화면
- `apps/admin/package.json`: 관리자 앱 의존성과 task
- `apps/admin/next.config.ts`: 공유 패키지 transpile 설정
- `apps/admin/tsconfig.json`: Next.js TypeScript 설정
- `apps/admin/eslint.config.js`: Next.js lint 설정
- `apps/admin/components.json`: shadcn 모노레포 alias
- `apps/admin/postcss.config.mjs`: Tailwind v4 PostCSS 설정
- `apps/admin/app/layout.tsx`: 공통 스타일과 앱 메타데이터
- `apps/admin/app/page.tsx`: 공유 패키지 import 검증 화면

## 작업 1: 공식 스타터 기준 확보와 루트 구성

**파일:**

- 생성: `package.json`
- 생성: `pnpm-workspace.yaml`
- 생성: `turbo.json`
- 생성: `.gitignore`

- [ ] **1단계: 현재 루트 보존 상태를 검증한다**

실행:

```bash
test -f docs/superpowers/specs/2026-06-11-catch-us-monorepo-design.md
test ! -d catch-us
git status --short
```

예상 결과: 설계 문서 검사는 성공하고 중첩 `catch-us` 검사는 성공한다.
`git status`에는 기존 미추적 `.agents/`, `skills-lock.json`만 표시될 수 있다.

- [ ] **2단계: 공식 create-turbo 기준본을 임시 경로에 생성한다**

실행:

```bash
test ! -e /tmp/catch-us-create-turbo-reference
pnpm dlx create-turbo@latest /tmp/catch-us-create-turbo-reference --package-manager pnpm --skip-install
```

예상 결과: `/tmp/catch-us-create-turbo-reference`에 `apps`, `packages`,
`package.json`, `pnpm-workspace.yaml`, `turbo.json`이 생성된다. 이 디렉터리는
현재 저장소에 복사하거나 중첩 프로젝트로 유지하지 않고, 생성된 의존성
버전과 공식 설정을 확인하는 기준본으로만 사용한다.

- [ ] **3단계: 루트 워크스페이스 파일을 작성한다**

`package.json`:

```json
{
  "name": "catch-us",
  "version": "0.0.0",
  "private": true,
  "packageManager": "pnpm@10.12.1",
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "check-types": "turbo run check-types"
  },
  "devDependencies": {
    "turbo": "latest"
  },
  "engines": {
    "node": ">=20"
  }
}
```

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "transit": {
      "dependsOn": ["^transit"]
    },
    "lint": {
      "dependsOn": ["transit"]
    },
    "check-types": {
      "dependsOn": ["transit"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

`.gitignore`:

```gitignore
node_modules
.next
.turbo
dist
coverage
*.tsbuildinfo
.env
.env.*
!.env.example
.DS_Store
```

구현 시 `packageManager`, `turbo`, Next.js, React와 lint 관련 버전은 2단계에서
생성된 공식 기준본의 실제 값을 사용한다. 위 구조와 스크립트 이름은
변경하지 않는다.

- [ ] **4단계: 워크스페이스 선언을 정적 검증한다**

실행:

```bash
node -e "const p=require('./package.json'); if(!p.private||p.scripts.build!=='turbo run build'||p.scripts.dev!=='turbo run dev') process.exit(1)"
rg -n 'apps/\\*|packages/\\*' pnpm-workspace.yaml
```

예상 결과: Node 검증이 종료 코드 0으로 끝나고 두 workspace glob이 출력된다.

- [ ] **5단계: 루트 구성을 커밋한다**

```bash
git add package.json pnpm-workspace.yaml turbo.json .gitignore
git commit -m "build: initialize pnpm turborepo workspace"
```

## 작업 2: TypeScript와 ESLint 공유 설정

**파일:**

- 생성: `packages/typescript-config/package.json`
- 생성: `packages/typescript-config/base.json`
- 생성: `packages/typescript-config/nextjs.json`
- 생성: `packages/typescript-config/react-library.json`
- 생성: `packages/eslint-config/package.json`
- 생성: `packages/eslint-config/base.js`
- 생성: `packages/eslint-config/next.js`
- 생성: `packages/eslint-config/react-internal.js`

- [ ] **1단계: 설정 패키지가 아직 없음을 확인한다**

실행:

```bash
test ! -e packages/typescript-config/package.json
test ! -e packages/eslint-config/package.json
```

예상 결과: 두 검사가 모두 성공한다.

- [ ] **2단계: TypeScript 설정 패키지를 작성한다**

`packages/typescript-config/package.json`:

```json
{
  "name": "@repo/typescript-config",
  "version": "0.0.0",
  "private": true,
  "files": ["*.json"],
  "exports": {
    "./base.json": "./base.json",
    "./nextjs.json": "./nextjs.json",
    "./react-library.json": "./react-library.json"
  }
}
```

`packages/typescript-config/base.json`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "allowJs": false,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": false,
    "isolatedModules": true,
    "module": "ESNext",
    "moduleDetection": "force",
    "moduleResolution": "Bundler",
    "noEmit": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2022"
  }
}
```

`packages/typescript-config/nextjs.json`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "allowJs": true,
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "plugins": [{ "name": "next" }]
  }
}
```

`packages/typescript-config/react-library.json`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["dom", "dom.iterable", "ES2022"]
  }
}
```

- [ ] **3단계: ESLint 설정 패키지를 작성한다**

```json
{
  "name": "@repo/eslint-config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./base": "./base.js",
    "./next": "./next.js",
    "./react-internal": "./react-internal.js"
  },
  "devDependencies": {
    "@eslint/js": "latest",
    "@next/eslint-plugin-next": "latest",
    "eslint": "latest",
    "eslint-plugin-react-hooks": "latest",
    "eslint-plugin-turbo": "latest",
    "typescript": "latest",
    "typescript-eslint": "latest"
  }
}
```

`latest` 표기는 create-turbo 기준본의 ESLint, TypeScript ESLint, Next.js,
React Hooks 관련 실제 버전으로 고정한다.

`packages/eslint-config/base.js`:

```js
import eslint from "@eslint/js";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";

export const baseConfig = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { turbo: turboPlugin },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    ignores: ["dist/**", ".next/**", "node_modules/**"],
  },
];
```

`packages/eslint-config/next.js`:

```js
import nextPlugin from "@next/eslint-plugin-next";
import { baseConfig } from "./base.js";

export const nextJsConfig = [
  ...baseConfig,
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
];
```

`packages/eslint-config/react-internal.js`:

```js
import reactHooks from "eslint-plugin-react-hooks";
import { baseConfig } from "./base.js";

export const reactInternalConfig = [
  ...baseConfig,
  {
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
];
```

- [ ] **4단계: JSON과 ESM export를 검증한다**

실행:

```bash
node -e "JSON.parse(require('fs').readFileSync('packages/typescript-config/base.json','utf8'))"
node --input-type=module -e "import('./packages/eslint-config/base.js').then(m=>{if(!Array.isArray(m.baseConfig))process.exit(1)})"
```

예상 결과: 두 명령 모두 종료 코드 0으로 끝난다. 의존성 설치 전 두 번째
명령이 모듈 미설치로 실패하면 작업 6의 `pnpm install` 직후 다시 실행한다.

- [ ] **5단계: 공유 설정을 커밋한다**

```bash
git add packages/typescript-config packages/eslint-config
git commit -m "build: add shared TypeScript and ESLint configs"
```

## 작업 3: auth, core, db 경계 패키지

**파일:**

- 생성: `packages/auth/package.json`
- 생성: `packages/auth/tsconfig.json`
- 생성: `packages/auth/eslint.config.js`
- 생성: `packages/auth/src/index.ts`
- 생성: `packages/core/package.json`
- 생성: `packages/core/tsconfig.json`
- 생성: `packages/core/eslint.config.js`
- 생성: `packages/core/src/index.ts`
- 생성: `packages/db/package.json`
- 생성: `packages/db/tsconfig.json`
- 생성: `packages/db/eslint.config.js`
- 생성: `packages/db/src/index.ts`

- [ ] **1단계: 경계 패키지 구조 검사가 실패하는지 확인한다**

실행:

```bash
node -e "for(const n of ['auth','core','db']) require('./packages/'+n+'/package.json')"
```

예상 결과: `MODULE_NOT_FOUND`로 실패한다.

- [ ] **2단계: 세 패키지의 공통 설정을 작성한다**

`packages/auth/package.json`:

```json
{
  "name": "@repo/auth",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "eslint": "latest",
    "typescript": "latest"
  }
}
```

`packages/core/package.json`:

```json
{
  "name": "@repo/core",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "eslint": "latest",
    "typescript": "latest"
  }
}
```

`packages/db/package.json`:

```json
{
  "name": "@repo/db",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "eslint": "latest",
    "typescript": "latest"
  }
}
```

`packages/auth/tsconfig.json`, `packages/core/tsconfig.json`,
`packages/db/tsconfig.json`:

```json
{
  "extends": "@repo/typescript-config/base.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`packages/auth/eslint.config.js`, `packages/core/eslint.config.js`,
`packages/db/eslint.config.js`:

```js
import { baseConfig } from "@repo/eslint-config/base";

export default baseConfig;
```

구현 시 `eslint`, `typescript` 버전은 create-turbo 기준본과 일치시킨다.

- [ ] **3단계: 부작용 없는 공개 API를 작성한다**

`packages/auth/src/index.ts`:

```ts
export const AUTH_PACKAGE = "@repo/auth" as const;

export type AuthPackageName = typeof AUTH_PACKAGE;
```

`packages/core/src/index.ts`:

```ts
export const CORE_PACKAGE = "@repo/core" as const;

export type CorePackageName = typeof CORE_PACKAGE;
```

`packages/db/src/index.ts`:

```ts
export const DB_PACKAGE = "@repo/db" as const;

export type DbPackageName = typeof DB_PACKAGE;
```

- [ ] **4단계: 공개 export를 정적 검증한다**

실행:

```bash
rg -n '"\\."\\s*:\\s*"./src/index.ts"' packages/{auth,core,db}/package.json
rg -n 'PACKAGE = "@repo/' packages/{auth,core,db}/src/index.ts
```

예상 결과: 첫 명령은 package.json 3개, 두 번째 명령은 index.ts 3개를
출력한다.

- [ ] **5단계: 경계 패키지를 커밋한다**

```bash
git add packages/auth packages/core packages/db
git commit -m "feat: add shared domain boundary packages"
```

## 작업 4: 공유 shadcn/ui JIT 패키지

**파일:**

- 생성: `packages/ui/package.json`
- 생성: `packages/ui/tsconfig.json`
- 생성: `packages/ui/eslint.config.js`
- 생성: `packages/ui/components.json`
- 생성: `packages/ui/src/components/button.tsx`
- 생성: `packages/ui/src/lib/utils.ts`
- 생성: `packages/ui/src/styles/globals.css`

- [ ] **1단계: UI 공개 경로 검사가 실패하는지 확인한다**

실행:

```bash
node -e "const p=require('./packages/ui/package.json'); if(!p.exports['./components/*']) process.exit(1)"
```

예상 결과: `MODULE_NOT_FOUND`로 실패한다.

- [ ] **2단계: UI 패키지 메타데이터와 설정을 작성한다**

`packages/ui/package.json`:

```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./components/*": "./src/components/*.tsx",
    "./lib/*": "./src/lib/*.ts",
    "./styles/globals.css": "./src/styles/globals.css"
  },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@radix-ui/react-slot": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "lucide-react": "latest",
    "tailwind-merge": "latest",
    "tw-animate-css": "latest"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "eslint": "latest",
    "react": "latest",
    "react-dom": "latest",
    "typescript": "latest"
  },
  "peerDependencies": {
    "react": "latest",
    "react-dom": "latest"
  }
}
```

구현 시 모든 `latest` 표기는 create-turbo 기준본과 shadcn CLI가 생성한 실제
버전 범위로 고정한다.

`packages/ui/tsconfig.json`:

```json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@repo/ui/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

`packages/ui/eslint.config.js`:

```js
import { reactInternalConfig } from "@repo/eslint-config/react-internal";

export default reactInternalConfig;
```

- [ ] **3단계: shadcn 모노레포 설정을 작성한다**

`packages/ui/components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@repo/ui/components",
    "utils": "@repo/ui/lib/utils",
    "ui": "@repo/ui/components",
    "lib": "@repo/ui/lib",
    "hooks": "@repo/ui/hooks"
  }
}
```

`packages/ui/src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

`packages/ui/src/styles/globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";

@source "../../../../apps/**/*.{ts,tsx}";
@source "../**/*.{ts,tsx}";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }
}
```

Button은 전체 workspace 의존성을 설치한 뒤 작업 6에서 shadcn CLI로
생성한다.

- [ ] **4단계: UI 공개 경로와 설정을 검증한다**

실행:

```bash
node -e "const p=require('./packages/ui/package.json'); for(const k of ['./components/*','./lib/*','./styles/globals.css']) if(!p.exports[k]) process.exit(1)"
node -e "const c=require('./packages/ui/components.json'); if(c.style!=='new-york'||c.iconLibrary!=='lucide'||c.aliases.ui!=='@repo/ui/components') process.exit(1)"
test -f packages/ui/src/lib/utils.ts
test -f packages/ui/src/styles/globals.css
```

예상 결과: 두 Node 검증과 두 파일 검사가 모두 성공한다.

- [ ] **5단계: UI 패키지를 커밋한다**

```bash
git add packages/ui
git commit -m "feat: add shared shadcn ui package"
```

## 작업 5: web과 admin Next.js 애플리케이션

**파일:**

- 생성: `apps/web/package.json`
- 생성: `apps/web/next.config.ts`
- 생성: `apps/web/tsconfig.json`
- 생성: `apps/web/eslint.config.js`
- 생성: `apps/web/components.json`
- 생성: `apps/web/postcss.config.mjs`
- 생성: `apps/web/app/layout.tsx`
- 생성: `apps/web/app/page.tsx`
- 생성: `apps/admin/package.json`
- 생성: `apps/admin/next.config.ts`
- 생성: `apps/admin/tsconfig.json`
- 생성: `apps/admin/eslint.config.js`
- 생성: `apps/admin/components.json`
- 생성: `apps/admin/postcss.config.mjs`
- 생성: `apps/admin/app/layout.tsx`
- 생성: `apps/admin/app/page.tsx`

- [ ] **1단계: 애플리케이션 구조 검사가 실패하는지 확인한다**

실행:

```bash
node -e "for(const n of ['web','admin']) require('./apps/'+n+'/package.json')"
```

예상 결과: `MODULE_NOT_FOUND`로 실패한다.

- [ ] **2단계: 두 앱의 package.json을 작성한다**

`apps/web/package.json`:

```json
{
  "name": "@repo/web",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/auth": "workspace:*",
    "@repo/core": "workspace:*",
    "@repo/db": "workspace:*",
    "@repo/ui": "workspace:*",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@tailwindcss/postcss": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "eslint": "latest",
    "tailwindcss": "latest",
    "typescript": "latest"
  }
}
```

`apps/admin/package.json`:

```json
{
  "name": "@repo/admin",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/auth": "workspace:*",
    "@repo/core": "workspace:*",
    "@repo/db": "workspace:*",
    "@repo/ui": "workspace:*",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "@tailwindcss/postcss": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "eslint": "latest",
    "tailwindcss": "latest",
    "typescript": "latest"
  }
}
```

두 파일의 `latest` 표기는 create-turbo 기준본의 실제 버전으로 고정한다.

- [ ] **3단계: Next.js, TypeScript, ESLint, PostCSS 설정을 작성한다**

각 앱의 `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/auth", "@repo/core", "@repo/db"],
};

export default nextConfig;
```

각 앱의 `tsconfig.json`:

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

각 앱의 `eslint.config.js`:

```js
import { nextJsConfig } from "@repo/eslint-config/next";

export default nextJsConfig;
```

각 앱의 `postcss.config.mjs`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **4단계: 두 앱의 shadcn 설정을 작성한다**

각 앱의 `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../../packages/ui/src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@repo/ui/lib/utils",
    "ui": "@repo/ui/components",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

- [ ] **5단계: 앱 레이아웃과 검증 화면을 작성한다**

`apps/web/app/layout.tsx`:

```tsx
import "@repo/ui/styles/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Catch Us",
  description: "Catch Us photo service",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

`apps/admin/app/layout.tsx`:

```tsx
import "@repo/ui/styles/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Catch Us Admin",
  description: "Catch Us administration",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

`apps/web/app/page.tsx`:

```tsx
import { AUTH_PACKAGE } from "@repo/auth";
import { CORE_PACKAGE } from "@repo/core";
import { DB_PACKAGE } from "@repo/db";
import { Button } from "@repo/ui/components/button";

export default function Home() {
  const packages = [AUTH_PACKAGE, CORE_PACKAGE, DB_PACKAGE];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <p className="text-muted-foreground text-sm">{packages.join(" · ")}</p>
      <h1 className="text-4xl font-semibold tracking-tight">Catch Us</h1>
      <Button>사진 서비스 준비 완료</Button>
    </main>
  );
}
```

`apps/admin/app/page.tsx`:

```tsx
import { AUTH_PACKAGE } from "@repo/auth";
import { CORE_PACKAGE } from "@repo/core";
import { DB_PACKAGE } from "@repo/db";
import { Button } from "@repo/ui/components/button";

export default function Home() {
  const packages = [AUTH_PACKAGE, CORE_PACKAGE, DB_PACKAGE];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <p className="text-muted-foreground text-sm">{packages.join(" · ")}</p>
      <h1 className="text-4xl font-semibold tracking-tight">Catch Us Admin</h1>
      <Button>관리자 대시보드 준비 완료</Button>
    </main>
  );
}
```

- [ ] **6단계: 앱 경계와 포트 구성을 정적 검증한다**

실행:

```bash
rg -n '"dev": "next dev --port 300[01]"' apps/{web,admin}/package.json
rg -n '@repo/(auth|core|db|ui)' apps/{web,admin}/app/page.tsx
rg -n 'transpilePackages' apps/{web,admin}/next.config.ts
```

예상 결과: 각 앱의 고유 포트, 네 공유 패키지 import, transpile 설정이
출력된다.

- [ ] **7단계: 두 애플리케이션을 커밋한다**

```bash
git add apps/web apps/admin
git commit -m "feat: add web and admin Next.js apps"
```

## 작업 6: 의존성 설치와 전체 빌드 검증

**파일:**

- 생성: `pnpm-lock.yaml`
- 수정 가능: shadcn CLI가 정규화한 `packages/ui/*`
- 수정 가능: Next.js가 생성한 `apps/web/next-env.d.ts`
- 수정 가능: Next.js가 생성한 `apps/admin/next-env.d.ts`

- [ ] **1단계: 의존성을 설치한다**

실행:

```bash
pnpm install
```

예상 결과: 모든 workspace가 인식되고 `pnpm-lock.yaml`이 생성되며 종료 코드
0으로 끝난다.

- [ ] **2단계: shadcn Button과 지원 파일을 생성한다**

실행:

```bash
pnpm dlx shadcn@latest add button --cwd apps/web --yes
```

예상 결과: `packages/ui/src/components/button.tsx`,
`packages/ui/src/lib/utils.ts`, `packages/ui/src/styles/globals.css`가 생성되거나
갱신된다. `apps/web/components.json`의 `ui` alias를 따라 Button이 앱 내부가
아닌 공유 패키지에 생성되어야 한다. Button은 `@repo/ui/lib/utils`를
import하고 스타일 파일은 Tailwind CSS v4 문법을 사용한다.

검증:

```bash
rg -n '@repo/ui/lib/utils|function Button|const buttonVariants' packages/ui/src/components/button.tsx
test -f packages/ui/src/lib/utils.ts
test -f packages/ui/src/styles/globals.css
```

예상 결과: Button 구현의 핵심 행이 출력되고 두 파일 검사가 성공한다.

- [ ] **3단계: Turbo task graph를 확인한다**

실행:

```bash
pnpm turbo run build --dry=json
```

예상 결과: JSON 출력에 `@repo/web#build`, `@repo/admin#build`가 포함되고,
두 앱의 build task가 인식된다.

workspace 의존성 검증:

```bash
pnpm --filter @repo/web list --depth 0
pnpm --filter @repo/admin list --depth 0
```

예상 결과: 두 출력에 `@repo/auth`, `@repo/core`, `@repo/db`, `@repo/ui`가
workspace link로 나타난다.

- [ ] **4단계: lint를 실행한다**

실행:

```bash
pnpm lint
```

예상 결과: 모든 lint task가 성공하고 경고가 0개다.

- [ ] **5단계: 타입 검사를 실행한다**

실행:

```bash
pnpm check-types
```

예상 결과: 두 앱과 `auth`, `core`, `db`, `ui`의 TypeScript 검사가 모두
성공한다.

- [ ] **6단계: 프로덕션 빌드를 실행한다**

실행:

```bash
pnpm build
```

예상 결과: `@repo/web`과 `@repo/admin`의 Next.js 프로덕션 빌드가 모두
성공하고 `.next` 산출물이 생성된다.

- [ ] **7단계: 빌드 캐시 복원을 검증한다**

실행:

```bash
pnpm build
```

예상 결과: 직전 빌드와 동일한 task가 Turborepo cache hit로 처리된다.

- [ ] **8단계: 설치 및 검증 결과를 커밋한다**

```bash
git add pnpm-lock.yaml apps packages package.json pnpm-workspace.yaml turbo.json
git commit -m "build: install and verify monorepo dependencies"
```

## 작업 7: 실행 확인과 README

**파일:**

- 생성: `README.md`

- [ ] **1단계: README가 없음을 확인한다**

실행:

```bash
test ! -e README.md
```

예상 결과: 검사가 성공한다.

- [ ] **2단계: 저장소 사용 문서를 작성한다**

`README.md`:

````md
# Catch Us

사진 서비스와 관리자 대시보드를 위한 pnpm Turborepo입니다.

## 구조

- `apps/web`: 사용자용 Next.js 앱 (`http://localhost:3000`)
- `apps/admin`: 관리자용 Next.js 앱 (`http://localhost:3001`)
- `packages/ui`: 공유 shadcn/ui 컴포넌트와 전역 스타일
- `packages/auth`: 인증 및 권한 경계
- `packages/core`: 공유 도메인 경계
- `packages/db`: 데이터 접근 경계
- `packages/eslint-config`: 공유 ESLint 설정
- `packages/typescript-config`: 공유 TypeScript 설정

## 명령어

```bash
pnpm install
pnpm dev
pnpm lint
pnpm check-types
pnpm build
```
````

개별 앱만 실행하려면 Turbo filter를 사용합니다.

```bash
pnpm turbo run dev --filter=@repo/web
pnpm turbo run dev --filter=@repo/admin
```

## 현재 범위

현재 저장소는 애플리케이션과 공유 패키지의 기본 구조만 제공합니다.
Supabase, 지도, 이미지 분석, 임베딩, 검색 기능은 후속 단계에서 설계하고
구현합니다.

````

- [ ] **3단계: 개발 서버를 실행한다**

실행:

```bash
pnpm dev
````

예상 결과: `web`은 `http://localhost:3000`, `admin`은
`http://localhost:3001`에서 실행된다. 검증이 끝나면 개발 서버를 정상
종료한다.

- [ ] **4단계: 브라우저에서 두 앱을 확인한다**

Browser 플러그인으로 다음 주소를 각각 연다.

```text
http://localhost:3000
http://localhost:3001
```

예상 결과:

- web 화면에 `Catch Us`와 `사진 서비스 준비 완료` Button이 보인다.
- admin 화면에 `Catch Us Admin`과 `관리자 대시보드 준비 완료` Button이
  보인다.
- 두 화면에서 전역 Tailwind 스타일과 shadcn Button 스타일이 적용된다.
- 브라우저 콘솔에 hydration 또는 runtime 오류가 없다.

- [ ] **5단계: 저장소 구조와 중첩 디렉터리 부재를 검증한다**

실행:

```bash
test "$PWD" = "/Users/minwoo/workspaces/catch-us"
test ! -d catch-us
find apps packages -maxdepth 2 -type d | sort
git status --short
```

예상 결과: 현재 경로와 중첩 디렉터리 검사가 성공한다. `apps/web`,
`apps/admin` 및 승인된 여섯 개 패키지가 출력된다. 기존 미추적 `.agents/`,
`skills-lock.json` 외에 의도하지 않은 파일이 없어야 한다.

- [ ] **6단계: README와 최종 상태를 커밋한다**

```bash
git add README.md
git commit -m "docs: document monorepo structure and commands"
```

- [ ] **7단계: 최종 검증을 한 번 더 실행한다**

실행:

```bash
pnpm lint
pnpm check-types
pnpm build
git log --oneline -8
```

예상 결과: 세 검증 명령이 모두 성공하며, 로그에 루트 구성, 공유 설정,
경계 패키지, UI, 앱, 설치 검증, README 커밋이 순서대로 나타난다.
