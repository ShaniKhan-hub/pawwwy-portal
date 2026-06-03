import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Moon, Sun, Wallet } from 'lucide-react';
import { api } from './api.js';
import { SummaryCards } from './components/SummaryCards.jsx';
import { AddExpenseForm } from './components/AddExpenseForm.jsx';
import { ExpensesTable } from './components/ExpensesTable.jsx';

const THEME_KEY = 'hostelbills-theme';

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  const [expenses, setExpenses] = useState(null);
  const [summary,  setSummary]  = useState(null);
  const [months,   setMonths]   = useState([]);
  const [filterMonth, setFilterMonth] = useState('');   // '' = all
  const [error, setError] = useState(null);
  const [loadingFirst, setLoadingFirst] = useState(true);

  /* Theme toggle */
  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        if (next === 'dark') document.documentElement.classList.add('dark');
        else                 document.documentElement.classList.remove('dark');
        localStorage.setItem(THEME_KEY, next);
      } catch {}
      return next;
    });
  };

  /* Initial load + reload on filter change */
  const reload = useCallback(async () => {
    try {
      const [exps, sum, mns] = await Promise.all([
        api.listExpenses(filterMonth || undefined),
        api.summary(),
        api.months(),
      ]);
      setExpenses(exps);
      setSummary(sum);
      setMonths(mns);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoadingFirst(false);
    }
  }, [filterMonth]);

  useEffect(() => { reload(); }, [reload]);

  /* Mutation helpers — optimistic refetch */
  const handleAdd = async (req) => {
    await api.addExpense(req);
    await reload();
  };

  const handleEdit = async (idx, req) => {
    await api.editExpense(idx, req);
    await reload();
  };

  const handleMarkPaid = async (idx) => {
    await api.markPaid(idx);
    await reload();
  };

  const handleDelete = async (idx) => {
    await api.deleteExpense(idx);
    await reload();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="flex-1 container-page py-8 sm:py-10">
        {error && (
          <div role="alert" className="card-minimal p-5 mb-6 text-sm">
            <p className="font-medium text-ink mb-1">Couldn't reach the backend.</p>
            <p className="text-ink-muted">{error.message}</p>
            <p className="text-ink-faint mt-2 text-xs">
              Make sure the Spring Boot service is running on port 8091.
            </p>
          </div>
        )}

        {loadingFirst && !error && (
          <div className="grid place-items-center py-16 text-ink-faint" role="status" aria-live="polite">
            <Loader2 size={20} className="animate-spin" />
            <span className="sr-only">Loading…</span>
          </div>
        )}

        {!loadingFirst && !error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <SummaryCards summary={summary} />

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <MonthFilter
                months={months}
                value={filterMonth}
                onChange={setFilterMonth}
              />
              <AddExpenseForm onAdd={handleAdd} />
            </div>

            <ExpensesTable
              expenses={expenses}
              onEdit={handleEdit}
              onMarkPaid={handleMarkPaid}
              onDelete={handleDelete}
              monthFilterActive={Boolean(filterMonth)}
            />
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

/* ────────────────────────────────────────────────────────── Header ─── */

function Header({ theme, onToggleTheme }) {
  return (
    <header className="border-b border-line">
      <div className="container-page h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid place-items-center h-7 w-7 rounded-md bg-accent/12 text-accent">
            <Wallet size={14} strokeWidth={1.75} />
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display tracking-tightest text-lg text-ink font-medium">
              HostelBills
            </span>
            <span className="hidden sm:inline text-xs text-ink-faint">
              · Insharah Iqbal
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          className="btn-icon"
          aria-label={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
        >
          {theme === 'dark' ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
        </button>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────── Month filter ─── */

function MonthFilter({ months, value, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
        Filter
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-minimal h-9"
      >
        <option value="">All months</option>
        {months.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </label>
  );
}

/* ────────────────────────────────────────────────────────── Footer ─── */

function Footer() {
  return (
    <footer className="border-t border-line py-6 mt-12">
      <p className="container-page text-xs text-ink-faint text-center">
        HostelBills · Pawwwy · BESE-31 C · MCS NUST
      </p>
    </footer>
  );
}
