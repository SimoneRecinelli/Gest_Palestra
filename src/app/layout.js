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
  return (
    <html lang="it">
      <body className={`${oswald.variable} ${inter.variable} font-body bg-paper text-ink min-h-screen`}>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
