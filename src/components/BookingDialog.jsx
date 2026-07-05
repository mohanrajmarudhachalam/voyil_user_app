import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Users,
  Clock,
  ShieldCheck,
  CalendarCheck,
  Headphones,
  Calendar,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  QrCode,
  Banknote,
  Lock,
  Stethoscope,
  CreditCard,
  Check,
} from 'lucide-react';
import { TIME_SLOTS } from '../mock';
import {
  createBooking,
  setIdentity,
  getStoredPhone,
  getStoredName,
  getStoredAddress,
  getStoredUserId
} from '../lib/api';
import { useToast } from '../hooks/use-toast';

/* ─── helpers ─────────────────────────────────────────────────── */
function iso(d) {
  return d.toISOString().split('T')[0];
}
function nextDays(n) {
  const out = [];
  const t = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(t);
    d.setDate(t.getDate() + i);
    out.push(d);
  }
  return out;
}
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ─── stepper config ──────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Service',  Icon: Stethoscope },
  { id: 2, label: 'Patient',  Icon: User },
  { id: 3, label: 'Schedule', Icon: Calendar },
  { id: 4, label: 'Payment',  Icon: CreditCard },
];

/* ─── inline error message ────────────────────────────────────── */
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
      <span>&#9679;</span> {msg}
    </p>
  );
}

/* ─── extract a readable string from a backend error response ──── */
function extractErrorMessage(e) {
  const data = e?.response?.data;
  if (!data) return e?.message || 'Please try again.';

  // FastAPI-style: { detail: "some string" }
  if (typeof data.detail === 'string') {
    return data.detail;
  }

  // FastAPI validation errors: { detail: [{ type, loc, msg, input, url }, ...] }
  if (Array.isArray(data.detail)) {
    return data.detail
      .map((d) => {
        if (typeof d === 'string') return d;
        if (d?.msg) {
          const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : d.loc;
          return field ? `${field}: ${d.msg}` : d.msg;
        }
        return JSON.stringify(d);
      })
      .join(', ');
  }

  // Express-validator style: [{ msg: '...' }, ...]
  if (Array.isArray(data)) {
    return data.map((d) => (typeof d === 'string' ? d : d?.msg || JSON.stringify(d))).join(', ');
  }

  // { message: "..." }
  if (typeof data.message === 'string') {
    return data.message;
  }

  if (typeof data === 'string') {
    return data;
  }

  return 'Please try again.';
}

/* ═══════════════════════════════════════════════════════════════ */
export default function BookingDialog({ service, open, onOpenChange }) {
  const [step, setStep]           = useState(1);
  const[image, setImage]          = useState(service?.image || '');
  const [date, setDate]           = useState(iso(new Date()));
  const [slot, setSlot]           = useState(TIME_SLOTS[1]);
  const [name, setName]           = useState('');
  const [userid, setUserid]       = useState('');
  const [phone, setPhone]         = useState('');
  const [age, setAge]             = useState('');
  const [gender, setGender]       = useState('Male');
  const [notes, setNotes]         = useState('');
  const [address, setAddress]     = useState('');
  const [city, setCity]           = useState('');
  const [Price, setPrice]         = useState(service?.price || 0);
  const [payMethod, setPayMethod] = useState('upi');
  const [errors, setErrors]       = useState({});
  const [done, setDone]           = useState(false);
  const [busy, setBusy]           = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setStep(1);
      setDone(false);
      setErrors({});
      setName(getStoredName());
      setPhone(getStoredPhone());
      setAddress(getStoredAddress());
      setUserid(getStoredUserId());
      setImage(service?.image || '');
      setPrice(service?.price || 0);
    }
  }, [open]);

  if (!service) return null;
  const days = nextDays(7);
  const progress = `${(step / 4) * 100}%`;

  console.log(userid);
  

  /* ── clear a single error when user edits that field ─────────── */
  const clearErr = (key) => setErrors((prev) => ({ ...prev, [key]: undefined }));

  /* ── navigation ─────────────────────────────────────────────── */
  const goBack = () => {
    setErrors({});
    if (step > 1) setStep((s) => s - 1);
    else onOpenChange(false);
  };

  const goNext = async () => {
    // ── Step 2 validation ────────────────────────────────────────
    if (step === 2) {
      const errs = {};
      if (!name.trim())
        errs.name = 'Full name is required.';
      if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.replace(/\s+/g, '')))
        errs.phone = 'Enter a valid 10-digit mobile number.';
      if (!age || isNaN(age) || Number(age) < 1 || Number(age) > 120)
        errs.age = 'Enter a valid age (1–120).';
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
    }

    // ── Step 3 validation ────────────────────────────────────────
    if (step === 3) {
      const errs = {};
      if (!address.trim()) errs.address = 'Visit address is required.';
      if (!city.trim())    errs.city    = 'City is required.';
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
    }

    setErrors({});

    if (step < 4) {
      setStep((s) => s + 1);
      return;
    }

    // ── Step 4 confirm ───────────────────────────────────────────
    if (!name || !phone || !address || !city) {
      toast({ title: 'Almost there', description: 'Please complete all required fields before confirming.' });
      return;
    }
console.log("Stored UserId:", userid);
    setBusy(true);
    try {
      await createBooking({
        userId: userid,
        service_id: service.id,
        image,
        date,
        slot,
        name,
        phone,
        address,
        city,
        age: age,
        gender,
        notes,
        Price,
        pay_method: payMethod,
      });
      setIdentity({ name, phone, address });
      setDone(true);
    } catch (e) {
      // Log the raw response so you can see exactly what the backend sent back
      console.log('Booking error response:', e?.response?.data);
      toast({
        title: 'Could not create booking',
        description: extractErrorMessage(e),
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  const ctaLabel =
    step === 4
      ? busy ? 'Confirming...' : `I've paid Rs.${service.price} — confirm`
      : 'Continue';

  /* ── review rows for step 4 ──────────────────────────────────── */
  const reviewRows = [
    ['Service', service.title],
    ['For',     name  || '—'],
    ['Phone',   phone || '—'],
    ['When',    `${new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · ${slot}`],
    ['Where',   [address, city].filter(Boolean).join(', ') || '—'],
  ];

  /* ════════════════════════════════════════════════════════════ */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[500px] w-[calc(100%-16px)] sm:rounded-3xl border border-white/10 bg-[#0d1a14] text-zinc-100 p-0 overflow-hidden flex flex-col max-h-[92vh]"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Book {service.title}</DialogTitle>
          <DialogDescription>Step {step} of 4</DialogDescription>
        </DialogHeader>

        {!done ? (
          <>
            {/* ── top bar ──────────────────────────────────────── */}
            <div className="px-4 pt-5 pb-3 shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={goBack}
                  className="h-9 w-9 rounded-full border border-white/12 bg-transparent flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:border-white/25 transition-colors shrink-0"
                  aria-label="Back"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[.12em] text-emerald-500">
                    Step {step} of 4
                  </p>
                  <p className="text-[17px] font-extrabold leading-tight">
                    {STEPS[step - 1].label}
                  </p>
                </div>
                <div className="h-9 w-9 shrink-0" />
              </div>

              {/* progress bar */}
              <div className="h-[3px] rounded-full bg-white/8 overflow-hidden mb-4">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: progress }}
                />
              </div>

              {/* step nodes */}
              <div className="grid grid-cols-4 gap-1">
                {STEPS.map(({ id, label, Icon }) => {
                  const isDone   = id < step;
                  const isActive = id === step;
                  return (
                    <button
                      key={id}
                      onClick={() => id < step && setStep(id)}
                      className="flex flex-col items-center gap-1.5 disabled:cursor-default"
                      disabled={id > step}
                    >
                      <div
                        className={[
                          'h-7 w-7 rounded-full flex items-center justify-center border transition-all duration-300',
                          isDone
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                            : isActive
                            ? 'bg-emerald-500 border-emerald-500 text-[#0a1a10]'
                            : 'bg-white/5 border-white/12 text-zinc-600',
                        ].join(' ')}
                      >
                        {isDone ? <Check size={13} /> : <Icon size={13} />}
                      </div>
                      <span
                        className={[
                          'text-[10px] font-bold uppercase tracking-[.08em] transition-colors',
                          isActive ? 'text-emerald-400' : isDone ? 'text-emerald-700' : 'text-zinc-600',
                        ].join(' ')}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── scrollable body ───────────────────────────────── */}
            <div className="overflow-y-auto flex-1 px-4 pb-4 space-y-4">

              {/* ── STEP 1: Service ──────────────────────────────── */}
              {step === 1 && (
                <div className="rounded-2xl border border-white/7 bg-[#0f2018] overflow-hidden">
                  <div className="relative h-36 overflow-hidden bg-[#0a1a10]">
                    <img
                      src={service.image}
                      alt=""
                      className="w-full h-full object-cover opacity-60"
                    />
                    <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 border border-emerald-500/30 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-emerald-400">
                      Home visit
                    </span>
                    <div className="absolute bottom-3 left-3">
                      <p className="text-xl font-extrabold text-white">{service.title}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{service.description}</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { Icon: Star,  val: '4.8',            key: 'Rating' },
                        { Icon: Users, val: '8.9k+',          key: 'Visits done' },
                        { Icon: Clock, val: service.duration,  key: 'Visit time' },
                      ].map(({ Icon, val, key }) => (
                        <div key={key} className="bg-[#0a1a10] border border-white/6 rounded-xl p-2.5 text-center">
                          <Icon size={14} className="text-emerald-500 mx-auto mb-1" />
                          <p className="text-[15px] font-extrabold text-white">{val}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{key}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[.12em] text-zinc-400 mb-1.5">What's included</p>
                      <p className="text-[13px] text-zinc-400 leading-relaxed">
                        Certified nurses for injections, IV drips, wound dressing, post-surgical care and elderly assistance.
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[.12em] text-zinc-400 mb-2">You're protected by</p>
                      <ul className="space-y-2">
                        {[
                          [ShieldCheck,   'Background-verified professionals'],
                          [CalendarCheck, 'Free reschedule up to 2 hours before visit'],
                          [Headphones,    '24x7 concierge support over call'],
                        ].map(([Icon, text]) => (
                          <li key={text} className="flex items-center gap-2.5 text-[13px] text-zinc-400">
                            <Icon size={15} className="text-emerald-500 shrink-0" />
                            {text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Patient ──────────────────────────────── */}
              {step === 2 && (
                <div className="rounded-2xl border border-white/7 bg-[#0f2018] p-4 space-y-4">
                  <p className="text-[17px] font-extrabold">Who is the visit for?</p>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-[.12em] font-bold text-zinc-400">Full name *</Label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <Input
                        value={name}
                        onChange={(e) => { setName(e.target.value); clearErr('name'); }}
                        placeholder="Patient's full name"
                        className={`h-11 pl-9 bg-[#0a1a10] border text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/40 ${errors.name ? 'border-red-500' : 'border-white/10'}`}
                      />
                    </div>
                    <FieldError msg={errors.name} />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-[.12em] font-bold text-zinc-400">Phone number *</Label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); clearErr('phone'); }}
                        placeholder="9XXXXXXXXX"
                        className={`h-11 pl-9 bg-[#0a1a10] border text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/40 ${errors.phone ? 'border-red-500' : 'border-white/10'}`}
                      />
                    </div>
                    <FieldError msg={errors.phone} />
                  </div>

                  {/* Age + Gender */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] uppercase tracking-[.12em] font-bold text-zinc-400">Age *</Label>
                      <Input
                        type="number"
                        value={age}
                        onChange={(e) => { setAge(e.target.value); clearErr('age'); }}
                        placeholder="e.g. 34"
                        className={`h-11 bg-[#0a1a10] border text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/40 ${errors.age ? 'border-red-500' : 'border-white/10'}`}
                      />
                      <FieldError msg={errors.age} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] uppercase tracking-[.12em] font-bold text-zinc-400">Gender</Label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['Male', 'Female', 'Other'].map((g) => (
                          <button
                            key={g}
                            onClick={() => setGender(g)}
                            className={[
                              'h-11 rounded-xl border text-[12px] font-semibold transition-colors',
                              gender === g
                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                                : 'bg-[#0a1a10] border-white/10 text-zinc-400 hover:border-emerald-500/40',
                            ].join(' ')}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-[.12em] font-bold text-zinc-400">Anything we should know?</Label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Allergies, conditions, special requirements..."
                      rows={3}
                      className="w-full bg-[#0a1a10] border border-white/10 rounded-xl px-3 py-2.5 text-[14px] text-zinc-100 placeholder:text-zinc-600 resize-none outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* ── STEP 3: Schedule ─────────────────────────────── */}
              {step === 3 && (
                <div className="rounded-2xl border border-white/7 bg-[#0f2018] p-4 space-y-5">
                  {/* date */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[.12em] text-zinc-400 mb-2.5">Pick a date</p>
                    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                      {days.map((d, i) => {
                        const v = iso(d);
                        const active = v === date;

                        return (
                          <button
                            key={v}
                            onClick={() => setDate(v)}
                            className={[
                              'shrink-0 flex flex-col items-center justify-center w-[60px] h-[72px] rounded-2xl border transition-colors',
                              active
                                ? 'bg-emerald-500 border-emerald-500 text-[#0a1a10]'
                                : 'bg-[#0a1a10] border-white/10 text-zinc-300 hover:border-emerald-500/40',
                            ].join(' ')}
                          >
                            <span className="text-[10px] font-bold uppercase opacity-80">
                              {i === 0 ? 'Today' : DAYS[d.getDay()]}
                            </span>
                            <span className="text-[20px] font-extrabold leading-none mt-1">{d.getDate()}</span>
                            <span className="text-[10px] mt-1 opacity-70">{MONTHS[d.getMonth()]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* time */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[.12em] text-zinc-400 mb-2.5">Pick a time slot</p>
                    <div className="flex flex-wrap gap-2">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSlot(t)}
                          className={[
                            'px-3.5 h-10 rounded-xl border text-[12px] font-semibold transition-colors',
                            t === slot
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                              : 'bg-[#0a1a10] border-white/10 text-zinc-400 hover:border-emerald-500/40',
                          ].join(' ')}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* address */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[.12em] text-zinc-400 mb-2.5">Visit address</p>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] uppercase tracking-[.12em] font-bold text-zinc-400">Address *</Label>
                        <div className="relative">
                          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                          <Input
                            value={address}
                            onChange={(e) => { setAddress(e.target.value); clearErr('address'); }}
                            placeholder="House no, building, street, area"
                            className={`h-11 pl-9 bg-[#0a1a10] border text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/40 ${errors.address ? 'border-red-500' : 'border-white/10'}`}
                          />
                        </div>
                        <FieldError msg={errors.address} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px] uppercase tracking-[.12em] font-bold text-zinc-400">City *</Label>
                        <Input
                          value={city}
                          onChange={(e) => { setCity(e.target.value); clearErr('city'); }}
                          placeholder="Chennai"
                          className={`h-11 bg-[#0a1a10] border text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/40 ${errors.city ? 'border-red-500' : 'border-white/10'}`}
                        />
                        <FieldError msg={errors.city} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Payment ──────────────────────────────── */}
              {step === 4 && (
                <div className="rounded-2xl border border-white/7 bg-[#0f2018] p-4 space-y-5">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                    <Lock size={11} className="text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-[.1em] text-emerald-400">Secure checkout</span>
                  </div>

                  <div>
                    <p className="text-[15px] font-bold text-white mb-3">Review your booking</p>
                    <div className="bg-[#0a1a10] border border-white/7 rounded-xl p-3.5">
                      {reviewRows.map(([key, val], i) => (
                        <div
                          key={key}
                          className={`flex items-start justify-between py-2 text-[13px] ${i < reviewRows.length - 1 ? 'border-b border-white/5' : ''}`}
                        >
                          <span className="text-zinc-500 shrink-0 mr-2">{key}</span>
                          <span className="text-zinc-200 font-semibold text-right">{val}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between pt-3 border-t border-white/8 mt-1">
                        <span className="text-[13px] font-bold text-white">Total payable</span>
                        <span className="text-[18px] font-extrabold text-emerald-300">Rs.{service.price}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[.12em] text-zinc-400 mb-2.5">Payment method</p>
                    <div className="space-y-2">
                      {[
                        { id: 'upi',  Icon: QrCode,   title: 'UPI — Scan & Pay',  sub: 'GPay, PhonePe, Paytm, BHIM & any UPI app' },
                        { id: 'cash', Icon: Banknote, title: 'Cash after visit',   sub: 'Pay our pro at your home' },
                      ].map(({ id, Icon, title, sub }) => (
                        <button
                          key={id}
                          onClick={() => setPayMethod(id)}
                          className={[
                            'w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors',
                            payMethod === id
                              ? 'border-emerald-500 bg-emerald-500/5'
                              : 'border-white/8 bg-[#0a1a10] hover:border-white/15',
                          ].join(' ')}
                        >
                          <div className="h-9 w-9 rounded-xl bg-emerald-500/12 flex items-center justify-center shrink-0">
                            <Icon size={18} className="text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-zinc-200">{title}</p>
                            <p className="text-[11px] text-zinc-500 mt-0.5">{sub}</p>
                          </div>
                          <div
                            className={[
                              'h-[18px] w-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                              payMethod === id ? 'border-emerald-500' : 'border-white/20',
                            ].join(' ')}
                          >
                            {payMethod === id && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── sticky bottom bar ─────────────────────────────── */}
            <div className="shrink-0 px-4 pb-5 pt-3 border-t border-white/6 flex items-center gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[.08em] text-zinc-500">
                  {step === 4 ? 'Total' : 'Visit fee'}
                </p>
                <p className="text-[22px] font-extrabold text-white leading-tight">Rs.{service.price}</p>
              </div>
              <Button
                onClick={goNext}
                disabled={busy}
                className="flex-1 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0a1a10] font-bold text-[15px] flex items-center justify-center gap-2"
              >
                {step === 4 && <Lock size={14} />}
                {ctaLabel}
                {step < 4 && <ArrowRight size={16} />}
              </Button>
            </div>
          </>
        ) : (
          /* ── Success state ─────────────────────────────────────── */
          <div className="p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 className="text-emerald-400" size={36} />
            </div>
            <h3 className="mt-5 text-[22px] font-extrabold tracking-tight">
              You're all set, {name.split(' ')[0]}.
            </h3>
            <p className="mt-1 text-[14px] text-zinc-400">
              {service.title} on {new Date(date).toDateString()} at {slot}.
            </p>
            <p className="mt-3 text-[12px] text-zinc-500">
              Our concierge will call {phone} to confirm the pro assigned.
            </p>
            <Button
              onClick={() => onOpenChange(false)}
              className="mt-6 w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0a1a10] font-bold text-[15px]"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}