import React from 'react';
import { MousePointerClick, CalendarClock, House } from 'lucide-react';

const STEPS = [
  {
    icon: MousePointerClick,
    label: '01',
    title: 'Pick a service',
    desc: 'Browse five verified categories — doctor, nurse, physio, lab or elderly care.',
  },
  {
    icon: CalendarClock,
    label: '02',
    title: 'Choose a slot',
    desc: 'Same-day slots across the city. Pick what works for you, even later tonight.',
  },
  {
    icon: House,
    label: '03',
    title: 'Get cared for',
    desc: 'Pro arrives within 60 minutes. Pay after the visit. We follow up the next day.',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-[12px] uppercase tracking-[0.18em] font-semibold text-emerald-400">
          How it works
        </p>
        <h2 className="mt-2 text-[28px] md:text-[36px] font-extrabold tracking-tight">
          Three steps. No paperwork.
        </h2>
        <p className="mt-3 text-[14px] md:text-[15px] text-zinc-400">
          We took the friction out of getting care at home. Here’s exactly
          what happens when you book.
        </p>
      </div>

      <div className="relative mt-12">
        {/* dashed connector line on desktop */}
        <div
          className="hidden md:block absolute top-7 left-12 right-12 h-px"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to right, rgba(16,185,129,0.45) 0 6px, transparent 6px 14px)',
          }}
        />
        <div className="grid md:grid-cols-3 gap-6 relative">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="relative glass rounded-3xl p-6 pt-8"
                style={{ animation: `fadeUp .55s ${0.08 * i}s backwards` }}
              >
                <span className="absolute -top-7 left-6 h-14 w-14 rounded-2xl bg-[#06100d] border border-emerald-500/35 flex items-center justify-center shadow-[0_8px_24px_-12px_rgba(16,185,129,0.6)]">
                  <Icon size={22} className="text-emerald-400" />
                </span>
                <span className="absolute top-5 right-5 text-[11px] uppercase tracking-[0.16em] font-bold text-emerald-300/70">
                  {s.label}
                </span>
                <h3 className="mt-2 text-[20px] font-extrabold tracking-tight text-zinc-50">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
