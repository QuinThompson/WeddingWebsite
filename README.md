# Shenice & Quinton Wedding Invitation

A mobile-first digital destination wedding invitation inspired by a wedding passport, boarding pass, and travel scrapbook. Built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Lucide React.

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

## Edit wedding content

All guest-facing wedding copy and structured content lives in one file:

[`src/data/wedding.ts`](src/data/wedding.ts)

Update:

- Couple names and initials
- Wedding date, time, and timezone
- Ceremony and reception details
- Hotel, airport, booking deadlines
- Timeline, attire, story chapters
- Wedding party groups
- Reminders, FAQs, destination guide
- Gallery image paths and alt text
- Contact information

Components read from this file so copy stays centralized.

## Replace images

Placeholder images live under `public/images/`:

- `couple-cover.jpg`
- `couple-story-01.jpg` … `couple-story-04.jpg`
- `ceremony.jpg` / `reception.jpg`
- `attire-women.jpg` / `attire-men.jpg`
- `gallery/photo-01.jpg` … `gallery/photo-08.jpg`

Keep the same filenames, or update the matching paths in `src/data/wedding.ts`. Prefer optimized JPEGs/WebP sized close to their display dimensions.

## Change lilac and sage colors

Primary palette tokens are defined in [`src/app/globals.css`](src/app/globals.css):

```css
--lilac: #b7a8cf;
--lilac-deep: #78658f;
--sage: #a8b39a;
--sage-deep: #66745e;
```

Attire swatches and some content colors also live in `src/data/wedding.ts` under `attire.encouragedColors`.

## Navigation and animations

1. `/` shows the closed wedding passport intro.
2. Opening the passport transitions into `/invite`, the scrapbook dashboard.
3. Dashboard items link to dedicated detail routes under `/invite/*`.
4. Browser Back/Forward works via Next.js routing and history.
5. Detail pages include a passport-shaped **Back to Invitation** control.
6. Returning to the dashboard uses a shortened reassemble animation.
7. Framer Motion entrance sequences respect `prefers-reduced-motion`.

## Google Sheets + Drive (RSVP, Registry, Memories)

Everything shared across guests goes through **one Google Spreadsheet**, **one Drive folder**, and **one Apps Script web app**.

You only need to paste **one URL** into the app:

```bash
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec
```

Site APIs:

| Guest action | API | Lands in |
|--------------|-----|----------|
| Submit RSVP | `POST /api/rsvp` | Sheet tab **RSVPs** |
| View / claim / add gifts | `/api/registry` | Sheet tab **Registry** |
| View / upload memories | `/api/memories` | Drive folder + sheet tab **Memories** |

Until `GOOGLE_APPS_SCRIPT_URL` is set, the site still works with browser-only storage (fine for local testing).

### What you create in Google

1. **Google Sheet** named e.g. `Shenice & Quinton Wedding Guest Data`  
   - Leave it empty (tabs are auto-created) **or** ensure tabs are named exactly: `RSVPs`, `Registry`, `Memories`.
2. **Google Drive folder** named e.g. `Wedding Guest Memories`  
   - Open the folder → copy the ID from the URL:  
     `https://drive.google.com/drive/folders/`**`THIS_IS_THE_FOLDER_ID`**

### What you paste into Apps Script

1. In the Sheet: **Extensions → Apps Script**
2. Delete any placeholder code; paste [`scripts/google-apps-script-wedding.js`](scripts/google-apps-script-wedding.js)
3. Set this line near the top:

```javascript
var MEMORIES_FOLDER_ID = "PASTE_DRIVE_FOLDER_ID_HERE";
```

4. **Save** → **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the web app URL (must end in `/exec`)

### What you give the app / host

| You provide | Where it goes |
|-------------|----------------|
| Apps Script **/exec** URL | `.env.local` → `GOOGLE_APPS_SCRIPT_URL=...` and the same env var on Netlify/Vercel |
| Drive folder ID | Only inside the Apps Script (`MEMORIES_FOLDER_ID`) — **not** in the website env |

You do **not** need to paste the Sheet share link into the app. The script is bound to the Sheet you opened it from.

After any script edit: **Deploy → Manage deployments → ✎ Edit → New version**.

### Sheet structure (auto-created)

**Tab: `RSVPs`**

| Submitted At | ID | Full Name | Email | Mobile | Attending | Guest Count | Guest Names | Meal Preference | Dietary Restrictions | Hotel Status | Flight Info | Song Request | Message | Adult Count | Child Count | Adults Detail | Children Detail |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Tab: `Registry`**

| ID | Title | Description | Store Label | Store URL | Price Label | Claimed By | Claimed At | Created At |
|---|---|---|---|---|---|---|---|---|

- First visit seeds gifts from `wedding.registry.items` if the tab is empty.
- Guests fill **Claimed By** / **Claimed At** when they claim.
- You can also edit rows directly in Sheets anytime.

**Tab: `Memories`** (index only — photo files live in Drive)

| ID | File ID | File Name | Alt | View URL | Created At |
|---|---|---|---|---|---|

### Drive folder structure

```
Wedding Guest Memories/          ← folder ID goes in Apps Script
  memory-….jpg                   ← guest uploads (auto)
  …
```

Files are shared as **Anyone with the link can view** so the gallery can display them. You browse/download the whole album from Drive.

### Local env

```bash
cp .env.example .env.local
# set GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
npm run dev
```

On Netlify/Vercel: add `GOOGLE_APPS_SCRIPT_URL` in project environment variables, then redeploy.

### Couple access tips

- **RSVPs / claims:** open the Google Sheet (source of truth).
- **Photos:** open the Drive folder.
- Couple tools on `/invite/registry` (code in `wedding.coupleAccessCode`, default `SQ2027`) can still download CSV snapshots and add gifts.
- Set `memories.forceUnlock: true` in `wedding.ts` to test Memories before the wedding day.

### Checklist — send these back when ready

1. Confirm Sheet exists (name is fine; no need to share the Sheet URL with the app).
2. Confirm Drive folder exists + you’ve pasted its **folder ID** into Apps Script.
3. Paste the Apps Script **web app `/exec` URL** here (or into `.env.local`) so we can verify RSVP / registry / memories.

## Deploy (free hosts)

Netlify or Vercel both work. Add `GOOGLE_APPS_SCRIPT_URL`, deploy from GitHub, share the public site URL with guests.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
