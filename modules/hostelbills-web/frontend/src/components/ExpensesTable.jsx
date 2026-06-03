import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Pencil, Trash2, X, CheckCircle2, AlertCircle, Wallet } from 'lucide-react';

function formatRupees(n) {
  return new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatDate(iso) {
  if (!iso) return '—';
  // Accept either ISO "YYYY-MM-DD" or anything Date can parse.
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  } catch {
    return iso;
  }
}

export function ExpensesTable({ expenses, onEdit, onMarkPaid, onDelete, monthFilterActive }) {
  if (expenses && expenses.length === 0) {
    return <EmptyState monthFilterActive={monthFilterActive} />;
  }

  if (!expenses) return null;

  return (
    <div className="card-minimal overflow-hidden">
      {/* Desktop header */}
      <div className="hidden sm:grid grid-cols-[1fr_8rem_6rem_6rem_8rem_6rem] gap-4 px-5 py-3 border-b border-line text-[11px] uppercase tracking-[0.18em] text-ink-faint">
        <span>Title</span>
        <span className="text-right">Amount</span>
        <span>Date</span>
        <span>Month</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>

      <ul>
        <AnimatePresence initial={false}>
          {expenses.map((e) => (
            <ExpenseRow
              key={`${e.index}-${e.title}`}
              expense={e}
              onEdit={onEdit}
              onMarkPaid={onMarkPaid}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── Row ─── */

function ExpenseRow({ expense: e, onEdit, onMarkPaid, onDelete }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="border-b border-line last:border-b-0 bg-surface">
        <EditRow
          expense={e}
          onCancel={() => setEditing(false)}
          onSave={async (req) => {
            await onEdit(e.index, req);
            setEditing(false);
          }}
        />
      </li>
    );
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-line last:border-b-0 hover:bg-surface/50 transition-colors"
    >
      {/* Desktop row */}
      <div className="hidden sm:grid grid-cols-[1fr_8rem_6rem_6rem_8rem_6rem] gap-4 px-5 py-3.5 items-center text-sm">
        <span className="text-ink truncate">{e.title}</span>
        <span className="text-right tnum text-ink"><span className="text-ink-faint">Rs.</span> {formatRupees(e.amount)}</span>
        <span className="text-ink-muted tnum">{formatDate(e.date)}</span>
        <span className="text-ink-muted">{e.month}</span>
        <span>{e.status === 'Paid' ? <PaidPill /> : <UnpaidPill />}</span>
        <div className="flex items-center justify-end gap-1">
          {e.status !== 'Paid' && (
            <button
              type="button"
              onClick={() => onMarkPaid(e.index)}
              className="btn-icon"
              aria-label="Mark paid"
              title="Mark paid"
            >
              <Check size={15} strokeWidth={1.75} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="btn-icon"
            aria-label="Edit"
            title="Edit"
          >
            <Pencil size={14} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete "${e.title}"?`)) onDelete(e.index);
            }}
            className="btn-icon hover:text-unpaid"
            aria-label="Delete"
            title="Delete"
          >
            <Trash2 size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Mobile row */}
      <div className="sm:hidden p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-ink font-medium truncate">{e.title}</p>
            <p className="text-xs text-ink-faint mt-0.5">{formatDate(e.date)} · {e.month}</p>
          </div>
          <p className="text-ink tnum text-right whitespace-nowrap">
            <span className="text-ink-faint text-xs">Rs.</span> {formatRupees(e.amount)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          {e.status === 'Paid' ? <PaidPill /> : <UnpaidPill />}
          <div className="flex items-center gap-1">
            {e.status !== 'Paid' && (
              <button type="button" onClick={() => onMarkPaid(e.index)} className="btn-icon" aria-label="Mark paid"><Check size={15} strokeWidth={1.75} /></button>
            )}
            <button type="button" onClick={() => setEditing(true)} className="btn-icon" aria-label="Edit"><Pencil size={14} strokeWidth={1.75} /></button>
            <button
              type="button"
              onClick={() => { if (window.confirm(`Delete "${e.title}"?`)) onDelete(e.index); }}
              className="btn-icon hover:text-unpaid"
              aria-label="Delete"
            ><Trash2 size={14} strokeWidth={1.75} /></button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

/* ────────────────────────────────────────────────────────── Edit row ─── */

function EditRow({ expense, onCancel, onSave }) {
  const [title,  setTitle]  = useState(expense.title);
  const [amount, setAmount] = useState(String(expense.amount));
  const [date,   setDate]   = useState(expense.date);
  const [paid,   setPaid]   = useState(expense.status === 'Paid');
  const [busy, setBusy]     = useState(false);
  const [err, setErr]       = useState(null);

  const submit = async () => {
    setErr(null);
    try {
      setBusy(true);
      const amt = Number(amount);
      await onSave({
        title:      title.trim() === expense.title ? '' : title.trim(),
        amount:     amt > 0 && amt !== expense.amount ? amt : 0,
        date:       date === expense.date ? '' : date,
        markAsPaid: paid,
      });
    } catch (e) {
      setErr(e.message ?? 'Failed to save.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 sm:px-5 sm:py-4">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_8rem_8rem_auto_auto] gap-3 items-center">
        <input
          className="input-minimal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Title"
          placeholder="Title"
        />
        <input
          className="input-minimal tnum"
          type="number"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-label="Amount in rupees"
          placeholder="Amount"
        />
        <input
          className="input-minimal"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Date"
        />

        <label className="inline-flex items-center gap-2 text-sm text-ink-muted">
          <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} className="accent-accent" />
          <span>Paid</span>
        </label>

        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={submit} disabled={busy} className="btn-icon disabled:opacity-50" aria-label="Save">
            <Check size={16} strokeWidth={2} className="text-paid" />
          </button>
          <button type="button" onClick={onCancel} className="btn-icon" aria-label="Cancel">
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
      {err && <p className="text-xs text-unpaid mt-2">{err}</p>}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────── Pills ─── */

function PaidPill() {
  return (
    <span className="pill-paid">
      <CheckCircle2 size={11} strokeWidth={2.25} />
      <span>Paid</span>
    </span>
  );
}

function UnpaidPill() {
  return (
    <span className="pill-unpaid">
      <AlertCircle size={11} strokeWidth={2.25} />
      <span>Unpaid</span>
    </span>
  );
}

/* ───────────────────────────────────────────────────────── Empty ─── */

function EmptyState({ monthFilterActive }) {
  return (
    <div className="card-minimal py-14 px-6 text-center">
      <Wallet size={32} strokeWidth={1.25} className="text-ink-faint mx-auto mb-4" aria-hidden="true" />
      <p className="font-display text-xl tracking-tightest text-ink mb-2">
        {monthFilterActive ? 'No expenses for this month' : 'No expenses yet'}
      </p>
      <p className="text-sm text-ink-muted">
        {monthFilterActive
          ? 'Try a different month, or clear the filter.'
          : 'Add your first expense above to get started.'}
      </p>
    </div>
  );
}
