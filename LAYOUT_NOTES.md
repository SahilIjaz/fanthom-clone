# Layout Notes — fathom.ai (measured at 1440 / 768 / 390, 2026-09-29)

## Typography (computed at 1440)

| Role | Font | Size | Weight | Letter-spacing | Color |
|---|---|---|---|---|---|
| H1 hero | Sora | 78.4px | 300 | −2.5px | #faf5f5 |
| H2 | Sora | 56.8px | 300 | −1.92px | #faf5f5 (black on offwhite section) |
| H3 / small H2 | Sora | 43.2px | 300 | −1.44px | #faf5f5 |
| Body | Sora | 16–18px | 300/400 | normal | offwhite at ~70% |
| Kickers (`✦ …`) | Sora | ~15px (`text-size-tiny sub`) | 400 | — | cyan / yellow / pink per section |
| Buttons | Sora (uppercase) | 17.4px | 500 | — | black on #00beff, radius 56px |
| Display caps (stats, banner) | TT Rounds Neue Cond Md → substitute Oswald | — | 500 | +.03em | — |

Fluid clamps from CSS custom props: `--h1: clamp(3.5rem → 5.5rem)`, `--h2: clamp(2.5 → 4rem)`,
`--h3: clamp(2 → 3rem)`, `--p-regular: clamp(1 → 1.125rem)` (interpolated between 20rem and
120rem viewport). Buttons: radius 56px, padding ≈ 17px 30px.

## Palette (CSS custom properties)

black #000, off-black #191919, offwhite #faf5f5, cyan #00beff, pink #ffa8bb,
purple #9600ff, orange #f55200, yellow #fff58c. Grid-hover gradient: pink→orange→purple→yellow.

## Homepage section order (1440, top → bottom)

1. **Superhuman banner** — offwhite strip, uppercase display text, arrow.
2. **Sticky nav** — `sticky top:0`, transparent over black, logo left, center links
   (Overview, Solutions ▾, Integrations ▾, Resources ▾, Pricing), right: Book a Demo,
   Log In, SIGN UP FREE white pill; swaps state at 80px scroll.
3. **Hero** (`section_hero-3`, black, starfield canvas) — left column: H1 (typewriter),
   sub-paragraph, cyan CTA, compliance row (SOC 2 | GDPR | HIPAA | SSO/SCIM). Right:
   floating UI chat cards + astronaut illustration (bobbing) + small planet. Height ≈ 842px.
4. **Logo strip** — G2 stars 5.0, "Used at 300K+ companies", logo marquee (speed 80px/s).
5. **Capture carousel** (`section_tabs padding-xl`) — Swiper, 2 visible dark cards over a
   cyan gradient bg div that parallaxes down (+90vh, scrub 1). 4 slides: bot-free capture,
   instant summaries, LLM integrations, topic monitoring.
6. **Marquee banner** — "Move work forward faster ✦ <spaceship illustration>" repeating,
   80px/s, offwhite text on black, between sections.
7. **Teams/individuals** (`section_plans`, ≈792px) — H2 center, purple swirl planet left
   edge (scroll-scrubbed video ≥992px), tab card `#0b0b0c` radius ~24px: yellow active tab
   with underline, copy + 4 icon features (2×2), SEE OUR PRICING cyan pill.
8. **"Fathom teams work smarter"** (`grid-section`, **offwhite bg, black text**) — H2 +
   3 stat blocks; interactive hover grid canvas (80px cells, brand gradient strokes).
   Hidden variant used on mobile (`section_teams--mobile`).
9. **"Make your team unstoppable"** (`section_flow`, ≈885px) — cyan kicker (scramble),
   H2 56.8px, large product recap screenshot on starfield.
10. **"Works where you meet"** (`section_integrations`, ≈923px) — yellow kicker, H3 43.2px,
    node map: center logo circle, 6 white pill bubbles (Google Meet, Slack, Zoom, Teams,
    Gmail, Asana) with connector lines, animated in shuffled order (#8), orange wireframe
    triangle + faint purple grid, closing line "Fathom adapts to your workflow…" (p-large).
11. **"Every team in flow"** (`section_flow`, ≈893px) — yellow kicker, H3, cyan CTA, Slick
    center-mode carousel of 6 role cards (Sales, CS, Marketing, Operations, HR, Product),
    pink circular arrows top-right, pink kicker + illustration per card.
12. **Bottom CTA** (`section_cta gradient_pink-purple`, ≈600px) — pink→purple radial-arc
    band, kicker, H3 **offwhite**, button **yellow text** variant.
13. **Footer** (`#191919`, ≈662px) — 6 link columns (Product, Company, Solutions,
    Integrations, Competitors, Resources), TRY FATHOM TODAY cyan pill, legal row.

## Breakpoints

- Webflow defaults: 991 (tablet), 767, 478. Slick switches at 990 → 2 slides, 660 → 1.
- <992: Lenis off (native scroll), planet static, stars static, no hover grid, pinned
  sections unpinned; hero becomes single column, nav collapses to hamburger.
- 768: H1 ≈ 60px; sections stack, tab card padding shrinks. 390: H1 ≈ 3.5rem floor,
  buttons full-width in hero, carousels 1-up.

## Notable structure details

- Starfield canvases sit inside 8 wrappers across hero/tabs/plans/flow/integrations/CTA.
- Section vertical rhythm: `padding-xl` ≈ 48px block padding; big sections rely on inner
  min-heights rather than section padding.
- Bottom CTA + pricing CTA share the arc treatment: repeating radial rings over
  pink→purple gradient, origin bottom center.
