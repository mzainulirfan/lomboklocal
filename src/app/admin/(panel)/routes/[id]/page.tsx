import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { supabasePublic } from "@/lib/supabase";
import type { TransferRouteRow } from "@/lib/transfers";
import { PanelHeader } from "../../ui";
import { RouteForm } from "../RouteForm";

export default async function EditRoutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = supabasePublic();
  const { data } = sb ? await sb.from("transfer_routes").select("*").eq("id", id).single() : { data: null };
  const route = data as TransferRouteRow | null;
  if (!route) notFound();

  return (
    <>
      <Link href="/admin/routes" className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-ink">
        <ArrowLeft size={16} /> Transfer
      </Link>
      <div className="mt-4">
        <PanelHeader
          kicker="Transport"
          title={`${route.from_loc} → ${route.to_loc}`}
          desc="Ubah harga atau urutan tampil rute ini."
        />
      </div>
      <div className="mt-8">
        <RouteForm route={route} />
      </div>
    </>
  );
}
