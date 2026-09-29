import Link from "next/link";
import { Planet } from "@/components/site/Planet";
import { LogoMark } from "@/components/site/Logo";
import { ProductShot } from "@/components/site/ProductShot";
import { icons } from "@/components/site/IntegrationIcons";
import { HeroCards, CaptureCarousel, TeamsTabs, RoleCarousel } from "@/components/site/HomeInteractive";

const companies = ["HubSpot", "Adobe", "Zapier", "Grubhub", "Webflow", "Calendly", "Notion", "Ramp", "Vercel", "Loom"];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-12 pb-20 pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-24">
          <div>
            <h1 className="h1 max-w-[17ch]">AI notetaking that is out of this world</h1>
            <p className="p-regular mt-6 max-w-md text-offwhite/75">
              Fanthom summarizes your meetings so you can focus on the conversation.{" "}
              <span className="font-medium text-offwhite">Now available bot-free.</span>
            </p>
            <Link href="/login" className="btn btn-cyan mt-8">Get started – free forever</Link>
            <div className="p-small mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-offwhite/50">
              <span>SOC 2 Type II</span><span aria-hidden>|</span>
              <span>GDPR</span><span aria-hidden>|</span>
              <span>HIPAA Compliant</span><span aria-hidden>|</span>
              <span>SSO / SCIM</span>
            </div>
          </div>
          <HeroCards />
        </div>
      </section>

      {/* LOGO MARQUEE */}
      <section className="border-y border-white/5 py-8">
        <div className="container-x flex flex-col items-center gap-6 lg:flex-row">
          <div className="flex shrink-0 items-center gap-3 pr-6 lg:border-r lg:border-white/10">
            <span className="text-brand-yellow" aria-hidden>★★★★★</span>
            <div className="p-small text-offwhite/70">
              <div className="font-medium text-offwhite">5.0 / 5.0 · 6,500+ reviews</div>
              <div>Used at 300K+ companies</div>
            </div>
          </div>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
            <div className="animate-marquee flex w-max gap-12 py-2">
              {[...companies, ...companies].map((c, i) => (
                <span key={i} className="disp text-lg tracking-[0.12em] text-offwhite/40">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CAPTURE CAROUSEL over black→cyan gradient */}
      <section className="bg-[linear-gradient(180deg,#000_0%,#01293a_45%,#0d84b8_100%)] py-20">
        <div className="container-x">
          <CaptureCarousel />
        </div>
      </section>

      {/* TEAM OF 1 OR 1000 */}
      <section className="relative overflow-hidden py-24">
        <Planet size={430} className="absolute -left-52 top-40 opacity-90" />
        <div className="container-x relative">
          <h2 className="h2 mx-auto max-w-[24ch] text-center">
            Whether you&rsquo;re a team of 1 or 1,000, Fanthom&rsquo;s got your back
          </h2>
          <TeamsTabs />
        </div>
      </section>

      {/* CLARITY / MOMENTUM / EASE */}
      <section className="py-20">
        <div className="container-x grid gap-6 lg:grid-cols-3">
          {[
            ["Clarity", "Unforgettable meetings… quite literally", "Shockingly accurate transcripts, instant summaries, and action items with consistent quality across every call – delivered straight to your inbox, like magic.", "#00beff"],
            ["Momentum", "From talk to done", "Every commitment becomes an owned, dated action item the moment the call ends – no Monday archaeology required.", "#ffa8bb"],
            ["Ease", "Zero-click capture", "Joins from your calendar, or records bot-free with nothing visible in the room. You never think about it again.", "#fff58c"],
          ].map(([t, h, body, c]) => (
            <div key={t as string} className="rounded-3xl border border-white/10 bg-[#0b0b0c] p-8">
              <h3 className="h3 !text-[1.6rem]" style={{ color: c as string }}>{t}</h3>
              <div className="h4 mt-3 !text-[1.15rem] !font-medium">{h}</div>
              <p className="p-small mt-3 text-offwhite/65">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-16">
        <div className="container-x text-center">
          <h2 className="h2">Fanthom teams<br />work smarter</h2>
          <div className="mx-auto mt-12 grid max-w-4xl gap-10 sm:grid-cols-3">
            {[
              ["95% of users", "say Fanthom helps them stay fully present in meetings"],
              ["6+ hours saved", "per team member every week on follow-up work"],
              ["3X faster", "from meeting insights to actionable next steps"],
            ].map(([n, d]) => (
              <div key={n}>
                <div className="disp text-4xl text-brand-cyan">{n}</div>
                <p className="p-small mt-2 text-offwhite/65">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAKE YOUR TEAM UNSTOPPABLE */}
      <section className="py-24">
        <div className="container-x text-center">
          <div className="kicker text-brand-cyan">Shared understanding. Faster execution. Better results.</div>
          <h2 className="h2 mt-3">Make your team unstoppable</h2>
          <div className="mt-12"><ProductShot /></div>
          <Link href="/login" className="btn btn-cyan mt-12">Try Fanthom for your team</Link>
        </div>
      </section>

      {/* WORKS WHERE YOU MEET */}
      <section className="py-24">
        <div className="container-x text-center">
          <div className="kicker text-brand-yellow">Zero friction, maximum flexibility.</div>
          <h2 className="h2 mt-3">Works where you meet</h2>
          <div className="grid-bg relative mx-auto mt-14 h-[440px] max-w-4xl">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 440" fill="none" aria-hidden>
              {[[218, 105], [672, 84], [148, 235], [700, 208], [258, 356], [648, 352]].map(([x, y], i) => (
                <line key={i} x1="450" y1="220" x2={x} y2={y} stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" />
              ))}
              <path d="M300 40 L620 400 L450 60 L260 380 Z" stroke="rgba(245,82,0,0.5)" strokeWidth="1.5" fill="none" />
            </svg>
            <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black shadow-[0_0_120px_rgba(150,0,255,0.4)]">
              <LogoMark size={72} />
            </div>
            {[
              ["meet", "Google Meet", "left-[8%] top-[18%]"],
              ["slack", "Slack", "right-[10%] top-[12%]"],
              ["zoom", "Zoom", "left-[3%] top-[49%]"],
              ["teams", "Microsoft Teams", "right-[3%] top-[43%]"],
              ["gmail", "Gmail", "left-[10%] bottom-[12%]"],
              ["asana", "Asana", "right-[8%] bottom-[13%]"],
            ].map(([icon, label, pos]) => (
              <span key={label} className={`absolute ${pos} flex items-center gap-2 rounded-full bg-offwhite px-4 py-2 text-[0.85rem] font-medium text-black shadow-lg`}>
                {icons[icon]} {label}
              </span>
            ))}
          </div>
          <p className="p-large mx-auto mt-10 max-w-[28ch] text-offwhite/90">
            Fanthom adapts to your workflow, not the other way around.
          </p>
        </div>
      </section>

      {/* EVERY TEAM IN FLOW */}
      <section className="py-24">
        <div className="container-x text-center">
          <div className="kicker text-brand-yellow">Empower your team&rsquo;s best work with seriously accurate AI notetaking</div>
          <h2 className="h2 mt-3">Every team in flow</h2>
          <Link href="/login" className="btn btn-cyan mt-8">Get started. It&rsquo;s free.</Link>
        </div>
        <RoleCarousel />
      </section>

      {/* BOTTOM CTA */}
      <section className="arc-band py-28 text-center text-black">
        <div className="container-x">
          <div className="kicker font-medium">Never miss what matters</div>
          <h2 className="h2 mx-auto mt-3 max-w-[18ch]">Stop guessing. Ask Fanthom. Start today, for free.</h2>
          <Link href="/login" className="btn btn-black mt-9">Get started. It&rsquo;s free.</Link>
        </div>
      </section>
    </>
  );
}
