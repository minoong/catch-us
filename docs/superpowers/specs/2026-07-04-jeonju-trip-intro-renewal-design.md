# Jeonju Trip Intro Renewal Design

## Status

Approved for implementation planning.

## Goal

`/trip/jeonju-2026`를 모바일 전용 여행 초대장 페이지로 리뉴얼한다.
기존 첫 진입 인트로 플래시는 유지하고, `/trip/jeonju-2026/schedule`에
있는 일정 데이터와 sticky 축소 헤더 감각을 1뎁스 intro 페이지에 흡수한다.

핵심 톤은 데이트 초대장과 시네마틱 여행 히어로의 조합이다. 동시에
카운트다운, 다음 일정, 자동 Stepper를 보여 주어 일정 앱 대시보드의
기능감도 첫 화면 안에 남긴다.

## Scope

- 대상 route: `/trip/jeonju-2026`
- 기준 viewport: 모바일 `390px` 폭, 보조로 `360px` 폭까지 깨지지 않게 한다.
- 데스크톱 전용 레이아웃은 만들지 않는다. 넓은 화면에서는 모바일 폭을
  가운데 정렬하는 수준으로만 대응한다.
- `/trip/jeonju-2026/schedule` route 자체의 UX는 이번 리뉴얼 범위가 아니다.
- 기존 정적 trip data는 `apps/web/app/trip/_data/trips.ts`를 계속 사용한다.

## Existing Context

현재 intro page는 다음 구조다.

- `TripIntroPage`: `TripIntroTransition`, `TripIntroHeader`, `TripHero`,
  `TripBentoGrid`, `TripStoryStack`를 세로로 배치한다.
- `TripIntroTransition`: 첫 진입 photo flash 인트로를 담당한다.
- `TripIntroHeader`: sticky header이지만 scroll progress 기반 축소는 없다.
- `TripHero`: 큰 타이포, KTX route beam, iPhone ticket preview를 보여 준다.
- `TripBentoGrid`와 `TripStoryStack`: 일정/숙소/무드보드/스크롤 스토리를
  보조 섹션으로 제공한다.

현재 schedule page는 `TripSchedulePage` 안에서 scroll position을 CSS 변수로
변환해 sticky header, map, date tabs 높이와 radius를 점진적으로 줄인다. 이
패턴을 intro page header에도 적용한다.

## Design Direction

선택한 방향은 "데이트 초대장 + 시네마틱 히어로 + 컨트롤 레이어"다.

1. 첫 진입 인트로는 그대로 유지한다.
2. intro가 끝나면 초대장처럼 읽히는 모바일 hero가 열린다.
3. sticky header는 스크롤값에 따라 점점 작아지고, 일정/카운트다운 상태를
   작게 보존한다.
4. header 아래 control strip은 현재 시간 기준으로 "용산역 출발까지" 또는
   "여행 시작 후" 시간을 보여 준다.
5. hero 중간에는 Aceternity 3D Marquee를 사용해 trip 이미지를 시네마틱 photo
   field로 보여 준다.
6. 일정 요약은 ReactBits Stepper를 사용하되, 자동으로 다음 step으로 넘어가고
   하단 progress bar가 남은 시간을 시각화한다.

## Page Structure

`TripIntroPage`는 다음 순서로 재구성한다.

1. `TripIntroTransition`
2. `TripIntroStickyHeader`
3. `TripTimeControlStrip`
4. `TripInvitationHero`
5. `TripPhotoMarquee`
6. `TripAutoItineraryStepper`
7. `TripClosingCta`

기존 `TripBentoGrid`와 `TripStoryStack`은 새 히어로, photo marquee, stepper와
역할이 겹치므로 제거하거나 새 섹션 안으로 흡수한다. 중복된 "일정 보기" CTA를
여러 카드에 반복하지 않는다.

## Components

### TripIntroStickyHeader

`/schedule`의 sticky shrink 방식처럼 scroll progress를 계산해 CSS 변수를
업데이트한다.

- 초기 상태: 초대장 상단 chrome처럼 넉넉한 pill header
- 축소 상태: 작은 title, countdown 상태, 일정 CTA만 남기는 compact header
- `prefers-reduced-motion`일 때도 크기 변화는 즉시 값 변경으로 동작하고,
  장식성 transform animation은 줄인다.

### TripTimeControlStrip

현재 시각과 첫 일정의 출발 시간을 비교한다.

- 구현 명령: `pnpm dlx motion-primitives@latest add sliding-number`
- 첫 일정: `ktx-521-yongsan-to-jeonju`
- 출발 기준: `2026-07-10 20:09` in local browser time
- 현재 시각이 출발 전이면 label은 `용산역 출발까지`
- 현재 시각이 출발 이후면 label은 `여행 시작 후`
- `SlidingNumber`로 일, 시, 분, 초를 표시한다.
- 시간이 음수/양수로 바뀌는 순간 label과 계산 모드가 자연스럽게 전환된다.
- browser/client-only 계산이므로 hydration mismatch를 피하기 위해 mount 이후
  ticking UI를 보여 준다.

### TripInvitationHero

기존 `TripHero`의 정보 구조를 더 감정적인 초대장 형태로 바꾼다.

- H1: `전주로 넘어가는 밤`
- supporting copy: 2026년 7월 10일, 용산에서 전주로 내려가는 2박 3일 여행
- primary CTA: `일정 자세히 보기`
- secondary state: KTX 521, 14호차, 1A/1B
- visual tone: 따뜻한 초대장, ticket/pass, soft photo depth

### TripPhotoMarquee

Aceternity `3D Marquee`를 사용한다.

- 구현 명령: `pnpm dlx shadcn@latest add @aceternity/3d-marquee-demo`
- images는 기존 optimized public assets를 사용한다.
  - `apps/web/public/trips/jeonju-2026/intro/*`
  - `apps/web/public/trips/jeonju-2026/places/*`
- 모바일에서 marquee가 본문 텍스트를 가리지 않도록 section 단위 photo field로
  둔다.
- reduced motion에서는 움직임을 정지하거나 정적인 이미지 그리드로 degrade한다.

### TripAutoItineraryStepper

ReactBits `Stepper-TS-CSS`를 기반으로 일정 요약을 만든다.

- 구현 명령: `pnpm dlx shadcn@latest add @react-bits/Stepper-TS-CSS`
- 핵심 step은 5-7개만 사용한다.
  - 용산역 출발
  - 전주역 도착
  - 숙소 체크인
  - 한옥마을/전동성당/경기전 구간
  - 덕진공원
  - 진미집
  - 전주역 귀가
- step은 일정 시간마다 자동으로 다음으로 넘어간다.
- 하단 progress bar는 현재 step의 남은 전환 시간을 나타낸다.
- 사용자가 step을 누르면 해당 step으로 이동하고 progress timer를 재시작한다.
- 자동 전환은 reduced motion 환경에서도 과한 motion 없이 동작해야 하며, 필요한
  경우 전환 duration을 줄인다.

### TripClosingCta

페이지 끝에는 schedule route로 가는 명확한 CTA 하나만 둔다.

- href: `/trip/jeonju-2026/schedule`
- copy: `전체 일정 열기` 또는 `지도와 일정 자세히 보기`

## Data Flow

- `TripIntroPage`는 기존처럼 `trip: Trip`을 prop으로 받는다.
- countdown 기준은 `trip.itinerary`에서 `id === "ktx-521-yongsan-to-jeonju"`인
  item을 찾고, item day와 `startsAt`을 합쳐 Date로 변환한다.
- stepper item은 `trip.itinerary`와 `trip.places`를 조합해 만든다.
- UI 컴포넌트 내부에 일정 문자열을 흩뿌리지 않는다. 문구는 component-local
  presentation copy만 허용하고, 일정 시간/장소/열차 정보는 trip data를 따른다.

## Error And Fallback Handling

- 첫 일정이 없거나 `startsAt`이 없으면 countdown strip은 `여행 준비 중` 상태를
  보여 주고 숫자 ticker를 숨긴다.
- `SlidingNumber` component가 설치되어 있지 않은 implementation 단계에서는
  먼저 registry component를 추가하고 경로를 `apps/web` conventions에 맞춘다.
- 3D Marquee 이미지 배열이 비어 있으면 정적 fallback card를 보여 준다.
- 외부 registry component는 generated code 그대로 두지 않고 repo lint,
  accessibility, reduced-motion, package boundary 규칙에 맞게 조정한다.

## Verification

구현 후 다음을 확인한다.

- `pnpm format:check`
- `pnpm lint`
- `pnpm check-types`
- `pnpm build`
- `git diff --check`
- 브라우저 모바일 QA
  - `/trip/jeonju-2026` at `390x844`
  - `/trip/jeonju-2026` at `360x800`
  - 첫 진입 인트로가 유지되는지
  - sticky header가 스크롤에 따라 점진적으로 축소되는지
  - countdown이 `2026-07-10 20:09` 전후로 label을 바꾸는지
  - Stepper가 자동 진행되고 progress bar가 reset되는지
  - reduced motion에서 핵심 정보가 사라지지 않는지

## Out Of Scope

- `/trip/jeonju-2026/schedule`의 지도, 날짜 탭, timeline redesign
- 데스크톱 전용 hero layout
- 새로운 여행 데이터 모델링
- Kakao map behavior 변경
- 실제 초대 공유/로그인/예약 기능
