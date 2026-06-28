# 전주 여행 인트로와 일정 탐색 페이지 설계

## 배경

`apps/web`에 전주 여행 일정 인트로 페이지를 만든다. 목적지는 전주이며, 일정은
2026년 7월 10일부터 2026년 7월 12일까지다. 사용자는 서울에서 KTX로 전주를
오가고, 숙소는 전주관광호텔호텔이다.

이번 페이지는 일반 정보 페이지가 아니라 모바일 앱 같은 여행 인트로와 일정
탐색 경험을 목표로 한다. Magic UI와 ReactBits 컴포넌트를 적극적으로 활용해
인터랙션, 패럴랙스, 애플 제품 소개 페이지 같은 시각 흐름을 만든다. 단, 현재
브레인스토밍 중 만든 목업은 최종 디자인이 아니라 구조 검증용이다. 구현 단계는
아래 구조를 기준으로 하되, 시각 완성도는 브라우저 검수와 반복 수정으로 끌어올린다.

## 목표

1. `/trip/[slug]`에 전주 여행 1뎁스 인트로 페이지를 만든다.
2. `/trip/[slug]/schedule`에 2뎁스 일정 탐색 페이지를 만든다.
3. 모바일을 1차 기준으로 설계하고, 데스크톱은 모바일 구조를 넓게 펼치는 방식으로
   대응한다.
4. 1뎁스는 Magic UI Bento Grid, ReactBits PillNav, 텍스트/배경/이미지 효과를
   활용한 제품 소개형 화면으로 만든다.
5. 2뎁스는 배달의민족, 쿠팡이츠 같은 탐색 화면처럼 상단 지도와 필터를 고정하고,
   아래 타임라인만 스크롤한다.
6. Kakao Maps JavaScript SDK 구조를 잡고, 키가 없을 때는 fallback 지도 카드를
   보여준다.
7. 일정은 사용자가 앱에서 추가하는 UI가 아니라, 사용자가 말해주는 정보를 정적
   itinerary data로 반영하는 구조를 사용한다.

## 이번 범위

### 포함

- `apps/web`의 전주 여행 route와 정적 데이터 구조
- 1뎁스 모바일 인트로 페이지
- 2뎁스 모바일 일정 탐색 페이지
- KTX 왕복 정보 카드
- 숙소 정보 카드
- Magic UI, ReactBits 기반 시각 효과 후보 설치 및 적용
- Kakao Maps SDK loader와 fallback UI
- 날짜별 필터: 전체, 2026-07-10, 2026-07-11, 2026-07-12
- 빠른 이동 rail: KTX, 전주역, 숙소, 체크아웃, 귀가 등
- active itinerary item과 지도 marker 동기화 구조

### 제외

- 사용자 입력으로 일정을 추가하는 UI
- Supabase 저장
- 사진 업로드
- 여행 사진 실제 데이터
- Kakao Place API 서버 호출
- 실시간 길찾기, 교통 경로 계산
- 결제, 예약, 공유 기능
- 완성된 디자인 시스템 정립

## 확정 데이터

첫 번째 slug는 `jeonju-2026`이다.

### 왕복 KTX

| 방향      | 날짜       | 출발       | 도착       | 열차    | 좌석          | Kakao Place                           |
| --------- | ---------- | ---------- | ---------- | ------- | ------------- | ------------------------------------- |
| 용산→전주 | 2026-07-10 | 용산 20:09 | 전주 21:47 | KTX 521 | 14호차 1A, 1B | <https://place.map.kakao.com/8014275> |
| 전주→용산 | 2026-07-12 | 전주 13:18 | 용산 15:03 | KTX 510 | 15호차 1A, 1B | <https://place.map.kakao.com/8508642> |

### 숙소

| 이름             | 체크인           | 체크아웃         | Kakao Place                              |
| ---------------- | ---------------- | ---------------- | ---------------------------------------- |
| 전주관광호텔호텔 | 2026-07-10 15:00 | 2026-07-12 11:00 | <https://place.map.kakao.com/2126483278> |

## route 구조

```text
apps/web/app/trip/
├── [slug]/
│   ├── page.tsx
│   └── schedule/
│       └── page.tsx
├── _components/
│   ├── trip-intro-page.tsx
│   ├── trip-schedule-page.tsx
│   ├── trip-bento-grid.tsx
│   ├── trip-hero.tsx
│   ├── trip-pill-nav.tsx
│   ├── trip-ticket-card.tsx
│   ├── trip-timeline.tsx
│   ├── trip-map-panel.tsx
│   └── trip-gallery-preview.tsx
├── _data/
│   └── trips.ts
└── _lib/
    ├── kakao-map-loader.ts
    └── itinerary.ts
```

`apps/web`에는 아직 FSD 구조를 강하게 도입하지 않는다. Next.js route와 가까운
정적 여행 페이지이므로 `app/trip/_components`, `_data`, `_lib`를 사용해 route
local feature로 묶는다. 나중에 여행 페이지가 서비스 핵심 기능으로 커지면
별도 feature boundary로 승격한다.

## 데이터 모델

정적 데이터는 UI 내부에 흩뿌리지 않고 `app/trip/_data/trips.ts`에서 관리한다.

```ts
type TripSlug = "jeonju-2026";

type TripDayId = "all" | "2026-07-10" | "2026-07-11" | "2026-07-12";

type ItineraryKind =
  | "train"
  | "station"
  | "hotel"
  | "meal"
  | "cafe"
  | "walk"
  | "transport"
  | "place";

interface TripPlace {
  id: string;
  name: string;
  kakaoPlaceUrl?: string;
  lat?: number;
  lng?: number;
  address?: string;
}

interface ItineraryItem {
  id: string;
  day: Exclude<TripDayId, "all">;
  kind: ItineraryKind;
  title: string;
  startsAt?: string;
  endsAt?: string;
  description?: string;
  tags: string[];
  placeId?: string;
  train?: {
    number: string;
    from: string;
    to: string;
    car: string;
    seats: string[];
  };
}

interface Trip {
  slug: TripSlug;
  title: string;
  subtitle: string;
  startsOn: string;
  endsOn: string;
  places: TripPlace[];
  itinerary: ItineraryItem[];
}
```

사용자가 나중에 "7월 11일 오전 경기전, 점심 베테랑 칼국수"처럼 말하면 앱에서
추가하는 UI를 만드는 것이 아니라, 이 정적 데이터에 항목을 추가한다. UI는 데이터
개수 증가를 전제로 설계한다.

## 1뎁스: 여행 인트로 페이지

### 목적

1뎁스는 정보 탐색 화면이 아니라 여행에 들어가는 입구다. 첫 화면은 모바일 앱
splash와 제품 랜딩의 중간 느낌으로 간다. 사용자가 `일정 탐색 열기`를 누르면
2뎁스 일정 화면으로 이동한다.

### 화면 구성

- 상단 status 영역
- ReactBits `PillNav` 기반 섹션 네비게이션
- 큰 히어로 카피: "전주로 넘어가는 밤"
- KTX 티켓이 iPhone mock 안에서 떠 있는 hero visual
- Magic UI `Marquee`로 KTX, 시간, 좌석, 숙소 정보 흐름 표시
- Magic UI `Bento Grid`로 route, KTX, 숙소, 사진 preview 카드 구성
- 하단 sticky CTA: `일정 탐색 열기`, `지도`

### 1뎁스 효과 매핑

| 영역        | 후보 컴포넌트/효과                                                            |
| ----------- | ----------------------------------------------------------------------------- |
| 상단 네비   | ReactBits `PillNav-TS-TW`                                                     |
| 히어로 문구 | ReactBits `SplitText-TS-TW`, Magic UI `animated-gradient-text`, `aurora-text` |
| 배경        | ReactBits `Silk-TS-TW`, `Noise-TS-TW`, Magic UI `animated-grid-pattern`       |
| 기기 mock   | Magic UI `iphone`, `backlight`                                                |
| KTX 정보띠  | Magic UI `marquee`                                                            |
| 정보 카드   | Magic UI `bento-grid`, `border-beam`                                          |
| 이동 표현   | Magic UI `animated-beam`                                                      |
| 이미지      | ReactBits `CircularGallery-TS-TW` 또는 추상 gradient preview                  |

## 2뎁스: 일정 탐색 페이지

### 목적

2뎁스는 사용자가 실제 일정을 탐색하는 화면이다. 배달의민족, 쿠팡이츠처럼 상단에
현재 컨텍스트를 고정하고, 아래 컨텐츠 리스트를 스크롤한다. 사용자는 특정 날짜나
일정 anchor로 유연하게 이동할 수 있어야 한다.

### 화면 구성

- sticky header
  - back button
  - 여행 제목
  - 현재 필터/anchor 요약
- sticky Kakao map panel
  - 현재 필터의 marker 표시
  - active itinerary marker 강조
  - SDK 키가 없을 때 fallback visual map
- sticky ReactBits `PillNav`
  - 전체
  - 07.10
  - 07.11
  - 07.12
- sticky quick rail
  - KTX 521
  - 전주역
  - 숙소
  - 체크아웃
  - KTX 510
  - 이후 추가되는 주요 장소
- scrollable timeline
  - 시간순 카드
  - 카드를 지나가거나 누르면 active item 변경
  - active item과 지도 marker, active place card 동기화
- floating actions
  - 현재 위치 카드 보기
  - 지도 보기

### 2뎁스 동작

1. 날짜 탭을 누르면 해당 날짜의 itinerary만 보인다.
2. `전체` 탭에서는 모든 itinerary를 날짜순으로 보여준다.
3. quick rail 항목을 누르면 해당 itinerary 카드로 스크롤한다.
4. timeline 카드가 active가 되면 지도 중심과 marker 강조 상태가 바뀐다.
5. Kakao SDK 로드 전이나 키 누락 시 fallback map card를 유지한다.
6. 2뎁스 안에서 사용자가 앱 데이터를 생성하거나 수정하지 않는다.

## Kakao Maps 연동

공식 Kakao Maps JavaScript SDK를 client component에서 로드한다.

- 환경 변수: `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`
- 스크립트 URL: `//dapi.kakao.com/v2/maps/sdk.js?appkey=...&autoload=false&libraries=services`
- 키가 없으면 fallback UI 표시
- SDK 로드 실패 시 fallback UI와 에러 안내 표시
- 좌표가 없는 장소는 지도 marker 대신 place card와 Kakao Place 링크만 표시

주소/좌표는 이번 범위에서 자동 조회하지 않는다. 장소 데이터에 좌표가 추가되면
지도 marker로 표시한다. Kakao Place URL은 외부 링크로 연결한다.

## 컴포넌트 설치 후보

구현 단계에서 MCP와 공식 문서를 다시 확인한 뒤 설치한다. 현재 확인한 ReactBits
후보 add command는 다음과 같다.

```bash
pnpm dlx shadcn@latest add @react-bits/PillNav-TS-TW @react-bits/SplitText-TS-TW @react-bits/ScrollStack-TS-TW @react-bits/ScrollFloat-TS-TW @react-bits/CircularGallery-TS-TW @react-bits/Silk-TS-TW @react-bits/Noise-TS-TW
```

Magic UI 후보는 `@magicui` registry에서 설치한다.

- `bento-grid`
- `iphone`
- `backlight`
- `marquee`
- `animated-beam`
- `animated-grid-pattern`
- `animated-gradient-text`
- `aurora-text`
- `border-beam`

실제 설치 항목은 구현 계획 단계에서 페이지 구성과 bundle 부담을 보고 줄일 수
있다. 그러나 1차 구현 목표는 "적게 쓰기"가 아니라 Magic UI와 ReactBits 효과를
적극적으로 써서 감성적인 여행 인트로를 만드는 것이다.

## 접근성과 모션

- 모든 continuous animation은 `prefers-reduced-motion`을 존중한다.
- reduced motion에서는 splash, parallax, floating 효과를 fade/slide 수준으로
  축소한다.
- 지도는 시각 장식만으로 정보를 전달하지 않고, 타임라인과 place card에 동일
  정보를 텍스트로 제공한다.
- PillNav는 키보드로 이동 가능해야 하며 현재 탭은 접근 가능한 상태로 노출한다.
- CTA와 quick rail은 충분한 hit area를 유지한다.
- 외부 Kakao Place 링크는 새 창 열림 여부와 접근 가능한 이름을 제공한다.

## 반응형 기준

모바일을 1차 기준으로 한다.

- 기준 폭: 390px-430px
- 1뎁스는 모바일 앱 splash와 bento story 구조
- 2뎁스는 sticky map/filter와 scroll timeline 구조
- 데스크톱에서는 모바일 카드 폭을 그대로 중앙에 두거나, 1뎁스 bento를 더 넓게
  펼친다.
- 데스크톱 최적화는 1차 구현 이후 시각 검수로 확장한다.

## 검증 계획

구현 후 최소 확인 항목:

- `/trip/jeonju-2026` 로드
- `/trip/jeonju-2026/schedule` 로드
- 모바일 폭에서 horizontal overflow 없음
- 1뎁스 CTA가 2뎁스로 이동
- 날짜 PillNav가 전체/날짜별 필터를 전환
- quick rail이 지정 카드로 이동
- Kakao key가 없을 때 fallback UI 표시
- Kakao key가 있을 때 SDK 로드 실패 없이 지도 표시
- `prefers-reduced-motion`에서 주요 정보 접근 가능
- `pnpm format:check`
- `pnpm lint`
- `pnpm check-types`
- `pnpm build`
- `git diff --check`

## 후속 입력 방식

사용자가 추가 일정을 말하면 다음 정보로 정리해 정적 데이터에 추가한다.

- 날짜
- 시간 또는 시간대
- 제목
- 카테고리
- 설명
- Kakao Place URL
- 좌표 또는 주소
- 지도에 표시할지 여부
- quick rail에 노출할지 여부

예시:

```text
2026-07-11 오전, 경기전, 관광, Kakao Place URL, 지도 표시
2026-07-11 점심, 베테랑 칼국수, 식사, Kakao Place URL, quick rail 노출
```

## 구현 전 확인 사항

- 1뎁스 최종 비주얼은 현재 목업에 만족하지 않은 상태다. 구조만 채택하고,
  구현 단계에서 Magic UI Bento Grid와 ReactBits 효과를 실제 컴포넌트로 붙인 뒤
  브라우저 검수로 다시 다듬는다.
- 실제 Kakao 좌표는 사용자가 제공하거나 후속 작업에서 확인한다.
- 2026년 7월 11일 일정은 아직 비어 있으므로 비어 있는 날짜 안내 문구를 최소화하고,
  사용자가 주는 일정으로 대체할 수 있게 데이터 구조를 먼저 만든다.
