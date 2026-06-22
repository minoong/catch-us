import { ScanFace } from "lucide-react";

import { SectionPlaceholder } from "@/widgets/section-placeholder";

export default function PeoplePage() {
  return (
    <SectionPlaceholder
      title="인물"
      description="얼굴 그룹과 인물 조회는 다음 기능 작업에서 구현합니다."
      icon={ScanFace}
    />
  );
}
