'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function MainHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === '/login') return null;
  if (!session) return null;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    window.location.href = '/login';
  };

  const ruolo = session.user?.ruolo === 'pt' ? 'Personal Trainer' : 'Atleta';
  const nomeUtente = session.user?.ruolo === 'pt' ? 'Mattia' : 'Simone';

  return (
    <header className="w-full bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <span className="text-xl font-bold tracking-tight text-stone-900 font-['Oswald']">
          GESTIONALE PALESTRA
        </span>
        <span className="text-xs uppercase bg-stone-100 text-stone-600 px-2 py-1 rounded-md font-medium tracking-wide">
          {ruolo}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-stone-600 hidden sm:inline">
          Ciao, <strong className="text-stone-900 capitalize">{nomeUtente}</strong>
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 shadow-sm cursor-pointer"
        >
          <span>Esci</span>
        </button>
      </div>
    </header>
  );
}