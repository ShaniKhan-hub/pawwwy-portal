# Pawwwy

> Four projects. One portal.

A group portal that hosts four individual modules built by **BESE-31 C** for the Object-Oriented Programming Integration Project at **Military College of Signals, NUST**. Each module is the work of one group member; the portal stitches them into a single coherent experience.

```
Pawwwy
├── Catsweeper          Shahram Ahmed              Minesweeper, with cats.
├── PawPlan             Muhammad Faran Shehryar    Track assignments. Before they track you.
├── Pawwwy Games        Memuna Javed               Two tiny games. One sleepy cat.
└── HostelBillManager   Insharah Iqbal             Hostel bills, finally readable.
```

---

## Architecture at a glance

```
                      ┌──────────────────────────┐
                      │      Pawwwy portal       │
                      │  Spring Boot + React     │
                      │     :8090 (prod)         │
                      └────────────┬─────────────┘
                                   │
                  ┌────────────────┼────────────────┐
                  │                │                │
       iframe ────┘     drop-in ───┘     iframe ────┘     iframe ───┐
          │                 │                 │                     │
          ▼                 ▼                 ▼                     ▼
   ┌──────────────┐  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐
   │  Catsweeper  │  │  PawPlan    │  │ Pawwwy Games │  │  HostelBills    │
   │  Spring Boot │  │  React JSX  │  │  React TS    │  │  Spring Boot    │
   │   + React    │  │  (drop-in)  │  │  static site │  │   + React       │
   │   :8080      │  │  (no URL)   │  │   :3000      │  │   :8091         │
   └──────────────┘  └─────────────┘  └──────────────┘  └─────────────────┘
   Shahram's repo      Faran's .jsx     Memuna's repo     Web port built here
```

Three of the four modules are **iframe-embedded** at config-driven URLs. One (PawPlan) is a **drop-in React route** because Faran delivered a self-contained component — no iframe needed, no separate deployment.

---

## Repository layout

```
pawwwy-portal/
├── README.md                       ← you are here
├── X_FRAME_FIX.md                  Spring Security snippet for any embedded module
├── play.bat                        One-click local launcher (Windows)
├── play.sh                         One-click local launcher (Unix)
│
├── portal-backend/                 Spring Boot 3.2.5 · Java 17 · :8090
│   ├── pom.xml
│   ├── README.md                   Endpoints + run instructions
│   └── src/...
│
├── portal-frontend/                Vite + React 18 + Tailwind 3 + Framer Motion · :5173 (dev)
│   ├── package.json
│   ├── README.md                   Design tokens + run instructions
│   └── src/
│       └── modules/PawPlan.jsx     Faran's drop-in (verbatim copy)
│
├── modules/
│   └── hostelbills-web/            Insharah's CLI ported to web · :8091
│       ├── README.md
│       ├── backend/                Spring Boot + Insharah's preserved classes
│       ├── frontend/               React UI
│       └── cli-original/           Insharah's original 4 files, BYTE-IDENTICAL
│
└── docs/
    ├── integration-catsweeper.md     For Shahram
    ├── integration-pawplan.md        For Faran
    ├── integration-pawwwy-games.md   For Memuna
    └── integration-hostelbills.md    For Insharah
```

Catsweeper and Pawwwy Games live in their authors' own repos. The portal embeds them at deploy time via iframe URL.

---

## Quick start — run locally

### Prerequisites

- **JDK 17 or later** (`java -version` to check)
- **Maven 3.8+** (`mvn -version`)
- **Node.js 20+** with **npm** (`node -v`, `npm -v`)

### One-click

**Windows:**
```cmd
play.bat
```

**macOS / Linux:**
```bash
chmod +x play.sh && ./play.sh
```

These open two terminals: one running the Spring Boot backend (port 8090), one running the Vite dev server (port 5173). When both are up, open <http://localhost:5173>.

### Manual

Two terminals:

```bash
# Terminal 1 — backend
cd portal-backend
mvn spring-boot:run

# Terminal 2 — frontend
cd portal-frontend
npm install
npm run dev
```

Then visit <http://localhost:5173>. You should see the landing page with all four modules. Click a card; the iframe will try to load the placeholder URL (which doesn't exist yet, so you'll see the "backend may be waking up" message escalating to an error — that's the expected demo behavior until real URLs are configured).

**PawPlan works fully even without any URLs configured**, because it's a drop-in React route, not an iframe. Click PawPlan to see this.

To test HostelBills locally too, start it in two extra terminals:

```bash
# Build the frontend into the backend's static folder (one-time)
cd modules/hostelbills-web/frontend && npm install && npm run build

# Then run the backend — serves frontend + API on one port
cd modules/hostelbills-web/backend && mvn spring-boot:run
```

Then temporarily edit `portal-backend/src/main/resources/application.properties`:

```properties
pawwwy.modules.hostelbills-url=http://localhost:8091
```

Restart the portal backend. Click HostelBills — it loads inside the iframe.

---

## Module status

| Module | Author | Type | Iframe URL config | Status |
|---|---|---|---|---|
| Catsweeper | Shahram Ahmed | iframe | `pawwwy.modules.catsweeper-url` | 🔜 awaiting deploy |
| PawPlan | Muhammad Faran Shehryar | drop-in | _(none — not iframed)_ | ✅ working |
| Pawwwy Games | Memuna Javed | iframe | `pawwwy.modules.pawwwy-games-url` | 🔜 awaiting deploy |
| HostelBillManager | Insharah Iqbal | iframe | `pawwwy.modules.hostelbills-url` | ✅ web port built, awaiting deploy |

Per-module deploy instructions live in `docs/integration-*.md`. Each guide is targeted at its author and walks through:

- Whether an X-Frame-Options fix is needed (only some need it)
- Render deployment steps (Static Site vs Web Service, build commands)
- A local-test path you can do _before_ deploying
- A pre-handoff checklist

---

## Deploying the portal to Render

The portal frontend builds **directly into** `portal-backend/src/main/resources/static/` (configured in `portal-frontend/vite.config.js`), so a single Spring Boot service ships both. In Render:

- **New → Web Service**
- Connect this repo
- **Build command:**
  ```
  cd portal-frontend && npm install && npm run build && cd ../portal-backend && mvn -B package -DskipTests
  ```
- **Start command:**
  ```
  java -jar portal-backend/target/pawwwy-portal-backend-*.jar
  ```
- **Environment variables** (set these once real module URLs are known):
  ```
  PAWWWY_MODULES_CATSWEEPER_URL    = https://shahram-catsweeper.onrender.com
  PAWWWY_MODULES_PAWWWY_GAMES_URL  = https://memuna-pawwwy-games.onrender.com
  PAWWWY_MODULES_HOSTELBILLS_URL   = https://insharah-hostelbills.onrender.com
  ```

Updating an env var is a one-click action in Render — no rebuild required. The iframe URLs are read at request time by `/api/modules`.

> **Free-tier note:** Render's free tier sleeps services after 15 minutes of inactivity. Cold starts take ~30–45 seconds. The portal's `IframeRenderer` is calibrated to this — it shows escalating messages ("Loading…" → "Still connecting…" → "Backend may be waking up…") and a manual Retry after 35s. Static Site deployments (Pawwwy Games) don't sleep, so they wake instantly.

---

## After your group has deployed, swap the URLs

The portal reads module URLs from one of:

1. `portal-backend/src/main/resources/application.properties` (defaults)
2. Environment variables (overrides defaults — used in production)

```properties
pawwwy.modules.catsweeper-url=https://your-real-catsweeper.onrender.com
pawwwy.modules.pawwwy-games-url=https://your-real-pawwwy-games.onrender.com
pawwwy.modules.hostelbills-url=https://your-real-hostelbills.onrender.com
```

No portal frontend rebuild is needed — the URLs are fetched at runtime from `/api/modules`.

---

## Adding a future module

1. **Pick an integration type** — iframe (most common) or drop-in (only for self-contained React components).
2. **Edit `portal-backend/.../service/ModuleRegistry.java`** — add one entry to `getModules()`.
3. **Edit `portal-backend/.../config/ModuleUrlProperties.java`** (iframe only) — add a new URL property.
4. **Drop-in modules only** — copy the `.jsx` into `portal-frontend/src/modules/`, then add one line to `portal-frontend/src/pages/PlayPage.jsx`:
   ```js
   const DROP_IN_COMPONENTS = {
     pawplan: lazy(() => import('../modules/PawPlan.jsx')),
     newslug: lazy(() => import('../modules/NewModule.jsx')),  // <-- new
   };
   ```
5. **Add a member entry** in `ModuleRegistry.getGroupInfo()` so they show up on the Team page.

Done. The landing page and Team page pick them up automatically.

---

## Tech stack

| Layer | Tech |
|---|---|
| Portal backend | Spring Boot 3.2.5 · Java 17 · Maven · Spring Security |
| Portal frontend | Vite 5 · React 18 · Tailwind 3 · Framer Motion · React Router 6 · lucide-react |
| Typography | Fraunces (display) · Geist (body) — picked over generic Inter/Roboto |
| Design | Refined minimalism · warm cream / warm dark · terracotta accent |
| HostelBills web port | Spring Boot 3.2.5 · Java 17 · same frontend stack as portal |
| Deployment | Render — single Web Service per Spring Boot module + one Static Site for Pawwwy Games |

---

## Team

| Name | Module | Role |
|---|---|---|
| Shahram Ahmed | Catsweeper | Minesweeper |
| Muhammad Faran Shehryar | PawPlan | Task Tracker |
| Memuna Javed | Pawwwy Games | Mini-games |
| Insharah Iqbal | HostelBillManager | Expense Tracker |

**Course:** Object-Oriented Programming — Integration Project
**Batch:** BESE-31 C
**University:** Military College of Signals, NUST
**Year:** 2026
