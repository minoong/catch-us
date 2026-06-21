import type {
  DashboardMetric,
  RecentPhoto,
  UploadTrendPoint,
  VisibilityPoint,
} from "./types";

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "전체 사진",
    value: "12,486",
    detail: "지난달보다 8.2% 증가",
  },
  {
    label: "공개 사진",
    value: "8,942",
    detail: "전체 사진의 71.6%",
  },
  {
    label: "비공개 사진",
    value: "3,544",
    detail: "전체 사진의 28.4%",
  },
  {
    label: "처리 중",
    value: "18",
    detail: "이미지 분석 작업",
  },
];

export const uploadTrend: UploadTrendPoint[] = [
  { date: "06-15", photos: 72 },
  { date: "06-16", photos: 84 },
  { date: "06-17", photos: 63 },
  { date: "06-18", photos: 102 },
  { date: "06-19", photos: 91 },
  { date: "06-20", photos: 118 },
  { date: "06-21", photos: 97 },
];

export const visibilityBreakdown: VisibilityPoint[] = [
  {
    visibility: "public",
    photos: 8942,
    fill: "var(--color-public)",
  },
  {
    visibility: "private",
    photos: 3544,
    fill: "var(--color-private)",
  },
];

export const recentPhotos: RecentPhoto[] = [
  {
    id: "photo-001",
    name: "seoul-evening.jpg",
    owner: "민우",
    location: "서울특별시 종로구",
    capturedAt: "2026-06-21",
    visibility: "public",
    status: "ready",
  },
  {
    id: "photo-002",
    name: "tokyo-crossing.jpg",
    owner: "여자친구",
    location: "Shibuya, Tokyo, Japan",
    capturedAt: "2026-06-20",
    visibility: "public",
    status: "ready",
  },
  {
    id: "photo-003",
    name: "screen-capture.png",
    owner: "민우",
    location: "위치 제외",
    capturedAt: "2026-06-20",
    visibility: "private",
    status: "ready",
  },
  {
    id: "photo-004",
    name: "busan-sea.jpg",
    owner: "여자친구",
    location: "부산광역시 해운대구",
    capturedAt: "2026-06-19",
    visibility: "public",
    status: "processing",
  },
  {
    id: "photo-005",
    name: "paris-street.jpg",
    owner: "민우",
    location: "Paris, Île-de-France, France",
    capturedAt: "2026-06-18",
    visibility: "public",
    status: "processing",
  },
];
