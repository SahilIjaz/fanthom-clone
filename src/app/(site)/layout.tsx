import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <a
        href="https://superhuman.com"
        target="_blank"
        rel="noreferrer"
        className="disp flex items-center justify-center gap-3 bg-offwhite px-4 py-2.5 text-[13px] tracking-[0.08em] text-black"
      >
        <span className="font-medium">Fanthom is now part of Superhuman.</span>
        <span className="underline underline-offset-2">Learn more</span>
        <span aria-hidden>→</span>
      </a>
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
