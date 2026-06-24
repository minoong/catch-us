"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@repo/ui/components/chart";

import { visibilityBreakdown } from "../model/mock-data";

const chartConfig = {
  photos: {
    label: "사진",
  },
  public: {
    label: "공개",
    color: "var(--chart-2)",
  },
  private: {
    label: "비공개",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function VisibilityChart() {
  return (
    <Card
      className="min-w-0"
      aria-labelledby="visibility-chart-title"
      aria-describedby="visibility-chart-description"
    >
      <CardHeader>
        <CardTitle>
          <h2 id="visibility-chart-title">공개 상태</h2>
        </CardTitle>
        <CardDescription id="visibility-chart-description">
          전체 사진의 공개·비공개 비율
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[240px] w-full"
        >
          <PieChart
            accessibilityLayer
            title="공개 상태"
            desc="전체 사진의 공개·비공개 비율"
          >
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="visibility"
                  role="status"
                  aria-live="polite"
                />
              }
            />
            <Pie
              data={visibilityBreakdown}
              dataKey="photos"
              nameKey="visibility"
              innerRadius={52}
              strokeWidth={4}
            >
              {visibilityBreakdown.map((item) => (
                <Cell key={item.visibility} fill={item.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="visibility" />}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
