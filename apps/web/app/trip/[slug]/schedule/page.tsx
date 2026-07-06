import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { TripSchedulePage } from "../../_components/trip-schedule-page";
import { generateTripStaticParams, getTrip } from "../../_lib/itinerary";

const JEONJU_META_IMAGE =
  "https://catch-us-web.vercel.app/trips/jeonju-2026/meta/og-image.jpg";

export const metadata: Metadata = {
  title: "전주 여행 일정",
  description: "2026년 7월 전주 여행 일정표.",
  icons: {
    apple: "/trips/jeonju-2026/meta/apple-touch-icon.png",
    icon: "/trips/jeonju-2026/meta/favicon.png",
  },
  openGraph: {
    description: "2026년 7월 전주 여행 일정표.",
    images: [
      {
        alt: "전주 여행의 밤 분위기",
        height: 630,
        url: JEONJU_META_IMAGE,
        width: 1200,
      },
    ],
    title: "전주 여행 일정",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    description: "2026년 7월 전주 여행 일정표.",
    images: [JEONJU_META_IMAGE],
    title: "전주 여행 일정",
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
