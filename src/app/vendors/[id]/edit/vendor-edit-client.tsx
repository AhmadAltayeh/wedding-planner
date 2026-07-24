"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteVendor } from "@/lib/actions/vendors";
import type { Vendor } from "@prisma/client";
import { PageHeader, Button } from "@/components/ui";
import { VendorForm } from "@/components/vendor-form";

export function VendorEditClient({ vendor }: { vendor: Vendor }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <PageHeader title="Edit vendor" subtitle={vendor.name} />
      <VendorForm vendor={vendor} />
      <Button
        variant="danger"
        className="mt-8 w-full"
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete vendor?")) return;
          startTransition(async () => {
            await deleteVendor(vendor.id);
            router.push("/vendors");
            router.refresh();
          });
        }}
      >
        Delete vendor
      </Button>
    </div>
  );
}
