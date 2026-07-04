import { notFound } from "next/navigation";

import { TripSchedulePage } from "../../_components/trip-schedule-page";
import { generateTripStaticParams, getTrip } from "../../_lib/itinerary";

export const metadata = {
  robots: {
    follow: false,
    index: false,
  },
};

export function generateStaticParams() {
  return generateTripStaticParams();
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getTrip(slug);
  if (!trip) notFound();

  return <TripSchedulePage trip={trip} />;
}
