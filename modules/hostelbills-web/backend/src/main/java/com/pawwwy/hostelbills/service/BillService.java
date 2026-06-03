package com.pawwwy.hostelbills.service;

import com.pawwwy.hostelbills.dto.ExpenseDTO;
import com.pawwwy.hostelbills.dto.SummaryDTO;
import com.pawwwy.hostelbills.model.BillManager;
import com.pawwwy.hostelbills.model.Expense;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Spring service wrapping Insharah's {@link BillManager}.
 *
 * <p>This class deliberately holds only one collaborator — a singleton
 * {@code BillManager} — and forwards every call straight through. No business
 * logic is duplicated; the only translation that happens here is wrapping each
 * {@link Expense} in an {@link ExpenseDTO} (which adds the array index) for the
 * REST response.
 *
 * <p>On startup we seed three demo expenses so the empty state isn't the first
 * thing a fresh visitor sees on the deployed instance. Easy to clear via DELETE.
 */
@Service
public class BillService {

    private final BillManager manager = new BillManager();

    @PostConstruct
    void seedDemoData() {
        manager.addExpense("Hostel mess fee",  9500.00, "2026-05-03", "May");
        manager.addExpense("Laundry",           600.00, "2026-05-10", "May");
        manager.addExpense("Internet share",   1200.00, "2026-05-12", "May");
        manager.markPaid(0); // mark the mess fee paid by default
    }

    /* ---------------------------------------------------------- queries -- */

    public List<ExpenseDTO> list() {
        return toDto(manager.getExpenses());
    }

    public List<ExpenseDTO> listByMonth(String month) {
        // We need the original indices, so filter on the full list rather than
        // calling manager.filterByMonth (which would lose them).
        ArrayList<Expense> all = manager.getExpenses();
        List<ExpenseDTO> result = new ArrayList<>();
        for (int i = 0; i < all.size(); i++) {
            Expense e = all.get(i);
            if (e.getMonth().equalsIgnoreCase(month)) {
                result.add(ExpenseDTO.from(i, e));
            }
        }
        return result;
    }

    public SummaryDTO summary() {
        return new SummaryDTO(
                manager.getTotal(),
                manager.getPaidTotal(),
                manager.getUnpaidTotal(),
                manager.getTotalCount(),
                manager.getPaidCount(),
                manager.getUnpaidCount()
        );
    }

    public List<String> months() {
        // Distinct months currently present, preserving first-seen order.
        ArrayList<String> seen = new ArrayList<>();
        for (Expense e : manager.getExpenses()) {
            String m = e.getMonth();
            if (m != null && !seen.contains(m)) seen.add(m);
        }
        return seen;
    }

    /* -------------------------------------------------------- mutations -- */

    public void add(String title, double amount, String date, String month) {
        manager.addExpense(title, amount, date, month);
    }

    public boolean edit(int index, String title, double amount, String date, boolean markAsPaid) {
        if (!manager.isValidIndex(index)) return false;
        manager.editExpense(index,
                title == null ? "" : title,
                amount,
                date  == null ? "" : date,
                markAsPaid);
        return true;
    }

    public boolean delete(int index) {
        if (!manager.isValidIndex(index)) return false;
        manager.deleteExpense(index);
        return true;
    }

    public boolean markPaid(int index) {
        if (!manager.isValidIndex(index)) return false;
        manager.markPaid(index);
        return true;
    }

    /* ----------------------------------------------------------- helpers - */

    private List<ExpenseDTO> toDto(ArrayList<Expense> in) {
        List<ExpenseDTO> out = new ArrayList<>(in.size());
        for (int i = 0; i < in.size(); i++) {
            out.add(ExpenseDTO.from(i, in.get(i)));
        }
        return out;
    }
}
