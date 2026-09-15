'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function NuovoGiornoForm({ schedaId }) {
  const [aperto, setAperto] = useState(false);
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
    setAperto(false);
    router.refresh();
  }

  if (!aperto) {
    return (
      <button
        onClick={() => setAperto(true)}
        className="flex items-center gap-1.5 text-accent font-medium hover:text-accentdark text-sm whitespace-nowrap px-3 py-2"
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        Seduta
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-1 py-2">
      <input
        placeholder="Nome seduta"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        autoFocus
        className="px-2 py-1.5 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent w-32"
      />
      <button type="submit" className="text-accent font-medium text-sm hover:text-accentdark">
        Aggiungi
      </button>
    </form>
  );
}
