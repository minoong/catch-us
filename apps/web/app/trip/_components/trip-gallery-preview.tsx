import { CameraIcon } from "@radix-ui/react-icons";

import CircularGallery from "@/components/CircularGallery";
import { Marquee } from "@/components/magicui/marquee";

const previewItems = [
  "한옥마을",
  "야경",
  "숙소",
  "KTX",
  "카페",
  "맛집",
] as const;

const galleryItems = previewItems.map((item, index) => {
  const palette = [
    ["#ef4444", "#f97316"],
    ["#111827", "#475569"],
    ["#2563eb", "#38bdf8"],
    ["#16a34a", "#84cc16"],
    ["#7c3aed", "#ec4899"],
    ["#f59e0b", "#fde68a"],
  ][index % 6];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${palette[0]}"/><stop offset="1" stop-color="${palette[1]}"/></linearGradient></defs><rect width="640" height="420" rx="52" fill="url(#g)"/><circle cx="520" cy="96" r="96" fill="rgba(255,255,255,.18)"/><circle cx="86" cy="330" r="128" fill="rgba(255,255,255,.12)"/><text x="48" y="228" fill="white" font-family="Arial, sans-serif" font-size="62" font-weight="900">${item}</text></svg>`;

  return {
    image: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    text: item,
  };
});

export function TripGalleryPreview({
  reducedMotion = false,
}: {
  reducedMotion?: boolean;
}) {
  const badges = previewItems.map((item) => (
    <span
      className="rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white"
      key={item}
    >
      {item}
    </span>
  ));

  return (
    <div className="absolute inset-0 flex flex-col justify-end overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),transparent_42%)] p-4">
      {reducedMotion ? null : (
        <div className="absolute inset-x-0 top-2 h-32 opacity-90">
          <CircularGallery
            bend={1.4}
            borderRadius={0.08}
            items={galleryItems}
            scrollSpeed={1}
            textColor="#ffffff"
          />
        </div>
      )}
      <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-white/80 shadow-lg">
        <CameraIcon className="size-5 text-neutral-800" />
      </div>
      {reducedMotion ? (
        <div className="flex flex-wrap gap-2">{badges}</div>
      ) : (
        <Marquee className="-mx-4 [--duration:18s]" repeat={3}>
          {badges}
        </Marquee>
      )}
    </div>
  );
}
