# Animation & Interaction Inventory — fathom.ai (audited 2026-09-29)

Method: loaded fathom.ai in headless Chromium at 1440/768/390, read all 43 inline scripts
and the compiled stylesheet, sampled computed styles at runtime (load sequence, hovers,
sticky positions), and diffed full-page screenshots. Parameters below are extracted, not
eyeballed. Reference material (assets, scripts, probe JSON) is kept in an uncommitted
local reference folder; proprietary creative (their illustrations, planet video, TT Rounds
font) is not redistributed in this repo — equivalents are rebuilt, everything measurable
is matched.

## Stack (confirmed from loaded bundles)

| Piece | Version / source |
|---|---|
| Site builder | Webflow (`fathomai.shared.*.css`, jQuery 3.5.1) |
| Animation | GSAP 3.15.0 + ScrollTrigger + SplitText + ScrambleTextPlugin |
| Smooth scroll | Lenis 1.0.42 (`@studio-freight/lenis`), desktop ≥992px only |
| Carousels | Slick 1.8.1 (role cards) + Swiper 11 (capture carousel) |
| Fonts | Sora 300/400/500 (woff2), TT Rounds Neue Cond Md (ttf), webflow-icons |
| Canvas FX | Hand-written: starfields, hover grid, marquee engine |

## Global behaviors

1. **Smooth scroll** — Lenis with default options, created only under
   `(min-width: 992px)` via `gsap.matchMedia`, destroyed below it. `window.lenis` exposed.
2. **Nav state swap** — `[data-btn-swap]` flips `top→scrolled` when scrollY ≥ **80px**
   (rAF-throttled, listens to Lenis scroll when present). Nav bar is `position: sticky; top: 0`.
3. **Reduced motion** — bubbles timeline jumps to `progress(1)` and kills; marquee engine
   does not start its timer; everything else relies on GSAP defaults (no global disable).
4. **No preloader, no page transitions, no custom cursor** (checked: none present).

## Numbered inventory

| # | Element / selector | Trigger | Properties | Duration | Easing | Stagger / notes |
|---|---|---|---|---|---|---|
| 1 | `h1[data-transition-typewriter]` (hero) | page load, delay **0.7s** (`data-tt-delay` overridable) | SplitText chars `autoAlpha 0→1` | **0.2s**/char | power1.out | stagger **0.04**/char (32 chars ⇒ ~1.5s total). Later instances trigger at `top 80%`, once |
| 2 | `[data-scramble="scroll"]` kickers (10 on home) | ScrollTrigger `top bottom`, **once** | per-**word** scrambleText, charset upperCase (alt: `#$!`), scramble speed 0.4 | **1s**/word | gsap default (power1.out) | word stagger **0.015**; SplitText reverted onComplete |
| 3 | `.image_astronaut` | immediately, loops | `y: -14px` | **3s** | sine.inOut | yoyo, repeat -1 (all devices) |
| 4 | `[data-anim="stars"]` canvases (8 wraps, 1–2 layers each) | paint on load (all devices); motion ≥992px | static starfield draw (80% `rgba(250,245,245,.45)`, 20% `#bfe8ff`, shadowBlur 8, ~5% twinkle overlays); pointer parallax `x,y = mouse offset × depth`, depth = (layer+1)×6px; idle drift `+=(i+1)×2px x / +=(i+1)×1px y` | parallax tween 0.6s; drift **20s** | drift: none (linear), yoyo repeat -1 | canvas per layer, `data-count` stars (default 100, r 0.6–1.8) |
| 5 | `.swiper-gradient-bg` (capture carousel bg) | scrub, `top bottom → bottom top` | `y: 0 → +90vh` (moves down = parallax) | scrub **1** | none | |
| 6 | `.planet-lottie video.planet-video` (purple planet) | scrub, `top bottom → bottom top`, ≥992px | `video.currentTime: 0 → duration` | scrub **2** | none | below 992px: static first frame. Source: `planet-full-crf32.mp4` |
| 7 | `[data-anim="card"]` | ScrollTrigger.batch onEnter, once | `yPercent 20→0, opacity 0→1` | **0.6s** | power2.out | batch stagger **0.4** (not on home; other pages) |
| 8 | `.bubble_container` ×6 (integrations map) | `.center_wrapper` at `top 70%`, once | per container: `.bubble_wrapper opacity 0, scale 0.6 → 1` then `.bubble_line-wrapper scale 0→1` | bubble **0.6s**, line **0.5s** | power2.out both | containers **shuffled**, stagger **0.18s**; reduced-motion ⇒ jump to end |
| 9 | `.grid-section` hover grid canvas | ≥992px only, rAF loop | mouse paints 80px cells: current cell opacity 120/255, neighbors spawn at p=0.9, fade −1/frame, stroke = linear-gradient stops `#FFA8BB 0% → #F55200 33% → #9600FF 66% → #FFF58C 100%`, globalAlpha × **0.6** | continuous | — | canvas appended to section; removed below 992px |
| 10 | Marquee banner (`[data-banner-mode="marquee"]`, "Move work forward faster ✦ 🚀") | on load; paused if reduced-motion | track `translateX` loop, distance = content width, duration = `max(6, width / speed)` s, speed default **80 px/s** | computed | linear | clones content until ≥ container + track width; pauses on hover/focus (slider mode) |
| 11 | Capture carousel (Swiper 11) | user / autoplay | slide transitions, pagination dots, prev/next arrows | swiper defaults | — | gradient bg behind it is #5 |
| 12 | Role cards (Slick, `.slider_center`) | arrows `.arrow_prev-c/.arrow_next-c` | 3 slides desktop / 2 tablet (≤990) / 1 mobile (≤660), centerMode, centerPadding 10px, swipeToSlide | slick default 300ms | slick default | second slick: `[data-slider="true"]`, infinite: false |
| 13 | Sticky title sequence (`[data-sticky-title]`) | wrap `top 40% → bottom bottom`, scrub true | chars `autoAlpha` in (stagger amount 0.7 from start), then out (0.7 from end); heading blocks overlap −0.15 | scrub | default | on inner pages; build lazily at `top 150%` |
| 14 | Pinned stats (`.sticky-trigger` + `.stats_wrapper`) | `top top`, `end +=200%`, **pin**, scrub 1, ≥992px | per item: item opacity, `.stats_trail scaleY 0→1, opacity→0.3` (origin bottom), `.stats_circle y from-below→0, opacity 0→1` | D=0.9 each, overlap 0.63 | power3.out | anticipatePin 1; not on home |
| 15 | Nav link hover | :hover | `color offwhite → #00beff` | 0.3s | cubic-bezier(.25,.46,.45,.94) | |
| 16 | Footer link hover | :hover | color | 0.35s | cubic-bezier(.25,.46,.45,.94) | |
| 17 | `.button.grad` (cyan pill) hover | :hover | `all` (gradient shift) | 0.2s | ease | radius 56px |
| 18 | `.button.yellow-border` hover | :hover | all | 0.35s | ease | bottom CTA button |
| 19 | Slick arrows hover | :hover | `scale 1 → 0.9` (matrix −0.9) | 0.3s | cubic-bezier(.25,.46,.45,.94) | prev is mirrored (scaleX −1) |
| 20 | Integration card hover (integrations page) | :hover | background-color | 0.35s | cubic-bezier(.19,1,.22,1) | |
| 21 | `@keyframes spin` | (utility) | rotate 0→360 | — | — | only non-Webflow keyframe in CSS |

## Breakpoint behavior (≥992 / <992)

Desktop-only: Lenis (#global-1), planet scrub (#6), stars drift+parallax (#4 motion),
hover grid (#9), pinned stats (#14). Always-on: typewriter (#1), scramble (#2),
astronaut bob (#3), static star paint (#4), card reveals (#7), bubbles (#8), marquee (#10).
Slick breakpoints: 990 and 660.

## Phase 3 verification (2026-09-29, headless Chromium against the localhost build)

Method per item: runtime assertions (computed opacity/transform sampling, canvas
presence, CSS variable readback) plus full-page screenshot diffing at 1440/768/390.
Zero console errors at all three widths.

| # | Item | Status | Evidence / notes |
|---|---|---|---|
| G1 | Lenis smooth scroll ≥992px | **matched** | `window.lenis` present at 1440, reverted below 992 via matchMedia |
| G2 | Nav swap at 80px | **matched** | `data-btn-swap` reads `top` → `scrolled` past the threshold |
| 1 | Hero typewriter | **matched** | 32 char spans; last char opacity 0→1 after delay+stagger; 0.2s / 0.04 / power1.out; later headings at top 80% once |
| 2 | Scramble kickers | **matched** | per-word 1s, stagger 15ms, uppercase charset, asserted to settle to exact text |
| 3 | Astronaut bob | **matched** | y −14px, 3s sine.inOut yoyo, applied to our original space-figure art |
| 4 | Starfields | **matched** | canvases across hero/carousel/plans/flow; static paint everywhere; 20s drift + pointer parallax depth (i+1)×6 desktop only |
| 5 | Gradient parallax | **matched** | y → +90vh, scrub 1, `top bottom → bottom top` |
| 6 | Planet scrub | **matched (equivalent)** | reference scrubs a video's currentTime (scrub 2, ≥992px); ours scrubs rotation of an original SVG planet on the identical trigger — their video asset is not shipped |
| 7 | Card reveals | **matched** | yPercent 20→0, 0.6s power2.out, batch stagger 0.4 |
| 8 | Integration bubbles | **matched** | shuffled stagger asserted mid-flight (one pill at 0.58 while others 0), 0.6s pop + 0.5s line, stagger 0.18, top 70% once |
| 9 | Hover grid | **matched** | 80px cells, brand-gradient strokes, fade 1/frame, desktop-only canvas; idles on home since the offwhite band is mobile-only, as on the reference |
| 10 | Marquee banner | **matched** | duration = distance / 80px·s⁻¹ (computed ≈31.3s), linear loop, cloned track, reduced-motion pause |
| 11 | Capture carousel | **partial** | React carousel with slide-in, dots and arrows; Swiper's drag physics not replicated |
| 12 | Role cards slider | **partial** | center carousel, 300ms slide, audited arrow hover scale .9; slick infinite drag not replicated |
| 13 | Sticky title sequence | **n/a on home** | zero instances on the live homepage per audit |
| 14 | Pinned stats | **n/a on home** | live homepage shows stats only in the mobile variant (desktop section collapsed); clone mirrors it with circle + gradient-trail styling, mobile-only |
| 15–19 | Hover transitions | **matched** | nav 0.3s cubic-bezier(.25,.46,.45,.94) → cyan, footer 0.35s, buttons all .2s, arrows scale .9 |
| 20 | Integration card hover | **n/a** | integrations listing page out of scope |
| 21 | spin keyframe | **n/a** | utility, unused on audited pages |

Known remaining differences: substitute display font (Oswald in place of the commercial
TT Rounds Neue Cond), original artwork in place of proprietary illustrations/video,
carousel drag physics (#11, #12), and a longer mobile page (equivalent stack, spacing
not yet tuned per-section below 768).
