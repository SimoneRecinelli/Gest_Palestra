'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errore, setErrore] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrore('');
    const risultato = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (risultato?.error) {
      setErrore('Email o password non corrette');
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h1>Accedi</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }}
        />
        {errore && <p style={{ color: 'red' }}>{errore}</p>}
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          Entra
        </button>
      </form>
    </div>
  );
}
