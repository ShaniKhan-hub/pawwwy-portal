package com.mycompany.hostelbillmanager;
 
import java.util.ArrayList;
 
public class BillManager {
 
    private ArrayList<Expense> expenses = new ArrayList<>();
 
    public void addExpense(String title, double amount, String date, String month) {
        expenses.add(new Expense(title, amount, date, month));
    }
 
    public void deleteExpense(int index) {
        if (isValidIndex(index)) expenses.remove(index);
    }
 
    // FIXED: added boolean markAsPaid as 5th parameter
    public void editExpense(int index, String title, double amount, String date, boolean markAsPaid) {
        if (isValidIndex(index)) {
            Expense e = expenses.get(index);
            if (!title.isEmpty()) e.setTitle(title);
            if (amount > 0)       e.setAmount(amount);
            if (!date.isEmpty())  e.setDate(date);
            e.setStatus(markAsPaid ? "Paid" : "Unpaid");
        }
    }
 
    public void markPaid(int index) {
        if (isValidIndex(index)) expenses.get(index).markPaid();
    }
 
    public double getTotal() {
        double t = 0;
        for (Expense e : expenses) t += e.getAmount();
        return t;
    }
 
    public double getPaidTotal() {
        double t = 0;
        for (Expense e : expenses)
            if (e.getStatus().equals("Paid")) t += e.getAmount();
        return t;
    }
 
    public double getUnpaidTotal() {
        double t = 0;
        for (Expense e : expenses)
            if (e.getStatus().equals("Unpaid")) t += e.getAmount();
        return t;
    }
 
    public int getTotalCount() { return expenses.size(); }
 
    public int getPaidCount() {
        int c = 0;
        for (Expense e : expenses)
            if (e.getStatus().equals("Paid")) c++;
        return c;
    }
 
    public int getUnpaidCount() {
        int c = 0;
        for (Expense e : expenses)
            if (e.getStatus().equals("Unpaid")) c++;
        return c;
    }
 
    public ArrayList<Expense> getExpenses()   { return expenses; }
    public boolean isEmpty()                   { return expenses.isEmpty(); }
    public boolean isValidIndex(int i)         { return i >= 0 && i < expenses.size(); }
 
    public ArrayList<Expense> filterByMonth(String month) {
        ArrayList<Expense> result = new ArrayList<>();
        for (Expense e : expenses)
            if (e.getMonth().equalsIgnoreCase(month))
                result.add(e);
        return result;
    }
}
 