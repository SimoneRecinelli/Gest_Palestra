'use client';
import useSwipeGiorni from '@/app/components/useSwipeGiorni';
import ModificaEsercizio from './ModificaEsercizio';
import AggiungiEsercizio from './AggiungiEsercizio';
import RimuoviGiorno from './RimuoviGiorno';

export default function ModificaSchedaClient({ giorni, scheda }) {
  const { attivo, vaiAl, classeAnimazione, gesti } = useSwipeGiorni(giorni);
  const giornoAttivo = giorni.find((g) => g.id === attivo);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-5">
      <p className="text-sm font-semibold text-steel">Modifica scheda</p>
      <h1 className="font-display font-extrabold text-[30px] leading-[1.02] tracking-tight break-words">
        {scheda.titolo}
      </h1>

      {/* Sedute: stessa barra della scheda, agganciata sotto l'header */}
      <div className="sticky top-[calc(env(safe-area-inset-top)+3.5rem)] z-30 -mx-4 px-4 py-3 mt-2 bg-chalk/95 backdrop-blur">
        <div role="tablist" className="flex items-center gap-2 overflow-x-auto nascondi-scrollbar">
          {giorni.map((g) => (
            <button
              key={g.id}
              id={`seduta-${g.id}`}
              role="tab"
              aria-selected={g.id === attivo}
              onClick={() => vaiAl(g.id)}
              className={`min-h-[44px] px-4 rounded-full font-semibold text-[15px] whitespace-nowrap transition-colors border ${
                g.id === attivo
                  ? 'bg-rubber text-white border-rubber'
                  : 'bg-surface text-rubber border-line active:bg-white'
              }`}
            >
              {g.nome}
            </button>
          ))}
        </div>
      </div>

      {giornoAttivo ? (
        <div key={giornoAttivo.id} {...gesti} className={`touch-pan-y pt-1 min-h-[60vh] ${classeAnimazione}`}>
          <div className="flex justify-between items-center gap-3 mb-4">
            <h2 className="font-display font-bold text-[22px] tracking-tight">
              {giornoAttivo.esercizi.length} {giornoAttivo.esercizi.length === 1 ? 'esercizio' : 'esercizi'}
            </h2>
            <RimuoviGiorno giornoId={giornoAttivo.id} nomeGiorno={giornoAttivo.nome} />
          </div>

          {giornoAttivo.esercizi.length === 0 && (
            <div className="card p-5 mb-4">
              <p className="font-semibold">Nessun esercizio in questa seduta.</p>
              <p className="text-steel mt-1">Aggiungine uno qui sotto.</p>
            </div>
          )}

          {giornoAttivo.esercizi.map((esercizio) => (
            <ModificaEsercizio key={esercizio.id} esercizio={esercizio} />
          ))}

          <div className="mt-4">
            <AggiungiEsercizio giornoId={giornoAttivo.id} />
          </div>
        </div>
      ) : (
        <div className="card p-5 mt-2">
          <p className="font-semibold">Nessuna seduta in questa scheda.</p>
        </div>
      )}
    </div>
  );
}
