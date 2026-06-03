# HostelBills — web port of HostelBillManager

Web port of **Insharah Iqbal's** HostelBillManager (BESE-31 C, MCS NUST). Wraps her CLI class design with a Spring Boot REST API and a minimal React frontend so the Pawwwy portal can iframe an interactive web version.

```
hostelbills-web/
├── backend/        Spring Boot 3.2.5 + Java 17 · serves API + React build on port 8091
├── frontend/       Vite + React 18 + Tailwind 3 + Framer Motion · dev on port 5174
└── cli-original/   Insharah's CLI implementation, preserved BYTE-FOR-BYTE
```

---

## What's preserved from Insharah's original

Two classes are reproduced **identically** (modulo package declaration) in the web port:

- `model/Expense.java` — same fields (`title`, `amount`, `date`, `month`, `status`), same constructor signature `(title, amount, date, month)`, status defaults to `"Unpaid"`, same getters/setters, same `markPaid()`, same `toString()` format (`title | Rs.amount | date | status`).
- `model/BillManager.java` — same `ArrayList<Expense> expenses` field, same `addExpense / deleteExpense / editExpense / markPaid` signatures, same `getTotal / getPaidTotal / getUnpaidTotal / getTotalCount / getPaidCount / getUnpaidCount` methods, same `filterByMonth` case-insensitive semantics, same `isValidIndex` index validation.

The `BillManagerParityTest` JUnit suite (8 tests under `backend/src/test/`) verifies behavioural parity with the original CLI version.

The original `BillUI.java` and `HostelBillManager.java` (the Scanner-based menu loop and the `main()`) are not reproduced in the web port because their job is now handled by the REST controller and the React UI. But all four originals live in `cli-original/`, untouched.

---

## Run locally

In two terminals:

```bash
# Terminal 1 — backend on :8091
cd backend
mvn spring-boot:run

# Terminal 2 — frontend dev server on :5174
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5174`. The frontend proxies `/api/*` to the backend, so you'll see three seed expenses (one Paid, two Unpaid) on first load.

Run tests:

```bash
cd backend
mvn test
```

`BillManagerParityTest` runs 8 behavioural checks against the preserved `BillManager` class.

---

## Deploy to Render

This module deploys as **one Render Web Service** (frontend + backend together).

The frontend's `vite.config.js` writes its build output into `backend/src/main/resources/static/`, so a single `mvn package` produces a JAR that serves the entire UI plus the API.

In Render:

- **Build command:**
  ```
  cd frontend && npm install && npm run build && cd ../backend && mvn -B package -DskipTests
  ```
- **Start command:**
  ```
  java -jar backend/target/hostelbills-web-backend-*.jar
  ```
- **Environment variables:** none required.

Render will assign a URL like `https://hostelbills.onrender.com`.

---

## Plug the URL into the portal

```properties
# portal-backend/src/main/resources/application.properties
pawwwy.modules.hostelbills-url=https://your-real-hostelbills-url.onrender.com
```

Or via env var: `PAWWWY_MODULES_HOSTELBILLS_URL`.

---

## API reference

| Method | Path | Body | Returns |
|---|---|---|---|
| `GET`    | `/api/expenses`             | – | `ExpenseDTO[]` |
| `GET`    | `/api/expenses?month=May`   | – | `ExpenseDTO[]` filtered (case-insensitive) |
| `POST`   | `/api/expenses`             | `{title, amount, date, month}` | updated list |
| `PUT`    | `/api/expenses/{index}`     | `{title, amount, date, markAsPaid}` | updated list |
| `POST`   | `/api/expenses/{index}/pay` | – | updated list |
| `DELETE` | `/api/expenses/{index}`     | – | updated list |
| `GET`    | `/api/summary`              | – | `{total, paidTotal, unpaidTotal, totalCount, paidCount, unpaidCount}` |
| `GET`    | `/api/months`               | – | `string[]` distinct months present |
| `GET`    | `/api/health`               | – | `{status: 'ok', service: 'hostelbills-web'}` |

The `editExpense` endpoint's semantics intentionally mirror Insharah's CLI: empty `title` or `date`, or `amount <= 0`, means "leave that field unchanged". The frontend handles this by sending empty/zero for unchanged fields.

`{index}` is the 0-based ArrayList position. Deletions shift later items down — the frontend refetches the list after each mutation so indices stay correct.

---

## Iframe-compatibility

`backend/src/main/java/com/pawwwy/hostelbills/config/SecurityConfig.java` disables `X-Frame-Options: DENY` and replaces it with a CSP `frame-ancestors` allowlist that includes the portal's local-dev (`http://localhost:5173`, `http://localhost:8090`) and deployed origin. When you deploy the portal, update the deployed URL in that allowlist.

See `pawwwy-portal/X_FRAME_FIX.md` for the full snippet and rationale.
