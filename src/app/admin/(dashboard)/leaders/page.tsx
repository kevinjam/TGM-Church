import { Users } from "lucide-react";
import { ModulePlaceholder } from "@/components/admin/module-placeholder";

export const metadata = { title: "Leaders" };

export default function LeadersPage() {
  return (
    <ModulePlaceholder
      icon={Users}
      title="Leaders"
      description="Manage the Grace Team shown on the About page — names, roles, bios, photos, and contact details. The team manager arrives in a later stage."
    />
  );
}
