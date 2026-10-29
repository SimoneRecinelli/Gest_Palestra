'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Email o password errate.');
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    // Sfondo scuro a tutto schermo, anche sotto notch e barra Home
    <div className="fixed inset-0 z-50 overflow-y-auto bg-rubber text-white">
      <div className="min-h-full flex flex-col px-6 pt-[calc(env(safe-area-inset-top)+2.5rem)] pb-[calc(env(safe-area-inset-bottom)+2rem)] max-w-md mx-auto">
        {/* Il disco visto di fronte, a grandezza di schermo: l'unico elemento che alza la voce */}
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <svg viewBox="0 0 240 240" className="w-44 h-44 sm:w-52 sm:h-52" aria-hidden="true">
            <circle cx="120" cy="120" r="116" fill="#D42B1E" />
            <circle cx="120" cy="120" r="96" fill="none" stroke="#AE2016" strokeWidth="3" />
            <circle cx="120" cy="120" r="64" fill="none" stroke="#AE2016" strokeWidth="3" />
            <circle cx="120" cy="120" r="36" fill="#FAFAF7" />
            <circle cx="120" cy="120" r="15" fill="#15171A" />
          </svg>
          <h1 className="font-display font-extrabold text-[44px] leading-none tracking-wide mt-8">
            Gestionale Palestra
          </h1>
          <p className="text-white/60 mt-2">Il diario della tua scheda</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div role="alert" className="p-3 bg-signal/15 border border-signal/60 text-[#FFB4AC] text-sm rounded-[10px] font-medium">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-[13px] font-semibold text-white/70 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field !bg-rubber2 !border-white/15 !text-white placeholder:!text-white/35 focus:!border-white focus:!ring-white/20"
              placeholder="nome@esempio.it"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[13px] font-semibold text-white/70 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field !bg-rubber2 !border-white/15 !text-white placeholder:!text-white/35 focus:!border-white focus:!ring-white/20"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full !min-h-[52px] text-base mt-2">
            {loading ? 'Accesso in corso…' : 'Entra'}
          </button>
        </form>
      </div>
    </div>
  );
}
