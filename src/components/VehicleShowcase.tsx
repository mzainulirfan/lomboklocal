import { VehicleCard, type CardLabels } from "@/components/cards";
import { VehicleDesktop, type ShowcaseItem } from "@/components/VehicleDesktop";

export type { ShowcaseItem };

/**
 * Showcase adaptif (Server Component):
 * - Mobile: kartu ringkas → bottom sheet booking.
 * - Desktop: master–detail via <VehicleDesktop> (client).
 */
export function VehicleShowcase({
  items,
  number,
  labels,
  detailsLabel,
}: {
  items: ShowcaseItem[];
  number: string;
  labels: CardLabels;
  detailsLabel: string;
}) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 md:hidden">
        {items.map((item) => (
          <VehicleCard key={item.vehicle.id} vehicle={item.vehicle} number={number} labels={labels} />
        ))}
      </div>
      <VehicleDesktop items={items} number={number} labels={labels} detailsLabel={detailsLabel} />
    </>
  );
}
