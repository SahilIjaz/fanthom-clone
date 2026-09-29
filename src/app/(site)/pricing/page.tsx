import Link from "next/link";
import type { Metadata } from "next";
import { PricingClient } from "./PricingClient";
import { FeatureMatrix } from "./FeatureMatrix";

export const metadata: Metadata = { title: "Pricing – Fanthom" };

const offers = [
  ["Qualified Portfolio Program", "Affiliated startups of select VCs & accelerators get up to 2 years free of Fanthom Team.", "Check eligibility →"],
  ["Get 10 free seats for nonprofits", "Because we know that doing good is hard enough. Let us help get you started.", "Apply here to qualify →"],
  ["Switching from Gong?", "Or something similar? Get Fanthom Business free through your contract plus data migration.", "Switch now →"],
];

export default function PricingPage() {
  return (
    <>
      <section className="py-16 text-center">
        <div className="container-x">
          <h1 className="h1 mx-auto max-w-[16ch]">Pricing to supercharge every meeting</h1>
          <PricingClient />
        </div>
      </section>

      <section className="py-16">
        <div className="container-x grid gap-6 lg:grid-cols-3">
          {offers.map(([t, body, cta]) => (
            <div key={t} className="rounded-3xl border border-white/12 bg-[#0b0b0c] p-8">
              <h3 className="h4 !font-medium">{t}</h3>
              <p className="p-small mt-3 text-offwhite/65">{body}</p>
              <Link href="/login" className="disp mt-5 inline-block text-[0.8rem] tracking-[0.1em] text-brand-cyan">{cta}</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <div className="kicker text-brand-cyan">Features</div>
          <h2 className="h2 mt-2 max-w-[20ch]">Meet your brilliant AI meeting partner</h2>
          <FeatureMatrix />
        </div>
      </section>

      <section className="arc-band py-24 text-center text-black">
        <div className="container-x">
          <h2 className="h2 mx-auto max-w-[20ch]">Ready to explore what&rsquo;s out there?</h2>
          <p className="p-regular mx-auto mt-4 max-w-xl text-black/75">
            Whether you&rsquo;d like to learn more about Fanthom, how it works for your team, or which plan is the best fit – our sales team is here to help.
          </p>
          <Link href="/app?demo=1" className="btn btn-black mt-8">Book a demo</Link>
        </div>
      </section>
    </>
  );
}
