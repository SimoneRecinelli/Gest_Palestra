'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
    <button onClick={handleAdd} disabled={loading} className="w-full py-3 border-2 border-dashed border-stone-300 text-stone-500 rounded-xl hover:bg-stone-50 hover:text-stone-700 hover:border-stone-400 transition-all font-medium text-sm">
      {loading ? 'Aggiungendo...' : '+ Aggiungi Esercizio in questo giorno'}
    </button>
  );
}