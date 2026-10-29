'use client';
import { useState } from 'react';
import EsercizioCard from './EsercizioCard';
import NuovoEsercizioForm from './NuovoEsercizioForm';
import NuovoGiornoForm from './NuovoGiornoForm';
import { ChevronsUp, ChevronsDown } from 'lucide-react';

export default function SchedaTabs({ giorni, isPt, isAtleta, schedaId }) {
  const [attivo, setAttivo] = useState(giorni[0]?.id ?? null);
  const giornoAttivo = giorni.find((g) => g.id === attivo);

  // Stato per inviare il comando di espansione/compressione a tutte le card
  const [espansioneGlobale, setEspansioneGlobale] = useState({ stato: true, ts: 0 });

  return (
    <div>
      {/* Barra delle sedute: resta agganciata sotto l'header mentre si scorrono gli esercizi */}
      <div className="sticky top-[calc(env(safe-area-inset-top)+3.5rem)] z-30 -mx-4 px-4 py-3 mt-2 bg-chalk/95 backdrop-blur">
        <div role="tablist" className="flex items-center gap-2 overflow-x-auto nascondi-scrollbar">
          {giorni.map((g) => (
            <button
              key={g.id}
              role="tab"
              aria-selected={g.id === attivo}
              onClick={() => setAttivo(g.id)}
              className={`min-h-[44px] px-4 rounded-full font-semibold text-[15px] whitespace-nowrap transition-colors border ${
                g.id === attivo
                  ? 'bg-rubber text-white border-rubber'
                  : 'bg-surface text-rubber border-line active:bg-white'
              }`}
            >
              {g.nome}
            </button>
          ))}
          {isPt && <NuovoGiornoForm schedaId={schedaId} />}
        </div>
      </div>

      {giornoAttivo ? (
        <div className="apri pt-1">
          {giornoAttivo.esercizi.length > 0 && (
            <div className="flex items-center justify-end gap-1 mb-2">
              <button
                onClick={() => setEspansioneGlobale({ stato: false, ts: Date.now() })}
                className="flex items-center gap-1.5 min-h-[40px] px-3 text-sm font-semibold text-steel active:text-rubber"
              >
                <ChevronsUp className="w-4 h-4" /> Comprimi tutti
              </button>
              <button
                onClick={() => setEspansioneGlobale({ stato: true, ts: Date.now() })}
                className="flex items-center gap-1.5 min-h-[40px] px-3 text-sm font-semibold text-steel active:text-rubber"
              >
                <ChevronsDown className="w-4 h-4" /> Espandi tutti
              </button>
            </div>
          )}

          {giornoAttivo.esercizi.length === 0 && (
            <div className="card p-5 mb-4">
              <p className="font-semibold">Nessun esercizio in questa seduta.</p>
              {isPt && <p className="text-steel mt-1">Aggiungine uno qui sotto.</p>}
            </div>
          )}

          {giornoAttivo.esercizi.map((es) => (
            <EsercizioCard
              key={es.id}
              esercizio={es}
              isAtleta={isAtleta}
              espansioneGlobale={espansioneGlobale}
            />
          ))}

          {isPt && <NuovoEsercizioForm giornoId={giornoAttivo.id} />}
        </div>
      ) : (
        <div className="card p-5 mt-2">
          <p className="font-semibold">Nessuna seduta ancora.</p>
          {isPt && <p className="text-steel mt-1">Usa «Seduta» nella barra qui sopra per crearne una.</p>}
        </div>
      )}
    </div>
  );
}
