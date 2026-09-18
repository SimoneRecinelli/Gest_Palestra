'use client';

import { Oswald, Inter } from 'next/font/google';
import SessionWrapper from './SessionWrapper';
import './globals.css';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

function MainHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // 1. Nascondi la navbar se siamo sulla pagina di login
  if (pathname === '/login') return null;

  // 2. Se la sessione non è ancora caricata, non mostrare la navbar (evita sfarfallii)
  if (!session) return null;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignora errori di rete
    }
    window.location.href = '/login';
  };

  // 3. Estraiamo il ruolo e il nome utente dalla sessione in modo dinamico
  const ruolo = session.user?.ruolo === 'pt' ? 'Personal Trainer' : 'Atleta';
  // Prende il nome (se esiste) oppure la parte della mail prima della chiocciola
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
          Ciao, <strong className="text-stone-900 capitalize">{nomeUtente.replace('_', ' ')}</strong>
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

export default function RootLayout({ children }) {
  return (
    // Aggiungi suppressHydrationWarning qui e nel body
    <html lang="it" suppressHydrationWarning>
      <body suppressHydrationWarning className="font-sans bg-[#f5f2eb] text-[#1c1917] min-h-screen flex flex-col antialiased">
        <SessionWrapper>
          <MainHeader />
          <main className="flex-1">
            {children}
          </main>
        </SessionWrapper>
      </body>
    </html>
  );
}