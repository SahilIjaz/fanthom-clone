import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/AppShell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const session = jar.get("fz_session")?.value;
  if (!session) redirect("/login");
  return <AppShell email={decodeURIComponent(session)}>{children}</AppShell>;
}
