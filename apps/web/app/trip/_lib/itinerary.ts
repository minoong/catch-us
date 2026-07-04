import {
  trips,
  type ItineraryItem,
  type Trip,
  type TripDayId,
  type TripSlug,
} from "../_data/trips";

export const tripDayOptions = [
  { id: "all", label: "전체" },
  { id: "2026-07-10", label: "07.10" },
  { id: "2026-07-11", label: "07.11" },
  { id: "2026-07-12", label: "07.12" },
] satisfies { id: TripDayId; label: string }[];

export function getTrip(slug: string): Trip | undefined {
  return trips.find((item) => item.slug === slug);
}

export function generateTripStaticParams(): { slug: TripSlug }[] {
  return trips.map((trip) => ({ slug: trip.slug }));
}

export function getPlace(trip: Trip, placeId: string | undefined) {
  if (!placeId) return undefined;
  return trip.places.find((place) => place.id === placeId);
}

export function getItineraryByDay(trip: Trip, day: TripDayId): ItineraryItem[] {
  if (day === "all") return trip.itinerary;
  return trip.itinerary.filter((item) => item.day === day);
}

export function getQuickLinks(trip: Trip): ItineraryItem[] {
  return trip.itinerary.filter((item) => item.quickLink);
}
