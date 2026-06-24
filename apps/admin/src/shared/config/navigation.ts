import {
  Images,
  LayoutDashboard,
  ListTodo,
  MapPinned,
  ScanFace,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavigationItem {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
}

export const adminNavigation = [
  {
    title: "개요",
    href: "/",
    description: "사진과 처리 현황을 한눈에 확인합니다.",
    icon: LayoutDashboard,
  },
  {
    title: "사진 관리",
    href: "/photos",
    description: "업로드한 사진과 공개 상태를 관리합니다.",
    icon: Images,
  },
  {
    title: "인물",
    href: "/people",
    description: "사진 속 인물과 얼굴 그룹을 관리합니다.",
    icon: ScanFace,
  },
  {
    title: "위치·지도",
    href: "/map",
    description: "사진 위치와 지도 마커를 확인합니다.",
    icon: MapPinned,
  },
  {
    title: "검색·임베딩",
    href: "/search",
    description: "검색 색인과 임베딩 처리 상태를 확인합니다.",
    icon: Search,
  },
  {
    title: "게스트·접근 관리",
    href: "/guests",
    description: "게스트와 접근 범위를 관리합니다.",
    icon: Users,
  },
  {
    title: "처리 작업",
    href: "/jobs",
    description: "메타데이터와 이미지 처리 작업을 확인합니다.",
    icon: ListTodo,
  },
  {
    title: "설정",
    href: "/settings",
    description: "관리자 서비스 설정을 관리합니다.",
    icon: Settings,
  },
] as const satisfies readonly AdminNavigationItem[];

export function getNavigationItem(pathname: string) {
  return adminNavigation.find(({ href }) =>
    href === "/"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`),
  );
}
