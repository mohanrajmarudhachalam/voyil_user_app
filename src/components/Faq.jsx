import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ = [
  {
    q: 'How quickly will the pro reach my home?',
    a: 'Most visits in metro cities are scheduled within 60 minutes during business hours. You can also pre-book a specific slot up to 7 days in advance.',
  },
  {
    q: 'Are the clinicians verified?',
    a: 'Yes. Every doctor, nurse and physio on our network is licence-verified and background-checked. You\u2019ll see their qualifications and rating before they arrive.',
  },
  {
    q: 'When and how do I pay?',
    a: 'Pay after the visit ends — by UPI, card or cash. There is no advance payment, no upselling. The price you see at booking is the price you pay.',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'Of course. You can cancel any confirmed booking from the Bookings tab. Cancellation is free until 30 minutes before the visit.',
  },
  {
    q: 'Do you serve my city?',
    a: 'We currently operate across Bengaluru, Chennai, Hyderabad, Pune and the NCR region. New cities launch every quarter — call our concierge to check.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="relative max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-24">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <p className="text-[12px] uppercase tracking-[0.18em] font-semibold text-emerald-400">
            Frequently asked
          </p>
          <h2 className="mt-2 text-[28px] md:text-[36px] font-extrabold text-slate-500 tracking-tight leading-tight">
            Answers, before you ask.
          </h2>
          <p className="mt-3 text-[14px] text-slate-500 max-w-sm">
            If something isn’t covered here, our concierge is online 24×7 and
            happy to help.
          </p>
        </div>
        <div className="lg:col-span-8  space-y-3">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="glass rounded-2xl px-5 border text-slate-500 transition-colors"
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="text-[15px] md:text-[16px] font-bold text-slate-400">
                    {item.q}
                  </span>
                  <span className="h-8 w-8 shrink-0 rounded-full border border-black flex items-center justify-center text-emerald-800">
                    {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-5 -mt-1">
                    <p className="text-[14px] leading-relaxed text-slate-500">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}