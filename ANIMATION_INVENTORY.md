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
