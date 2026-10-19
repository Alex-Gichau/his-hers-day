# His &amp; Hers — Wedding Invitation

A dark, premium wedding invitation site built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

## Editing content

Almost every piece of text, image, and link on the site lives in a single file:

```
src/data/data.json   ->  src/data/index.ts  ->  imported as { siteData } from "@/data"
```

`src/data/data.json` is the source of truth. Edit it and the UI updates — no component changes needed.

### `data.json` map

| Key | Controls |
| --- | --- |
| `couple` | Names and initials shown in the hero, nav brand, and footer |
| `wedding` | Date, venue, address, gifts note |
| `hero` | Hero badge, headline, CTAs, and background image |
| `countdown` | Countdown titles |
| `highlights` | The three summary tiles (venue / date / celebration) |
| `features` | The "Our story / Memories / Celebrations" cards, each with a `title`, `description`, and `image` |
| `letter` | The **Our letter to you** section — `title`, `paragraphs[]` (emojis are welcome), and `signature` |
| `gallery` | Title + the images used in the scrolling marquee |
| `timeline` | The wedding schedule entries |
| `rsvp` | RSVP fields. The `guests` field uses `type: "range"` with `min`/`max` to render the 1–5 slider |
| `map` | Embedded map: `embedUrl` (iframe src), `directionsUrl`, title, address |
| `googleForm` | `url` of the Google Form the RSVP button opens |
| `venue` | Venue section copy and image |
| `nav` | `brand`, `brandName`, `items[]` (label / href / icon), `cta`, `ctaHref` |
| `footer` | Footer eyebrow and name |

### Wiring up a real Google Form

1. Create a Google Form with the fields you want (Name, Guests, Email, Message).
2. Copy the form ID — it is the long string in the URL between `/d/e/` and `/viewform`.
3. Update `googleForm.id` and `googleForm.url` in `src/data/data.json`:

```json
"googleForm": {
  "id": "1AbCdEfGhIjKlMnOpQrStUvWxYz",
  "url": "https://docs.google.com/forms/d/e/1AbCdEfGhIjKlMnOpQrStUvWxYz/viewform?embedded=true"
}
```

The **Send RSVP** button opens this form in a new tab.

## Structure

```
src/
  app/
    layout.tsx        fonts (Montserrat, Praise, Caveat), dark theme, metadata
    page.tsx          the whole page composition
    globals.css       tokens, damask pattern layer, custom utilities
  components/
    siteNav.tsx           desktop top bar + mobile floating bottom bar
    galleryMarquee.tsx   seamless edge-to-edge scrolling gallery
    letterSection.tsx    handwritten letter section
    guestsSlider.tsx     1-5 numeric slider
    venueMap.tsx         Google Maps embed
    scrollToTop.tsx      appears after scrolling down
    countdown.tsx / weddingCalendar.tsx / whatsappDrawer.tsx
    ui/               shadcn-style primitives
  data/
    data.json         all editable content
    index.ts          typed accessor
  types/data.ts       types + icon map
```

## Design system

- **Dark mode only** — the theme provider is locked to `dark`.
- **Fonts**: `Montserrat` for body text, `Praise` (script) for display headings, `Caveat` (handwriting) for the letter.
- **Background**: a generated damask pattern (`public/patterns/damask-dark.svg`) sits behind the content on a fixed layer, faded out at the top so it blends into the hero.
- **Scrollbar** is hidden while the page stays fully scrollable.
- **Section order**: Hero → Our Day + Countdown → Highlights → Gallery → Feature cards → Our letter to you → Wedding timeline + Map → RSVP → Venue → Footer.

## Notes

- The map iframe loads from `google.com` and does not need to be added to `next.config.ts` `remotePatterns`. The `next/image` remote patterns already allow `images.unsplash.com` and `photos.google.com`.
- Navigation is smooth-scrolled and offset so section titles are never hidden beneath the fixed header.
