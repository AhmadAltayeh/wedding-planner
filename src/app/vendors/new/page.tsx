import { PageHeader } from "@/components/ui";
import { VendorForm } from "@/components/vendor-form";

export default function NewVendorPage() {
  return (
    <div>
      <PageHeader title="Add vendor" />
      <VendorForm />
    </div>
  );
}
