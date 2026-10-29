'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function AggiungiEsercizio({ giornoId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    await fetch('/api/esercizi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ giorno_id: giornoId })
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="w-full min-h-[56px] flex items-center justify-center gap-2 border-2 border-dashed border-steel/50 text-steel rounded-card font-semibold active:bg-white disabled:opacity-50"
    >
      <Plus className="w-5 h-5" strokeWidth={2.5} />
      {loading ? 'Aggiunta in corso…' : 'Aggiungi esercizio a questa seduta'}
    </button>
  );
}
