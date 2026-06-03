# Integrating Catsweeper into the Pawwwy portal

Audience: **Shahram** (and anyone helping Catsweeper get online).

Bottom line: Catsweeper is the easiest of the four modules to integrate — but there's one deployment puzzle to solve because the frontend uses relative `/api` paths.

---

## 1. Good news first

Looking at `catsweeper/backend/pom.xml`:

```xml
<artifactId>spring-boot-starter-web</artifactId>
<artifactId>spring-boot-starter-validation</artifactId>
<artifactId>spring-boot-starter-test</artifactId>
```

**No `spring-boot-starter-security`.** That means Spring Boot isn't adding `X-Frame-Options: DENY` to your responses, so iframing works **without any code changes**. ✅

You don't need to touch `SecurityConfig` (you don't have one — keep it that way).

The only Catsweeper config file in `com.catsweeper.config` is `CorsConfig.java`, and that's already fine.

---

## 2. The one real puzzle — frontend ↔ backend connection in production

Your frontend (`catsweeper/frontend/src/api/client.js`) is hardcoded to call `/api`:

```js
const API = '/api';
```

In **dev**, your `vite.config.js` proxies `/api → http://localhost:8080`, so it works.

In **production**, there's no Vite dev server and no proxy. The frontend will literally request `https://catsweeper-frontend.onrender.com/api/...` — which doesn't exist if backend and frontend are deployed separately.

You have **two ways to solve this**. Pick one.

### Option A — Single Render service (recommended)

Build the frontend into the backend's static folder and deploy the whole thing as one Spring Boot Web Service. Frontend and backend share an origin, so `/api` resolves correctly with no code changes.

**Edit `catsweeper/frontend/vite.config.js`:**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true }
    }
  },
  build: {
    // Build straight into Spring Boot's static-resources folder
    outDir: path.resolve(__dirname, '../backend/src/main/resources/static'),
    emptyOutDir: true,
  }
});
```

**Add an SPA fallback to your Spring Boot backend** so React Router routes survive a hard refresh. Create `catsweeper/backend/src/main/java/com/catsweeper/config/SpaFallbackConfig.java`:

```java
package com.catsweeper.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SpaFallbackConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Add one line for each top-level React Router route in your app:
        registry.addViewController("/play").setViewName("forward:/index.html");
        registry.addViewController("/stats").setViewName("forward:/index.html");
        registry.addViewController("/achievements").setViewName("forward:/index.html");
        // Catch-all (only if you're using nested or dynamic React routes):
        // registry.addViewController("/{path:^(?!api|assets).*}").setViewName("forward:/index.html");
    }
}
```

**Build + run:**

```bash
cd catsweeper/frontend && npm install && npm run build
cd ../backend && mvn spring-boot:run
# → both served from http://localhost:8080
```

**Deploy:** one Render Web Service pointing at the backend. Build command:

```bash
cd frontend && npm install && npm run build && cd ../backend && mvn -B package -DskipTests
```

Start command:

```bash
java -jar backend/target/catsweeper-backend-*.jar
```

Iframe URL for the portal: `https://catsweeper.onrender.com` (or whatever Render assigns).

### Option B — Two Render services (only if you want them separate)

Modify the frontend to support a configurable API base URL.

**Edit `catsweeper/frontend/src/api/client.js`:**

```js
const API = import.meta.env.VITE_API_BASE
  ? `${import.meta.env.VITE_API_BASE}/api`
  : '/api';
```

In Render, set the frontend's environment variable:

```
VITE_API_BASE=https://catsweeper-api.onrender.com
```

Update `CorsConfig.java` on the backend to allow the deployed frontend's domain:

```java
registry.addMapping("/api/**")
        .allowedOrigins("https://catsweeper.onrender.com")   // <-- frontend URL
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true)
        .maxAge(3600);
```

Iframe URL for the portal: the **frontend** URL (e.g. `https://catsweeper.onrender.com`).

---

## 3. Plugging the URL into the portal

Once Catsweeper is deployed, update **one line** in the portal:

`portal-backend/src/main/resources/application.properties`:

```properties
pawwwy.modules.catsweeper-url=https://your-real-catsweeper-url.onrender.com
```

Restart the portal — done. No portal frontend rebuild needed; the iframe URL is fetched from `/api/modules` at runtime.

For Render deployment, you can also set it via env var: `PAWWWY_MODULES_CATSWEEPER_URL`.

---

## 4. Local test — verify iframe embedding works BEFORE deploying

You can prove the portal-→-Catsweeper integration works end-to-end on your own machine in 3 terminals:

```bash
# Terminal 1 — Catsweeper backend (port 8080)
cd catsweeper/backend && mvn spring-boot:run

# Terminal 2 — Catsweeper frontend, served via Vite preview on port 4173
cd catsweeper/frontend
npm install && npm run build
npm run preview -- --port 4173      # OR: vite preview --port 4173

# Terminal 3 — Pawwwy portal backend (port 8090)
cd pawwwy-portal/portal-backend && mvn spring-boot:run

# Terminal 4 — Pawwwy portal frontend (port 5173)
cd pawwwy-portal/portal-frontend && npm run dev
```

**Important:** before starting, temporarily edit the portal backend's `application.properties`:

```properties
pawwwy.modules.catsweeper-url=http://localhost:4173
```

Open `http://localhost:5173`, click the Catsweeper card — Catsweeper should load inside the portal's iframe. If you can play it, the integration works. ✅

> ⚠️ **Caveat with Vite preview:** `vite preview` does NOT run the dev-server proxy. So in the local-test setup above, Catsweeper's frontend will try to call `/api` on `localhost:4173` and 404. To make the local test fully functional, you either need to:
>
> 1. Do Option A first (build frontend into backend, then `mvn spring-boot:run` from the backend, then point the portal at `http://localhost:8080`), or
> 2. Add a temporary proxy by running `vite preview` behind a small proxy server (more setup).
>
> Option 1 is simpler. The local test then becomes:
> ```
> # After applying Option A's vite.config change + SpaFallbackConfig:
> cd catsweeper/frontend && npm run build
> cd ../backend && mvn spring-boot:run        # serves frontend + API on :8080
>
> # In portal application.properties:
> # pawwwy.modules.catsweeper-url=http://localhost:8080
> ```

---

## 5. Checklist before handing the URL to the portal team

- [ ] Frontend builds without errors (`npm run build`)
- [ ] Backend starts without errors (`mvn spring-boot:run`)
- [ ] Hitting the deployed URL shows the Catsweeper home screen
- [ ] You can start a game, click tiles, hit `/play` directly without 404
- [ ] DevTools → Network → no failed `/api/*` requests
- [ ] Deployed URL embeds correctly inside the portal locally — replace the placeholder URL in `application.properties` and click the Catsweeper card

---

## Future-proofing — if Catsweeper ever adds Spring Security

If you later add `spring-boot-starter-security` to Catsweeper (e.g. for user accounts), the iframe **will** break because Spring Security's default headers include `X-Frame-Options: DENY`. The fix is in [`../X_FRAME_FIX.md`](../X_FRAME_FIX.md) — a 15-line `SecurityConfig` you'd paste in.
