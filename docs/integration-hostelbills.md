# Integrating HostelBillManager into the Pawwwy portal

Audience: **Insharah** (and anyone touching the HostelBills web port).

Your original is a console program — `Scanner` for input, ANSI escape codes for colored output. That's perfect for the OOP class submission but can't be embedded inside a web portal. So the integration takes two pieces:

1. **Your CLI is preserved exactly as you submitted it** in `modules/hostelbills-web/cli-original/`. Untouched. Bit-for-bit identical. That's still your OOP deliverable.
2. **A web port** in `modules/hostelbills-web/backend/` + `frontend/` reproduces the same logic via REST + React so the Pawwwy portal can iframe it. The two key classes — `Expense` and `BillManager` — are reproduced **byte-for-byte identical** (only the package name changed).

---

## What's actually preserved vs. what's new

| Your file | Where it lives in the web port | What changed |
|---|---|---|
| `Expense.java` | `backend/.../model/Expense.java` | Only the `package` line. All fields, constructor, getters, setters, `markPaid()`, `toString()` identical. |
| `BillManager.java` | `backend/.../model/BillManager.java` | Only the `package` line. All methods identical. |
| `BillUI.java` | (not used) — the console UI is now the React frontend | The web UI does the same things your menu did: add, edit, delete, mark paid, filter by month, show totals. |
| `HostelBillManager.java` (main) | (not used) — Spring Boot's `main()` is now `HostelBillsApplication.java` | The CLI's `while` loop is now an HTTP request loop. |

There are also brand-new files for the web layer that aren't part of your original design:

- `dto/AddExpenseRequest`, `dto/EditExpenseRequest`, `dto/ExpenseDTO`, `dto/SummaryDTO` — request/response shapes for REST
- `service/BillService` — thin Spring wrapper that owns a singleton `BillManager` and adds the index field to responses
- `controller/BillController` — the REST endpoints
- `config/SecurityConfig`, `config/CorsConfig` — security headers + CORS

These wrap your design without altering it. Every business action still goes through your `BillManager` methods.

---

## Verifying the port is faithful

There are 8 JUnit tests in `backend/src/test/java/com/pawwwy/hostelbills/BillManagerParityTest.java` that exercise your `BillManager` as a plain class (no Spring, no REST) and verify behaviour matches the original:

- A new manager is empty
- Added expenses default to `"Unpaid"`
- `markPaid` updates status + totals correctly
- `editExpense` preserves your empty/zero "leave unchanged" semantics
- Deletion shifts remaining items down
- Invalid indices are no-ops
- `filterByMonth` is case-insensitive
- `toString` format matches `title | Rs.amount | date | status`

To run them:

```bash
cd modules/hostelbills-web/backend
mvn test
```

If any fail, the port has drifted from your design.

---

## Running the web version locally

```bash
# Terminal 1 — backend on :8091
cd pawwwy-portal/modules/hostelbills-web/backend
mvn spring-boot:run

# Terminal 2 — frontend dev server on :5174
cd pawwwy-portal/modules/hostelbills-web/frontend
npm install
npm run dev
```

Open `http://localhost:5174`. You'll see three seed expenses on load (one Paid, two Unpaid). Add a new one, edit a row, mark something paid, change the month filter — all those click through your `BillManager` methods on the backend.

---

## Running the CLI version locally (your original)

This still works exactly as you wrote it:

```bash
cd pawwwy-portal/modules/hostelbills-web/cli-original
javac -d target/classes src/main/java/com/mycompany/hostelbillmanager/*.java
java -cp target/classes com.mycompany.hostelbillmanager.HostelBillManager
```

ANSI-coloured menu, Scanner input, same flow as you submitted.

(Your `pom.xml` targets Java 25 via `maven.compiler.release=25` — lower this in the pom if your installed JDK is older.)

---

## Deploy to Render

One Render Web Service serves both the React frontend and the API. The frontend's `vite.config.js` writes its build output into `backend/src/main/resources/static/`, so `mvn package` produces a single JAR that ships everything.

In Render → **New → Web Service** → connect the repo:

- **Build command:**
  ```
  cd modules/hostelbills-web/frontend && npm install && npm run build && cd ../backend && mvn -B package -DskipTests
  ```
- **Start command:**
  ```
  java -jar modules/hostelbills-web/backend/target/hostelbills-web-backend-*.jar
  ```
- **Environment variables:** none.

Render assigns a URL like `https://hostelbills.onrender.com`.

---

## What you should submit to the professor

For the OOP coursework rubric (which grades on class design, OOP principles, inheritance/encapsulation/etc):

- Submit the `cli-original/` folder as your individual work. It's your code, unchanged.

For the integration project (which grades on the portal):

- The web port and portal both. The web port preserves your classes verbatim and adds the REST layer the portal needs.

Both can coexist in the same submission; just point the professor at `cli-original/` for the OOP rubric and the running portal demo for the integration rubric.

---

## Checklist before handing the URL to the portal team

- [ ] `mvn test` in `backend/` passes all 8 parity tests
- [ ] `mvn spring-boot:run` starts the backend on port 8091 with no errors
- [ ] `npm run build` in `frontend/` produces output in `../backend/src/main/resources/static/`
- [ ] Opening the deployed URL shows the dashboard with seed expenses
- [ ] All four CRUD operations work via the UI (add, edit, mark paid, delete)
- [ ] Month filter narrows results correctly
- [ ] Deployed URL embeds correctly inside the portal locally (set `pawwwy.modules.hostelbills-url=http://localhost:8091`, run portal, click HostelBills card)
