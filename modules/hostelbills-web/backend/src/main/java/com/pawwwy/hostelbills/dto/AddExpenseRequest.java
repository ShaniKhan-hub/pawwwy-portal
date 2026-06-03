package com.pawwwy.hostelbills.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

/**
 * Request body for {@code POST /api/expenses}.
 *
 * <p>Fields mirror Insharah's {@code BillManager.addExpense} signature one-for-one.
 */
public record AddExpenseRequest(
        @NotBlank String title,
        @Positive double amount,
        @NotBlank String date,
        @NotBlank String month
) {}
