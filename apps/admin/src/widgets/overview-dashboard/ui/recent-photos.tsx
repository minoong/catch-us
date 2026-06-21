import { ImageIcon } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@repo/ui/components/item";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { recentPhotos } from "../model/mock-data";
import type { PhotoProcessingStatus, PhotoVisibility } from "../model/types";

const visibilityLabels: Record<PhotoVisibility, string> = {
  public: "공개",
  private: "비공개",
};

const statusLabels: Record<PhotoProcessingStatus, string> = {
  ready: "준비 완료",
  processing: "처리 중",
  "needs-location": "위치 필요",
};

export function RecentPhotos() {
  return (
    <Card
      aria-labelledby="recent-photos-title"
      aria-describedby="recent-photos-description"
    >
      <CardHeader>
        <CardTitle>
          <h2 id="recent-photos-title">최근 사진</h2>
        </CardTitle>
        <CardDescription id="recent-photos-description">
          최근 업로드한 사진의 목업 상태입니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사진</TableHead>
                <TableHead>소유자</TableHead>
                <TableHead>공개 상태</TableHead>
                <TableHead>위치</TableHead>
                <TableHead>처리 상태</TableHead>
                <TableHead className="text-right">촬영일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPhotos.map((photo) => (
                <TableRow key={photo.id}>
                  <TableCell>
                    <div className="flex items-center gap-3 font-medium">
                      <span className="bg-muted flex size-8 items-center justify-center rounded-sm border">
                        <ImageIcon aria-hidden="true" className="size-4" />
                      </span>
                      {photo.name}
                    </div>
                  </TableCell>
                  <TableCell>{photo.owner}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        photo.visibility === "public" ? "default" : "secondary"
                      }
                    >
                      {visibilityLabels[photo.visibility]}
                    </Badge>
                  </TableCell>
                  <TableCell>{photo.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        photo.status === "needs-location"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {statusLabels[photo.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {photo.capturedAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <ItemGroup className="gap-3 md:hidden">
          {recentPhotos.map((photo) => (
            <Item key={photo.id} role="listitem" variant="outline">
              <ItemMedia variant="icon">
                <ImageIcon aria-hidden="true" />
              </ItemMedia>
              <ItemContent className="min-w-0">
                <ItemTitle className="w-full truncate">{photo.name}</ItemTitle>
                <ItemDescription className="line-clamp-1">
                  {photo.location} · {photo.capturedAt}
                </ItemDescription>
              </ItemContent>
              <ItemFooter className="justify-start">
                <Badge
                  variant={
                    photo.visibility === "public" ? "default" : "secondary"
                  }
                >
                  {visibilityLabels[photo.visibility]}
                </Badge>
                <Badge
                  variant={
                    photo.status === "needs-location"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {statusLabels[photo.status]}
                </Badge>
              </ItemFooter>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
