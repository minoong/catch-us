import { Search } from "lucide-react";

import { SectionPlaceholder } from "@/widgets/section-placeholder";

export default function SearchPage() {
  return (
    <SectionPlaceholder
      title="검색·임베딩"
      description="키워드와 유사 이미지 검색 색인은 다음 기능 작업에서 구현합니다."
      icon={Search}
    />
  );
}
