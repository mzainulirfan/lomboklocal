import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PanelHeader } from "../../ui";
import { RouteForm } from "../RouteForm";

export default function NewRoutePage() {
  return (
    <>
      <Link href="/admin/routes" className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-ink">
        <ArrowLeft size={16} /> Transfer
      </Link>
      <div className="mt-4">
        <PanelHeader
          kicker="Transport"
          title="Tambah."
          desc="Isi rute antar-jemput baru beserta harganya."
        />
      </div>
      <div className="mt-8">
        <RouteForm />
      </div>
    </>
  );
}
