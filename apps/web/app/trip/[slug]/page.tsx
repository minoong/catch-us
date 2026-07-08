import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { TripIntroPage } from "../_components/trip-intro-page";
import { generateTripStaticParams, getTrip } from "../_lib/itinerary";

const JEONJU_META_IMAGE =
  "https://catch-us-web.vercel.app/trips/jeonju-2026/meta/og-image.jpg";

export const metadata: Metadata = {
  title: "하나보다 둘, 한 명보다 두명",
  description: "2026년 7월, 용산에서 KTX를 타고 전주로 내려가는 여행.",
  icons: {
    apple: "/trips/jeonju-2026/meta/apple-touch-icon.png",
    icon: "/trips/jeonju-2026/meta/favicon.png",
  },
  openGraph: {
    description: "2026년 7월, 용산에서 KTX를 타고 전주로 내려가는 여행.",
    images: [
      {
        alt: "전주 여행의 밤 분위기",
        height: 630,
        url: JEONJU_META_IMAGE,
        width: 1200,
      },
    ],
    title: "하나보다 둘, 한 명보다 두명",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    description: "2026년 7월, 용산에서 KTX를 타고 전주로 내려가는 여행.",
    images: [JEONJU_META_IMAGE],
    title: "하나보다 둘, 한 명보다 두명",
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

  return <TripIntroPage trip={trip} />;
}
