import { notFound } from "next/navigation";
import { getVendor } from "@/lib/actions/vendors";
import { VendorEditClient } from "./vendor-edit-client";

export default async function EditVendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vendor = await getVendor(id);
  if (!vendor) notFound();
  return <VendorEditClient vendor={vendor} />;
}
