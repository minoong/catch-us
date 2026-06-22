import { Images } from "lucide-react";

import { SectionPlaceholder } from "@/widgets/section-placeholder";

export default function PhotosPage() {
  return (
    <SectionPlaceholder
      title="사진 관리"
      description="다중 업로드와 공개 상태 관리는 다음 기능 작업에서 구현합니다."
      icon={Images}
    />
  );
}
