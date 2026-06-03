package com.pawwwy.hostelbills;

import com.pawwwy.hostelbills.model.BillManager;
import com.pawwwy.hostelbills.model.Expense;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Behavioural parity checks against Insharah's class design.
 *
 * <p>These tests deliberately exercise the {@link BillManager} as a plain
 * collaborator — no Spring, no REST — to prove the preserved class behaves
 * exactly as the original CLI version does. If any of these fail, the port
 * has drifted from the original design.
 */
class BillManagerParityTest {

    @Test
    void newManagerIsEmpty() {
        BillManager m = new BillManager();
        assertTrue(m.isEmpty());
        assertEquals(0, m.getTotalCount());
        assertEquals(0.0, m.getTotal(), 0.001);
    }

    @Test
    void addedExpenseStartsUnpaid() {
        BillManager m = new BillManager();
        m.addExpense("Mess fee", 9500.0, "2026-05-03", "May");

        assertEquals(1, m.getTotalCount());
        assertEquals(1, m.getUnpaidCount());
        assertEquals(0, m.getPaidCount());

        Expense e = m.getExpenses().get(0);
        assertEquals("Mess fee", e.getTitle());
        assertEquals(9500.0, e.getAmount(), 0.001);
        assertEquals("Unpaid", e.getStatus());
    }

    @Test
    void markPaidUpdatesStatusAndTotals() {
        BillManager m = new BillManager();
        m.addExpense("Mess fee", 9500.0, "2026-05-03", "May");
        m.addExpense("Laundry",   600.0, "2026-05-10", "May");

        m.markPaid(0);

        assertEquals("Paid",   m.getExpenses().get(0).getStatus());
        assertEquals("Unpaid", m.getExpenses().get(1).getStatus());
        assertEquals(9500.0, m.getPaidTotal(),   0.001);
        assertEquals( 600.0, m.getUnpaidTotal(), 0.001);
        assertEquals(10100.0, m.getTotal(),     0.001);
    }

    @Test
    void editExpenseFollowsOriginalSemantics() {
        BillManager m = new BillManager();
        m.addExpense("Mess fee", 9500.0, "2026-05-03", "May");

        // Empty title => keep, amount <= 0 => keep, empty date => keep, set paid
        m.editExpense(0, "", 0, "", true);

        Expense e = m.getExpenses().get(0);
        assertEquals("Mess fee", e.getTitle());
        assertEquals(9500.0,     e.getAmount(), 0.001);
        assertEquals("2026-05-03", e.getDate());
        assertEquals("Paid",     e.getStatus());

        // Non-empty title overwrites
        m.editExpense(0, "Hostel mess", 0, "", true);
        assertEquals("Hostel mess", m.getExpenses().get(0).getTitle());
    }

    @Test
    void deleteByIndexShiftsRemainingDown() {
        BillManager m = new BillManager();
        m.addExpense("A", 100, "d1", "May");
        m.addExpense("B", 200, "d2", "May");
        m.addExpense("C", 300, "d3", "June");

        m.deleteExpense(0);

        assertEquals(2, m.getTotalCount());
        assertEquals("B", m.getExpenses().get(0).getTitle());
        assertEquals("C", m.getExpenses().get(1).getTitle());
    }

    @Test
    void invalidIndexIsNoop() {
        BillManager m = new BillManager();
        m.addExpense("A", 100, "d1", "May");

        m.deleteExpense(5);            // out of bounds
        m.editExpense(-1, "X", 1, "d", true);
        m.markPaid(99);

        assertEquals(1, m.getTotalCount());
        assertEquals("Unpaid", m.getExpenses().get(0).getStatus());
    }

    @Test
    void filterByMonthIsCaseInsensitive() {
        BillManager m = new BillManager();
        m.addExpense("A", 100, "d1", "May");
        m.addExpense("B", 200, "d2", "May");
        m.addExpense("C", 300, "d3", "June");

        assertEquals(2, m.filterByMonth("may").size());
        assertEquals(2, m.filterByMonth("MAY").size());
        assertEquals(1, m.filterByMonth("June").size());
        assertEquals(0, m.filterByMonth("July").size());
    }

    @Test
    void toStringFormatMatchesOriginal() {
        Expense e = new Expense("Mess", 9500.0, "2026-05-03", "May");
        assertEquals("Mess | Rs.9500.0 | 2026-05-03 | Unpaid", e.toString());
    }
}
