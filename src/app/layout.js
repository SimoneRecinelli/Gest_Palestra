import { Oswald, Inter } from 'next/font/google';
import SessionWrapper from './SessionWrapper';
import './globals.css';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-oswald',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Diario Allenamento',
};

export default function RootLayout({ children }) {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      // Ignora eventuali errori di rete
    }
    window.location.href = '/login';
  };

  return (
    <html lang="it">
      <body className={`${oswald.variable} ${inter.variable} font-body bg-paper text-ink min-h-screen flex flex-col`}>
        <SessionWrapper>
          {/* Navbar integrata direttamente qui */}
          <header className="w-full bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold tracking-tight text-stone-900 font-['Oswald']">
                GESTIONALE PALESTRA
              </span>
              <span className="text-xs uppercase bg-stone-100 text-stone-600 px-2 py-1 rounded-md font-medium tracking-wide">
                Atleta
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-stone-600 hidden sm:inline">
                Ciao, <strong className="text-stone-900">Simone</strong>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 shadow-sm cursor-pointer"
              >
                <span>Esci</span>
              </button>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>
        </SessionWrapper>
      </body>
    </html>
  );
}