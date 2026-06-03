package com.pawwwy.hostelbills.model;

/**
 * Expense.
 *
 * <p>Original author: <b>Insharah Iqbal</b>. This class is preserved from the CLI version
 * with the same fields, the same constructor signature, the same getters and setters,
 * and the same {@code toString()} format ({@code title | Rs.amount | date | status}).
 * The only change from the original is the package declaration.
 *
 * <p>See {@code modules/hostelbills-web/cli-original/} for the byte-for-byte original.
 */
public class Expense {

    private String title;
    private double amount;
    private String date;
    private String month;
    private String status;

    public Expense(String title, double amount, String date, String month) {
        this.title  = title;
        this.amount = amount;
        this.date   = date;
        this.month  = month;
        this.status = "Unpaid";
    }

    // Getters
    public String getTitle()  { return title; }
    public double getAmount() { return amount; }
    public String getDate()   { return date; }
    public String getMonth()  { return month; }
    public String getStatus() { return status; }

    // Setters
    public void setTitle(String title)   { this.title  = title; }
    public void setAmount(double amount) { this.amount = amount; }
    public void setDate(String date)     { this.date   = date; }
    public void setMonth(String month)   { this.month  = month; }
    public void setStatus(String status) { this.status = status; }

    public void markPaid() { this.status = "Paid"; }

    @Override
    public String toString() {
        return title + " | Rs." + amount + " | " + date + " | " + status;
    }
}
