import Link from "next/link";
import { Planet } from "@/components/site/Planet";
import { LogoMark } from "@/components/site/Logo";
import { ProductShot } from "@/components/site/ProductShot";
import { icons } from "@/components/site/IntegrationIcons";
import { HeroCards, CaptureCarousel, TeamsTabs, RoleCarousel } from "@/components/site/HomeInteractive";
import { Reveal, SplitHeading, Scramble, Parallax, ScaleIn, CountUp } from "@/components/site/Fx";
import { Stars, MarqueeBanner } from "@/components/site/Canvases";
import { GradientParallax, Bob } from "@/components/site/Fx";
import { SpaceFigure, MiniShip } from "@/components/site/HeroArt";
import { BubbleField } from "@/components/site/Bubbles";

const companies = ["HubSpot", "Adobe", "Zapier", "Grubhub", "Webflow", "Calendly", "Notion", "Ramp", "Vercel", "Loom"];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <Stars count={110} layers={2} />
        <div className="container-x relative pb-20 pt-16 lg:pb-28 lg:pt-24">
          <div className="relative z-10 max-w-[1100px]">
            <SplitHeading as="h1" text="AI notetaking that is out of this world" className="h1 max-w-[15ch]" />
            <Reveal delay={420}><p className="p-regular mt-2 max-w-md text-offwhite/75">
              Fanthom summarizes your meetings so you can focus on the conversation.{" "}
              <span className="font-medium text-offwhite">Now available bot-free.</span>
            </p></Reveal>
            <Reveal delay={560}><Link href="/login" className="btn btn-cyan mt-8"><Scramble text="Get started – free forever" /></Link></Reveal>
            <Reveal delay={700}><div className="p-small mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-offwhite/50">
              <span>SOC 2 Type II</span><span aria-hidden>|</span>
              <span>GDPR</span><span aria-hidden>|</span>
              <span>HIPAA Compliant</span><span aria-hidden>|</span>
              <span>SSO / SCIM</span>
            </div></Reveal>
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

      {/* CAPTURE CAROUSEL over parallaxing cyan gradient (inventory #5) */}
      <section className="relative overflow-hidden py-20">
        <GradientParallax className="absolute inset-x-0 -top-[45%] h-[190%] bg-[radial-gradient(ellipse_70%_55%_at_50%_60%,#0d84b8_0%,#01293a_55%,transparent_100%)]" />
        <Stars count={70} layers={1} />
        <div className="container-x relative">
          <CaptureCarousel />
        </div>
      </section>

      {/* MARQUEE BANNER (inventory #10) */}
      <MarqueeBanner className="border-y border-white/5 py-6" speed={80}>
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className="flex items-center gap-10 pr-10">
            <span className="h2 whitespace-nowrap !text-[3.4rem] text-offwhite">Move work forward faster</span>
            <MiniShip width={110} />
          </span>
        ))}
      </MarqueeBanner>

      {/* TEAM OF 1 OR 1000 */}
      <section className="relative overflow-hidden py-24">
        <Parallax speed={0.18} className="absolute -left-52 top-40">
          <Planet size={430} className="opacity-90" />
        </Parallax>
        <Stars count={80} layers={1} />
        <div className="container-x relative">
          <SplitHeading text="Whether you’re a team of 1 or 1,000, Fanthom’s got your back" className="h2 mx-auto max-w-[24ch] text-center" />
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
          ].map(([t, h, body, c], ci) => (
            <Reveal key={t as string} delay={ci * 130} className="rounded-3xl border border-white/10 bg-[#0b0b0c] p-8">
              <h3 className="h3 !text-[1.6rem]" style={{ color: c as string }}>{t}</h3>
              <div className="h4 mt-3 !text-[1.15rem] !font-medium">{h}</div>
              <p className="p-small mt-3 text-offwhite/65">{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STATS — offwhite band; on the reference this variant renders on mobile
          only (desktop section is collapsed), stat circles with gradient trails */}
      <section className="relative bg-offwhite py-16 text-black lg:hidden">
        <div className="text-center">
          <SplitHeading text="Fanthom teams work smarter" className="h2 mx-auto max-w-[12ch] !text-black" />
          <div className="mt-10 space-y-10">
            {[
              ["95% of users", "say Fanthom helps them stay fully present in meetings", "#f55200", "left"],
              ["6+ hours saved", "per team member every week on follow-up work", "#ffa8bb", "right"],
              ["3X Faster", "from meeting insights to actionable next steps", "#00beff", "left"],
            ].map(([n, d, c, side]) => (
              <Reveal key={n} className="relative">
                <div
                  className="absolute inset-y-4 w-3/5 opacity-50"
                  style={{ [side === "left" ? "left" : "right"]: 0, background: `linear-gradient(${side === "left" ? "90deg" : "270deg"}, ${c}55, transparent)` }}
                  aria-hidden
                />
                <div
                  className="relative mx-auto flex h-52 w-52 flex-col items-center justify-center rounded-full px-6 text-center"
                  style={{ background: c as string }}
                >
                  <div className="text-[1.35rem] font-medium leading-tight">{n}</div>
                  <p className="mt-1.5 text-[0.85rem] leading-snug">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MAKE YOUR TEAM UNSTOPPABLE */}
      <section className="relative overflow-hidden py-24">
        <Stars count={90} layers={2} />
        <div className="container-x relative text-center">
          <div className="kicker text-brand-cyan"><Scramble text="Shared understanding. Faster execution. Better results." /></div>
          <SplitHeading text="Make your team unstoppable" className="h2 mt-3" />
          <ScaleIn className="mt-12"><ProductShot /></ScaleIn>
          <Link href="/login" className="btn btn-cyan mt-12">Try Fanthom for your team</Link>
        </div>
      </section>

      {/* WORKS WHERE YOU MEET */}
      <section className="py-24">
        <div className="container-x text-center">
          <div className="kicker text-brand-yellow"><Scramble text="Zero friction, maximum flexibility." /></div>
          <SplitHeading text="Works where you meet" className="h2 mt-3" />
          <BubbleField className="grid-bg relative mx-auto mt-14 h-[440px] max-w-4xl">
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
              <span key={label} data-bubble className={`absolute ${pos}`}>
                <span data-bubble-pill className="flex items-center gap-2 rounded-full bg-offwhite px-4 py-2 text-[0.85rem] font-medium text-black shadow-lg">
                  {icons[icon]} {label}
                </span>
              </span>
            ))}
          </BubbleField>
          <Reveal><p className="p-large mx-auto mt-10 max-w-[28ch] text-offwhite/90">
            Fanthom adapts to your workflow, not the other way around.
          </p></Reveal>
        </div>
      </section>

      {/* EVERY TEAM IN FLOW */}
      <section className="py-24">
        <div className="container-x text-center">
          <div className="kicker text-brand-yellow"><Scramble text="Empower your team’s best work with seriously accurate AI notetaking" /></div>
          <SplitHeading text="Every team in flow" className="h2 mt-3" />
          <Link href="/login" className="btn btn-cyan mt-8">Get started. It&rsquo;s free.</Link>
        </div>
        <RoleCarousel />
      </section>

      {/* BOTTOM CTA */}
      <section className="arc-band py-28 text-center">
        <div className="container-x">
          <div className="kicker font-medium text-black"><Scramble text="Never miss what matters" /></div>
          <SplitHeading text="Stop guessing. Ask Fanthom. Start today, for free." className="h2 mx-auto mt-3 max-w-[18ch] !text-offwhite" />
          <Link href="/login" className="btn btn-black mt-9 !text-brand-yellow">Get started. It&rsquo;s free.</Link>
        </div>
      </section>
    </>
  );
}
