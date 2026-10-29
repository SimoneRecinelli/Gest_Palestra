'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { ChevronLeft, LogOut } from 'lucide-react';
import Piatto from './components/Piatto';

// Dove porta la freccia indietro. In modalità app su iPhone non c'è il tasto del browser,
// quindi ogni pagina interna deve avere la sua uscita.
function destinazioneIndietro(pathname) {
  if (/^\/scheda\/[^/]+\/modifica/.test(pathname)) {
    return { href: pathname.replace(/\/modifica.*$/, ''), etichetta: 'Scheda' };
  }
  if (pathname.startsWith('/scheda/')) {
    return { href: '/dashboard', etichetta: 'Schede' };
  }
  return null;
}

export default function MainHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === '/login') return null;
  if (!session) return null;

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const isPt = session.user?.ruolo === 'pt';
  const ruolo = isPt ? 'Personal Trainer' : 'Atleta';
  const nomeUtente = isPt ? 'Mattia' : 'Simone';
  const indietro = destinazioneIndietro(pathname);

  return (
    <header className="sticky top-0 z-40 bg-rubber text-white pt-[env(safe-area-inset-top)]">
      <div className="h-14 px-3 flex items-center justify-between gap-3">
        {indietro ? (
          <Link
            href={indietro.href}
            className="flex items-center min-h-tap -ml-1 pl-1 pr-3 font-semibold text-[15px] active:opacity-60"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
            {indietro.etichetta}
          </Link>
        ) : (
          <Link href="/dashboard" className="flex items-center gap-2.5 min-h-tap pl-1.5">
            <Piatto colore="#D42B1E" size={22} foro="#15171A" />
            <span className="font-display font-extrabold text-[22px] leading-none tracking-wide">
              Palestra
            </span>
          </Link>
        )}

        <div className="flex items-center gap-1">
          <div className="text-right leading-tight mr-1">
            <p className="text-sm font-semibold">{nomeUtente}</p>
            <p className="text-xs text-white/60">{ruolo}</p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Esci"
            className="w-11 h-11 flex items-center justify-center rounded-full active:bg-white/15"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
