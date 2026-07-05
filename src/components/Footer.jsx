import React from 'react';
import { Plus, Phone, Mail, MapPin } from 'lucide-react';
import { CONTACT } from '../mock';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-10">
      {/* CTA banner */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl my-10 lg:my-14 p-8 lg:p-12 border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-emerald-500/8 to-transparent">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 justify-between">
            <div className="max-w-xl">
              <h3 className="text-[24px] md:text-[30px] font-extrabold tracking-tight text-zinc-50 leading-tight">
                Need care now? Talk to a human.
              </h3>
              <p className="mt-2 text-[14px] md:text-[15px] text-zinc-300">
                Our concierge is online 24×7 and can book any service in under a
                minute over the phone.
              </p>
            </div>
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-3 h-14 pl-3 pr-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0a1411] font-bold text-[16px] transition-colors shrink-0"
            >
              <span className="h-11 w-11 rounded-full bg-white/15 flex items-center justify-center">
                <Phone size={18} />
              </span>
              {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>

      {/* link grid */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pb-10 grid md:grid-cols-12 gap-8">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
              <Plus size={18} className="text-emerald-400" strokeWidth={3} />
            </span>
            <span className="text-[15px] font-extrabold tracking-tight">
              VOYIL
            </span>
          </div>
          <p className="mt-4 text-[14px] text-zinc-400 max-w-sm leading-relaxed">
            Premium home healthcare — a network of verified doctors, nurses
            and labs, available at your doorstep.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-[12px] uppercase tracking-[0.14em] font-bold text-zinc-300">
            Services
          </p>
          <ul className="mt-3 space-y-2 text-[13px] text-zinc-400">
            <li>General Physician</li>
            <li>Home Nurse</li>
            <li>Physiotherapist</li>
            <li>Lab Sample Collection</li>
            <li>Elderly Care</li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="text-[12px] uppercase tracking-[0.14em] font-bold text-zinc-300">
            Reach us
          </p>
          <ul className="mt-3 space-y-2 text-[13px] text-zinc-300">
            <li className="flex items-center gap-2">
              <Phone size={13} className="text-emerald-400" />
              {CONTACT.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={13} className="text-emerald-400" />
              care@aevumhealth.example
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={13} className="text-emerald-400" />
              Bengaluru · Chennai · Hyderabad · NCR
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-zinc-500">
            © {new Date().getFullYear()} Voyil. All rights reserved.
          </p>
          <p className="text-[12px] text-zinc-500">
            Built with care · 24×7 concierge available
          </p>
        </div>
      </div>
    </footer>
  );
}
