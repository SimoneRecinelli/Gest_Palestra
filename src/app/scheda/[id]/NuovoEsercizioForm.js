'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Search } from 'lucide-react';

export default function NuovoEsercizioForm({ giornoId }) {
  const [aperto, setAperto] = useState(false);
  const [libreria, setLibreria] = useState([]);
  
  // Stati del form
  const [nome, setNome] = useState('');
  const [gruppoMuscolare, setGruppoMuscolare] = useState(''); // <-- Stato aggiunto
  const [serie, setSerie] = useState('');
  const [ripetizioni, setRipetizioni] = useState('');
  const [recupero, setRecupero] = useState('');
  const [notePt, setNotePt] = useState('');
  const [ordine, setOrdine] = useState(0);
  const [isSuperset, setIsSuperset] = useState(false);
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(''); 
  
  const [caricamento, setCaricamento] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (aperto && libreria.length === 0) {
      fetch('/api/esercizi/libreria')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setLibreria(data);
        })
        .catch(err => console.error("Errore caricamento libreria", err));
    }
  }, [aperto, libreria.length]);

  const handleSelezionaDallaLibreria = (e) => {
    const nomeSelezionato = e.target.value;
    if (!nomeSelezionato) return;
    
    const esEsistente = libreria.find(es => es.nome === nomeSelezionato);
    if (esEsistente) {
      setNome(esEsistente.nome || '');
      setGruppoMuscolare(esEsistente.gruppo_muscolare || ''); // <-- Autocompilazione
      setSerie(esEsistente.serie || '');
      setRipetizioni(esEsistente.ripetizioni || '');
      setRecupero(esEsistente.recupero || '');
      setNotePt(esEsistente.note_pt || '');
      setVideoUrl(esEsistente.video_url || '');
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setCaricamento(true);

    let urlVideoFinale = videoUrl;

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

      urlVideoFinale = url;
    }

    await fetch('/api/esercizi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        giornoId, 
        nome, 
        gruppo_muscolare: gruppoMuscolare, // <-- Invio dati al DB
        serie, 
        ripetizioni, 
        recupero, 
        notePt, 
        videoUrl: urlVideoFinale, 
        ordine, 
        is_superset: isSuperset 
      }),
    });

    setCaricamento(false);
    setNome('');
    setGruppoMuscolare('');
    setSerie('');
    setRipetizioni('');
    setRecupero('');
    setNotePt('');
    setOrdine(0);
    setIsSuperset(false);
    setFile(null);
    setVideoUrl('');
    setAperto(false);
    router.refresh();
  }

  if (!aperto) {
    return (
      <button
        onClick={() => setAperto(true)}
        className="flex items-center gap-2 text-accent font-medium hover:text-accentdark mb-6 mt-4"
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        Aggiungi esercizio
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-5 mb-6 mt-4 relative animate-in fade-in slide-in-from-top-2 duration-200">
      <button type="button" onClick={() => setAperto(false)} className="absolute top-4 right-4 text-inkmuted hover:text-ink">
        <X className="w-4 h-4" />
      </button>
      
      <h4 className="font-display font-semibold text-lg mb-4">Nuovo esercizio</h4>
      
      <div className="space-y-4">
        
        {libreria.length > 0 && (
          <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 mb-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase mb-2">
              <Search className="w-3.5 h-3.5" /> Scegli dallo storico (opzionale)
            </label>
            <select 
              onChange={handleSelezionaDallaLibreria}
              defaultValue=""
              className="w-full px-3 py-2 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="" disabled>Seleziona un esercizio per autocompilare...</option>
              {libreria.map((es, idx) => (
                <option key={idx} value={es.nome}>{es.nome}</option>
              ))}
            </select>
          </div>
        )}

        {/* GRIGLIA NOME E GRUPPO MUSCOLARE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold text-inkmuted mb-1">Nome Esercizio</label>
            <input
              placeholder="Es: Panca Piana"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-inkmuted mb-1">Gruppo Muscolare</label>
            <select
              value={gruppoMuscolare}
              onChange={(e) => setGruppoMuscolare(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Nessuno</option>
              <option value="Petto">Petto</option>
              <option value="Dorso">Dorso</option>
              <option value="Gambe">Gambe</option>
              <option value="Spalle">Spalle</option>
              <option value="Bicipiti">Bicipiti</option>
              <option value="Tricipiti">Tricipiti</option>
              <option value="Addome">Addome</option>
            </select>
          </div>
        </div>
        
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

        <div>
          <label className="block text-[10px] uppercase font-bold text-inkmuted mb-1">Istruzioni / Note PT</label>
          <textarea
            placeholder="Consigli su come eseguire l'esercizio"
            value={notePt}
            onChange={(e) => setNotePt(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>

        <div className="flex items-center space-x-2 pt-1 pb-2 border-b border-stone-100">
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
          <label className="block text-[10px] uppercase font-bold text-inkmuted mb-1">Link Video (YouTube) esistente</label>
          <input
            type="url"
            placeholder="https://..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-3 py-2 mb-2 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          
          <label className="block text-[10px] uppercase font-bold text-inkmuted mb-1">Oppure carica un nuovo video file</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={caricamento}
        className="mt-6 w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {caricamento ? 'Salvataggio in corso...' : 'Salva esercizio'}
      </button>
    </form>
  );
}