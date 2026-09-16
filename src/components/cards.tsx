import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tour, Vehicle } from "@/content/site";
import { VehicleBookModal } from "@/components/VehicleBookModal";
import { getUsdRate } from "@/lib/settings";
import { formatUSD } from "@/lib/format";

export async function TourCard({ tour, wide = false }: { tour: Tour; wide?: boolean }) {
  const usd = formatUSD(tour.priceAmount, await getUsdRate());
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
        <span className="font-bold">
          From {tour.price}
          {usd && <span className="ml-1.5 font-normal text-black/40">{usd}</span>}
        </span>
      </div>
    </Link>
  );
}

export type CardLabels = {
  date: string;
  days: string;
  phone: string;
  phonePh: string;
  bookUnit: string;
  opening: string;
  perDay: string;
  perWeek: string;
  weeklySave: string;
  cancelNote: string;
  available: string;
  fullNote: string;
  refCode: string;
  refHint: string;
  selectUnit: string;
  closeDetails: string;
};

export async function VehicleCard({
  vehicle,
  number,
  labels,
  href,
}: {
  vehicle: Vehicle;
  number: string;
  labels: CardLabels;
  /** Bila diisi, kartu menjadi link preview (tanpa tombol modal). */
  href?: string;
}) {
  const usd = formatUSD(vehicle.dailyAmount, await getUsdRate());
  const specs = vehicle.spec.split("·").map((s) => s.trim()).filter(Boolean);
  const body = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3.5 py-2 text-sm font-extrabold tracking-tight text-ink shadow-lg">
          {vehicle.daily}
          <span className="font-medium text-ink/55">{labels.perDay}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-extrabold tracking-tight">{vehicle.name}</h3>
        {vehicle.highlight && (
          <p className="mt-2 w-fit rounded-full bg-ocean/20 px-3 py-1.5 text-xs font-bold text-cyan-200">
            {vehicle.highlight}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {specs.map((s) => (
            <span key={s} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/65">
              {s}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-white/45">
          {usd ? `${usd}${labels.perDay}` : vehicle.daily}
          {vehicle.weekly && <span className="ml-2 text-white/30">· {vehicle.weekly}{labels.perWeek}</span>}
        </p>
        <div className="mt-auto pt-2">
          {href ? (
            <span className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-4 text-sm font-bold text-ink transition group-hover:bg-white/90">
              {labels.selectUnit} <ArrowUpRight size={16} className="ml-2" />
            </span>
          ) : (
            <VehicleBookModal vehicle={vehicle} number={number} labels={labels} usd={usd} />
          )}
        </div>
      </div>
    </>
  );
  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-white/5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-white/25">
      {href ? (
        <Link href={href} className="flex flex-1 flex-col" aria-label={vehicle.name}>
          {body}
        </Link>
      ) : (
        body
      )}
    </article>
  );
}
