import { MapPinned } from "lucide-react";

import { SectionPlaceholder } from "@/widgets/section-placeholder";

export default function MapPage() {
  return (
    <SectionPlaceholder
      title="위치·지도"
      description="TMAP, Geoapify, Google Maps 연동은 다음 기능 작업에서 구현합니다."
      icon={MapPinned}
    />
  );
}
