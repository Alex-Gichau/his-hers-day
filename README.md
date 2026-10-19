# Hers &amp; His — Wedding Invitation

A dark, premium wedding invitation site built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

Every word, image, and link on the site is driven by a single JSON file, so the whole invitation can be re-skinned for a different couple, date, or venue without touching a component.

---

## What the site contains

| Section | Anchor | What it does |
| --- | --- | --- |
| **Hero** | `#top` | Full-bleed 100vh background image that fades into the page, a wedding badge, the couple's names in the script font, and two CTAs: **Join Us** (opens the WhatsApp drawer) and **View details** (jumps to the timeline). |
| **Our Day** | `#our-day` | A date/venue card paired with a live **countdown** (days / hours / minutes / seconds). Once the date passes it flips to a "We said I do" message. |
| **Highlights** | — | Three summary tiles (venue, date, celebration) pulled straight from the JSON. |
| **Our gallery** | `#gallery` | A full-bleed **marquee** that scrolls continuously left to right, with both edges faded so the photos dissolve into the page. Pauses on hover, and stops under `prefers-reduced-motion`. |
| **Feature cards** | — | "Our story / Memories / Celebrations" cards, each with a grayscale image that warms to full colour on hover. |
| **Our letter to you** | `#letter` | A handwritten (Caveat) letter on ruled paper that **reveals itself sentence by sentence** as it scrolls into view. |
| **Wedding timeline** | `#details` | The day's schedule as a connected vertical timeline, plus a **live Google Maps embed** of the venue with a Directions button. |
| **RSVP form** | `#rsvp` | Name, a 1–5 **guests slider**, email, and a message. Submitting posts to `/api/rsvp`, which emails the details to the couple via the Gmail API, and the form swaps to a personalised confirmation card. |
| **Venue** | `#venue` | Venue details, gifts note, an interactive **calendar** pinned to the wedding date, and a venue photograph. |
| **Footer** | — | "With love" sign-off. |

### Site-wide behaviour

- **Responsive navigation** — a fixed top bar on desktop, a floating bottom bar on mobile, both driven by the same JSON.
- **Scroll reveal** — sections fade and slide in as they enter the viewport.
- **Smooth, offset scrolling** — in-page links never hide a section title under the fixed header.
- **Scroll-to-top button** — fades in once you are 600px down.
- **Hidden scrollbar** — the page stays fully scrollable, just without a visible track.
- **WhatsApp drawer** — the "Join Us" button opens a drawer with a link to the WhatsApp family group.
- **Dark mode only** — the theme is locked, with no light variant or flash on load.

---

## Tech stack

| | |
| --- | --- |
| Framework | Next.js 15.5.3 (App Router, Turbopack) |
| UI | React 19.1.0, TypeScript 5 |
| Styling | Tailwind CSS v4, `tailwind-merge` + `clsx` |
| Components | shadcn/ui (new-york style) on Radix UI, `vaul` for the drawer |
| Icons | `lucide-react` + a hand-rolled inline SVG for brand marks |
| Fonts | `next/font/google` — Montserrat, Praise, Caveat |
| Theming | `next-themes` with `forcedTheme="dark"` |
| Date picker | `react-day-picker` v9 |
| Email | `googleapis` v186 (Gmail API, `gmail.send` scope) |

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

---

## Editing the content

```
src/data/data.json  ->  src/data/index.ts  ->  import { siteData } from "@/data"
```

`src/data/data.json` is the **single source of truth**. Edit it and the UI updates — no component changes needed.

> Always import from `@/data`, never from `data.json` directly. The accessor casts the raw JSON to the `SiteData` type, which keeps literal strings (icon names, field types) narrow enough for `iconMap` lookups to type-check.

### `data.json` map

| Key | Controls |
| --- | --- |
| `couple` | `initials`, `nameOne`, `nameTwo`, `displayName`, `eyebrow` — used in the hero, nav brand, letter signature, and footer. |
| `wedding` | `date` (ISO, drives the countdown and calendar), `dateLabel`, `venue`, `address`, `giftsLabel`, `gifts`. |
| `hero` | Badge, greeting, `title` / `titleAccent`, description, `primaryCta` ("Join Us"), `secondaryCta` ("View details"), and the background `image`. |
| `countdown` | `title`, `subtitle`, plus the `pastTitle` / `pastMessage` shown once the date has passed. |
| `highlights` | The three summary tiles — each an `icon`, `label`, and `value`. |
| `features` | The "Our story / Memories / Celebrations" cards, each with a `title`, `description`, and `image`. |
| `letter` | The **Our letter to you** section — `eyebrow`, `title`, `signature`, and `paragraphs[]` (emojis are welcome; they are folded into the sentence they belong to). |
| `gallery` | `eyebrow`, `title`, `cta`, and the `images[]` used in the scrolling marquee. |
| `timeline` | `title`, `description`, and the `items[]` (each with a `time`, `title`, and `detail`). |
| `rsvp` | `title`, `description`, `submit`, and `fields[]`. The `guests` field uses `type: "range"` with `min`/`max` to render the 1–5 slider. |
| `map` | `embedUrl` (the iframe `src`), `directionsUrl`, `title`, `description`. |
| `venue` | `title`, `description`, and the venue `image`. |
| `nav` | `brand`, `brandName`, `items[]` (`label` / `href` / `icon`), `cta`, and `ctaHref`. |
| `footer` | `eyebrow` and `name`. |
| `story` | **Legacy** — kept for reference, but no longer rendered (the letter section replaced it). Safe to delete along with `StoryData`. |

### Adding a nav item

Add an entry to `nav.items` and register its icon in `src/types/data.ts`:

```json
{ "label": "Dress code", "href": "#dress-code", "icon": "Shirt" }
```

Icons resolve through the `iconMap` in `src/types/data.ts`, so the name must exist there and be added to the `IconName` union.

### The RSVP form

`src/components/rsvpForm.tsx` posts the field values to `/api/rsvp` and swaps the form for a confirmation card on success. The route handler turns the submission into an email — see [Sending RSVP emails](#sending-rsvp-emails) below.

The subject and body are built server-side in `src/app/api/rsvp/route.ts`:

| Field | Subject | Body |
| --- | --- | --- |
| Name | `"<Name> has RSVP'd"` | The **Message** field first, then a separator and the details: `Name:`, `Guests:`, `Email:` |
| Guests > 1 | `"<Name> has RSVP'd with <n> Guests"` | same |
| No message | `"<Name> has RSVP'd"` | `"No message was left."` instead of the message |

The email is sent **from** the configured sender mailbox with the **sender name** (the couple's display name by default) as the display name. The guest's email address is placed in `Reply-To`, so hitting reply in Gmail goes straight back to the guest.

> The `From` address must be the authenticated mailbox (or one of its aliases) — Gmail rejects the request otherwise. The guest's address is never used as the sender.

---

## Sending RSVP emails

RSVP submissions are delivered through the **Gmail API** using a server-side OAuth refresh token. The wrapper in `src/lib/gmail/gmailApp.ts` mirrors Apps Script's `GmailApp.sendEmail()` — it takes `to`, `subject`, `body`, and an optional `senderName`, and returns the sent message id.

### 1. Create Google Cloud credentials

1. Open the [Google Cloud Console](https://console.cloud.google.com/) and create (or pick) a project.
2. Enable the **Gmail API** under *APIs & Services → Library*.
3. Under *APIs & Services → Credentials*, create an **OAuth client ID** of type **Web application**.
4. Add `http://localhost:3000/api/oauth/callback` (or whatever port you use) to the client's **Authorised redirect URIs**.

### 2. Get a refresh token

```bash
node scripts/gmail-auth.mjs
```

The script reads `GMAIL_CLIENT_ID` / `GMAIL_CLIENT_SECRET` from `.env.local` (or `.env`), prints a consent URL, and spins up a temporary server on the redirect port. Sign in, approve the `https://www.googleapis.com/auth/gmail.send` scope, and the script prints a ready-to-paste `GMAIL_REFRESH_TOKEN=...` line.

### 3. Configure the environment

Copy `.env.example` to `.env.local` and fill it in:

```bash
RSVP_TO_EMAIL=you@example.com          # where RSVPs are delivered
RSVP_SENDER_NAME=Hers & His            # display name on the outgoing mail
GMAIL_CLIENT_ID=...                    # from the OAuth client
GMAIL_CLIENT_SECRET=...
GMAIL_REFRESH_TOKEN=...                # from step 2
GMAIL_SENDER_ADDRESS=you@gmail.com     # the mailbox the mail is sent from
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `RSVP_TO_EMAIL` | yes | Recipient of every RSVP. Falls back to `GMAIL_RECIPIENT`, then `RSVP_RECIPIENT`. |
| `RSVP_SENDER_NAME` | no | Display name on the outgoing mail. Defaults to the couple's `displayName` from `data.json`. |
| `GMAIL_CLIENT_ID` | yes | OAuth client id. Falls back to `GOOGLE_CLIENT_ID`. |
| `GMAIL_CLIENT_SECRET` | yes | OAuth client secret. Falls back to `GOOGLE_CLIENT_SECRET`. |
| `GMAIL_REFRESH_TOKEN` | yes | Long-lived refresh token. Falls back to `GOOGLE_REFRESH_TOKEN`. |
| `GMAIL_SENDER_ADDRESS` | yes | The `From` address — must be the authenticated mailbox or one of its aliases. Falls back to `GMAIL_USER_ID` / `GOOGLE_USER_ID`. A guest's email always goes to `Reply-To`, never to `From`. |

`.env*` is already git-ignored. Never commit the refresh token.

### 4. Try it

Submit the form on the site. If the credentials are missing the API returns a clear `500` — *"RSVP is not configured. Set RSVP_TO_EMAIL on the server."* — and the form shows an error banner rather than pretending the RSVP was received.

> Only the Gmail API is used — no `smtp` package, no third-party mail service. The token is refreshed automatically as needed.

---

## Project structure

```
src/
  app/
    layout.tsx        fonts (Montserrat, Praise, Caveat), dark theme, metadata
    page.tsx          the whole page composition
    globals.css       design tokens, damask pattern layer, custom utilities
    api/rsvp/
      route.ts        POST handler — validates the RSVP and emails it via Gmail
  components/
    siteNav.tsx           desktop top bar + mobile floating bottom bar
    galleryMarquee.tsx   seamless edge-to-edge scrolling gallery
    letterSection.tsx    handwritten letter that reveals sentence by sentence
    reveal.tsx            scroll-triggered reveal wrapper
    rsvpForm.tsx         RSVP form — posts to /api/rsvp, with sending + error states
    guestsSlider.tsx     1-5 numeric slider
    venueMap.tsx         Google Maps embed + Directions link
    countdown.tsx        live countdown to the wedding date
    weddingCalendar.tsx  interactive calendar pinned to the wedding date
    whatsappDrawer.tsx   "Join Us" drawer with the WhatsApp family link
    whatsappIcon.tsx     inline WhatsApp brand glyph (lucide has no brand icons)
    scrollToTop.tsx      appears after scrolling down
    theme-provider.tsx   next-themes wrapper, locked to dark
    ui/                  shadcn-style primitives (button, card, badge, input,
                         textarea, separator, drawer, dialog, calendar)
  data/
    data.json           all editable content
    index.ts            typed accessor
  types/data.ts         types + icon map
  lib/
    utils.ts            `cn()` class-name helper
    gmail/gmailApp.ts   server-only Gmail wrapper (`sendEmail()`)
public/
  patterns/damask-dark.svg   generated background pattern
scripts/
  generate-pattern.mjs      regenerates the damask pattern
  gmail-auth.mjs            one-time OAuth refresh-token generator
.env.example            template for the Gmail / RSVP environment variables
```

---

## Design system

**Colours** — the palette is defined with `oklch()` in `globals.css`. The dark theme lives on `:root` and is mirrored in `.dark` so Tailwind `dark:` variants keep working without a light mode. Primary is a warm rose, background a deep brown-black.

**Fonts**

| Utility | Face | Used for |
| --- | --- | --- |
| `font-sans` | Montserrat | Body copy, UI, labels |
| `font-wedding` / `font-wedding-alt` | Praise | Display headings, names, numbers |
| `font-hand` | Caveat | The letter section |

Praise is a display face with only weight 400 and no true bold, so emphasis comes from **size and colour** rather than weight.

**Background** — a generated damask pattern (`public/patterns/damask-dark.svg`) sits behind the content on a fixed `body::after` layer (`z-index: -1`), faded out toward the top so it blends into the hero. It is deliberately subtle: roughly 10% opacity strokes over a dark base. Regenerate it with `node scripts/generate-pattern.mjs`.

**Utilities**

| Class | Purpose |
| --- | --- |
| `.container-page` | Constrains a section's content to the page width (max 72rem) while the section itself stays full-bleed |
| `.edge-fade-x` | Fades the left and right edges of the gallery strip |
| `.animate-gallery-marquee` | Drives the left-to-right gallery scroll |
| `.reveal` + `.reveal-from-{up,down,left,right,none}` | Scroll reveal states |
| `.letter-sentence` | Per-sentence reveal states inside the letter |
| `.font-wedding` / `.font-wedding-alt` / `.font-hand` | Script and handwriting faces |

`prefers-reduced-motion: reduce` is honoured everywhere — content shows immediately, with no animation.

---

## Notes and gotchas

- **Do not put a background colour on `body`.** The base colour belongs on `html` and `body` must stay transparent (no `bg-background` class on `<body>` in `layout.tsx`). A body background paints *after* negative-z-index children, so it hides the `z-index: -1` damask layer entirely. The pattern lives on `body::after` so the top fade applies only to the pattern and never washes out page content.
- **The map iframe needs no `next.config.ts` entry.** Google Maps loads from `google.com`, not through `next/image`. The `remotePatterns` list only covers `next/image` sources (`images.unsplash.com`, `photos.google.com`, `plus.unsplash.com`, `lh3.googleusercontent.com`).
- **Nav targets need distinct scroll positions.** The active-link highlight sorts sections by their position in the DOM, so two sections sharing a `top` value will collide.
- **The fixed bars need page clearance.** `main` uses `pb-28 pt-16 sm:pb-16 sm:pt-24` and the footer uses `pb-24 sm:pb-8` so content never hides behind the floating bars.
- **The scroll-to-top button sits above the mobile bottom nav** (`bottom-24 right-4 sm:bottom-8 sm:right-8`).
- **Casing changes are applied at the render layer.** Use Tailwind's `uppercase` rather than editing `data.json`, so the content file stays readable and casing remains a pure style concern.
- **Brand icons are hand-rolled.** lucide-react ships no brand marks, so the WhatsApp glyph lives in `src/components/whatsappIcon.tsx` as an inline SVG using `fill="currentColor"`.
- **Gmail code is server-only.** `src/lib/gmail/gmailApp.ts` starts with `import "server-only"`, so it can never be pulled into a client bundle. Keep the OAuth credentials in server environment variables, never in `NEXT_PUBLIC_*`.
- **The RSVP route must stay on the Node runtime.** `src/app/api/rsvp/route.ts` sets `export const runtime = "nodejs"` because `googleapis` needs Node built-ins. It also sets `dynamic = "force-dynamic"` so it is never statically rendered at build time.
- **The refresh token is the secret.** The access token is short-lived and refreshed automatically; the refresh token is what must be protected. `.env*` is git-ignored — keep it that way.
- **`From` must be the authenticated mailbox.** Gmail rejects a message whose `From` is not the account (or an alias of it) the request is authenticated for. The guest's address belongs in `Reply-To`.
