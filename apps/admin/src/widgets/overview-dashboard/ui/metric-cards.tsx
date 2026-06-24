import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import { dashboardMetrics } from "../model/mock-data";

export function MetricCards() {
  return (
    <section
      aria-label="사진 현황"
      className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:px-6 xl:grid-cols-4"
    >
      {dashboardMetrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader>
            <CardDescription>{metric.label}</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {metric.value}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">{metric.detail}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
