import { motion } from 'framer-motion';
import { Receipt, CheckCircle2, AlertCircle } from 'lucide-react';

function formatRupees(n) {
  return new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

export function SummaryCards({ summary }) {
  if (!summary) return <div className="h-[7.5rem]" aria-hidden="true" />;

  const cards = [
    {
      key: 'total',
      label: 'Total',
      icon: Receipt,
      amount: summary.total,
      count: summary.totalCount,
      tone: 'ink',
    },
    {
      key: 'paid',
      label: 'Paid',
      icon: CheckCircle2,
      amount: summary.paidTotal,
      count: summary.paidCount,
      tone: 'paid',
    },
    {
      key: 'unpaid',
      label: 'Unpaid',
      icon: AlertCircle,
      amount: summary.unpaidTotal,
      count: summary.unpaidCount,
      tone: 'unpaid',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        const iconColorClass =
          c.tone === 'paid'   ? 'text-paid' :
          c.tone === 'unpaid' ? 'text-unpaid' :
                                'text-ink-faint';

        return (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="card-minimal p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint font-medium">
                {c.label}
              </span>
              <Icon size={16} strokeWidth={1.5} className={iconColorClass} aria-hidden="true" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-ink-faint">Rs.</span>
              <span className="font-display tracking-tightest text-3xl text-ink tnum">
                {formatRupees(c.amount)}
              </span>
            </div>
            <p className="text-xs text-ink-faint mt-1">
              {c.count} {c.count === 1 ? 'expense' : 'expenses'}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
