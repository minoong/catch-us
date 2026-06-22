import { Users } from "lucide-react";

import { SectionPlaceholder } from "@/widgets/section-placeholder";

export default function GuestsPage() {
  return (
    <SectionPlaceholder
      title="게스트·접근 관리"
      description="게스트 초대와 접근 범위는 인증 작업에서 구현합니다."
      icon={Users}
    />
  );
}
