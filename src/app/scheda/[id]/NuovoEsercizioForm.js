'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';

export default function NuovoEsercizioForm({ giornoId }) {
  const [aperto, setAperto] = useState(false);
  const [nome, setNome] = useState('');
  const [serie, setSerie] = useState('');
  const [ripetizioni, setRipetizioni] = useState('');
  const [recupero, setRecupero] = useState('');
  const [notePt, setNotePt] = useState('');
  const [ordine, setOrdine] = useState(0);
  const [isSuperset, setIsSuperset] = useState(false);
  const [file, setFile] = useState(null);
  const [caricamento, setCaricamento] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setCaricamento(true);

    let videoUrl = null;

    if (file) {
      const rispostaUrl = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name }),
      });
      const { uploadUrl, videoUrl: url } = await rispostaUrl.json();

      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      videoUrl = url;
    }

    await fetch('/api/esercizi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        giornoId, 
        nome, 
        serie, 
        ripetizioni, 
        recupero, 
        notePt, 
        videoUrl, 
        ordine, 
        is_superset: isSuperset 
      }),
    });

    setCaricamento(false);
    setNome('');
    setSerie('');
    setRipetizioni('');
    setRecupero('');
    setNotePt('');
    setOrdine(0);
    setIsSuperset(false);
    setFile(null);
    setAperto(false);
    router.refresh();
  }

  if (!aperto) {
    return (
      <button
        onClick={() => setAperto(true)}
        className="flex items-center gap-2 text-accent font-medium hover:text-accentdark mb-6"
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        Aggiungi esercizio
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-5 mb-6 relative">
      <button type="button" onClick={() => setAperto(false)} className="absolute top-4 right-4 text-inkmuted hover:text-ink">
        <X className="w-4 h-4" />
      </button>
      <h4 className="font-display font-semibold text-lg mb-4">Nuovo esercizio</h4>
      <div className="space-y-3">
        <input
          placeholder="Nome esercizio"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="w-full px-3 py-2 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        
{/* Griglia form corretta con etichette chiare */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold text-inkmuted mb-1">Serie</label>
            <input
              placeholder="Es: 4"
              value={serie}
              onChange={(e) => setSerie(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-inkmuted mb-1">Ripetizioni</label>
            <input
              placeholder="8-10"
              value={ripetizioni}
              onChange={(e) => setRipetizioni(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-inkmuted mb-1">Recupero</label>
            <input
              placeholder="90s o 1'30"
              value={recupero}
              onChange={(e) => setRecupero(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-inkmuted mb-1">Ordine (Pos.)</label>
            <input
              type="number"
              placeholder="0"
              value={ordine}
              onChange={(e) => setOrdine(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <textarea
          placeholder="Consigli su come eseguire l'esercizio"
          value={notePt}
          onChange={(e) => setNotePt(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {/* Spunta Superserietà */}
        <div className="flex items-center space-x-2 pt-1">
          <input
            type="checkbox"
            id="nuovo-superset-form"
            checked={isSuperset}
            onChange={(e) => setIsSuperset(e.target.checked)}
            className="w-4 h-4 text-stone-900 border-border rounded focus:ring-accent cursor-pointer"
          />
          <label htmlFor="nuovo-superset-form" className="text-sm font-medium text-stone-700 cursor-pointer">
            ⚡ In superset con l'esercizio successivo
          </label>
        </div>

        <div>
          <label className="block text-sm text-inkmuted mb-1">Video dell'esecuzione</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={caricamento}
        className="mt-4 bg-accent hover:bg-accentdark text-white font-medium px-4 py-2 rounded transition-colors disabled:opacity-60"
      >
        {caricamento ? 'Caricamento...' : 'Salva esercizio'}
      </button>
    </form>
  );
}