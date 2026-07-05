import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarPlus,
  MapPin,
  Clock,
  Phone,
  XCircle,
  RefreshCw,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  fetchMyBookings,
  cancelMyBooking,
  getStoredPhone,
  getStoredUserId
} from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'confirmed', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function BookingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState(getStoredPhone());
  const [userid, setUserid] = useState(getStoredUserId());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const reload = useCallback(async () => {
    const p = getStoredPhone();
    setPhone(p);
    setUserid(getStoredUserId());
    console.log('USER ID :',userid);
    
    if (!p) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {

      const raw = await fetchMyBookings(userid);
      console.log('Raw Bookings:', raw);
      const mapped = raw.data.map((b) => ({
        id: b._id,
        service_title: b.service_title || b.service_id,
        service_image: b.service_image || b.image,
        date: b.date,
        slot: b.slot,
        address: b.address,
        phone: b.phone,
        price: b.price ?? b.Price,
        // your API doesn't send a status field yet — default to 'confirmed'
        status: b.status || 'confirmed',
      }));
      setItems(mapped);
    } catch(err) {
      console.log('ERROR ',err);
      
      toast({ title: 'Could not load bookings' ,err });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    reload();
    const fn = () => reload();
    window.addEventListener('aevum:identity-changed', fn);
    window.addEventListener('focus', fn);
    return () => {
      window.removeEventListener('aevum:identity-changed', fn);
      window.removeEventListener('focus', fn);
    };
  }, [reload]);

  const filtered = items.filter((b) => filter === 'all' || b.status === filter);

  const onCancel = async (id) => {
    try {
      await cancelMyBooking(id, phone);
      toast({ title: 'Booking cancelled' });
      reload();
    } catch {
      toast({ title: 'Could not cancel' });
    }
  };

  return (
    <section className="relative max-w-5xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] font-semibold text-emerald-400">
            Account
          </p>
          <h1 className="mt-2 text-[32px] md:text-[40px] font-extrabold tracking-tight leading-tight">
            Your bookings
          </h1>
          <p className="mt-2 text-[14px] text-zinc-400">
            All home visits linked to your phone number.
          </p>
        </div>
        {phone && (
          <button
            onClick={reload}
            className="self-start inline-flex items-center gap-1.5 h-10 px-3 rounded-full border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.07] text-[13px] font-semibold"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        )}
      </div>

      {!phone ? (
        <EmptyState
          onCta={() => navigate('/')}
          ctaLabel="Browse services"
          title="No bookings here yet."
          desc="Once you book your first visit, it will show up here. Bookings are tied to the phone number you provide."
        />
      ) : (
        <>
          {/* filter chips */}
          <div className="mt-7 flex items-center gap-2 overflow-x-auto pb-1">
            <Filter size={14} className="text-zinc-500 shrink-0" />
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={
                    'shrink-0 h-9 px-3.5 rounded-full text-[12px] font-bold uppercase tracking-wider transition-colors ' +
                    (active
                      ? 'bg-emerald-500 text-[#0a1411]'
                      : 'border border-white/10 text-zinc-300 hover:bg-white/5')
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* list */}
          {filtered.length === 0 ? (
            <div className="mt-10 text-center text-zinc-400 text-[14px]">
              {loading ? 'Loading…' : 'No bookings in this view.'}
            </div>
          ) : (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {filtered.map((b) => (
                <article
                  key={b.id}
                  className="glass rounded-3xl overflow-hidden"
                >
                  <div className="relative h-[120px]">
                    <img
                      src={b.service_image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0a1411] via-[#0a1411]/40 to-transparent" />
                    <div className="absolute inset-0 flex items-end justify-between p-4">
                      <h3 className="text-[18px] font-extrabold tracking-tight text-zinc-50">
                        {b.service_title}
                      </h3>
                      <StatusPill status={b.status} />
                    </div>
                  </div>
                  <div className="px-5 py-4 space-y-1.5">
                    <Row icon={Clock}>
                      {new Date(b.date).toDateString()} · {b.slot}
                    </Row>
                    <Row icon={MapPin}>{b.address}</Row>
                    <Row icon={Phone}>{b.phone}</Row>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 px-5 py-3">
                    <span className="text-[16px] font-extrabold text-emerald-300">
                      ₹{b.price}
                    </span>
                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <button
                        onClick={() => onCancel(b.id)}
                        className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-zinc-400 hover:text-rose-400 transition-colors"
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function Row({ icon: Icon, children }) {
  return (
    <p className="text-[13px] text-zinc-300 flex items-center gap-2">
      <Icon size={13} className="text-emerald-400 shrink-0" />
      <span className="truncate">{children}</span>
    </p>
  );
}

function StatusPill({ status }) {
  const map = {
    pending: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    confirmed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    completed: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    cancelled: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  };
  const cls = map[status] || 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30';
  return (
    <span
      className={
        'text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border backdrop-blur ' +
        cls
      }
    >
      {status}
    </span>
  );
}

function EmptyState({ title, desc, ctaLabel, onCta }) {
  return (
    <div className="mt-12 glass rounded-3xl p-10 text-center max-w-lg mx-auto">
      <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
        <CalendarPlus size={28} className="text-emerald-400" />
      </div>
      <h3 className="mt-5 text-[22px] font-extrabold tracking-tight">{title}</h3>
      <p className="mt-2 text-[14px] text-zinc-400 max-w-md mx-auto">{desc}</p>
      <Button
        onClick={onCta}
        className="mt-6 h-12 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0a1411] font-bold text-[14px]"
      >
        {ctaLabel} <ArrowRight size={16} className="ml-1" />
      </Button>
    </div>
  );
}
