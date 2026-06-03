# Pawwwy Portal — Frontend

Vite + React 18 + Tailwind 3 + React Router 6 + Framer Motion + lucide-react.

Refined-minimal warm-neutral aesthetic. Fonts: **Fraunces** (display) + **Geist** (body), loaded from Google Fonts.

---

## Run locally

The backend should already be running on port 8090 (see `portal-backend/README.md`). Then, from this directory (`portal-frontend/`):

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>.

Vite proxies all `/api/**` calls to the Spring Boot backend, so:

- `GET /api/modules` → resolves against `localhost:8090`
- The landing page should fetch and display all four modules from the live backend
- Theme toggle should work, persisting choice to `localStorage`
- Clicking a module card should route to `/play/<slug>` and show the Phase-4 placeholder

## Build for production

```bash
npm run build
```

The build output is written **directly into** `../portal-backend/src/main/resources/static/`, which is exactly where Spring Boot serves static assets from. After running this:

```bash
cd ../portal-backend && mvn spring-boot:run
```

…serves frontend + backend as a single service on port 8090.

## Project layout

```
portal-frontend/
├── package.json
├── vite.config.js              Port 5173, /api proxy → 8090, build → portal-backend static/
├── tailwind.config.js          Custom color tokens + display/body font stack
├── postcss.config.js
├── index.html                  Loads Fraunces + Geist, FOUC-safe theme bootstrapping
├── public/
│   └── favicon.svg             Same cat mark, terracotta stroke
└── src/
    ├── main.jsx                Mounts <ThemeProvider><BrowserRouter><App /></BrowserRouter></ThemeProvider>
    ├── App.jsx                 Routes
    ├── index.css               Tailwind layers + CSS-variable design tokens (light + dark)
    ├── api/
    │   └── client.js           fetchModules / fetchGroup / fetchHealth — typed-ish, timeout-safe
    ├── theme/
    │   └── ThemeProvider.jsx   light/dark with localStorage + system preference + live OS sync
    ├── components/
    │   ├── CatLogo.jsx         Geometric line-art cat (monochrome, currentColor)
    │   ├── Wordmark.jsx        "Pawwwy" in Fraunces with tightened wwwy cluster
    │   ├── ThemeToggle.jsx     Sun ↔ Moon crossfade button
    │   ├── TopNav.jsx          Wordmark + Home / Team / theme toggle
    │   └── Footer.jsx          Single muted line
    ├── layouts/
    │   └── AppLayout.jsx       Header + outlet + footer (hides chrome on /play/*)
    ├── pages/
    │   ├── LandingPage.jsx     Hero + 4-module grid (Phase 3 polishes further)
    │   ├── TeamPage.jsx        Member cards (Phase 9 polishes further)
    │   └── PlayPage.jsx        ModuleViewer placeholder (Phase 4 builds the real one)
    └── modules/                (Phase 6 will drop PawPlan.jsx here)
```

## Design tokens

CSS variables in `src/index.css` drive everything via Tailwind's `<alpha-value>` syntax. Light theme = warm cream surface + warm-dark ink + terracotta accent. Dark theme = warm near-black + warm off-white ink + brighter terracotta. Tokens:

```
--canvas   bg-canvas     Page background
--surface  bg-surface    One step in from canvas
--elevated bg-elevated   Cards
--ink      text-ink      Primary text
--ink-muted               Secondary text
--ink-faint               Labels, eyebrows, footnotes
--line     border-line   Subtle borders
--line-strong             Borders on hover
--accent   text-accent / bg-accent / border-accent
--accent-soft             Tint for accent surfaces
```

Override or extend in `tailwind.config.js`.
