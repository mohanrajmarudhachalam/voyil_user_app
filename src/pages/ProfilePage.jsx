import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  PhoneCall,
  LogOut,
  ChevronRight,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Bell,
  MapPin,
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { getStoredPhone, getStoredName, setIdentity, clearIdentity, signIn as apiSignIn } from '../lib/api';
import { useToast } from '../hooks/use-toast';
import { CONTACT } from '../mock';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const buildUser = () => {
    const p = getStoredPhone();
    const n = getStoredName();
    return p ? { phone: p, name: n || 'Aevum Member', provider: 'phone' } : null;
  };
  const [user, setU] = useState(buildUser());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneIn, setPhoneIn] = useState('');
  const [mode, setMode] = useState('signin');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fn = () => setU(buildUser());
    window.addEventListener('aevum:identity-changed', fn);
    return () => window.removeEventListener('aevum:identity-changed', fn);
  }, []);

  const signIn = async () => {
    if (!email || !password) {
      toast({ title: 'Please enter email and password.' });
      return;
    }

    setLoading(true);
    const result = await apiSignIn({ email, password });
    setLoading(false);

    toast({ title: result.message });
  };

  const google = () => {
    setIdentity({ name: 'Aevum Member', phone: phoneIn || '0000000000' });
    toast({ title: 'Signed in (demo).' });
  };
  const guest = () => navigate('/');
  const signOut = () => clearIdentity();

  if (user) {
    return (
      <section className="relative max-w-5xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <UserIcon size={28} className="text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] uppercase tracking-[0.18em] font-semibold text-emerald-500">
              Profile
            </p>
            <h1 className="text-[24px] md:text-[28px] font-extrabold tracking-tight text-emerald-500 leading-tight">
              {user.name}
            </h1>
            <p className="text-[13px] text-emerald-500">
              Bookings tracked by +{user.phone}
            </p>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="hidden sm:inline-flex h-10 rounded-full bg-transparent border-white/15 text-zinc-200 hover:bg-white/5"
          >
            <LogOut size={15} className="mr-2" /> Sign out
          </Button>
        </div>

        <div className="mt-9 grid md:grid-cols-3 gap-3">
          <Tile
            icon={Sparkles}
            label="My bookings"
            desc="See upcoming and past visits"
            onClick={() => navigate('/bookings')}
          />
          <Tile
            icon={MapPin}
            label="Saved addresses"
            desc="Home, office and parents\u2019"
            onClick={() => toast({ title: 'Coming soon' })}
          />
          <Tile
            icon={Bell}
            label="Notifications"
            desc="Reminders and updates"
            onClick={() => toast({ title: 'Coming soon' })}
          />
          <Tile
            icon={ShieldCheck}
            label="Privacy"
            desc="Manage your data"
            onClick={() => toast({ title: 'Coming soon' })}
          />
          <Tile
            icon={HelpCircle}
            label="Help & support"
            desc={`Call ${CONTACT.phone}`}
            onClick={() => toast({ title: 'Call ' + CONTACT.phone })}
          />
        </div>

        <ConciergeCard />

        <Button
          onClick={signOut}
          variant="outline"
          className="sm:hidden mt-6 w-full h-12 rounded-2xl bg-transparent border-white/15 text-zinc-200 hover:bg-white/5"
        >
          <LogOut size={16} className="mr-2" /> Sign out
        </Button>
      </section>
    );
  }

  // Signed out: dual-pane sign in
  return (
    <section className="relative max-w-6xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <p className="text-[12px] uppercase tracking-[0.18em] font-semibold text-emerald-400">
            Member access
          </p>
          <h1 className="mt-2 text-[34px] md:text-[44px] font-extrabold leading-[1.05] tracking-tight">
            Welcome to <span className="font-display italic font-medium text-emerald-400">Aevum.</span>
          </h1>
          <p className="mt-4 text-[15px] text-zinc-400 max-w-md">
            Sign in to keep track of your bookings, save your address, and
            reach our concierge in a tap. Or continue as a guest — your
            bookings stay linked to your phone number.
          </p>
          <ConciergeCard className="mt-8" />
        </div>

        <div className="lg:col-span-7">
          <div className="glass rounded-3xl p-7">
            <Button
              onClick={google}
              variant="outline"
              className="w-full h-12 rounded-2xl bg-transparent border-white/15 text-zinc-100 hover:bg-white/5 hover:text-zinc-50 gap-2"
            >
              <GoogleMark /> Continue with Google
            </Button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 font-bold">
                or with email
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="space-y-3">
              <Field
                icon={Mail}
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                type="email"
              />
              <Field
                icon={Lock}
                label="Password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                type="password"
              />
              <Field
                icon={PhoneCall}
                label="Phone (for booking sync)"
                value={phoneIn}
                onChange={setPhoneIn}
                placeholder="+91 9XXXX XXXXX"
              />

              <Button
                onClick={signIn}
                disabled={loading}
                className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0a1411] font-bold text-[15px] disabled:opacity-60"
              >
                {loading
                  ? 'Signing in…'
                  : mode === 'signin'
                  ? 'Sign in'
                  : 'Create account'}
              </Button>
              <p className="text-center text-[13px] text-zinc-400">
                {mode === 'signin' ? "Don\u2019t have an account?" : 'Already a member?'}{' '}
                <button
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-emerald-400 font-bold hover:text-emerald-300"
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-500 font-bold">
                Just exploring?
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <Button
              onClick={guest}
              variant="outline"
              className="w-full h-12 rounded-2xl bg-transparent border-white/15 text-zinc-100 hover:bg-white/5 hover:text-zinc-50"
            >
              Continue as guest
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tile({ icon: Icon, label, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left glass rounded-2xl px-4 py-4 hover:border-emerald-500/40 transition-colors flex items-center gap-3"
    >
      <span className="h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
        <Icon size={18} className="text-emerald-400" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[14px] font-bold text-zinc-50">{label}</span>
        <span className="block text-[12px] text-zinc-400 truncate">{desc}</span>
      </span>
      <ChevronRight size={16} className="text-zinc-500" />
    </button>
  );
}

function Field({ icon: Icon, label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] uppercase tracking-[0.14em] font-bold text-zinc-300">
        {label}
      </Label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 pl-9 bg-[#13231e] border-white/10 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-emerald-500/40"
        />
      </div>
    </div>
  );
}

function ConciergeCard({ className = '' }) {
  return (
    <div
      className={
        'rounded-2xl border border-emerald-500/25 bg-emerald-500/8 p-4 flex items-center gap-3 ' +
        className
      }
    >
      <span className="h-11 w-11 rounded-full bg-emerald-500 text-[#0a1411] flex items-center justify-center">
        <PhoneCall size={20} />
      </span>
      <div className="flex-1">
        <p className="text-[13px] font-bold text-zinc-50">Talk to our concierge</p>
        <p className="text-[12px] text-zinc-300">Online 24×7 · average pickup 12s</p>
      </div>
      <a
        href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
        className="px-3 h-9 inline-flex items-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#0a1411] text-[12px] font-bold"
      >
        {CONTACT.phone}
      </a>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#FFC107"
        d="M43.6 20.5h-1.9V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.3 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 7.1 29.3 5 24 5 16.3 5 9.6 9.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.5 16.1 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2c-.4.4 6.8-5 6.8-14.8 0-1.2-.1-2.3-.6-3.5z"
      />
    </svg>
  );
}
