import { MetricCards } from "./metric-cards";
import { RecentPhotos } from "./recent-photos";
import { UploadTrendChart } from "./upload-trend-chart";
import { VisibilityChart } from "./visibility-chart";

export function OverviewDashboard() {
  return (
    <main className="@container/main flex flex-1 flex-col">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <header className="flex flex-col gap-1 px-4 lg:px-6">
          <h1 className="text-2xl font-semibold tracking-tight">개요</h1>
          <p className="text-muted-foreground text-sm">
            Catch Us 사진과 처리 현황을 확인합니다.
          </p>
        </header>

        <MetricCards />

        <section
          aria-labelledby="photo-statistics-title"
          className="grid gap-4 px-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)] lg:px-6"
        >
          <h2 id="photo-statistics-title" className="sr-only">
            사진 통계
          </h2>
          <UploadTrendChart />
          <VisibilityChart />
        </section>

        <section aria-labelledby="recent-photos-title" className="px-4 lg:px-6">
          <RecentPhotos />
        </section>
      </div>
    </main>
  );
}
