# X-Frame-Options fix for portal-embedded modules

> If your module's iframe shows up **blank** inside the Pawwwy portal — but loads fine when you open its URL directly — this is almost certainly why.

---

## What's happening

By default, **Spring Security adds `X-Frame-Options: DENY`** to every HTTP response. That header tells the browser to refuse to render the page inside any `<iframe>`. So the moment a Spring Boot service uses `spring-boot-starter-security`, all its iframes break — even from a same-domain portal.

**Three of the four Pawwwy modules need to be checked:**

| Module | Has Spring Security? | Needs the fix? |
|---|---|---|
| Catsweeper | ❌ No (`pom.xml` has web + validation + test only) | **No** — iframes already work |
| Pawwwy Games | ❌ No (pure frontend, static site) | **No** |
| HostelBills (web port) | ✅ Yes (added in Phase 8) | **Yes** — already applied in the new code |
| _Any future module that adds Spring Security_ | ✅ Yes | **Yes** — paste the snippet below |

If your `pom.xml` has this dependency, you need the fix:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

---

## The fix (Spring Boot 3.2 / Spring Security 6)

Create or edit a `SecurityConfig` class in your module's `config` package:

```java
package com.<yourmodule>.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
            .headers(headers -> headers
                // Disable Spring Security's default X-Frame-Options: DENY
                .frameOptions(frame -> frame.disable())

                // Use CSP frame-ancestors instead — modern, more flexible.
                // Only allow embedding from the Pawwwy portal's origins.
                .contentSecurityPolicy(csp -> csp.policyDirectives(
                    "frame-ancestors 'self' " +
                    "http://localhost:5173 " +              // portal dev
                    "http://localhost:8090 " +              // portal backend (same-origin prod)
                    "https://pawwwy-portal.onrender.com"    // <-- swap to the real deployed portal URL
                ))
            );
        return http.build();
    }
}
```

### What the snippet does

1. `csrf.disable()` — safe for stateless APIs. Skip if your module needs CSRF protection.
2. `anyRequest().permitAll()` — no auth on any endpoint. Adjust if your module has protected routes.
3. `frameOptions.disable()` — removes the `X-Frame-Options: DENY` header completely.
4. `contentSecurityPolicy(...)` — replaces it with a precise allowlist via the modern CSP header. The browser will allow the page in iframes ONLY when the parent's origin is in the list.

### What `frame-ancestors` to use

| Environment | Portal origin | Add to `frame-ancestors` |
|---|---|---|
| Local dev — portal Vite dev server | `http://localhost:5173` | yes |
| Local prod — portal Spring Boot serving built React | `http://localhost:8090` | yes |
| Deployed | e.g. `https://pawwwy-portal.onrender.com` | yes — use the **real** URL once known |
| Module accessed directly (not in portal) | the page's own origin | `'self'` covers this |

---

## How to verify it worked

After deploying the change:

1. Open your browser's DevTools → Network tab.
2. Load your module's URL directly (not via the portal). Click the document request.
3. In the **Response Headers**, you should see:
   - No `X-Frame-Options` header (or `X-Frame-Options: ALLOWALL` if your framework insists)
   - `Content-Security-Policy: frame-ancestors 'self' http://localhost:5173 ...`
4. Then load the Pawwwy portal and click your module's card. It should render inside the iframe instead of going blank.

If it's still blank, open the iframe in DevTools → Console tab. The error message will tell you exactly which directive is blocking it (usually a `frame-ancestors` mismatch).

---

## Why not just `X-Frame-Options: SAMEORIGIN`?

`X-Frame-Options` is an older header that only supports `DENY`, `SAMEORIGIN`, or `ALLOW-FROM <one-url>`. The `ALLOW-FROM` variant is deprecated and not supported by Chrome. `SAMEORIGIN` only works if the iframe parent is on the **exact same origin** as the child, which is rarely true once you deploy to Render (different subdomains = different origins).

CSP `frame-ancestors` is the modern replacement: it supports multiple allowed origins, works in all current browsers, and takes precedence over `X-Frame-Options` when both are present.
