# Integrating Pawwwy Games into the Pawwwy portal

Audience: **Memuna** (and anyone helping Pawwwy Games go online).

Of the four modules, Pawwwy Games is the **lowest-friction iframe candidate** — a pure frontend with no backend, no CSP headers, no X-Frame-Options worries. Two notes worth knowing, then a clean deploy path.

---

## 1. Good news first

- ✅ **No backend** — nothing setting `X-Frame-Options`. Iframes work out of the box.
- ✅ **No CORS to configure** — no cross-origin API calls anywhere.
- ✅ **Static site deploy** — fits Render's free Static Site tier (no sleep, instant cold-start, free forever).
- ✅ **No environment variables required to deploy.** (See §2.)

---

## 2. About the AI Studio leftovers

Your `package.json` lists these dependencies inherited from the AI Studio template:

```json
"@google/genai": "^1.29.0",
"express": "^4.21.2",
"dotenv": "^17.2.3",
```

And your `vite.config.ts` defines `process.env.GEMINI_API_KEY`. The `.env.example` and `README.md` both reference a Gemini API key as if it were required.

**It's not required.** A grep of every `.ts`/`.tsx` file under `src/` confirms that `@google/genai`, `express`, and `dotenv` are **never imported anywhere**. The "Super-Smart feline AI" referenced on your home screen is implemented locally in `TicTacToe.tsx` with no external calls. CatRunner is a single-player runner with no AI.

I built the project locally with **no GEMINI_API_KEY set**, and it built cleanly — Vite just substitutes `undefined` for the absent env var, and since nothing reads it, nothing breaks.

### Recommended cleanup (optional but worth doing)

```bash
npm uninstall @google/genai express dotenv @types/express
```

And remove from `vite.config.ts`:

```diff
- import {defineConfig, loadEnv} from 'vite';
+ import { defineConfig } from 'vite';

  export default defineConfig(({mode}) => {
-   const env = loadEnv(mode, '.', '');
    return {
      plugins: [react(), tailwindcss()],
-     define: {
-       'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
-     },
      ...
    };
  });
```

You can also delete `.env.example` and rewrite the README to drop the Gemini section. **None of this affects the games.** It just makes the project's actual scope visible — pure frontend, no AI service, no backend.

---

## 3. Deploy to Render — Static Site

This is the simplest of the four module deploys.

1. Push the `pawwwy-games` repo to GitHub.
2. In Render: **New → Static Site**.
3. Connect the repo.
4. Settings:
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dist`
   - **Environment variables:** none required.
5. Click **Create Static Site**.

Render will assign a URL like `https://pawwwy-games.onrender.com`. Verified build output:

```
dist/index.html                  0.4 kB
dist/assets/index-*.css         23 kB    (gzipped: 5 kB)
dist/assets/index-*.js         345 kB    (gzipped: 109 kB)
```

Free tier: this works forever. Static sites on Render don't sleep.

---

## 4. Plugging the URL into the portal

Once deployed, update **one line** in `portal-backend/src/main/resources/application.properties`:

```properties
pawwwy.modules.pawwwy-games-url=https://your-real-pawwwy-games-url.onrender.com
```

Restart the portal — done. Or via env var on Render: `PAWWWY_MODULES_PAWWWY_GAMES_URL`.

No portal frontend rebuild needed; the URL is fetched from `/api/modules` at runtime.

---

## 5. Local test — verify iframe embedding works BEFORE deploying

```bash
# Terminal 1 — Pawwwy Games on port 3000 (its dev default, no clash with the portal)
cd pawwwy-games
npm install
npm run dev

# Terminal 2 — portal backend
cd pawwwy-portal/portal-backend && mvn spring-boot:run

# Terminal 3 — portal frontend
cd pawwwy-portal/portal-frontend && npm run dev
```

**Before starting the portal**, temporarily edit `portal-backend/src/main/resources/application.properties`:

```properties
pawwwy.modules.pawwwy-games-url=http://localhost:3000
```

Open `http://localhost:5173`, click **Pawwwy Games**. You should see your full home screen (PAWWWY wordmark, Kitty Cross + CatDash cards) loading inside the portal's iframe. Click into either game; play it. If everything works there, it'll work when deployed.

---

## 6. Naming clash heads-up

The portal is also called "Pawwwy". To avoid confusing the user, your module shows up as **"Pawwwy Games"** on the portal's landing page card and in the top-bar breadcrumb. Inside your iframe, your own PAWWWY branding is untouched. Both names coexist cleanly because the portal's iframe is visually contained — the user knows they've crossed a boundary.

---

## 7. Checklist before handing the URL to the portal team

- [ ] `npm install` runs without errors
- [ ] `npm run build` produces `dist/` cleanly
- [ ] Opening the deployed URL shows the PAWWWY home screen
- [ ] Kitty Cross plays end-to-end (local 2P + vs AI)
- [ ] CatDash plays end-to-end (jump, score, game over, restart)
- [ ] Deployed URL embeds correctly inside the portal locally (test as above)

---

## 8. Why static-site deploy is the right call here

Pawwwy Games has zero state that needs persistence and zero server-side computation. Everything runs in the browser:

- TicTacToe logic — local heuristic AI in `TicTacToe.tsx`
- CatRunner physics — requestAnimationFrame loop in `CatRunner.tsx`
- Cat avatar images — served from the public DiceBear API (cached aggressively by browsers)

If you ever add a feature that genuinely needs a backend (multiplayer, persistent scoreboards, real AI calls), you'd switch the Render deployment to **Web Service** and add a small backend at that point. The portal's iframe URL would stay the same; only your deployment topology changes.

For the integration deliverable, static is the right answer — fastest to ship, free forever, no cold-start delays in the portal.
