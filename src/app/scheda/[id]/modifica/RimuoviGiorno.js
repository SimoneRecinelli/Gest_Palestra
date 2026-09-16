'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RimuoviGiorno({ giornoId, nomeGiorno }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Vuoi davvero eliminare "${nomeGiorno}" e tutti i suoi esercizi? L'azione è irreversibile.`)) return;
    setLoading(true);
    await fetch(`/api/giorni/${giornoId}`, { method: 'DELETE' });
    router.refresh();
    setLoading(false);
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading} 
      className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors"
    >
      {loading ? 'Eliminazione...' : '🗑 Rimuovi Giorno'}
    </button>
  );
}