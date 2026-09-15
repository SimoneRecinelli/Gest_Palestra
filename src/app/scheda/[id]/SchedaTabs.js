'use client';
import { useState } from 'react';
import EsercizioCard from './EsercizioCard';
import NuovoEsercizioForm from './NuovoEsercizioForm';
import NuovoGiornoForm from './NuovoGiornoForm';

export default function SchedaTabs({ giorni, isPt, isAtleta, schedaId }) {
  const [attivo, setAttivo] = useState(giorni[0]?.id ?? null);
  const giornoAttivo = giorni.find((g) => g.id === attivo);

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
        <div>
          {giornoAttivo.esercizi.length === 0 && (
            <p className="text-inkmuted mb-4">Nessun esercizio ancora in questa seduta.</p>
          )}
          {giornoAttivo.esercizi.map((es) => (
            <EsercizioCard key={es.id} esercizio={es} isAtleta={isAtleta} />
          ))}
          {isPt && <NuovoEsercizioForm giornoId={giornoAttivo.id} />}
        </div>
      ) : (
        <p className="text-inkmuted">Nessuna seduta ancora creata.</p>
      )}
    </div>
  );
}
