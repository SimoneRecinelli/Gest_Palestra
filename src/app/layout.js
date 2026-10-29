import { Big_Shoulders_Display, Hanken_Grotesk } from 'next/font/google';
import SessionWrapper from './SessionWrapper';
import MainHeader from './MainHeader';
import './globals.css';

// Display: lettere strette da cartellonistica industriale, ottime per i numeri grandi.
const display = Big_Shoulders_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

// Testo: grotesque pulito e leggibile anche con poca luce.
const body = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Gestionale Palestra',
  description: 'Diario di allenamento',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    // L'app occupa tutto lo schermo e la barra di stato si appoggia sull'header scuro
    statusBarStyle: 'black-translucent',
    title: 'Palestra',
  },
  formatDetection: { telephone: false },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // necessario per usare le safe area di iPhone (notch, barra Home)
  themeColor: '#15171A',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-[100dvh] flex flex-col">
        <SessionWrapper>
          <MainHeader />
          <main className="flex-1 pb-[calc(env(safe-area-inset-bottom)+2rem)]">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
