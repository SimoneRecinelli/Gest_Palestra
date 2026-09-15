'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';

export default function NuovaSchedaForm() {
  const [aperto, setAperto] = useState(false);
  const [titolo, setTitolo] = useState('');
  const [atletaEmail, setAtletaEmail] = useState('');
  const [errore, setErrore] = useState('');
  const [caricamento, setCaricamento] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrore('');
    setCaricamento(true);
    const risposta = await fetch('/api/schede', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titolo, atletaEmail }),
    });
    const dati = await risposta.json();
    setCaricamento(false);
    if (!risposta.ok) {
      setErrore(dati.errore || 'Errore');
      return;
    }
    router.push(`/scheda/${dati.id}`);
  }

  if (!aperto) {
    return (
      <button
        onClick={() => setAperto(true)}
        className="flex items-center gap-2 text-accent font-medium hover:text-accentdark mt-2"
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        Nuova scheda
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-5 mt-2 max-w-sm relative">
      <button type="button" onClick={() => setAperto(false)} className="absolute top-4 right-4 text-inkmuted hover:text-ink">
        <X className="w-4 h-4" />
      </button>
      <h3 className="font-display font-semibold text-lg mb-4">Nuova scheda</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-inkmuted mb-1">Titolo</label>
          <input
            placeholder="Scheda Forza — Ottobre"
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            required
            className="w-full px-3 py-2 bg-white border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm text-inkmuted mb-1">Email dell'atleta</label>
          <input
            placeholder="atleta già registrato"
            value={atletaEmail}
            onChange={(e) => setAtletaEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-white border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>
      {errore && <p className="text-sm text-red-700 mt-3">{errore}</p>}
      <button
        type="submit"
        disabled={caricamento}
        className="mt-4 bg-accent hover:bg-accentdark text-white font-medium px-4 py-2 rounded transition-colors disabled:opacity-60"
      >
        {caricamento ? 'Creazione...' : 'Crea scheda'}
      </button>
    </form>
  );
}
