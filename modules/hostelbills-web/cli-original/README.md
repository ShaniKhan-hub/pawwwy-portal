# HostelBillManager — Original CLI implementation

Author: **Insharah Iqbal**
Course: Object-Oriented Programming, BESE-31 C, MCS NUST

These four files are the **original** Java implementation of HostelBillManager as Insharah submitted it for the OOP class deliverable:

```
src/main/java/com/mycompany/hostelbillmanager/
├── Expense.java                Core data model
├── BillManager.java            Business logic (CRUD, totals, filtering)
├── BillUI.java                 Console UI (ANSI colors, Scanner input)
└── HostelBillManager.java      main() entry point
```

**These files are preserved byte-for-byte** (verified by MD5). Do not edit them.

They satisfy the OOP coursework rubric on their own. The web port in `../backend/` and `../frontend/` is a **separate re-implementation** of the same class design (`Expense` and `BillManager` are preserved with identical fields, methods, and semantics) so that the Pawwwy portal can iframe an interactive web version while keeping the original CLI intact for the academic submission.

## Run the original CLI

```bash
cd cli-original
javac -d target/classes src/main/java/com/mycompany/hostelbillmanager/*.java
java -cp target/classes com.mycompany.hostelbillmanager.HostelBillManager
```

You'll get the menu-driven, ANSI-coloured terminal interface as originally designed.

(`pom.xml` is the original Maven build file as Insharah committed it. It targets Java 25 via `maven.compiler.release=25` — you can lower this to your installed JDK if needed.)
