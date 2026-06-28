import type { Trip } from "../_data/trips";
import { TripBentoGrid } from "./trip-bento-grid";
import { TripHero } from "./trip-hero";

export function TripIntroPage({ trip }: { trip: Trip }) {
  return (
    <main className="bg-background text-foreground min-h-screen overflow-hidden pb-8">
      <section className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-4 sm:max-w-lg">
        <TripHero trip={trip} />
        <TripBentoGrid trip={trip} />
      </section>
    </main>
  );
}
