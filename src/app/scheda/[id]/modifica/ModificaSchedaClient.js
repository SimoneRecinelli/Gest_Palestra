'use client';
import { useState } from 'react';
import Link from 'next/link';
import ModificaEsercizio from './ModificaEsercizio';
import AggiungiEsercizio from './AggiungiEsercizio';
import RimuoviGiorno from './RimuoviGiorno';

export default function ModificaSchedaClient({ giorni, scheda }) {
  const [attivo, setAttivo] = useState(giorni[0]?.id ?? null);
  const giornoAttivo = giorni.find((g) => g.id === attivo);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h1 className="font-display font-semibold text-2xl">Modifica: {scheda.titolo}</h1>
        <Link href={`/scheda/${scheda.id}`} className="text-stone-500 hover:text-stone-900 text-sm font-medium">
          ← Torna alla visualizzazione
        </Link>
      </div>

      {/* MENU A TABS PER LA MODIFICA */}
      <div className="flex items-center border-b border-stone-200 mb-8 overflow-x-auto scrollbar-hide">
        {giorni.map((g) => (
          <button
            key={g.id}
            onClick={() => setAttivo(g.id)}
            className={`font-display font-medium text-base px-4 py-3 border-b-[3px] whitespace-nowrap transition-colors ${
              g.id === attivo
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            {g.nome}
          </button>
        ))}
      </div>

      {/* CONTENUTO DEL GIORNO SELEZIONATO */}
      {giornoAttivo ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-stone-800">Esercizi in: {giornoAttivo.nome}</h2>
            <RimuoviGiorno giornoId={giornoAttivo.id} nomeGiorno={giornoAttivo.nome} />
          </div>
          
          {giornoAttivo.esercizi.length === 0 && (
            <p className="text-stone-500 italic mb-6 text-center">Nessun esercizio ancora aggiunto in questa seduta.</p>
          )}

          {giornoAttivo.esercizi.map((esercizio) => (
            <ModificaEsercizio key={esercizio.id} esercizio={esercizio} />
          ))}
          
          <div className="mt-6">
            <AggiungiEsercizio giornoId={giornoAttivo.id} />
          </div>
        </div>
      ) : (
        <p className="text-stone-500">Nessuna seduta creata in questa scheda.</p>
      )}
    </div>
  );
}