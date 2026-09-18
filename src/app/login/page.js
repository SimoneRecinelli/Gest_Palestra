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
      password 
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
    <div className="flex flex-col items-center justify-center mt-16 sm:mt-24 px-4">
      {/* Intestazione Brand */}
      <div className="mb-10 text-center">
        <h1 className="font-display font-bold text-4xl tracking-tight text-stone-900 font-['Oswald'] uppercase mb-2">
          Gestionale Palestra
        </h1>
        <p className="text-stone-500 text-sm font-medium">
          Accedi al tuo diario di allenamento
        </p>
      </div>

      {/* Form di Login Moderno */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 p-8">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Accedi</h2>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all placeholder-stone-400"
              placeholder="Inserisci la tua email"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white transition-all placeholder-stone-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-bold transition-colors shadow-md disabled:opacity-70 mt-4"
          >
            {loading ? 'Accesso in corso...' : 'Entra'}
          </button>
        </form>
      </div>
    </div>
  );
}