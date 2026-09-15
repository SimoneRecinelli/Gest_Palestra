import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { query } from './db';

export const authOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credenziali',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { rows } = await query('SELECT * FROM utenti WHERE email = $1', [
          credentials.email,
        ]);
        const utente = rows[0];
        if (!utente) return null;

        const valida = await bcrypt.compare(credentials.password, utente.password_hash);
        if (!valida) return null;

        return {
          id: String(utente.id),
          email: utente.email,
          name: utente.nome,
          ruolo: utente.ruolo,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.ruolo = user.ruolo;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.ruolo = token.ruolo;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
