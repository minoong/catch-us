import { CameraIcon } from "@radix-ui/react-icons";

import { Marquee } from "@/components/magicui/marquee";

const previewItems = [
  "한옥마을",
  "야경",
  "숙소",
  "KTX",
  "카페",
  "맛집",
] as const;

export function TripGalleryPreview() {
  return (
    <div className="absolute inset-0 flex flex-col justify-end overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.92),transparent_42%)] p-4">
      <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-white/80 shadow-lg">
        <CameraIcon className="size-5 text-neutral-800" />
      </div>
      <Marquee className="-mx-4 [--duration:18s]" repeat={3}>
        {previewItems.map((item) => (
          <span
            className="rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white"
            key={item}
          >
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
