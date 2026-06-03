import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const todayIso = () => new Date().toISOString().split('T')[0];
const currentMonthName = () => MONTHS[new Date().getMonth()];

export function AddExpenseForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title,  setTitle]  = useState('');
  const [amount, setAmount] = useState('');
  const [date,   setDate]   = useState(todayIso());
  const [month,  setMonth]  = useState(currentMonthName());
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  const reset = () => {
    setTitle('');
    setAmount('');
    setDate(todayIso());
    setMonth(currentMonthName());
    setErr(null);
  };

  const close = () => { setOpen(false); reset(); };

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    const amt = Number(amount);
    if (!title.trim())  { setErr('Title is required.'); return; }
    if (!amt || amt <= 0) { setErr('Amount must be positive.'); return; }
    if (!date)          { setErr('Date is required.'); return; }
    if (!month)         { setErr('Month is required.'); return; }

    try {
      setSubmitting(true);
      await onAdd({ title: title.trim(), amount: amt, date, month });
      reset();
      setOpen(false);
    } catch (e) {
      setErr(e.message ?? 'Failed to add expense.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {!open ? (
          <motion.button
            key="trigger"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="btn-primary"
          >
            <Plus size={16} strokeWidth={2} />
            <span>Add expense</span>
          </motion.button>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="card-minimal p-5"
            aria-label="Add a new expense"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display tracking-tightest text-xl text-ink">New expense</h3>
              <button
                type="button"
                onClick={close}
                className="btn-icon"
                aria-label="Cancel"
              >
                <X size={16} strokeWidth={1.75} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Field label="Title">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mess fee"
                  className="input-minimal w-full"
                  autoFocus
                />
              </Field>

              <Field label="Amount (Rs.)">
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="input-minimal w-full tnum"
                />
              </Field>

              <Field label="Date">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-minimal w-full"
                />
              </Field>

              <Field label="Month">
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="input-minimal w-full"
                >
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
            </div>

            {err && <p className="text-sm text-unpaid mt-3" role="alert">{err}</p>}

            <div className="flex items-center justify-end gap-2 mt-5">
              <button type="button" onClick={close} className="btn-ghost">Cancel</button>
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                {submitting ? 'Adding…' : 'Add expense'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.18em] text-ink-faint mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
