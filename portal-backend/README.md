# Pawwwy Portal — Backend

Spring Boot 3.2.5 service that:

1. Serves the React frontend (once it's built in Phase 2 and copied into `src/main/resources/static/`).
2. Exposes a small read-only REST API the frontend uses to render the landing page and Team page.

Default port: **8090** (chosen to avoid colliding with Catsweeper on 8080).

---

## Run locally

From this directory (`portal-backend/`):

```bash
mvn spring-boot:run
```

Then visit:

| URL | What you should see |
|---|---|
| <http://localhost:8090/> | Placeholder backend page (replaced by React in Phase 2) |
| <http://localhost:8090/api/health> | `{"status":"ok","service":"pawwwy-portal"}` |
| <http://localhost:8090/api/modules> | JSON array of the four modules |
| <http://localhost:8090/api/group> | Group / course / member metadata |

## Run tests

```bash
mvn test
```

Three smoke tests verify the controller returns the expected shape for the frontend.

## Swap iframe URLs

Module URLs live in `src/main/resources/application.properties`:

```properties
pawwwy.modules.catsweeper-url=https://catsweeper.onrender.com
pawwwy.modules.pawwwy-games-url=https://pawwwy-games.onrender.com
pawwwy.modules.hostelbills-url=https://hostelbills.onrender.com
```

For production (Render), override via environment variables:

- `PAWWWY_MODULES_CATSWEEPER_URL`
- `PAWWWY_MODULES_PAWWWY_GAMES_URL`
- `PAWWWY_MODULES_HOSTELBILLS_URL`

No code changes, no rebuild — restart the service and it picks up the new URLs.

## Project layout

```
portal-backend/
├── pom.xml
├── src/main/java/com/pawwwy/portal/
│   ├── PortalApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java       Locks portal against being iframed; permits API
│   │   ├── CorsConfig.java           Allows Vite dev server (port 5173) to call API
│   │   ├── SpaFallbackConfig.java    SPA deep-link fallback (/play/*, /team → index.html)
│   │   └── ModuleUrlProperties.java  Config-driven iframe URLs
│   ├── model/
│   │   ├── Module.java               One module DTO
│   │   ├── Member.java               One group member DTO
│   │   └── GroupInfo.java            Group / course metadata DTO
│   ├── service/
│   │   └── ModuleRegistry.java       Single source of truth for the four modules + group info
│   └── controller/
│       └── PortalController.java     GET /api/modules, /api/group, /api/health
├── src/main/resources/
│   ├── application.properties
│   └── static/index.html             Placeholder until Phase 2 plugs in the React build
└── src/test/java/com/pawwwy/portal/
    └── controller/PortalControllerTest.java
```
