import { Oswald, Inter } from 'next/font/google';
import SessionWrapper from './SessionWrapper';
import MainHeader from './MainHeader';
import './globals.css';

export const metadata = {
  title: 'Gestionale Palestra',
  description: 'Diario di allenamento',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Palestra',
  },
};

export default function RootLayout({ children }) {
  return (
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