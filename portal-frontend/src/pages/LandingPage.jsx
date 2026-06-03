import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight } from 'lucide-react';
import { fetchModules, fetchGroup } from '../api/client.js';
import { CatLogo } from '../components/CatLogo.jsx';
import { Wordmark } from '../components/Wordmark.jsx';
import { Eyebrow } from '../components/Eyebrow.jsx';
import { ModuleCard } from '../components/ModuleCard.jsx';
import { LandingBackground } from '../components/LandingBackground.jsx';

export function LandingPage() {
  const [modules, setModules] = useState(null);
  const [group, setGroup] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    Promise.all([
      fetchModules({ signal: ac.signal }),
      fetchGroup({ signal: ac.signal }),
    ])
      .then(([m, g]) => {
        setModules(m);
        setGroup(g);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err);
      });
    return () => ac.abort();
  }, []);

  return (
    <div className="container-page relative">
      <LandingBackground />

      {/* Content layer — sits above the paw-print backdrop */}
      <div className="relative z-10">
        <Hero group={group} />

        <ProjectsSection modules={modules} error={error} />

        <Outro />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Hero -- */

function Hero({ group }) {
  return (
    <section className="pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        }}
        className="flex flex-col items-center text-center"
      >
        <FadeUp>
          <CatLogo size={44} strokeWidth={1.5} className="text-accent mb-7 sm:mb-9" />
        </FadeUp>

        <FadeUp>
          <Eyebrow as="p" className="mb-5">
            BESE-31 C · MCS NUST · 2026
          </Eyebrow>
        </FadeUp>

        {/* Massive wordmark — the page's typographic anchor */}
        <FadeUp>
          <Wordmark
            as="h1"
            sizeClass="text-display-xl"
            className="text-ink mb-5 sm:mb-6"
          />
        </FadeUp>

        <FadeUp>
          <p className="font-display italic text-xl sm:text-2xl text-ink-muted max-w-prose-tight font-light leading-snug">
            {group?.tagline ?? 'Four projects. One portal.'}
          </p>
        </FadeUp>
      </motion.div>
    </section>
  );
}

function FadeUp({ children }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------- Projects -- */

function ProjectsSection({ modules, error }) {
  return (
    <section aria-labelledby="modules-heading" className="pb-16 sm:pb-20">
      <h2 id="modules-heading" className="sr-only">Modules</h2>

      {/* Section eyebrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex items-center gap-4 mb-10 sm:mb-12"
      >
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
        <span className="text-[11px] uppercase tracking-[0.3em] text-ink-faint">
          The projects
        </span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </motion.div>

      {error && <ErrorState error={error} />}
      {!error && !modules && <LoadingState />}

      {modules && (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 list-none">
          {modules.map((m, i) => (
            <li key={m.slug} className="h-full">
              <ModuleCard module={m} index={i} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ----------------------------------------------------------------- Outro -- */

function Outro() {
  return (
    <section className="pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-line pt-8">
        <p className="text-sm text-ink-muted max-w-prose-tight">
          An Object-Oriented Programming integration project from the Software Engineering programme
          at the Military College of Signals, NUST.
        </p>
        <Link
          to="/team"
          className="
            inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-accent
            transition-colors duration-200 whitespace-nowrap
          "
        >
          <span>Meet the team</span>
          <ArrowRight size={14} strokeWidth={1.75} />
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Misc states - */

function LoadingState() {
  return (
    <div className="grid place-items-center py-20 text-ink-faint" role="status" aria-live="polite">
      <Loader2 size={20} className="animate-spin" />
      <span className="sr-only">Loading modules…</span>
    </div>
  );
}

function ErrorState({ error }) {
  return (
    <div role="alert" className="card-minimal p-6 text-sm mt-4">
      <p className="font-medium text-ink mb-1">Couldn't reach the portal backend.</p>
      <p className="text-ink-muted">
        {error.message} Make sure the Spring Boot service is running on port 8090.
      </p>
    </div>
  );
}

export default LandingPage;
