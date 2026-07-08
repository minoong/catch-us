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
  imageUrl?: string;
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
    title: "하나보다 둘, 한 명보다 두 명",
    subtitle:
      "2026년 7월 10일, 용산에서 KTX를 타고 전주로 내려가는 2박 3일 여행.",
    startsOn: "2026-07-10",
    endsOn: "2026-07-12",
    places: [
      {
        id: "yongsan-station",
        name: "용산역",
        imageUrl: "/trips/jeonju-2026/places/ktx-yongsan.jpeg",
        kakaoPlaceUrl: "https://place.map.kakao.com/8014275",
        lat: 37.5290767,
        lng: 126.9658972,
        visualPosition: { x: 18, y: 58 },
      },
      {
        id: "jeonju-station",
        name: "전주역",
        imageUrl: "/trips/jeonju-2026/places/ktx-jeonju-station.jpeg",
        kakaoPlaceUrl: "https://place.map.kakao.com/8508642",
        lat: 35.8500537,
        lng: 127.1623649,
        visualPosition: { x: 78, y: 36 },
      },
      {
        id: "jeonju-tourist-hotel",
        name: "전주관광호텔",
        imageUrl: "/trips/jeonju-2026/places/jeonju-tourist-hotel.jpeg",
        kakaoPlaceUrl: "https://place.map.kakao.com/2126483278",
        lat: 35.817533,
        lng: 127.139982,
        visualPosition: { x: 68, y: 78 },
      },
      {
        id: "hyundaiok-nambu-market",
        name: "전주현대옥 남부시장점",
        address: "전북특별자치도 전주시 완산구 풍남문2길 63 2동 74호",
        imageUrl: "/trips/jeonju-2026/places/hyundaiok.jpeg",
        kakaoPlaceUrl: "https://place.map.kakao.com/14594702",
        lat: 35.81334,
        lng: 127.14642,
        visualPosition: { x: 49, y: 58 },
      },
      {
        id: "jojeomrye-nammun-pisundae",
        name: "조점례남문피순대",
        address: "전북특별자치도 전주시 완산구 풍남문2길 39 5동 117~119호",
        imageUrl: "/trips/jeonju-2026/places/jojeomrye-pisundae.jpeg",
        kakaoPlaceUrl: "https://place.map.kakao.com/10186580",
        lat: 35.81345,
        lng: 127.1458,
        visualPosition: { x: 47, y: 59 },
      },
      {
        id: "pungnammun-gate",
        name: "풍남문",
        address: "전북특별자치도 전주시 완산구 풍남문3길 1",
        imageUrl: "/trips/jeonju-2026/places/pungnammun.jpeg",
        kakaoPlaceUrl: "https://place.map.kakao.com/8138264",
        lat: 35.81431,
        lng: 127.14707,
        visualPosition: { x: 51, y: 55 },
      },
      {
        id: "jeondong-cathedral",
        name: "전동성당",
        address: "전북특별자치도 전주시 완산구 태조로 51",
        imageUrl: "/trips/jeonju-2026/places/jeondong-cathedral.jpeg",
        kakaoPlaceUrl: "https://place.map.kakao.com/12760599",
        lat: 35.81359,
        lng: 127.14997,
        visualPosition: { x: 58, y: 57 },
      },
      {
        id: "gyeonggijeon-shrine",
        name: "경기전",
        address: "전북특별자치도 전주시 완산구 태조로 44",
        imageUrl: "/trips/jeonju-2026/places/gyeonggijeon.jpeg",
        kakaoPlaceUrl: "https://place.map.kakao.com/10170551",
        lat: 35.81502,
        lng: 127.14989,
        visualPosition: { x: 58, y: 52 },
      },
      {
        id: "jeonju-hanok-village",
        name: "전주한옥마을",
        address: "전북특별자치도 전주시 완산구 풍남동3가 63-1",
        imageUrl: "/trips/jeonju-2026/places/hanok-village.jpeg",
        kakaoPlaceUrl: "https://place.map.kakao.com/10731896",
        lat: 35.81518,
        lng: 127.153,
        visualPosition: { x: 65, y: 52 },
      },
      {
        id: "omokdae",
        name: "오목대",
        address: "전북특별자치도 전주시 완산구 기린대로 55",
        imageUrl: "/trips/jeonju-2026/places/omokdae.jpeg",
        kakaoPlaceUrl: "https://place.map.kakao.com/8458699",
        lat: 35.81592,
        lng: 127.15358,
        visualPosition: { x: 67, y: 49 },
      },
      {
        id: "deokjin-park",
        name: "전주덕진공원",
        address: "전북특별자치도 전주시 덕진구 권삼득로 390",
        imageUrl: "/trips/jeonju-2026/places/deokjin-park.png",
        kakaoPlaceUrl: "https://place.map.kakao.com/27603721",
        lat: 35.847489352012374,
        lng: 127.12102683209902,
        visualPosition: { x: 28, y: 18 },
      },
      {
        id: "jinmijip-main",
        name: "진미집 본점",
        address: "전북특별자치도 전주시 완산구 노송여울2길 106 1층",
        imageUrl: "/trips/jeonju-2026/places/jinmijip.png",
        kakaoPlaceUrl: "https://place.map.kakao.com/10082639",
        lat: 35.82685234659319,
        lng: 127.1424163695651,
        visualPosition: { x: 40, y: 37 },
      },
      {
        id: "day-3-morning-place",
        name: "자매갈비전골",
        address: "전북특별자치도 전주시 완산구 기린대로 121 1-2층",
        imageUrl: "/trips/jeonju-2026/places/jamae-galbi-jeongol.jpeg",
        kakaoPlaceUrl: "https://place.map.kakao.com/11171115",
        lat: 35.819844991790426,
        lng: 127.15345196148678,
        visualPosition: { x: 58, y: 42 },
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
        description:
          "어이, 시작부터 KTX라니 우리 예산 괜찮은 거냐고! 아무튼 14호차 1A, 1B로 간다!!!",
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
        description:
          "어이어이, 진짜로 와버렸잖아 전주역! 기차 타고 왔더니 멀미 난다 해... 딸기우유, 당분을 달라해!",
        tags: ["도착", "지도"],
        placeId: "jeonju-station",
        quickLink: true,
      },
      {
        id: "jeonju-tourist-hotel",
        day: "2026-07-10",
        kind: "hotel",
        title: "전주관광호텔",
        startsAt: "15:00",
        endsAt: "2026-07-12 11:00",
        description:
          "긴쨩이 묵기엔 너무 고급진 거 아니냐고! 10일부터 12일까지 여기가 우리 아지트다. 룸서비스는 전부 긴토키 앞으로 달아두라고!",
        tags: ["숙소", "베이스캠프", "Kakao Place"],
        placeId: "jeonju-tourist-hotel",
        quickLink: true,
      },
      {
        id: "day-2-breakfast-hyundaiok",
        day: "2026-07-11",
        kind: "meal",
        title: "아침밥 후보 · 전주현대옥",
        startsAt: "09:00",
        description:
          "아침부터 콩나물국밥이라니 아저씨냐! ...라곤 해도 역시 해장엔 국밥만 한 게 없지. 뚝배기 바닥까지 핥아먹어주마!",
        tags: ["아침", "콩나물국밥", "후보1"],
        placeId: "hyundaiok-nambu-market",
        quickLink: true,
      },
      {
        id: "day-2-breakfast-jojeomrye",
        day: "2026-07-11",
        kind: "meal",
        title: "아침밥 후보 · 조점례남문피순대",
        startsAt: "09:00",
        description: "콩나물로 부족하다면 피순대다 해!",
        tags: ["아침", "피순대", "후보2"],
        placeId: "jojeomrye-nammun-pisundae",
        quickLink: true,
      },
      {
        id: "day-2-pungnammun",
        day: "2026-07-11",
        kind: "place",
        title: "풍남문",
        startsAt: "10:00",
        description:
          "이게 그 유명한 풍남문인가 뭔가 하는 건가? 어이 신파치, 안경 벗고 제대로 보라고.",
        tags: ["풍남문", "산책", "동선"],
        placeId: "pungnammun-gate",
        quickLink: true,
      },
      {
        id: "day-2-jeondong-cathedral",
        day: "2026-07-11",
        kind: "place",
        title: "전동성당",
        startsAt: "10:30",
        description:
          "어이어이, 성당 앞에서 그런 썩은 동태눈깔을 하고 있으면 신성모독으로 잡혀간다고! 대충 기념사진이나 찍고 가자고.",
        tags: ["전동성당", "사진", "한옥마을"],
        placeId: "jeondong-cathedral",
        quickLink: true,
      },
      {
        id: "day-2-gyeonggijeon",
        day: "2026-07-11",
        kind: "place",
        title: "경기전",
        startsAt: "11:30",
        description: "안경은 마음의 일부입니다.",
        tags: ["경기전", "관람", "산책"],
        placeId: "gyeonggijeon-shrine",
        quickLink: true,
      },
      {
        id: "day-2-hanok-village",
        day: "2026-07-11",
        kind: "place",
        title: "전주한옥마을",
        startsAt: "12:30",
        description:
          "드디어 한옥마을이다 해! 길거리 음식 다 내놓으라 해! 긴짱 지갑 오늘 다 털어버릴 거다 해!!",
        tags: ["한옥마을", "점심", "골목"],
        placeId: "jeonju-hanok-village",
        quickLink: true,
      },
      {
        id: "day-2-omokdae",
        day: "2026-07-11",
        kind: "place",
        title: "오목대",
        startsAt: "15:30",
        description:
          "헥헥... 어이, 밥 먹고 바로 등산시키는 악덕 사장이 어딨냐고! 당분 부족하다고, 당분!! 네 녀석 피는 무슨 색이냐!",
        tags: ["오목대", "전망", "산책"],
        placeId: "omokdae",
        quickLink: true,
      },
      {
        id: "day-2-deokjin-park",
        day: "2026-07-11",
        kind: "place",
        title: "전주덕진공원",
        startsAt: "17:30",
        description:
          "어이어이, 연못 퀄리티가 장난 아니잖아. 사다하루 산책시키기에도 제격이겠어.",
        tags: ["덕진공원", "산책", "휴식"],
        placeId: "deokjin-park",
        quickLink: true,
      },
      {
        id: "day-2-jinmijip",
        day: "2026-07-11",
        kind: "meal",
        title: "진미집 본점",
        startsAt: "19:00",
        description: "마요네즈 듬뿍 얹어서...",
        tags: ["저녁", "노포", "연탄불고기"],
        placeId: "jinmijip-main",
        quickLink: true,
      },
      {
        id: "day-2-night-option",
        day: "2026-07-11",
        kind: "hotel",
        title: "숙소 복귀 또는 더 먹기",
        startsAt: "21:00",
        description:
          "아직 위장에 공간 남았다 해! 야식 안 사주면 호텔 로비에서 다시마 초절임이나 씹으면서 날뛸 거다 해!!",
        tags: ["숙소", "야식", "선택"],
        placeId: "jeonju-tourist-hotel",
        quickLink: true,
      },
      {
        id: "day-3-morning-place",
        day: "2026-07-12",
        kind: "meal",
        title: "자매갈비전골",
        startsAt: "10:30",
        description: "마지막 날까지 고기냐! 식사는 밸런스를 생각해라!!!",
        tags: ["오전", "갈비전골", "식사"],
        placeId: "day-3-morning-place",
        quickLink: true,
      },
      {
        id: "ktx-510-jeonju-to-yongsan",
        day: "2026-07-12",
        kind: "train",
        title: "전주역 출발 · KTX 510",
        startsAt: "13:18",
        endsAt: "15:03",
        description:
          "드디어 한양으로 돌아가는구만. 15호차 1A, 1B 좌석이니까 내 자리에 딴 놈 앉아있으면 동야호로 날려버린다.",
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
