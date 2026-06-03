package com.pawwwy.hostelbills.controller;

import com.pawwwy.hostelbills.dto.AddExpenseRequest;
import com.pawwwy.hostelbills.dto.EditExpenseRequest;
import com.pawwwy.hostelbills.dto.ExpenseDTO;
import com.pawwwy.hostelbills.dto.SummaryDTO;
import com.pawwwy.hostelbills.service.BillService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API.
 *
 * <ul>
 *   <li>{@code GET    /api/expenses}              — full list</li>
 *   <li>{@code GET    /api/expenses?month=May}    — month filter (case-insensitive)</li>
 *   <li>{@code POST   /api/expenses}              — add</li>
 *   <li>{@code PUT    /api/expenses/{index}}      — edit (full body) </li>
 *   <li>{@code POST   /api/expenses/{index}/pay}  — mark paid</li>
 *   <li>{@code DELETE /api/expenses/{index}}      — delete</li>
 *   <li>{@code GET    /api/summary}               — totals + counts for dashboard</li>
 *   <li>{@code GET    /api/months}                — distinct months present (for filter UI)</li>
 *   <li>{@code GET    /api/health}                — health check</li>
 * </ul>
 */
@RestController
@RequestMapping("/api")
public class BillController {

    private final BillService service;

    public BillController(BillService service) {
        this.service = service;
    }

    @GetMapping("/expenses")
    public List<ExpenseDTO> list(@RequestParam(required = false) String month) {
        return (month == null || month.isBlank())
                ? service.list()
                : service.listByMonth(month);
    }

    @PostMapping("/expenses")
    public ResponseEntity<List<ExpenseDTO>> add(@Valid @RequestBody AddExpenseRequest req) {
        service.add(req.title(), req.amount(), req.date(), req.month());
        return ResponseEntity.ok(service.list());
    }

    @PutMapping("/expenses/{index}")
    public ResponseEntity<?> edit(@PathVariable int index,
                                  @RequestBody EditExpenseRequest req) {
        boolean ok = service.edit(index, req.title(), req.amount(), req.date(), req.markAsPaid());
        if (!ok) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(service.list());
    }

    @PostMapping("/expenses/{index}/pay")
    public ResponseEntity<?> markPaid(@PathVariable int index) {
        boolean ok = service.markPaid(index);
        if (!ok) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(service.list());
    }

    @DeleteMapping("/expenses/{index}")
    public ResponseEntity<?> delete(@PathVariable int index) {
        boolean ok = service.delete(index);
        if (!ok) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(service.list());
    }

    @GetMapping("/summary")
    public SummaryDTO summary() {
        return service.summary();
    }

    @GetMapping("/months")
    public List<String> months() {
        return service.months();
    }

    @GetMapping("/health")
    public Health health() {
        return new Health("ok", "hostelbills-web");
    }

    public record Health(String status, String service) {}
}
