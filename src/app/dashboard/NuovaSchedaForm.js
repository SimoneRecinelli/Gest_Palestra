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
      <button onClick={() => setAperto(true)} className="btn-dark w-full mt-5">
        <Plus className="w-5 h-5" strokeWidth={2.5} />
        Nuova scheda
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 mt-5 apri">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-2xl tracking-wide">Nuova scheda</h2>
        <button
          type="button"
          onClick={() => setAperto(false)}
          aria-label="Chiudi"
          className="w-11 h-11 -mr-2 flex items-center justify-center rounded-full text-steel active:bg-black/5"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="titolo-scheda" className="field-label">Titolo</label>
          <input
            id="titolo-scheda"
            placeholder="Scheda Forza — Ottobre"
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            required
            className="field"
          />
        </div>
        <div>
          <label htmlFor="email-atleta" className="field-label">Email dell'atleta</label>
          <input
            id="email-atleta"
            type="email"
            inputMode="email"
            autoCapitalize="none"
            placeholder="atleta già registrato"
            value={atletaEmail}
            onChange={(e) => setAtletaEmail(e.target.value)}
            required
            className="field"
          />
        </div>
      </div>
      {errore && (
        <p role="alert" className="text-sm font-medium text-signaldark mt-3">
          {errore}
        </p>
      )}
      <button type="submit" disabled={caricamento} className="btn-primary w-full mt-5">
        {caricamento ? 'Creazione…' : 'Crea scheda'}
      </button>
    </form>
  );
}
