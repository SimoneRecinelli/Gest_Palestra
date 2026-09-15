import SessionWrapper from './SessionWrapper';

export const metadata = {
  title: 'Gestionale Palestra',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body style={{ margin: 0 }}>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
