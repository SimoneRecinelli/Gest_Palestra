'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy } from 'lucide-react';

export default function DuplicaSchedaBtn({ schedaId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDuplica = async () => {
    if (!confirm('Vuoi duplicare questa scheda? Verrà creata una copia esatta.')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/schede/${schedaId}/duplica`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        // Redirige il PT direttamente alla pagina di modifica della nuova scheda clonata
        router.push(`/scheda/${data.newId}/modifica`);
        router.refresh();
      } else {
        alert('Errore durante la duplicazione.');
        setLoading(false);
      }
    } catch (error) {
      alert('Errore di connessione.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDuplica}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors disabled:opacity-50 border border-stone-200"
    >
      <Copy className="w-4 h-4" />
      {loading ? 'Duplicazione...' : 'Duplica'}
    </button>
  );
}