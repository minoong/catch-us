import { notFound } from "next/navigation";

import { TripIntroPage } from "../_components/trip-intro-page";
import { generateTripStaticParams, getTrip } from "../_lib/itinerary";

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

  return <TripIntroPage trip={trip} />;
}
