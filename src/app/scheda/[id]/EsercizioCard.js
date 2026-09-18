'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function EsercizioCard({ esercizio, isAtleta }) {
  const [nota, setNota] = useState(esercizio.nota_atleta || '');
  const [salvataggioNota, setSalvataggioNota] = useState(false);
  const [peso, setPeso] = useState('');
  const [ripetizioniFatte, setRipetizioniFatte] = useState('');
  const [registrando, setRegistrando] = useState(false);
  const router = useRouter();

  async function salvaNota() {
    setSalvataggioNota(true);
    await fetch('/api/note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ esercizioId: esercizio.id, testo: nota }),
    });
    setSalvataggioNota(false);
  }

  async function registraSerie(e) {
    e.preventDefault();
    if (!peso && !ripetizioniFatte) return;
    setRegistrando(true);
    await fetch('/api/pesi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ esercizioId: esercizio.id, pesoKg: peso, ripetizioniFatte }),
    });
    setPeso('');
    setRipetizioniFatte('');
    setRegistrando(false);
    router.refresh();
  }

  // Funzione aggiornata per garantire compatibilità mobile assoluta (playsinline=1)
  const getEmbedUrl = (url) => {
    if (!url) return null;
    let finalUrl = url;
    if (url.includes('/shorts/')) finalUrl = url.replace('/shorts/', '/embed/');
    else if (url.includes('youtu.be/')) finalUrl = url.replace('youtu.be/', 'www.youtube.com/embed/').split('?')[0];
    else if (url.includes('watch?v=')) finalUrl = url.replace('watch?v=', 'embed/').split('&')[0];
    
    // Aggiungiamo playsinline per evitare che su iOS apra player strani
    return finalUrl.includes('?') ? `${finalUrl}&playsinline=1` : `${finalUrl}?playsinline=1`;
  };

  return (
    <div className="bg-card border border-border border-l-4 border-l-accent rounded-lg p-4 sm:p-5 mb-4 shadow-sm">
      <h3 className="font-display font-semibold text-xl mb-3">{esercizio.nome}</h3>

      {/* Tabellone: serie / ripetizioni / recupero */}
      <div className="grid grid-cols-3 divide-x divide-border border border-border rounded bg-white/60 mb-4 shadow-sm">
        <div className="text-center py-2">
          <p className="font-display font-semibold text-lg sm:text-xl leading-none">{esercizio.serie ?? '—'}</p>
          <p className="text-[10px] sm:text-xs uppercase tracking-wide text-inkmuted mt-1">serie</p>
        </div>
        <div className="text-center py-2">
          <p className="font-display font-semibold text-lg sm:text-xl leading-none">{esercizio.ripetizioni ?? '—'}</p>
          <p className="text-[10px] sm:text-xs uppercase tracking-wide text-inkmuted mt-1">ripetizioni</p>
        </div>
        <div className="text-center py-2">
          <p className="font-display font-semibold text-lg sm:text-xl leading-none">{esercizio.recupero ?? '—'}</p>
          <p className="text-[10px] sm:text-xs uppercase tracking-wide text-inkmuted mt-1">recupero</p>
        </div>
      </div>

      {esercizio.note_pt && (
        <p className="text-sm italic text-inkmuted border-l-2 border-border pl-3 mb-4">
          {esercizio.note_pt}
        </p>
      )}

      {esercizio.nota_atleta && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <span className="block text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">
            📝 Nota di Simone:
          </span>
          <p className="text-sm text-yellow-900">{esercizio.nota_atleta}</p>
        </div>
      )}

      {/* Contenitore Video 16:9 "Bulletproof" per mobile */}
      {esercizio.video_url ? (
        <div className="w-full mb-5 relative pt-[56.25%] bg-black rounded overflow-hidden shadow-sm">
          <iframe 
            src={getEmbedUrl(esercizio.video_url)} 
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            title={`Video ${esercizio.nome}`}
          ></iframe>
        </div>
      ) : (
        <p className="text-sm text-inkmuted mb-4">Nessun video caricato.</p>
      )}

      {/* Diario pesi */}
      <div className="border-t border-border pt-4">
        <p className="text-sm font-bold text-inkmuted uppercase tracking-wide mb-3">Diario pesi</p>
        {esercizio.pesi && esercizio.pesi.length > 0 ? (
          <ul className="space-y-2 mb-4">
            {esercizio.pesi.map((p, i) => (
              <li
                key={p.id}
                className={`flex items-center justify-between text-sm p-2 rounded ${i === 0 ? 'bg-stone-50 border border-stone-100 font-medium' : 'text-inkmuted'}`}
              >
                <span>
                  <span className={`font-display ${i === 0 ? 'text-stone-900 font-bold' : ''}`}>{p.peso_kg ?? '—'} kg</span>
                  {p.ripetizioni_fatte && <span> × {p.ripetizioni_fatte}</span>}
                </span>
                <span className="text-xs">
                  {new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-inkmuted mb-4">Ancora nessuna serie registrata.</p>
        )}

        {/* Form responsive e anti-zoom */}
        {isAtleta && (
          <form onSubmit={registraSerie} className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
            <input
              type="number"
              step="0.5"
              placeholder="kg"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              // text-base previene lo zoom automatico su iOS!
              className="w-[80px] sm:w-20 px-2 py-2 sm:py-1.5 bg-white border border-border rounded text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="text"
              placeholder="reps"
              value={ripetizioniFatte}
              onChange={(e) => setRipetizioniFatte(e.target.value)}
              className="w-[90px] sm:w-24 px-2 py-2 sm:py-1.5 bg-white border border-border rounded text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {/* Tasto flessibile: si allunga su mobile, resta compatto su pc */}
            <button
              type="submit"
              disabled={registrando}
              className="flex-1 sm:flex-none flex justify-center items-center gap-1 bg-accent hover:bg-accentdark text-white text-base sm:text-sm font-medium px-4 py-2 sm:py-1.5 rounded transition-colors disabled:opacity-60"
            >
              <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" strokeWidth={2.5} />
              Registra
            </button>
          </form>
        )}
      </div>

      {isAtleta && (
        <div className="border-t border-border pt-4 mt-4">
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Le tue note, sensazioni, aggiustamenti..."
            rows={2}
            className="w-full px-3 py-2 bg-white border border-border rounded text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent placeholder-stone-400"
          />
          <button
            onClick={salvaNota}
            disabled={salvataggioNota}
            className="mt-2 text-sm text-accent hover:text-accentdark font-semibold disabled:opacity-60 flex justify-end w-full"
          >
            {salvataggioNota ? 'Salvataggio...' : 'Salva nota'}
          </button>
        </div>
      )}
    </div>
  );
}