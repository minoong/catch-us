import { ListTodo } from "lucide-react";

import { SectionPlaceholder } from "@/widgets/section-placeholder";

export default function JobsPage() {
  return (
    <SectionPlaceholder
      title="처리 작업"
      description="메타데이터와 이미지 처리 큐는 다음 기능 작업에서 구현합니다."
      icon={ListTodo}
    />
  );
}
