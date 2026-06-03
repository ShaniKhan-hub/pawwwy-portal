package com.pawwwy.hostelbills.dto;

/**
 * Request body for {@code PUT /api/expenses/{index}}.
 *
 * <p>Fields mirror Insharah's {@code BillManager.editExpense}:
 * {@code (index, title, amount, date, markAsPaid)}. The index is part of the URL;
 * the other four arrive in the body. {@code title} or {@code date} may be the empty
 * string to mean "leave unchanged", and {@code amount <= 0} also means unchanged —
 * matching the original semantics exactly.
 */
public record EditExpenseRequest(
        String title,
        double amount,
        String date,
        boolean markAsPaid
) {}
