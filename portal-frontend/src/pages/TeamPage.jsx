import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { fetchGroup, fetchModules } from '../api/client.js';
import { Eyebrow } from '../components/Eyebrow.jsx';
import { MemberCard } from '../components/MemberCard.jsx';

export function TeamPage() {
  const [group, setGroup]     = useState(null);
  const [modules, setModules] = useState(null);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    Promise.all([
      fetchGroup({ signal: ac.signal }),
      fetchModules({ signal: ac.signal }),
    ])
      .then(([g, m]) => { setGroup(g); setModules(m); })
      .catch((err) => err.name !== 'AbortError' && setError(err));
    return () => ac.abort();
  }, []);

  // Resolve module-by-slug map so each MemberCard gets its accent color + link.
  const moduleBySlug = useMemo(() => {
    if (!modules) return {};
    return Object.fromEntries(modules.map((m) => [m.slug, m]));
  }, [modules]);

  return (
    <div className="container-page">
      <Hero />

      <section aria-labelledby="team-heading" className="pb-16">
        <h2 id="team-heading" className="sr-only">Members</h2>

        {error && <ErrorState error={error} />}
        {!error && !group && <LoadingState />}

        {group && (
          <>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {group.members.map((member, i) => (
                <MemberCard
                  key={member.name}
                  member={member}
                  module={moduleBySlug[member.moduleSlug]}
                  index={i}
                />
              ))}
            </ol>

            <Outro group={group} />
          </>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ Hero -- */

function Hero() {
  return (
    <section className="pt-16 sm:pt-24 pb-12 sm:pb-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        }}
        className="max-w-3xl"
      >
        <FadeUp>
          <Eyebrow as="p" className="mb-5">The team</Eyebrow>
        </FadeUp>

        <FadeUp>
          <h1 className="font-display text-display-lg tracking-tightest text-ink leading-[1.05] mb-6">
            Made by{' '}
            <span className="italic font-light text-ink-muted">four</span>{' '}
            classmates.
          </h1>
        </FadeUp>

        <FadeUp>
          <p className="text-base sm:text-lg text-ink-muted font-light leading-relaxed">
            Pawwwy is the integration of four individual projects, each built by a member
            of the team as part of the Object-Oriented Programming course at MCS NUST.
            One portal, four modules, one shared semester.
          </p>
        </FadeUp>

        {/* Hairline divider into the cards */}
        <FadeUp>
          <div className="flex items-center gap-4 mt-12 sm:mt-14">
            <span className="h-px w-12 bg-line" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-ink-faint">
              The four
            </span>
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
          </div>
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

/* ----------------------------------------------------------------- Outro -- */

function Outro({ group }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mt-16 pt-10 border-t border-line"
    >
      <div className="max-w-3xl">
        <Eyebrow as="p" className="mb-4">Course</Eyebrow>
        <p className="font-display text-2xl tracking-tightest text-ink leading-snug mb-1">
          {group.university}
        </p>
        <p className="text-sm text-ink-muted">
          {group.batch} · {group.course}
        </p>
      </div>
    </motion.section>
  );
}

/* ----------------------------------------------------------------- Misc --- */

function LoadingState() {
  return (
    <div className="grid place-items-center py-16 text-ink-faint" role="status" aria-live="polite">
      <Loader2 size={20} className="animate-spin" />
      <span className="sr-only">Loading team…</span>
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

export default TeamPage;
