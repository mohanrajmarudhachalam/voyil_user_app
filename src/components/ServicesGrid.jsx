import React from 'react';
import {
  Stethoscope,
  HeartPulse,
  Activity,
  FlaskConical,
  HandHeart,
  Star,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

const ICON_MAP = { Stethoscope, HeartPulse, Activity, FlaskConical, HandHeart };

export default function ServicesGrid({ services, onBook }) {
  // Bento layout: first card spans wide on desktop, last card spans wide; 3 in middle
  return (
    <section className="relative max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] font-semibold text-emerald-400">
            What we offer
          </p>
          <h2 className="mt-2 text-[28px] md:text-[36px] font-extrabold text-slate-900 tracking-tight">
            Home-visit services, on your schedule.
          </h2>
        </div>
        <span className="hidden md:inline-flex h-9 px-3 items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-slate-700 text-[12px] font-bold">
          {services.length} categories
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {services.map((s, i) => {
          // Define spans for bento layout
          // 0 -> wide(3), 1 -> normal(3), 2 -> normal(2), 3 -> normal(2), 4 -> normal(2)
          const spans = [
            'md:col-span-3',
            'md:col-span-3',
            'md:col-span-2',
            'md:col-span-2',
            'md:col-span-2',
          ];
          const heights = ['h-[300px]', 'h-[300px]', 'h-[260px]', 'h-[260px]', 'h-[260px]'];
          return (
            <ServiceTile
              key={s.id}
              service={s}
              onBook={onBook}
              span={spans[i] || 'md:col-span-2'}
              h={heights[i] || 'h-[260px]'}
              i={i}
            />
          );
        })}
      </div>
    </section>
  );
}

function ServiceTile({ service, onBook, span, h, i }) {
  const Icon = ICON_MAP[service.icon] || Stethoscope;
  return (
    <div
      onClick={() => onBook(service)}
      className={
        'group relative overflow-hidden rounded-3xl border border-slate-500 bg-white shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-emerald-600 ' +
        span +
        ' ' +
        h
      }
      style={{ animation: `fadeUp .55s ${0.06 * i}s backwards` }}
    >
      <img
        src={service.image}
        alt={service.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <span className="h-10 w-10 rounded-xl bg-[#0a1411]/70 border border-white/10 backdrop-blur flex items-center justify-center">
            <Icon size={18} className="text-emerald-400" />
          </span>
          <div className="flex items-center gap-1 px-2 h-7 rounded-full bg-black/40 border border-white/10 backdrop-blur">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-[12px] font-bold text-zinc-50">{service.rating}</span>
          </div>
        </div>

        <div>
          <p className="flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-slate-600 font-semibold mb-1">
            <Clock size={11} className="text-slate-500" /> {service.duration}
          </p>
          <h3 className="text-[22px] md:text-[24px] font-extrabold leading-tight tracking-tight text-emerald-500">
            {service.title}
          </h3>
          <p className="mt-1 text-[13px] text-slate-800 max-w-[360px]">
            {service.subtitle}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-600 font-semibold">
                Starts from
              </p>
              <p className="text-[20px] font-extrabold text-emerald-300 leading-tight">
                ₹{service.price}
                <span className="text-[11px] text-slate-600 font-medium ml-1">/ visit</span>
              </p>
            </div>
            <span
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-emerald-500 group-hover:bg-emerald-400 text-[#0a1411] font-bold text-[13px] transition-colors"
            >
              Book
              <ArrowUpRight size={15} strokeWidth={2.8} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
