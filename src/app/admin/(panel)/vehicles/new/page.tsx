import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PanelHeader } from "../../ui";
import { VehicleForm } from "../VehicleForm";

export default function NewVehiclePage() {
  return (
    <>
      <Link href="/admin/vehicles" className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-ink">
        <ArrowLeft size={16} /> Vehicles
      </Link>
      <div className="mt-4">
        <PanelHeader
          kicker="Rental"
          title="Tambah."
          desc="Isi detail unit baru. Centang tampil agar langsung muncul di halaman rental."
        />
      </div>
      <div className="mt-8">
        <VehicleForm />
      </div>
    </>
  );
}
