'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Search, Link2 } from 'lucide-react';
import { GRUPPI } from '@/app/components/gruppi';

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
      <button onClick={() => setAperto(true)} className="btn-dark w-full mt-2">
        <Plus className="w-5 h-5" strokeWidth={2.5} />
        Aggiungi esercizio
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 mt-2 apri">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-bold text-2xl tracking-tight">Nuovo esercizio</h4>
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
        {libreria.length > 0 && (
          <div className="bg-chalk p-3.5 rounded-[12px]">
            <label htmlFor="storico" className="flex items-center gap-1.5 text-[13px] font-semibold text-steel mb-2">
              <Search className="w-4 h-4" /> Parti da un esercizio già usato
            </label>
            <select
              id="storico"
              onChange={handleSelezionaDallaLibreria}
              defaultValue=""
              className="field"
            >
              <option value="" disabled>Scegli per compilare i campi…</option>
              {libreria.map((es, idx) => (
                <option key={idx} value={es.nome}>{es.nome}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nuovo-nome" className="field-label">Nome esercizio</label>
            <input
              id="nuovo-nome"
              placeholder="Es: Panca piana"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="field"
            />
          </div>
          <div>
            <label htmlFor="nuovo-gruppo" className="field-label">Gruppo muscolare</label>
            <select
              id="nuovo-gruppo"
              value={gruppoMuscolare}
              onChange={(e) => setGruppoMuscolare(e.target.value)}
              className="field"
            >
              <option value="">Nessuno</option>
              {GRUPPI.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label htmlFor="nuovo-serie" className="field-label">Serie</label>
            <input id="nuovo-serie" inputMode="numeric" placeholder="4" value={serie} onChange={(e) => setSerie(e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="nuovo-rip" className="field-label">Ripetizioni</label>
            <input id="nuovo-rip" placeholder="8-10" value={ripetizioni} onChange={(e) => setRipetizioni(e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="nuovo-rec" className="field-label">Recupero</label>
            <input id="nuovo-rec" placeholder="90 o 1'30" value={recupero} onChange={(e) => setRecupero(e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="nuovo-ordine" className="field-label">Posizione</label>
            <input id="nuovo-ordine" type="number" inputMode="numeric" placeholder="0" value={ordine} onChange={(e) => setOrdine(parseInt(e.target.value) || 0)} className="field" />
          </div>
        </div>

        <div>
          <label htmlFor="nuovo-note" className="field-label">Istruzioni per l'atleta</label>
          <textarea
            id="nuovo-note"
            placeholder="Come eseguire l'esercizio"
            value={notePt}
            onChange={(e) => setNotePt(e.target.value)}
            rows={2}
            className="field"
          />
        </div>

        <label htmlFor="nuovo-superset-form" className="flex items-center gap-3 min-h-tap cursor-pointer">
          <input
            type="checkbox"
            id="nuovo-superset-form"
            checked={isSuperset}
            onChange={(e) => setIsSuperset(e.target.checked)}
            className="w-6 h-6 rounded-md border-line accent-[#D42B1E] cursor-pointer"
          />
          <span className="flex items-center gap-1.5 font-semibold">
            <Link2 className="w-4 h-4 text-signal" strokeWidth={2.5} />
            Superset con l'esercizio successivo
          </span>
        </label>

        <div className="space-y-4">
          <div>
            <label htmlFor="nuovo-video" className="field-label">Link video (YouTube)</label>
            <input
              id="nuovo-video"
              type="url"
              inputMode="url"
              autoCapitalize="none"
              placeholder="https://…"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="field"
            />
          </div>
          <div>
            <label htmlFor="nuovo-file" className="field-label">Oppure carica un video</label>
            <input
              id="nuovo-file"
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm file:mr-4 file:min-h-[40px] file:px-4 file:rounded-[10px] file:border-0 file:font-semibold file:bg-chalk file:text-rubber"
            />
          </div>
        </div>
      </div>

      <button type="submit" disabled={caricamento} className="btn-primary w-full mt-6">
        {caricamento ? 'Salvataggio…' : 'Salva esercizio'}
      </button>
    </form>
  );
}
