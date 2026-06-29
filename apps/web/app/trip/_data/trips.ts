export type TripSlug = "jeonju-2026";

export type TripDayId = "all" | "2026-07-10" | "2026-07-11" | "2026-07-12";

export type ItineraryKind =
  | "train"
  | "station"
  | "hotel"
  | "meal"
  | "cafe"
  | "walk"
  | "transport"
  | "place";

export interface TripPlace {
  id: string;
  name: string;
  kakaoPlaceUrl?: string;
  address?: string;
  lat?: number;
  lng?: number;
  visualPosition: {
    x: number;
    y: number;
  };
}

export interface ItineraryItem {
  id: string;
  day: Exclude<TripDayId, "all">;
  kind: ItineraryKind;
  title: string;
  startsAt?: string;
  endsAt?: string;
  description: string;
  tags: string[];
  placeId?: string;
  quickLink?: boolean;
  train?: {
    number: string;
    from: string;
    to: string;
    car: string;
    seats: string[];
  };
}

export interface Trip {
  slug: TripSlug;
  title: string;
  subtitle: string;
  startsOn: string;
  endsOn: string;
  places: TripPlace[];
  itinerary: ItineraryItem[];
}

export const trips = [
  {
    slug: "jeonju-2026",
    title: "전주로 넘어가는 밤",
    subtitle:
      "2026년 7월 10일, 용산에서 KTX를 타고 전주로 내려가는 2박 3일 여행.",
    startsOn: "2026-07-10",
    endsOn: "2026-07-12",
    places: [
      {
        id: "yongsan-station",
        name: "용산역",
        kakaoPlaceUrl: "https://place.map.kakao.com/8014275",
        lat: 37.5290767,
        lng: 126.9658972,
        visualPosition: { x: 18, y: 58 },
      },
      {
        id: "jeonju-station",
        name: "전주역",
        kakaoPlaceUrl: "https://place.map.kakao.com/8508642",
        lat: 35.8500537,
        lng: 127.1623649,
        visualPosition: { x: 78, y: 36 },
      },
      {
        id: "jeonju-tourist-hotel",
        name: "전주관광호텔호텔",
        kakaoPlaceUrl: "https://place.map.kakao.com/2126483278",
        lat: 35.817533,
        lng: 127.139982,
        visualPosition: { x: 68, y: 78 },
      },
    ],
    itinerary: [
      {
        id: "ktx-521-yongsan-to-jeonju",
        day: "2026-07-10",
        kind: "train",
        title: "용산역 출발 · KTX 521",
        startsAt: "20:09",
        endsAt: "21:47",
        description: "용산에서 전주로 내려가는 첫 이동. 14호차 1A, 1B 좌석.",
        tags: ["KTX", "교통", "출발"],
        placeId: "yongsan-station",
        quickLink: true,
        train: {
          number: "KTX 521",
          from: "용산",
          to: "전주",
          car: "14호차",
          seats: ["1A", "1B"],
        },
      },
      {
        id: "jeonju-arrival",
        day: "2026-07-10",
        kind: "station",
        title: "전주역 도착",
        startsAt: "21:47",
        description: "전주 여행의 첫 도착 지점.",
        tags: ["도착", "지도"],
        placeId: "jeonju-station",
        quickLink: true,
      },
      {
        id: "jeonju-tourist-hotel",
        day: "2026-07-10",
        kind: "hotel",
        title: "전주관광호텔호텔",
        startsAt: "15:00",
        endsAt: "2026-07-12 11:00",
        description: "2026년 7월 10일 체크인, 7월 12일 체크아웃.",
        tags: ["숙소", "베이스캠프", "Kakao Place"],
        placeId: "jeonju-tourist-hotel",
        quickLink: true,
      },
      {
        id: "day-2-empty-guide",
        day: "2026-07-11",
        kind: "place",
        title: "전주에서 보내는 하루",
        description:
          "7월 11일의 장소, 교통, 식사 동선은 정리되는 대로 이 일정 데이터에 직접 반영한다.",
        tags: ["전주", "동선 정리"],
      },
      {
        id: "ktx-510-jeonju-to-yongsan",
        day: "2026-07-12",
        kind: "train",
        title: "전주역 출발 · KTX 510",
        startsAt: "13:18",
        endsAt: "15:03",
        description: "전주에서 용산으로 돌아오는 이동. 15호차 1A, 1B 좌석.",
        tags: ["KTX", "교통", "귀가"],
        placeId: "jeonju-station",
        quickLink: true,
        train: {
          number: "KTX 510",
          from: "전주",
          to: "용산",
          car: "15호차",
          seats: ["1A", "1B"],
        },
      },
    ],
  },
] satisfies Trip[];
