package com.pawwwy.hostelbills.dto;

/**
 * The dashboard summary. Every field maps directly to a getter on
 * {@code BillManager} (one-to-one).
 */
public record SummaryDTO(
        double total,
        double paidTotal,
        double unpaidTotal,
        int totalCount,
        int paidCount,
        int unpaidCount
) {}
