export type PhotoVisibility = "public" | "private";

export type PhotoProcessingStatus = "ready" | "processing" | "needs-location";

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
}

export interface UploadTrendPoint {
  date: string;
  photos: number;
}

export interface VisibilityPoint {
  visibility: PhotoVisibility;
  photos: number;
  fill: string;
}

export interface RecentPhoto {
  id: string;
  name: string;
  owner: string;
  location: string;
  capturedAt: string;
  visibility: PhotoVisibility;
  status: PhotoProcessingStatus;
}
