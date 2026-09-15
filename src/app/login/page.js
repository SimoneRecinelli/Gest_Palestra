'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Dumbbell } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState('');
  const [caricamento, setCaricamento] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrore('');
    setCaricamento(true);
    const risultato = await signIn('credentials', { email, password, redirect: false });
    setCaricamento(false);
    if (risultato?.error) {
      setErrore('Email o password non corrette.');
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Dumbbell className="w-6 h-6 text-accent" strokeWidth={2.5} />
          <span className="font-display font-semibold text-xl tracking-tight">Diario Allenamento</span>
        </div>

        <div className="bg-card border border-border rounded-lg border-l-4 border-l-accent p-8">
          <h1 className="font-display font-semibold text-2xl mb-6">Accedi</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-inkmuted mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-inkmuted mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            {errore && <p className="text-sm text-red-700">{errore}</p>}
            <button
              type="submit"
              disabled={caricamento}
              className="w-full bg-accent hover:bg-accentdark text-white font-medium py-2.5 rounded transition-colors disabled:opacity-60"
            >
              {caricamento ? 'Accesso...' : 'Entra'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
