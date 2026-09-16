import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PanelHeader } from "../../ui";
import { TourForm } from "../TourForm";

export default function NewTourPage() {
  return (
    <>
      <Link href="/admin/tours" className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-ink">
        <ArrowLeft size={16} /> Tours
      </Link>
      <div className="mt-4">
        <PanelHeader
          kicker="Trips"
          title="Tambah."
          desc="Isi detail tour baru. Itinerary bisa ditambahkan setelah tour disimpan."
        />
      </div>
      <div className="mt-8">
        <TourForm />
      </div>
    </>
  );
}
