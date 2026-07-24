import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Plus, ArrowRight } from 'lucide-react';
import { CONTACT } from '../mock';
import Logo from '../assets/logo.svg';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/bookings', label: 'Bookings' },
  { to: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-[#FCF9EF] shadow-sm">
     <div className="max-w-7xl mx-auto px-5 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center">
           <img
            src={Logo}
            alt="Voyil Logo"
            className="h-12 w-auto object-contain"
            style={{ transform: "scale(1.4)", transformOrigin: "left center" }}
         />
          
        </Link>

       {/*  <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                'px-3 h-9 inline-flex items-center rounded-full text-[13px] font-semibold transition-colors  ' +
                (isActive
                  ? 'text-emerald-800 bg-emerald-100'
                  : 'text-gray-800 hover:text-emerald-800 hover:bg-emerald-50')
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav> */}

        <div className="flex items-center gap-2">
          <a
            href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
            className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] transition-colors"
          >
            Book a visit
            <ArrowRight size={14} strokeWidth={2.6} />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-200 hover:bg-white/5"
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#06100d]">
          <div className="max-w-7xl mx-auto px-5 py-3 flex flex-col gap-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  'h-11 px-3 inline-flex items-center rounded-xl text-[14px] font-semibold ' +
                  (isActive
                    ? 'text-emerald-300 bg-emerald-500/10'
                    : 'text-zinc-200 hover:bg-white/5')
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
