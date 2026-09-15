'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NuovoGiornoForm({ schedaId }) {
  const [nome, setNome] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch('/api/giorni', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedaId, nome }),
    });
    setNome('');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 8, marginBottom: 24 }}>
      <input
        placeholder="Nome giorno (es. Giorno A - Push)"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        style={{ marginRight: 8, padding: 6 }}
      />
      <button type="submit">Aggiungi giorno</button>
    </form>
  );
}
