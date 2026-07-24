import React from 'react';
import { ArrowRight, Phone, Sparkles, ShieldCheck, Clock3, IndianRupee } from 'lucide-react';
import { CONTACT } from '../mock';

export default function Hero({ onPrimary }) {
  return (
    <section className="relative overflow-hidden glow-emerald glow-emerald-soft">
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-14 lg:pt-24 pb-16 lg:pb-24 grid lg:grid-cols-12 gap-10 items-center">
        {/* LEFT */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-3 h-8 rounded-full border border-emerald-500/30 bg-emerald-500/10">
            <Sparkles size={13} className="text-emerald-400" />
            <span className="text-[12px] font-semibold text-emerald-700 tracking-wide">
              Verified clinicians · 24×7 concierge
            </span>
          </div>

          <h1 className="mt-5 text-[40px] md:text-[58px] leading-[1.04] font-extrabold tracking-tight text-slate-900">
            Healthcare that <br className="hidden md:block" />
            <span className="font-display italic font-medium text-emerald-600">
              comes to you.
            </span>
          </h1>

          <p className="mt-5 max-w-[520px] text-[15px] md:text-[17px] leading-relaxed text-slate-600">
            Voyil brings doctors, nurses, physios and lab pros straight
            to your living room. No more queues, no commute, no surprises
            — just careful, on-time, on-budget care.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              onClick={onPrimary}
              className="inline-flex items-center gap-2 h-12 px-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0a1411] font-bold text-[14px] shadow-[0_10px_30px_-8px_rgba(16,185,129,0.5)] transition-colors"
            >
              Browse services
              <ArrowRight size={16} strokeWidth={2.6} />
            </button>
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 h-12 px-5 rounded-full border border-white/15 bg-white/[0.03] text-zinc-700 hover:bg-white/[0.07] font-semibold text-[14px] transition-colors"
            >
              <Phone size={15} className="text-emerald-400" />
              {CONTACT.phone}
            </a>
          </div>

          <div className="mt-9 grid grid-cols-3 gap-3 max-w-md">
            <Stat label="Verified pros" value="100%" />
            <Stat label="Avg arrival" value="<60 min" />
            <Stat label="Starts at" value="₹299" />
          </div>
        </div>

        {/* RIGHT — floating glass cards */}
        <div className="lg:col-span-5 relative h-[420px] hidden lg:block">
          <FloatingCard
            className="top-2 left-2"
            delay="0s"
            icon={<ShieldCheck className="text-emerald-500" size={18} />}
            title="Verified clinicians"
            desc="All pros are licence-checked and background-verified before they visit your home."
          />
          <FloatingCard
            className="top-32 right-2"
            delay="0.4s"
            icon={<Clock3 className="text-emerald-400" size={18} />}
            title="60-minute ETA"
            desc="Same-day slots across the city. Track your pro live, see when they arrive."
          />
          <FloatingCard
            className="bottom-2 left-8"
            delay="0.8s"
            icon={<IndianRupee className="text-emerald-400" size={18} />}
            title="Pay after visit"
            desc="Transparent pricing from ₹299. No advance, no hidden charges, no upsells."
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="glass rounded-2xl p-3.5">
      <p className="text-[20px] font-extrabold tracking-tight text-emerald-600">
        {value}
      </p>
      <p className="text-[11px] mt-0.5 uppercase tracking-[0.12em] text-slate-500 font-semibold">
        {label}
      </p>
    </div>
  );
}

function FloatingCard({ className = '', delay = '0s', icon, title, desc }) {
  return (
    <div
      className={
        'absolute rounded-2xl p-4 max-w-[260px] backdrop-blur-xl bg-white/80 border border-slate-200 shadow-xl animate-float ' +
        className
      }
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
          {icon}
        </span>

        <p className="text-[15px] font-semibold text-slate-900">
          {title}
        </p>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
        {desc}
      </p>
    </div>
  );
}