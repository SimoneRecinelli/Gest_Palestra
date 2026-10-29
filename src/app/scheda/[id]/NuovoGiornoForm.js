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
        className="flex items-center gap-1.5 min-h-[44px] px-4 rounded-full border border-dashed border-steel/60 text-steel font-semibold text-[15px] whitespace-nowrap active:bg-white"
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        Seduta
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 shrink-0">
      <input
        aria-label="Nome della seduta"
        placeholder="Nome seduta"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        autoFocus
        className="field !min-h-[44px] !py-1.5 !rounded-full w-40"
      />
      <button type="submit" className="btn-primary btn-sm !min-h-[44px] !rounded-full">
        Aggiungi
      </button>
    </form>
  );
}
