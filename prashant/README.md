# Prashant Gupta — Portfolio

Personal portfolio of **Prashant Gupta**, Unity Game Developer (Mobile · VR/AR · Multiplayer · Web3) — currently **Senior Game Developer at Sloppy Studios**.

**🌐 Live site:** https://prashant-portfolio-black-sigma.vercel.app/
**📄 CV:** [`/cv`](https://prashant-portfolio-black-sigma.vercel.app/cv) — branded, print-optimized page; the PDF is generated from it
**🕹️ Arcade:** the site contains **10 playable mini-games** written from scratch in vanilla JS

---

## Featured shipped titles

| Title | Platform | Rating | Store |
| --- | --- | --- | --- |
| Newton's Playground: Physics Sandbox | Meta Quest VR | ★4.9 · 15,000+ reviews | [Meta Horizon Store](https://www.meta.com/en-gb/experiences/newtons-playground-physics-sandbox/24802835455982621/) |
| Metaspace | Android / iOS | ★4.6 (App Store) | [Google Play](https://play.google.com/store/apps/details?id=com.MetaspaceTechnologiesPrivateLimited.Metaspace) · [App Store](https://apps.apple.com/in/app/metaspace-game/id6462402154) |
| Oceanside Whispers | PC (Steam) | 2026 release | [Steam](https://store.steampowered.com/app/4108420/Oceanside_Whispers/) |

## Live products featured

- **ARRISE** — WebAR advertising platform (AR image tracking in the browser): https://ar.rionick.com/
- **QuotePro** — interactive proposals & quotations SaaS: https://quote-pro-saa-s.vercel.app/
- **MultiLingo** — file translation into 100+ languages (CSV/Excel/JSON/XML): https://multilingo-wkh3.onrender.com/

---

## Site anatomy

One-page static site (no build step) based on the Imroz HTML template with a substantial custom layer on top.

| Section | What's in it |
| --- | --- |
| Hero | Particle constellation (particles.js), typing role rotator, store-presence chips (Play / App Store / Quest / Steam), custom dark gradient background |
| About | Clickable platform-tagged game covers, **live WebAR demo gallery** (5 real ARRISE client posters — Vice Streets, One8, King of Gluttony, India Post, FIFA 2026 — each with a crisp per-demo QR chip, lightbox enlarge and scan-and-point instructions; desktop-only), checkmark quick-facts grid, signature quote card |
| Skills tabs | 6 icon skill cards (32 tech chips), Experience & Education as visual timelines |
| Services | 6 offer cards (mobile, VR/AR, multiplayer, performance, SDKs/LiveOps, Web3) |
| **The Build Pipeline** | "How I work" as an animated CI-style pipeline: 5 stage cards (Discovery → Prototype → Production Sprints → Polish & Launch → LiveOps) on a rail that fills as stages pass — the LiveOps stage stays amber/pulsing ("ongoing") — each card ending in a "You get:" deliverable line, plus a macOS-style terminal that types a mock build log (`$ prashant --start "your-game"`). Scroll-triggered via IntersectionObserver; no-JS and reduced-motion visitors get the fully-completed static state |
| Career Highlights | Odometer counters (5+ yrs, 3+ titles, 4 platforms, 15k+ reviews) |
| Featured band | Newton's Playground spotlight with ★4.9 badge and store CTA |
| **Player reviews wall** | "15,000 Players Have Spoken" — 8 real 5-star reviews quoted **verbatim from verified owners** on the Meta Horizon Store (fetched from the live store page, usernames kept), in a two-row pure-CSS marquee (rows scroll opposite directions, hover pauses, edge fade mask, duplicate sets `aria-hidden`); stat chips: 4.9★ · 15K ratings · 92% five-star · Top seller. Reduced-motion: static wrapped grid |
| Portfolio grid | 3×3: shipped games, live products, branded open-source covers + "Your Project Here" CTA card |
| **The Mini Arcade** | 10 playable canvas games — see below |
| **The Neon Room** (`/neon`) | Standalone physics toy — see below |
| **Plan Your Build estimator** | Playful project configurator: pick platform → project type → optional features (chips); a sticky "Project Spec" panel live-updates a ballpark timeline (`weeks × 1.35` upper bound), always promises "prototype in your hands: Week 1", and the CTA opens WhatsApp with the full spec pre-written — turns visitors into structured leads without a form |
| Contact | Two-column form with project-type selector feeding a prefilled WhatsApp message + availability card (status, quick facts, WhatsApp/GitHub/LinkedIn) |

## The Mini Arcade

`assets/js/arcade.js` — a small game **engine** plus 10 game modules, all hand-written vanilla JS (no libraries).

**Engine (core)** owns: canvas + game loop, tab switching, pointer/keyboard routing, particle system, screen shake, game-over overlay with click-to-restart, per-game **localStorage high scores**, achievement toasts, **fullscreen mode** (native API + iOS pseudo-fullscreen fallback), **haptic feedback** (`navigator.vibrate`) and a **virtual pointer** for mobile: games flagged `steer: true` are driven by relative "trackpad" drags (1.55× boost, the finger never covers the action) or by **gyroscope tilt steering** (opt-in 🧭 button, iOS permission flow, auto-calibrates to how the phone is held, orientation-aware axis remap).

**Games** register via `window.ARCADE.register(module)` with a fixed contract (`start/step/draw` + optional pointer/key hooks, everything driven through an `api` object — no DOM access inside game modules):

| # | Game | Genre | Twist |
| --- | --- | --- | --- |
| 1 | 🧲 Physics Sandbox | physics toy | spawn/drag/fling bodies, Earth/Moon/Zero-G |
| 2 | 🏗️ Stack Tower | precision stacker | overhang slicing, PERFECT combos |
| 3 | ⚡ Lag Runner | endless runner | jump lag spikes, fake FPS counter |
| 4 | 🐛 Bug Hunter | clicker defense | protect `build.exe`, integrity bar |
| 5 | 🚀 Asteroid Dodge | survival dodger | graze bonuses, shield pickups |
| 6 | 🧠 Tech Memory | memory pairs | match the real tech stack |
| 7 | 🧺 Commit Catcher | paddle catch | catch commits, dodge `<<<< HEAD` |
| 8 | 💧 Leak Popper | risk/reward popper | RAM meter, OUT OF MEMORY crash |
| 9 | 🏓 Packet Pong | pong vs AI | SYN/SYN-ACK/ACK serve, SERVER TIMEOUT |
| 10 | 👾 Spam Blaster | fixed shooter | @-bot waves, golden UNSUBSCRIBE bot |

Easter eggs: Konami code (↑↑↓↓←→←→BA) confetti achievement, per-game first-time achievements, "Game hopper" (3 games) and "FULL CLEAR" (all 10).

Hiring hook: once per visit, from the second game over onward, a "Let's build yours →" card slides over the game-over screen linking to the contact section (exits fullscreen first so the page can scroll).

**Global leaderboard** (Firebase Firestore + Anonymous Auth, lazy-loaded ESM from gstatic — zero impact on page load): **one best row per player**. Each browser gets an invisible anonymous uid; the player's document id IS the uid (`lb/{game}/scores/{uid}` — no composite indexes needed), so a higher score updates your row in place and one player can never flood the board. Finishing below your own record skips the initials screen entirely. Skippable 3-letter arcade-style initials entry (keyboard or tap arrows, remembered, profanity blocklist); per-game **worldwide Top 10** via the 🏆 HUD button with "← YOU" highlighting and a "Top 10 needs N+" goal line. Security rules verified live: create/update only your own uid-doc, updates must strictly increase the score, field set/initials format/score bounds validated, deletes forbidden — hijack, fake-board and delete attacks all denied in testing. 60s client cache (~10 doc reads per board view); fails soft to "LEADERBOARD OFFLINE" + local best.

**Online 1v1 (Packet Pong)** — `assets/js/netplay.js`: real-time PvP over a **WebRTC DataChannel**, with Firebase Firestore used purely as the signaling server (SDP/ICE handshake docs in `netplay/{room}`; no game traffic touches the server). "🏓 Host a match" mints a 4-character room and **freezes the local game** behind a lobby panel (room code, copy-invite-link button with copied feedback, animated waiting state) — you can no longer lose an AI match while waiting. Joining works two ways: opening the invite link (`?vs=CODE`) auto-joins, or "🔗 Join a code" opens a 4-slot code entry (type it or tap ▲▼) so two devices can connect by reading four characters aloud. Lobby input takes priority over the start/pause overlays, and a connecting match force-starts play. Netcode: **host-authoritative** simulation (ball, bounces, scoring) broadcast at ~30 Hz in normalized coordinates so both sides can run different canvas sizes; the guest streams its paddle position, interpolates the incoming state and renders the mirrored court, with hit/score effects driven by host events. Falls back to the AI opponent on disconnect, timeout, unsupported browsers or strict NATs (no TURN relay).
assets/js/neon.js           the Neon Room physics toy (neon.html)

## The Neon Room (`/neon`)

`neon.html` + `assets/js/neon.js` — a standalone, full-screen **physics toy** in the spirit of the classic "don't touch it" web toys, built from scratch on Canvas 2D + WebAudio (no libraries):

- A neon **OPEN** sign in the brand pink hangs from the ceiling on two chains. The sign is a Verlet rigid body (4 corners, 6 rods) on **slack-able ropes**: grab it to swing it, and it tilts because the chains converge toward the ceiling. Chains that go slack and snap taut *clank*.
- The sign is the **only light in the room**: a canvas darkness layer with a soft hole around the sign reveals the headline underneath ("Please don't shoot the sign."), so switching the neon off leaves the copy in the dark. The page exposes the light level as a CSS variable (`--lit`) for the text glow.
- A **rocker switch** on the right wall powers the sign with a real neon flicker-on sequence (per-tube random gating + transformer hum synthesized with WebAudio, occasional stutters while steady).
- A **slingshot** in the corner (pull back, trajectory preview, release) fires pebbles. Each letter is a single-stroke neon tube; a hit **shatters that tube** (sparks, glass shards, screen shake, a crack drawn into the tube) and shoves the sign. Hitting the switch toggles it ("trick shot"). Break all four letters and the copy flips to "Well. Now it's closed." with a *fix the sign* button.
- **Hover buzz**: resting the pointer on the sign (or holding it on touch) swells the hum into a crackling electric buzz, and the tube under the pointer sizzles brighter. The header OPEN chip on the home page plays a short zap on hover too (after the page has had a click, per browser autoplay rules; muted if the neon room was muted).
- HUD: state, shots, tubes broken, sound toggle (remembered), local clock, keyboard shortcuts (space = switch, r = repair, m = mute). Mobile: bigger grab zones, portrait layout, `pointer: coarse` hints. Reduced-motion visitors get fades instead of flicker and no shake.

Linked from the site via the glowing **OPEN** chip in the header and a line under the Mini Arcade.

## Key files

```
index.html                  main one-page site
cv.html                     CV page (source of truth for the PDF)
vercel.json                 clean URLs (/cv), caching + security headers
robots.txt / sitemap.xml    SEO
assets/css/custom.css       entire custom design layer (versioned ?v=N)
assets/js/custom.js         nav fix, typing rotator, hero particles, Konami
assets/js/arcade.js         arcade engine + 10 game modules
assets/js/netplay.js        WebRTC 1v1 link (Firestore signaling) for online Pong
assets/images/logo/logo-mark.svg   custom "P + play button" brand mark
assets/images/portfolio/*   store art, live-site screenshots, branded covers
assets/images/ar-targets/*  ARRISE client posters (compressed) + per-demo QR SVGs
assets/cv/*.pdf             generated CV PDF
```

## Performance & accessibility

- Arcade sim **pauses off-screen** (IntersectionObserver); DPR capped at 1.5 on mobile / 2 on desktop; `desynchronized` canvas context
- Portrait-friendly canvas on phones; steering games use relative trackpad-style touch drags (or tilt) so the finger never covers the ship; ≥38px touch targets; arcade tab strip is a horizontal snap-scroll on phones (auto-centers the active tab)
- Hero typing rotator reserves the height of the longest role via an invisible sizer — zero layout shift while it types/deletes; fluid `clamp()` heading sizes on phones
- `prefers-reduced-motion` disables screen shake and hero particles
- Lazy + async-decoded images; cache-busting query params on custom assets
- Card text readability: permanent scrim + frosted-glass (backdrop blur) hover overlays

## SEO / sharing

Open Graph + Twitter cards (custom og-cover), JSON-LD `Person` schema (worksFor Sloppy Studios, sameAs store links), canonical URLs, robots.txt + sitemap.xml.

## Development

Run locally (any static server):

```bash
python3 -m http.server 8000
```

**Regenerate the CV PDF** after editing `cv.html` (uses headless Chrome, server must be running):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu \
  --no-pdf-header-footer --print-to-pdf="assets/cv/Prashant_Gupta_Resume_2026.pdf" \
  "http://localhost:8000/cv.html"
```

**Cache busting:** when editing `custom.css` / `custom.js` / `arcade.js`, bump the `?v=N` query in `index.html` so returning visitors get the new file.

## Deployment

Hosted on **Vercel** (free Hobby plan, private GitHub repo). Every push to `master` auto-deploys:

```bash
git push origin master
```

`vercel.json` provides clean URLs (`/cv`), asset cache headers and basic security headers.

---

*Template base: Imroz (ThemeForest). Everything else — brand, logo, sections, CV system, arcade engine and all ten games — custom-built.*
