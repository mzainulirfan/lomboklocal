import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { supabasePublic } from "@/lib/supabase";
import type { VehicleRow } from "@/lib/vehicles";
import { PanelHeader } from "../../ui";
import { VehicleForm } from "../VehicleForm";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sb = supabasePublic();
  const { data } = sb ? await sb.from("vehicles").select("*").eq("id", id).single() : { data: null };
  const v = data as VehicleRow | null;
  if (!v) notFound();

  return (
    <>
      <Link href="/admin/vehicles" className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-ink">
        <ArrowLeft size={16} /> Vehicles
      </Link>
      <div className="mt-4">
        <PanelHeader kicker="Rental" title={v.name} desc="Ubah detail kendaraan, lalu simpan." />
      </div>
      <div className="mt-8">
        <VehicleForm vehicle={v} />
      </div>
    </>
  );
}
