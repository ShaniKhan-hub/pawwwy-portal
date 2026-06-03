package com.mycompany.hostelbillmanager;
 
import java.util.ArrayList;
import java.util.Scanner;
 
public class BillUI {
 
    static final String RESET  = "\u001B[0m";
    static final String RED    = "\u001B[31m";
    static final String GREEN  = "\u001B[32m";
    static final String YELLOW = "\u001B[33m";
    static final String BLUE   = "\u001B[34m";
    static final String PURPLE = "\u001B[35m";
    static final String CYAN   = "\u001B[36m";
    static final String WHITE  = "\u001B[37m";
    static final String BOLD   = "\u001B[1m";
 
    private BillManager manager = new BillManager();
    private Scanner sc          = new Scanner(System.in);
 
    // Auto extract month from date YYYY-MM-DD
    private String extractMonth(String date) {
        String[] months = {
            "January","February","March","April","May","June",
            "July","August","September","October","November","December"
        };
        try {
            String[] parts = date.split("-");
            int year  = Integer.parseInt(parts[0]);
            int month = Integer.parseInt(parts[1]);
            if (month >= 1 && month <= 12)
                return months[month - 1] + " " + year;
        } catch (Exception e) {}
        return date;
    }
 
    // -------------------------------------------------------
    //  MAIN MENU
    // -------------------------------------------------------
    public void showMenu() {
        while (true) {
            clearScreen();
            showDashboard();
            System.out.println(CYAN + BOLD
                + "  +==================================+"
                + "\n  |       HOSTEL BILL MANAGER        |"
                + "\n  +==================================+"
                + "\n  |  1.  Add Expense                 |"
                + "\n  |  2.  View All Expenses           |"
                + "\n  |  3.  Edit Expense                |"
                + "\n  |  4.  Delete Expense              |"
                + "\n  |  5.  Mark Expense as Paid        |"
                + "\n  |  6.  View Monthly Summary        |"
                + "\n  |  7.  View Totals                 |"
                + "\n  |  8.  Exit                        |"
                + "\n  +==================================+"
                + RESET);
            System.out.print(YELLOW + BOLD + "\n  Choose option (1-8): " + RESET);
            String choice = sc.nextLine().trim();
            handle(choice);
        }
    }
 
    // -------------------------------------------------------
    //  DASHBOARD
    // -------------------------------------------------------
    private void showDashboard() {
        System.out.println(PURPLE + BOLD
            + "  +==================================+"
            + "\n  |         QUICK SUMMARY            |"
            + "\n  +==================================+");
        System.out.printf("  |  Total Expenses  : %-14d|%n", manager.getTotalCount());
        System.out.printf("  |  Total Amount    : Rs. %-11.2f|%n", manager.getTotal());
        System.out.printf("  |  Paid            : %-14d|%n", manager.getPaidCount());
        System.out.printf("  |  Unpaid          : %-14d|%n", manager.getUnpaidCount());
        System.out.println("  +==================================+" + RESET);
        System.out.println();
    }
 
    // -------------------------------------------------------
    //  HANDLE CHOICE
    // -------------------------------------------------------
    private void handle(String choice) {
        switch (choice) {
            case "1": addForm();      break;
            case "2": viewAll();      break;
            case "3": editForm();     break;
            case "4": deleteForm();   break;
            case "5": markPaidForm(); break;
            case "6": monthlyForm();  break;
            case "7": showTotals();   break;
            case "8": exitApp();      break;
            default:
                showError("Invalid choice! Please enter a number from 1 to 8.");
                pause();
        }
    }
 
    // -------------------------------------------------------
    //  1. ADD EXPENSE
    // -------------------------------------------------------
    private void addForm() {
        clearScreen();
        printHeader("ADD NEW EXPENSE");
 
        String title = getStringInput("  Expense Title          : ");
        if (title.isEmpty()) {
            showError("Title cannot be empty!");
            pause();
            return;
        }
 
        double amount = getDoubleInput("  Amount (Rs.)           : ");
        if (amount <= 0) {
            showError("Amount must be greater than zero!");
            pause();
            return;
        }
 
        String date  = getDateInput("  Date (YYYY-MM-DD)      : ");
        String month = extractMonth(date);
        System.out.println(GREEN + "  Month set to: " + month + RESET);
 
        manager.addExpense(title, amount, date, month);
        showSuccess("Expense \"" + title + "\" added successfully!");
        pause();
    }
 
    // -------------------------------------------------------
    //  2. VIEW ALL
    // -------------------------------------------------------
    private void viewAll() {
        clearScreen();
        printHeader("ALL EXPENSES");
 
        if (manager.isEmpty()) {
            showError("No expenses recorded yet!");
            pause();
            return;
        }
 
        printTableHeader();
        ArrayList<Expense> list = manager.getExpenses();
        for (int i = 0; i < list.size(); i++)
            printTableRow(i, list.get(i));
        printTableFooter();
        pause();
    }
 
    // -------------------------------------------------------
    //  3. EDIT EXPENSE
    // -------------------------------------------------------
    private void editForm() {
        clearScreen();
        printHeader("EDIT EXPENSE");
 
        if (manager.isEmpty()) {
            showError("No expenses to edit!");
            pause();
            return;
        }
 
        printTableHeader();
        ArrayList<Expense> list = manager.getExpenses();
        for (int i = 0; i < list.size(); i++)
            printTableRow(i, list.get(i));
        printTableFooter();
 
        int idx = getIntInput("  Enter index to edit    : ");
        if (!manager.isValidIndex(idx)) {
            showError("Invalid index! Please choose a number from the list.");
            pause();
            return;
        }
 
        Expense current = manager.getExpenses().get(idx);
 
        clearScreen();
        printHeader("EDIT EXPENSE");
 
        System.out.println(YELLOW + BOLD
            + "  Editing: " + current.getTitle() + RESET);
        System.out.println(YELLOW
            + "  Just type the new value and press Enter."
            + "\n  To KEEP the current value, just press Enter without typing.\n"
            + RESET);
 
        // ----- Title -----
        System.out.println(CYAN + "  Current Title  : " + current.getTitle() + RESET);
        String title = getStringInput("  New Title       : ");
        if (title.isEmpty()) {
            title = current.getTitle();
            System.out.println(GREEN + "  Kept: " + title + RESET);
        } else {
            System.out.println(GREEN + "  Changed to: " + title + RESET);
        }
 
        System.out.println();
 
        // ----- Amount -----
        System.out.println(CYAN + "  Current Amount : Rs." + current.getAmount() + RESET);
        String amtInput = getStringInput("  New Amount (numbers only): ");
        double amount;
        if (amtInput.isEmpty()) {
            amount = current.getAmount();
            System.out.println(GREEN + "  Kept: Rs." + amount + RESET);
        } else {
            try {
                amount = Double.parseDouble(amtInput);
                if (amount <= 0) {
                    amount = current.getAmount();
                    System.out.println(YELLOW + "  Must be > 0! Kept: Rs." + amount + RESET);
                } else {
                    System.out.println(GREEN + "  Changed to: Rs." + amount + RESET);
                }
            } catch (NumberFormatException e) {
                amount = current.getAmount();
                System.out.println(YELLOW + "  Invalid number! Kept: Rs." + amount + RESET);
            }
        }
 
        System.out.println();
 
        // ----- Date -----
        System.out.println(CYAN + "  Current Date   : " + current.getDate() + RESET);
        String date = getStringInput("  New Date (YYYY-MM-DD): ");
        if (date.isEmpty() || !date.matches("\\d{4}-\\d{2}-\\d{2}")) {
            date = current.getDate();
            System.out.println(GREEN + "  Kept: " + date + RESET);
        } else {
            String newMonth = extractMonth(date);
            System.out.println(GREEN + "  Changed to: " + date + RESET);
            System.out.println(GREEN + "  Month updated to: " + newMonth + RESET);
        }
 
        System.out.println();
 
        // ----- Status (NEW FIX) -----
        System.out.println(CYAN + "  Current Status : " + current.getStatus() + RESET);
        System.out.println(YELLOW + "  Type 'paid' or 'unpaid', or press Enter to keep current." + RESET);
        String statusInput = getStringInput("  New Status      : ");
        boolean markAsPaid;
        if (statusInput.equalsIgnoreCase("paid")) {
            markAsPaid = true;
            System.out.println(GREEN + "  Changed to: Paid" + RESET);
        } else if (statusInput.equalsIgnoreCase("unpaid")) {
            markAsPaid = false;
            System.out.println(GREEN + "  Changed to: Unpaid" + RESET);
        } else {
            markAsPaid = current.getStatus().equals("Paid");
            System.out.println(GREEN + "  Kept: " + current.getStatus() + RESET);
        }
 
        manager.editExpense(idx, title, amount, date, markAsPaid);
        showSuccess("Expense updated successfully!");
        pause();
    }
 
    // -------------------------------------------------------
    //  4. DELETE EXPENSE
    // -------------------------------------------------------
    private void deleteForm() {
        clearScreen();
        printHeader("DELETE EXPENSE");
 
        if (manager.isEmpty()) {
            showError("No expenses to delete!");
            pause();
            return;
        }
 
        printTableHeader();
        ArrayList<Expense> list = manager.getExpenses();
        for (int i = 0; i < list.size(); i++)
            printTableRow(i, list.get(i));
        printTableFooter();
 
        int idx = getIntInput("  Enter index to delete  : ");
        if (!manager.isValidIndex(idx)) {
            showError("Invalid index! Please choose a number from the list.");
            pause();
            return;
        }
 
        String name = manager.getExpenses().get(idx).getTitle();
        System.out.print(RED + BOLD
            + "\n  Are you sure you want to delete \""
            + name + "\"? (y/n): " + RESET);
        String confirm = sc.nextLine().trim().toLowerCase();
 
        if (confirm.equals("y")) {
            manager.deleteExpense(idx);
            showSuccess("\"" + name + "\" deleted successfully!");
        } else {
            System.out.println(YELLOW + "\n  Deletion cancelled. No changes made." + RESET);
        }
        pause();
    }
 
    // -------------------------------------------------------
    //  5. MARK AS PAID
    // -------------------------------------------------------
    private void markPaidForm() {
        clearScreen();
        printHeader("MARK EXPENSE AS PAID");
 
        if (manager.isEmpty()) {
            showError("No expenses found!");
            pause();
            return;
        }
 
        printTableHeader();
        ArrayList<Expense> list = manager.getExpenses();
        for (int i = 0; i < list.size(); i++)
            printTableRow(i, list.get(i));
        printTableFooter();
 
        int idx = getIntInput("  Enter index to mark paid: ");
        if (!manager.isValidIndex(idx)) {
            showError("Invalid index! Please choose a number from the list.");
            pause();
            return;
        }
 
        Expense selected = manager.getExpenses().get(idx);
 
        // Already paid
        if (selected.getStatus().equals("Paid")) {
            clearScreen();
            printHeader("ALREADY PAID");
            System.out.println(GREEN + BOLD
                + "  +==================================+"
                + "\n  |        PAYMENT CONFIRMED!        |"
                + "\n  +==================================+"
                + RESET);
            System.out.println(CYAN  + BOLD + "\n  Title   : " + selected.getTitle()  + RESET);
            System.out.println(WHITE + BOLD + "  Amount  : Rs." + selected.getAmount() + RESET);
            System.out.println(WHITE + BOLD + "  Date    : " + selected.getDate()    + RESET);
            System.out.println(WHITE + BOLD + "  Month   : " + selected.getMonth()   + RESET);
            System.out.println(GREEN + BOLD + "  Status  : Already PAID!"             + RESET);
            System.out.println(GREEN + BOLD
                + "\n  This bill was already paid by you this month!"
                + RESET);
            pause();
            return;
        }
 
        // Confirm payment
        System.out.print(YELLOW + BOLD
            + "\n  Mark \"" + selected.getTitle()
            + "\" of Rs." + selected.getAmount()
            + " as Paid? (y/n): " + RESET);
        String confirm = sc.nextLine().trim().toLowerCase();
 
        if (!confirm.equals("y")) {
            System.out.println(YELLOW + "\n  Cancelled. No changes made." + RESET);
            pause();
            return;
        }
 
        manager.markPaid(idx);
 
        clearScreen();
        printHeader("PAYMENT SUCCESSFUL");
        System.out.println(GREEN + BOLD
            + "  +==================================+"
            + "\n  |      PAYMENT CONFIRMED! :)       |"
            + "\n  +==================================+"
            + RESET);
        System.out.println(CYAN  + BOLD + "\n  Title   : " + selected.getTitle()  + RESET);
        System.out.println(WHITE + BOLD + "  Amount  : Rs." + selected.getAmount() + RESET);
        System.out.println(WHITE + BOLD + "  Date    : " + selected.getDate()    + RESET);
        System.out.println(WHITE + BOLD + "  Month   : " + selected.getMonth()   + RESET);
        System.out.println(GREEN + BOLD + "  Status  : PAID!"                     + RESET);
        System.out.println(GREEN + BOLD
            + "\n  You have successfully paid this bill"
            + "\n  for the month of " + selected.getMonth() + "!"
            + RESET);
        pause();
    }
 
    // -------------------------------------------------------
    //  6. MONTHLY SUMMARY
    // -------------------------------------------------------
    private void monthlyForm() {
        clearScreen();
        printHeader("MONTHLY SUMMARY");
 
        if (!manager.isEmpty()) {
            System.out.println(CYAN + "  Available months in records:" + RESET);
            ArrayList<String> seen = new ArrayList<>();
            for (Expense e : manager.getExpenses()) {
                if (!seen.contains(e.getMonth())) {
                    seen.add(e.getMonth());
                    System.out.println(CYAN + "   - " + e.getMonth() + RESET);
                }
            }
            System.out.println();
        }
 
        String month = getStringInput("  Enter Month (e.g. April 2026): ");
        if (month.isEmpty()) {
            showError("Month cannot be empty!");
            pause();
            return;
        }
 
        ArrayList<Expense> list = manager.filterByMonth(month);
        if (list.isEmpty()) {
            showError("No records found for: " + month);
            pause();
            return;
        }
 
        printTableHeader();
        for (int i = 0; i < list.size(); i++)
            printTableRow(i, list.get(i));
        printTableFooter();
 
        double total = 0, paid = 0, unpaid = 0;
        for (Expense e : list) {
            total += e.getAmount();
            if (e.getStatus().equals("Paid")) paid   += e.getAmount();
            else                              unpaid += e.getAmount();
        }
 
        System.out.println(CYAN  + BOLD + "  Month Total   : Rs. " + String.format("%.2f", total)  + RESET);
        System.out.println(GREEN + BOLD + "  Paid          : Rs. " + String.format("%.2f", paid)   + RESET);
        System.out.println(RED   + BOLD + "  Unpaid        : Rs. " + String.format("%.2f", unpaid) + RESET);
        pause();
    }
 
    // -------------------------------------------------------
    //  7. VIEW TOTALS
    // -------------------------------------------------------
    private void showTotals() {
        clearScreen();
        printHeader("TOTALS SUMMARY");
        System.out.println(CYAN  + BOLD + "  Total Expenses : " + manager.getTotalCount()                             + RESET);
        System.out.println(WHITE + BOLD + "  Total Amount   : Rs. " + String.format("%.2f", manager.getTotal())       + RESET);
        System.out.println(GREEN + BOLD + "  Paid Amount    : Rs. " + String.format("%.2f", manager.getPaidTotal())   + RESET);
        System.out.println(RED   + BOLD + "  Unpaid Amount  : Rs. " + String.format("%.2f", manager.getUnpaidTotal()) + RESET);
        pause();
    }
 
    // -------------------------------------------------------
    //  8. EXIT
    // -------------------------------------------------------
    private void exitApp() {
        clearScreen();
        System.out.println(CYAN + BOLD
            + "\n  +==================================+"
            + "\n  |    Thank you for using HBM!      |"
            + "\n  |          Goodbye! :)             |"
            + "\n  +==================================+\n"
            + RESET);
        System.exit(0);
    }
 
    // -------------------------------------------------------
    //  TABLE HELPERS
    // -------------------------------------------------------
    private void printTableHeader() {
        System.out.println(BLUE + BOLD
            + "\n  +-----+------------------+----------+------------+----------+"
            +   "\n  | No. | Title            | Amount   | Date       | Status   |"
            +   "\n  +-----+------------------+----------+------------+----------+"
            + RESET);
    }
 
    private void printTableRow(int i, Expense e) {
        String statusColor = e.getStatus().equals("Paid") ? GREEN : RED;
        System.out.printf(
            BLUE + "  | " + RESET + "%-3d " +
            BLUE + "| " + RESET + "%-16s " +
            BLUE + "| " + RESET + "%-8.2f " +
            BLUE + "| " + RESET + "%-10s " +
            BLUE + "| " + statusColor + "%-8s " + RESET +
            BLUE + "|" + RESET + "%n",
            i, e.getTitle(), e.getAmount(), e.getDate(), e.getStatus());
    }
 
    private void printTableFooter() {
        System.out.println(BLUE + BOLD
            + "  +-----+------------------+----------+------------+----------+"
            + RESET + "\n");
    }
 
    // -------------------------------------------------------
    //  UI HELPERS
    // -------------------------------------------------------
    private void printHeader(String title) {
        System.out.println(CYAN + BOLD
            + "\n  +======================================+"
            + "\n        " + title
            + "\n  +======================================+"
            + RESET + "\n");
    }
 
    private void showSuccess(String msg) {
        System.out.println(GREEN + BOLD + "\n  [OK] " + msg + RESET);
    }
 
    private void showError(String msg) {
        System.out.println(RED + BOLD + "\n  [!!] " + msg + RESET);
    }
 
    private void pause() {
        System.out.print(YELLOW + "\n  Press Enter to go back to menu..." + RESET);
        sc.nextLine();
    }
 
    private void clearScreen() {
        for (int i = 0; i < 50; i++) System.out.println();
    }
 
    // -------------------------------------------------------
    //  INPUT HELPERS
    // -------------------------------------------------------
    private String getStringInput(String prompt) {
        System.out.print(WHITE + prompt + RESET);
        return sc.nextLine().trim();
    }
 
    private double getDoubleInput(String prompt) {
        while (true) {
            try {
                System.out.print(WHITE + prompt + RESET);
                String in = sc.nextLine().trim();
                if (in.isEmpty()) return 0;
                double val = Double.parseDouble(in);
                if (val < 0) {
                    showError("Please enter a positive number!");
                    continue;
                }
                return val;
            } catch (NumberFormatException e) {
                showError("Invalid amount! Please enter a number (e.g. 1500).");
            }
        }
    }
 
    private int getIntInput(String prompt) {
        while (true) {
            try {
                System.out.print(WHITE + prompt + RESET);
                return Integer.parseInt(sc.nextLine().trim());
            } catch (NumberFormatException e) {
                showError("Invalid input! Please enter a whole number.");
            }
        }
    }
 
    private String getDateInput(String prompt) {
        while (true) {
            System.out.print(WHITE + prompt + RESET);
            String in = sc.nextLine().trim();
            if (in.isEmpty()) return "";
            if (in.matches("\\d{4}-\\d{2}-\\d{2}")) return in;
            showError("Invalid format! Please use YYYY-MM-DD (e.g. 2026-04-15).");
        }
    }
}
 