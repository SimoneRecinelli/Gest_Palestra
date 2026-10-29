'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';

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
    <button onClick={handleDelete} disabled={loading} className="btn-danger btn-sm shrink-0">
      <Trash2 className="w-4 h-4" />
      {loading ? 'Eliminazione…' : 'Elimina seduta'}
    </button>
  );
}
