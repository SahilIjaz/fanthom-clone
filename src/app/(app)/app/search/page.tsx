import { Suspense } from "react";
import { GlobalSearch } from "@/components/app/GlobalSearch";

export const metadata = { title: "Search – Fanthom" };

export default function SearchPage() {
  return (
    <Suspense>
      <GlobalSearch />
    </Suspense>
  );
}
