import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  CheckCircle2,
  IndianRupee,
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { adminListBookings, adminStats } from '../lib/api';
import { useToast } from '../hooks/use-toast';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, list] = await Promise.all([
          adminStats(),
          adminListBookings({}),
        ]);
        if (cancelled) return;
        setStats(s);
        setAll(list);
        setRecent(list.slice(0, 5));
      } catch {
        toast({ title: 'Could not load dashboard' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const breakdown = useMemo(() => {
    const map = new Map();
    all.forEach((b) => {
      const cur = map.get(b.service_title) || { count: 0, revenue: 0 };
      cur.count += 1;
      if (b.status === 'confirmed' || b.status === 'completed') {
        cur.revenue += b.price || 0;
      }
      map.set(b.service_title, cur);
    });
    const arr = Array.from(map.entries()).map(([title, v]) => ({
      title,
      ...v,
    }));
    arr.sort((a, b) => b.count - a.count);
    const max = Math.max(...arr.map((x) => x.count), 1);
    return { arr, max };
  }, [all]);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="px-5 lg:px-10 pt-20 lg:pt-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-emerald-400">
            {today}
          </p>
          <h1 className="mt-1.5 text-[28px] md:text-[32px] font-extrabold tracking-tight">
            Good to see you, <span className="font-display italic text-emerald-400">admin.</span>
          </h1>
          <p className="mt-1 text-[14px] text-zinc-400">
            Here’s what’s happening across VOYIL today.
          </p>
        </div>
        <Link
          to="/admin/bookings"
          className="inline-flex items-center gap-1.5 self-start h-10 px-4 rounded-full border border-white/10 bg-white/[0.03] text-zinc-100 hover:bg-white/[0.07] text-[13px] font-semibold transition-colors"
        >
          Manage bookings <ArrowRight size={14} />
        </Link>
      </div>

      <section className="mt-7 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi icon={Users} label="Total bookings" value={stats?.total ?? (loading ? '…' : 0)} />
        <Kpi icon={CalendarCheck} label="Confirmed" value={stats?.confirmed ?? (loading ? '…' : 0)} />
        <Kpi icon={CheckCircle2} label="Completed" value={stats?.completed ?? (loading ? '…' : 0)} />
        <Kpi
          icon={IndianRupee}
          label="Revenue"
          value={
            stats
              ? `₹${(stats.revenue || 0).toLocaleString('en-IN')}`
              : loading
              ? '…'
              : '₹0'
          }
        />
      </section>

      <section className="mt-8 grid lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 glass rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <p className="text-[14px] font-bold text-zinc-50">Recent bookings</p>
            <Link
              to="/admin/bookings"
              className="text-[12px] font-bold text-emerald-300 hover:text-emerald-200 inline-flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div>
            {recent.length === 0 && (
              <div className="py-12 text-center text-zinc-500 text-[13px]">
                {loading ? 'Loading…' : 'No bookings yet.'}
              </div>
            )}
            {recent.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]"
              >
                <img
                  src={b.image}
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover ring-1 ring-white/10"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-bold text-zinc-50 truncate">
                    {b.name} <span className="text-zinc-500 font-medium">·</span> {b.service_title}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-zinc-400 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} className="text-emerald-400" />
                      {new Date(b.date).toDateString()} · {b.slot}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone size={11} className="text-emerald-400" />
                      {b.phone}
                    </span>
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin size={11} className="text-emerald-400" />
                      <span className="truncate max-w-[160px]">{b.address}</span>
                    </span>
                  </p>
                </div>
                <StatusPill status={b.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 glass rounded-3xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <p className="text-[14px] font-bold text-zinc-50">Most booked services</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300">
              <TrendingUp size={12} /> All time
            </span>
          </div>
          <div className="px-5 py-4 space-y-3">
            {breakdown.arr.length === 0 && (
              <p className="text-center text-zinc-500 text-[13px] py-8">
                {loading ? 'Loading…' : 'No data yet.'}
              </p>
            )}
            {breakdown.arr.map((row) => {
              const pct = Math.round((row.count / breakdown.max) * 100);
              return (
                <div key={row.title}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[13px] font-semibold text-zinc-200 truncate pr-2">
                      {row.title}
                    </p>
                    <p className="text-[12px] text-zinc-400 shrink-0">
                      <span className="text-emerald-300 font-bold">{row.count}</span> bookings
                      <span className="mx-1.5 opacity-40">·</span>
                      <span>₹{row.revenue.toLocaleString('en-IN')}</span>
                    </p>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                      style={{ width: pct + '%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function Kpi({ icon: Icon, label, value }) {
  return (
    <div className="glass rounded-2xl p-4 animate-fadeUp">
      <div className="flex items-center gap-2">
        <span className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <Icon size={17} className="text-emerald-400" />
        </span>
        <p className="text-[11px] uppercase tracking-[0.14em] font-bold text-zinc-400">
          {label}
        </p>
      </div>
      <p className="mt-3 text-[26px] font-extrabold tracking-tight text-zinc-50 leading-tight">
        {value}
      </p>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    confirmed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    completed: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    cancelled: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  };
  const cls = map[status] || 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30';
  return (
    <span
      className={
        'shrink-0 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border ' +
        cls
      }
    >
      {status}
    </span>
  );
}
