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

  // Funzione per tradurre i link YouTube normali e Shorts in link da incorporare (embed)
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('/shorts/')) return url.replace('/shorts/', '/embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'www.youtube.com/embed/').split('?')[0];
    if (url.includes('watch?v=')) return url.replace('watch?v=', 'embed/').split('&')[0];
    return url;
  };

  return (
    <div className="bg-card border border-border border-l-4 border-l-accent rounded-lg p-5 mb-4">
      <h3 className="font-display font-semibold text-xl mb-3">{esercizio.nome}</h3>

      {/* Tabellone: serie / ripetizioni / recupero */}
      <div className="grid grid-cols-3 divide-x divide-border border border-border rounded bg-white/60 mb-3">
        <div className="text-center py-2">
          <p className="font-display font-semibold text-lg leading-none">{esercizio.serie ?? '—'}</p>
          <p className="text-xs text-inkmuted mt-1">serie</p>
        </div>
        <div className="text-center py-2">
          <p className="font-display font-semibold text-lg leading-none">{esercizio.ripetizioni ?? '—'}</p>
          <p className="text-xs text-inkmuted mt-1">ripetizioni</p>
        </div>
        <div className="text-center py-2">
          <p className="font-display font-semibold text-lg leading-none">{esercizio.recupero ?? '—'}</p>
          <p className="text-xs text-inkmuted mt-1">recupero</p>
        </div>
      </div>

      {/* Note del PT per l'Atleta */}
      {esercizio.note_pt && (
        <p className="text-sm italic text-inkmuted border-l-2 border-border pl-3 mb-3">
          {esercizio.note_pt}
        </p>
      )}

      {/* Note dell'Atleta visibili al PT */}
      {esercizio.nota_atleta && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <span className="block text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">
            📝 Nota di Simone:
          </span>
          <p className="text-sm text-yellow-900">{esercizio.nota_atleta}</p>
        </div>
      )}

      {/* Video YouTube con iframe al posto di <video> */}
      {esercizio.video_url ? (
        <div className="w-full max-w-sm mb-4">
          <iframe 
            src={getEmbedUrl(esercizio.video_url)} 
            className="w-full aspect-video rounded bg-black"
            allowFullScreen
            title={`Video ${esercizio.nome}`}
          ></iframe>
        </div>
      ) : (
        <p className="text-sm text-inkmuted mb-4">Nessun video caricato per questo esercizio.</p>
      )}

      {/* Diario pesi */}
      <div className="border-t border-border pt-3">
        <p className="text-sm font-medium text-inkmuted mb-2">Diario pesi</p>
        {esercizio.pesi && esercizio.pesi.length > 0 ? (
          <ul className="space-y-1 mb-3">
            {esercizio.pesi.map((p, i) => (
              <li
                key={p.id}
                className={`flex items-baseline justify-between text-sm ${i === 0 ? 'riga-nuova' : ''}`}
              >
                <span>
                  <span className="font-display font-semibold">{p.peso_kg ?? '—'} kg</span>
                  {p.ripetizioni_fatte && <span className="text-inkmuted"> × {p.ripetizioni_fatte}</span>}
                </span>
                <span className="text-xs text-inkmuted">
                  {new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-inkmuted mb-3">Ancora nessuna serie registrata.</p>
        )}

        {isAtleta && (
          <form onSubmit={registraSerie} className="flex gap-2">
            <input
              type="number"
              step="0.5"
              placeholder="kg"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              className="w-20 px-2 py-1.5 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="text"
              placeholder="ripetizioni"
              value={ripetizioniFatte}
              onChange={(e) => setRipetizioniFatte(e.target.value)}
              className="w-24 px-2 py-1.5 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={registrando}
              className="flex items-center gap-1 bg-accent hover:bg-accentdark text-white text-sm font-medium px-3 py-1.5 rounded transition-colors disabled:opacity-60"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              Registra
            </button>
          </form>
        )}
      </div>

      {isAtleta && (
        <div className="border-t border-border pt-3 mt-3">
          <p className="text-sm font-medium text-inkmuted mb-2">Le tue note</p>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Sensazioni, aggiustamenti, promemoria..."
            rows={2}
            className="w-full px-3 py-2 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={salvaNota}
            disabled={salvataggioNota}
            className="mt-2 text-sm text-accent hover:text-accentdark font-medium disabled:opacity-60"
          >
            {salvataggioNota ? 'Salvataggio...' : 'Salva nota'}
          </button>
        </div>
      )}
    </div>
  );
}