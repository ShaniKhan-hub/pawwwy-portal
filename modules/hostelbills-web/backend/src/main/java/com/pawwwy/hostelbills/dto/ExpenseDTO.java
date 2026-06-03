package com.pawwwy.hostelbills.dto;

import com.pawwwy.hostelbills.model.Expense;

/**
 * What the frontend sees.
 *
 * <p>The original {@link Expense} has no notion of identity — the CLI uses ArrayList
 * indices to refer to an expense. We preserve that exactly in the REST layer: the
 * {@code index} field is the expense's current position in the manager's list, used
 * as its URL path parameter. Indices shift after a delete, so the frontend refetches
 * the list after every mutation. Same behaviour as the original.
 *
 * <p>All other fields are copied directly from the {@code Expense} getters — no
 * transformation, no renaming.
 */
public record ExpenseDTO(
        int index,
        String title,
        double amount,
        String date,
        String month,
        String status
) {
    public static ExpenseDTO from(int index, Expense e) {
        return new ExpenseDTO(
                index,
                e.getTitle(),
                e.getAmount(),
                e.getDate(),
                e.getMonth(),
                e.getStatus()
        );
    }
}
