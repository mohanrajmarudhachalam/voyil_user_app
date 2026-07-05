import React, { useState } from 'react';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { adminLogin } from '../lib/api';
import { useToast } from '../hooks/use-toast';

export default function AdminLogin({ onLoggedIn }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (e) => {
    e?.preventDefault?.();
    if (!password) return;
    setLoading(true);
    try {
      const t = await adminLogin(password);
      toast({ title: 'Welcome back.' });
      onLoggedIn(t);
    } catch {
      toast({
        title: 'Login failed',
        description: 'Check the password and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#06100d] flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div
        className="absolute -top-20 -right-20 w-[460px] h-[460px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(closest-side, rgba(16,185,129,0.30), transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(closest-side, rgba(20,184,166,0.18), transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <div className="relative w-full max-w-[440px] glass rounded-3xl p-8 animate-fadeUp">
        <div className="flex items-center gap-3">
          <span className="h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="text-emerald-400" size={22} />
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-emerald-400">
              Staff console
            </p>
            <h1 className="text-[22px] font-extrabold tracking-tight leading-tight text-zinc-50">
              Aevum Admin
            </h1>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <Sparkles size={14} className="text-emerald-400 mt-0.5 shrink-0" />
          <p className="text-[12px] text-zinc-300 leading-relaxed">
            Restricted area. Bookings and customer data shown here are
            confidential. Sign in with your staff password.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <label className="block text-zinc-300 text-[11px] uppercase tracking-[0.14em] font-bold">
            Admin password
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full h-12 pl-9 pr-3 rounded-xl bg-[#13231e] border border-white/10 text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/30 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-[#0a1411] font-bold text-[15px] transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in to admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
