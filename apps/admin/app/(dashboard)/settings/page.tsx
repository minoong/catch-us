import { Settings } from "lucide-react";

import { SectionPlaceholder } from "@/widgets/section-placeholder";

export default function SettingsPage() {
  return (
    <SectionPlaceholder
      title="설정"
      description="서비스와 관리자 설정은 각 기능이 연결된 뒤 구현합니다."
      icon={Settings}
    />
  );
}
