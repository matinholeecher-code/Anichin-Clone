import { Suspense } from "react";
import { ArchiveGrid } from "@/components/ArchiveGrid";

export default function AzListsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-[#a0a0a0]">Memuat data...</div>}>
      <ArchiveGrid title="AZ Lists" />
    </Suspense>
  );
}
