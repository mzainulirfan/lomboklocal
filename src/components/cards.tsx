import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { Tour, Vehicle } from "@/content/site";

export function TourCard({ tour, wide = false }: { tour: Tour; wide?: boolean }) {
  return (
    <Link href={`/tours/${tour.slug}`} className={`group ${wide ? "md:col-span-2" : ""}`}>
      <div
        className={`relative overflow-hidden rounded-[2rem] ${
          wide ? "aspect-[16/10]" : "aspect-[4/5]"
        }`}
      >
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-7 text-white">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/65">{tour.area}</p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight">{tour.title}</h3>
          </div>
          {wide && (
            <span className="rounded-full bg-white px-4 py-3 text-ink">
              <ArrowUpRight size={18} />
            </span>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-between text-sm">
        <span>
          {tour.duration} · {tour.type}
        </span>
        <span className="font-bold">From {tour.price}</span>
      </div>
    </Link>
  );
}

export function VehicleCard({
  vehicle,
  index,
  cta,
}: {
  vehicle: Vehicle;
  index: string;
  cta: string;
}) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] bg-white/5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between">
          <h3 className="font-bold">{vehicle.name}</h3>
          <span className="text-sm text-white/50">{index}</span>
        </div>
        <p className="mt-2 text-sm text-white/50">{vehicle.spec}</p>
        <ul className="mt-4 space-y-1.5">
          {vehicle.perks.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm text-white/70">
              <Check size={14} className="text-white/50" /> {p}
            </li>
          ))}
        </ul>
        <p className="mt-5 font-bold">
          {vehicle.daily} <span className="font-normal text-white/40">/ day</span>
          {vehicle.weekly && (
            <span className="ml-2 text-sm font-normal text-white/40">· {vehicle.weekly}/week</span>
          )}
        </p>
        <a
          href={cta}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-ink transition hover:bg-white/90"
        >
          Rent now <ArrowUpRight size={16} className="ml-2" />
        </a>
      </div>
    </article>
  );
}
