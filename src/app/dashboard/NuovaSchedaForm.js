'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NuovaSchedaForm() {
  const [titolo, setTitolo] = useState('');
  const [atletaEmail, setAtletaEmail] = useState('');
  const [errore, setErrore] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrore('');
    const risposta = await fetch('/api/schede', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titolo, atletaEmail }),
    });
    const dati = await risposta.json();
    if (!risposta.ok) {
      setErrore(dati.errore || 'Errore');
      return;
    }
    router.push(`/scheda/${dati.id}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginTop: 24, border: '1px dashed #aaa', padding: 16, borderRadius: 8, maxWidth: 400 }}
    >
      <h3>Nuova scheda</h3>
      <input
        placeholder="Titolo (es. Scheda Forza - Ottobre)"
        value={titolo}
        onChange={(e) => setTitolo(e.target.value)}
        required
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 6 }}
      />
      <input
        placeholder="Email dell'atleta (già registrato)"
        value={atletaEmail}
        onChange={(e) => setAtletaEmail(e.target.value)}
        required
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 6 }}
      />
      {errore && <p style={{ color: 'red' }}>{errore}</p>}
      <button type="submit">Crea scheda</button>
    </form>
  );
}
