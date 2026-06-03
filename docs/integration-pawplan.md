# Integrating PawPlan into the Pawwwy portal

Audience: **Faran** (and anyone touching the PawPlan integration).

PawPlan is the **only drop-in** of the four modules. It loads as a native React route inside the portal — no iframe, no separate deployment, no X-Frame-Options worries.

---

## How it's wired up

Three pieces:

1. **Source file** — `portal-frontend/src/modules/PawPlan.jsx` is a verbatim copy of Faran's `PawPlan.jsx`. **Zero edits.** The MD5 hash matches the original. If Faran updates his file, replace this copy with the new version.

2. **Lazy registration** — `portal-frontend/src/pages/PlayPage.jsx`:

   ```js
   const DROP_IN_COMPONENTS = {
     pawplan: lazy(() => import('../modules/PawPlan.jsx')),
   };
   ```

   This means PawPlan ships as its own JS bundle and only downloads when the user clicks the PawPlan card. The landing page doesn't pay any cost.

3. **Backend metadata** — `ModuleRegistry.java` sets `dropIn=true` and `iframeUrl=null` for the pawplan slug. That tells the frontend to render the component instead of an iframe.

Net result: route `/play/pawplan` mounts PawPlan inside the portal's standard `ModuleViewer` shell — back button at top, content underneath.

---

## Bundle impact

After lazy-loading:

| Chunk | Size | Gzipped | When loaded |
|---|---|---|---|
| Main bundle (landing + viewer + everything else) | 306.5 KB | 98.7 KB | Always |
| `PawPlan-*.js` | 26.1 KB | 6.8 KB | Only when visiting `/play/pawplan` |

---

## Style isolation — why this works without conflicts

Faran's component injects a `<style>` block with some global selectors:

```css
* { box-sizing:border-box; margin:0; padding:0; }
body { background:#F4EDE0; min-height:100vh; }
::-webkit-scrollbar { width:6px } ...
```

These are global rules — they'd normally pollute the surrounding app. Here, they're scoped by React's lifecycle:

- **Mount** (user clicks PawPlan card) → `<style>` block is inserted into the DOM. Body bg becomes #F4EDE0. The portal's top bar still renders correctly because Tailwind utility classes (specificity 0,1,0) beat the universal `*` selector (specificity 0,0,0).
- **Unmount** (user clicks Back) → React removes the `<style>` block from the DOM. All rules vanish. Body bg reverts to the portal's `bg-canvas` token. ✅

No leakage between sessions.

There's one cosmetic detail worth knowing: the area **behind** PawPlan (the top-bar strip) is the portal's canvas, not PawPlan's cream. Below PawPlan (anywhere it doesn't paint its own background) is also the portal canvas. PawPlan's root div has its own `background: #F4EDE0` and `minHeight: 100vh`, so the visible area inside PawPlan is its own design.

---

## Layout — overflow handling

PawPlan's outermost div uses `minHeight: 100vh`. That's taller than the available space inside the viewer (which is `100vh − 3rem` for the top bar). To handle this cleanly, `ModuleViewer` wraps drop-in modules in:

```jsx
<div className="relative flex-1 overflow-y-auto bg-surface">
  {children}
</div>
```

So when PawPlan's content exceeds the viewable area, you get an **internal scrollbar** within the viewer body — the portal's top bar stays pinned at the top. Standard "app inside an app" pattern.

---

## Typography contrast — by design

The portal uses Fraunces + Geist (warm cream / terracotta). PawPlan uses Playfair Display + DM Sans (warm cream / forest green). When you cross from the portal into PawPlan you get a deliberate visual handoff: same warm-cream foundation, but a clearly distinct typographic identity. It signals "you've entered a different module" without being jarring.

---

## How to update PawPlan in the future

If Faran updates his `PawPlan.jsx`, replace the portal's copy:

```bash
cp /path/to/faran/PawPlan.jsx pawwwy-portal/portal-frontend/src/modules/PawPlan.jsx
cd pawwwy-portal/portal-frontend && npm run build
```

That's it. No portal-side code changes needed.

---

## What's preserved from the OOP submission

Faran also delivered `PawPlan 1.java` — the CLI Java version that satisfies the OOP class-design requirement for the coursework. That file lives outside the portal repo. The portal only consumes the React companion (`PawPlan.jsx`). Both should be submitted: the `.java` for the OOP rubric, the portal for the integration deliverable.

---

## Verifying the integration locally

```bash
# Terminal 1 — portal backend
cd pawwwy-portal/portal-backend && mvn spring-boot:run

# Terminal 2 — portal frontend
cd pawwwy-portal/portal-frontend && npm install && npm run dev
```

Open `http://localhost:5173`, click **PawPlan** on the landing page. You should see:

- The viewer's slim top bar (Back button, ● PawPlan, "Task Tracker" tag, "MFS" initials)
- PawPlan's own cream + forest-green design filling the rest of the viewport
- The Add Task / Filter / Sort / Reminders / Report controls all working
- Internal scrolling within the viewer if content is tall
- ESC or Back returns to the portal — body background reverts to the portal's canvas

If the PawPlan cream background "sticks" after going back, refresh once and report it — that would mean the `<style>` cleanup didn't run. (It should — React unmounts the component on route change, removing the `<style>` node.)
