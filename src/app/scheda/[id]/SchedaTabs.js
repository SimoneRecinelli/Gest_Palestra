'use client';
import { useState } from 'react';
import EsercizioCard from './EsercizioCard';
import NuovoEsercizioForm from './NuovoEsercizioForm';
import NuovoGiornoForm from './NuovoGiornoForm';
import { ChevronsUp, ChevronsDown } from 'lucide-react'; // <--- Aggiunte icone

export default function SchedaTabs({ giorni, isPt, isAtleta, schedaId }) {
  const [attivo, setAttivo] = useState(giorni[0]?.id ?? null);
  const giornoAttivo = giorni.find((g) => g.id === attivo);

  // Stato per inviare il comando di espansione/compressione a tutte le card
  const [espansioneGlobale, setEspansioneGlobale] = useState({ stato: true, ts: 0 });

  return (
    <div>
      <div className="flex items-center border-b border-border mb-6 overflow-x-auto">
        {giorni.map((g) => (
          <button
            key={g.id}
            onClick={() => setAttivo(g.id)}
            className={`font-display font-medium text-base px-4 py-3 border-b-[3px] whitespace-nowrap transition-colors ${
              g.id === attivo
                ? 'border-accent text-ink'
                : 'border-transparent text-inkmuted hover:text-ink'
            }`}
          >
            {g.nome}
          </button>
        ))}
        {isPt && <NuovoGiornoForm schedaId={schedaId} />}
      </div>

      {giornoAttivo ? (
        <div className="animate-in fade-in duration-300">
          
          {/* I DUE PULSANTI ESPANDI/COMPRIMI TUTTI */}
          {giornoAttivo.esercizi.length > 0 && (
            <div className="flex items-center justify-end gap-4 mb-4 px-1">
              <button 
                onClick={() => setEspansioneGlobale({ stato: false, ts: Date.now() })}
                className="flex items-center gap-1 text-xs font-semibold text-stone-400 hover:text-stone-800 transition-colors"
              >
                <ChevronsUp className="w-4 h-4" /> Comprimi tutti
              </button>
              <button 
                onClick={() => setEspansioneGlobale({ stato: true, ts: Date.now() })}
                className="flex items-center gap-1 text-xs font-semibold text-stone-400 hover:text-stone-800 transition-colors"
              >
                <ChevronsDown className="w-4 h-4" /> Espandi tutti
              </button>
            </div>
          )}

          {giornoAttivo.esercizi.length === 0 && (
            <p className="text-inkmuted mb-4">Nessun esercizio ancora in questa seduta.</p>
          )}

          {/* LISTA ESERCIZI */}
          {giornoAttivo.esercizi.map((es) => (
            <EsercizioCard 
              key={es.id} 
              esercizio={es} 
              isAtleta={isAtleta} 
              espansioneGlobale={espansioneGlobale} // <--- Passiamo il segnale alla card
            />
          ))}

          {isPt && <NuovoEsercizioForm giornoId={giornoAttivo.id} />}
        </div>
      ) : (
        <p className="text-inkmuted">Nessuna seduta ancora creata.</p>
      )}
    </div>
  );
}