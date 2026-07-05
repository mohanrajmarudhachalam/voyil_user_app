import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  RefreshCw,
  Calendar,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Undo2,
} from 'lucide-react';
import { adminListBookings, adminStats, adminUpdateStatus } from '../lib/api';
import { useToast } from '../hooks/use-toast';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function Bookings() {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const reload = async () => {
    setLoading(true);
    try {
      const [b, s] = await Promise.all([
        adminListBookings({ status: tab, q: q || undefined }),
        adminStats(),
      ]);
      setItems(b);
      setStats(s);
    } catch {
      toast({ title: 'Could not load bookings' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, [tab]); // eslint-disable-line

  const onUpdate = async (id, status) => {
    try {
      await adminUpdateStatus(id, status);
      toast({ title: 'Updated', description: `Booking marked ${status}.` });
      reload();
    } catch {
      toast({ title: 'Update failed' });
    }
  };

  const counts = useMemo(
    () => ({
      all: stats?.total ?? 0,
      confirmed: stats?.confirmed ?? 0,
      completed: stats?.completed ?? 0,
      cancelled: stats?.cancelled ?? 0,
    }),
    [stats]
  );

  return (
    <div className="px-5 lg:px-10 pt-20 lg:pt-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-emerald-400">
            Operations
          </p>
          <h1 className="mt-1.5 text-[28px] md:text-[32px] font-extrabold tracking-tight">
            All bookings
          </h1>
          <p className="mt-1 text-[14px] text-zinc-400">
            Search, filter and manage every visit on the network.
          </p>
        </div>
        <button
          onClick={reload}
          className="self-start h-10 px-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] text-zinc-100 hover:bg-white/[0.07] text-[13px] font-semibold"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <section className="mt-7 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="inline-flex p-1 rounded-2xl border border-white/10 bg-[#0e1a16] w-fit">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={
                  'px-3.5 h-9 rounded-xl text-[12.5px] font-semibold transition-colors ' +
                  (active
                    ? 'bg-emerald-500 text-[#0a1411]'
                    : 'text-zinc-300 hover:text-zinc-50 hover:bg-white/5')
                }
              >
                {t.label}
                <span
                  className={
                    'ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ' +
                    (active
                      ? 'bg-black/10 text-[#0a1411]'
                      : 'bg-white/10 text-zinc-300')
                  }
                >
                  {counts[t.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative md:w-[360px] w-full">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && reload()}
            placeholder="Search name, phone, address, service…"
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#0e1a16] border border-white/10 text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30 transition-colors text-[13px]"
          />
        </div>
      </section>

      <section className="mt-5 glass rounded-2xl overflow-hidden">
        <div className="hidden lg:grid grid-cols-12 gap-3 px-5 py-3 border-b border-white/5 text-[10.5px] uppercase tracking-[0.14em] font-bold text-zinc-400">
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Service</div>
          <div className="col-span-2">Schedule</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {items.length === 0 && (
          <div className="px-5 py-12 text-center text-zinc-400 text-[13.5px]">
            {loading ? 'Loading…' : 'No bookings match this filter.'}
          </div>
        )}

        {items.map((b) => (
          <div
            key={b.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-3 px-5 py-4 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]"
          >
            <div className="lg:col-span-3 min-w-0">
              <p className="text-[14px] font-bold text-zinc-50 truncate">{b.name}</p>
              <p className="text-[12px] text-zinc-400 truncate flex items-center gap-1">
                <Phone size={11} className="text-emerald-400" /> {b.phone}
              </p>
              <p className="text-[12px] text-zinc-400 truncate flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-emerald-400" /> {b.address}
              </p>
            </div>
            <div className="lg:col-span-3 min-w-0 flex items-center gap-3">
              <img
                src={b.service_image}
                alt=""
                className="h-12 w-12 rounded-lg object-cover ring-1 ring-white/10"
              />
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-zinc-100 truncate">
                  {b.service_title}
                </p>
                <p className="text-[12px] text-emerald-300 font-semibold">
                  ₹{b.price} · {b.duration}
                </p>
              </div>
            </div>
            <div className="lg:col-span-2 min-w-0">
              <p className="text-[13px] text-zinc-200 flex items-center gap-1">
                <Calendar size={12} className="text-emerald-400" />
                {new Date(b.date).toDateString()}
              </p>
              <p className="text-[12px] text-zinc-400 flex items-center gap-1 mt-0.5">
                <Clock size={12} className="text-emerald-400" /> {b.slot}
              </p>
            </div>
            <div className="lg:col-span-2 flex items-center">
              <StatusPill status={b.status} />
            </div>
            <div className="lg:col-span-2 flex lg:justify-end items-center gap-2 flex-wrap">
              {b.status !== 'completed' && (
                <ActionBtn tone="emerald" icon={CheckCircle2} onClick={() => onUpdate(b.id, 'completed')}>
                  Complete
                </ActionBtn>
              )}
              {b.status !== 'cancelled' && (
                <ActionBtn tone="rose" icon={XCircle} onClick={() => onUpdate(b.id, 'cancelled')}>
                  Cancel
                </ActionBtn>
              )}
              {b.status === 'cancelled' && (
                <ActionBtn tone="zinc" icon={Undo2} onClick={() => onUpdate(b.id, 'confirmed')}>
                  Reopen
                </ActionBtn>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function ActionBtn({ tone, icon: Icon, onClick, children }) {
  const tones = {
    emerald: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10',
    rose: 'border-rose-500/40 text-rose-300 hover:bg-rose-500/10',
    zinc: 'border-white/15 text-zinc-200 hover:bg-white/5',
  };
  return (
    <button
      onClick={onClick}
      className={
        'h-8 px-2.5 rounded-lg text-[11.5px] font-bold border inline-flex items-center gap-1 transition-colors ' +
        tones[tone]
      }
    >
      <Icon size={13} /> {children}
    </button>
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
        'inline-flex text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border ' +
        cls
      }
    >
      {status}
    </span>
  );
}
