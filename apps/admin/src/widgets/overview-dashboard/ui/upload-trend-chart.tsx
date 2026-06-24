"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@repo/ui/components/chart";

import { uploadTrend } from "../model/mock-data";

const chartConfig = {
  photos: {
    label: "업로드 사진",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function UploadTrendChart() {
  return (
    <Card
      className="min-w-0"
      aria-labelledby="upload-trend-title"
      aria-describedby="upload-trend-description"
    >
      <CardHeader>
        <CardTitle>
          <h2 id="upload-trend-title">업로드 추이</h2>
        </CardTitle>
        <CardDescription id="upload-trend-description">
          최근 7일 동안 업로드한 사진 수
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <AreaChart
            accessibilityLayer
            data={uploadTrend}
            title="업로드 추이"
            desc="최근 7일 동안 업로드한 사진 수"
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <ChartTooltip
              content={<ChartTooltipContent role="status" aria-live="polite" />}
            />
            <Area
              dataKey="photos"
              type="natural"
              fill="var(--color-photos)"
              fillOpacity={0.25}
              stroke="var(--color-photos)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
