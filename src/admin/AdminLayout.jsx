import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  CalendarCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';

const NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
];

export default function AdminLayout({ onSignOut }) {
  return (
    <div className="min-h-screen w-full bg-[#06100d] text-zinc-100">
      <div className="flex">
        <aside className="hidden lg:flex sticky top-0 h-screen w-[240px] shrink-0 flex-col border-r border-white/5 bg-[#08130f]/70 backdrop-blur-xl">
          <div className="px-5 pt-6 pb-5 flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
              <ShieldCheck size={18} className="text-emerald-400" />
            </span>
            <div className="leading-tight">
              <p className="text-[14px] font-extrabold tracking-tight">
                Aevum <span className="text-emerald-400">Admin</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 font-bold">
                Staff console
              </p>
            </div>
          </div>

          <nav className="px-3 mt-4 space-y-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  'flex items-center gap-3 px-3 h-11 rounded-xl text-[13.5px] font-semibold transition-colors ' +
                  (isActive
                    ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/30'
                    : 'text-zinc-300 hover:bg-white/5 border border-transparent')
                }
              >
                <n.icon size={17} />
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto p-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles size={13} className="text-emerald-400" />
                <p className="text-[12px] font-bold text-zinc-100">
                  Concierge backup
                </p>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Customers can also book by phone — +91 98400 12264.
              </p>
            </div>
            <button
              onClick={onSignOut}
              className="mt-2 w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 text-zinc-300 hover:text-rose-300 hover:bg-rose-500/5 hover:border-rose-500/30 text-[13px] font-semibold transition-colors"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </aside>

        <MobileBar onSignOut={onSignOut} />

        <main className="flex-1 min-w-0">
          <div className="min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function MobileBar({ onSignOut }) {
  const navigate = useNavigate();
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 px-4 flex items-center justify-between border-b border-white/5 bg-[#06100d]/85 backdrop-blur-xl">
      <button onClick={() => navigate('/admin')} className="flex items-center gap-2">
        <span className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
          <ShieldCheck size={16} className="text-emerald-400" />
        </span>
        <span className="text-[13px] font-extrabold tracking-tight">
          Aevum Admin
        </span>
      </button>
      <div className="flex items-center gap-1">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              'h-9 px-2.5 inline-flex items-center gap-1.5 rounded-lg text-[12px] font-semibold ' +
              (isActive ? 'bg-emerald-500/15 text-emerald-200' : 'text-zinc-300')
            }
          >
            <n.icon size={14} />
            <span className="hidden sm:inline">{n.label}</span>
          </NavLink>
        ))}
        <button
          onClick={onSignOut}
          className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-white/10 text-zinc-300"
          aria-label="Sign out"
        >
          <LogOut size={14} />
        </button>
      </div>
    </div>
  );
}
