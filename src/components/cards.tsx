import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { Tour, Vehicle } from "@/content/site";
import { InquiryButton } from "@/components/InquiryButton";
import { waScooter } from "@/lib/whatsapp";

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
  number,
}: {
  vehicle: Vehicle;
  index: string;
  /** Nomor WA (dari DB) untuk link booking + lead logging. */
  number: string;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-white/5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-white/25">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-white px-3.5 py-2 text-sm font-extrabold tracking-tight text-ink shadow-lg">
            {vehicle.daily}
            <span className="font-medium text-ink/55">/day</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-2 text-[11px] font-extrabold uppercase tracking-widest text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Available
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-xl font-extrabold tracking-tight">{vehicle.name}</h3>
          <span className="shrink-0 text-sm font-bold text-white/30">{index}</span>
        </div>
        <p className="mt-1 text-sm text-white/50">{vehicle.spec}</p>
        {vehicle.weekly && (
          <p className="mt-3 inline-flex w-fit items-center rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
            {vehicle.weekly}/week · hemat untuk trip panjang
          </p>
        )}
        <ul className="mt-4 space-y-2">
          {vehicle.perks.map((p) => (
            <li key={p} className="flex items-center gap-2.5 text-sm text-white/70">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
                <Check size={12} className="text-emerald-300" />
              </span>
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <InquiryButton
            inquiry={{ type: "vehicle", title: vehicle.name, payload: {} }}
            fallbackHref={waScooter(vehicle.name, "", "", "", number)}
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-4 text-sm font-bold text-ink transition hover:bg-white/90"
          >
            Rent this scooter <ArrowUpRight size={16} className="ml-2" />
          </InquiryButton>
          <p className="mt-2.5 text-center text-xs text-white/35">
            Free cancellation · pay on pickup
          </p>
        </div>
      </div>
    </article>
  );
}
