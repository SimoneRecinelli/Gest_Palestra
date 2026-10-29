'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Play, Pause, RotateCcw, ChevronDown, Info, Link2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import Piatto from '@/app/components/Piatto';
import { COLORI_GRUPPO } from '@/app/components/gruppi';

export default function EsercizioCard({ esercizio, isAtleta, espansioneGlobale }) {
  const [nota, setNota] = useState(esercizio.nota_atleta || '');
  const [salvataggioNota, setSalvataggioNota] = useState(false);
  const [peso, setPeso] = useState('');
  const [ripetizioniFatte, setRipetizioniFatte] = useState('');
  const [registrando, setRegistrando] = useState(false);

  // Stato per l'apertura/chiusura della card (Fisarmonica)
  const [isExpanded, setIsExpanded] = useState(false); // Di default chiusa: la seduta si legge come lista compatta
  const [anteprimaKo, setAnteprimaKo] = useState(false);

  // Ascolta i pulsanti "Espandi/Comprimi tutti"
  useEffect(() => {
    if (espansioneGlobale && espansioneGlobale.ts > 0) {
      setIsExpanded(espansioneGlobale.stato);
    }
  }, [espansioneGlobale]);

  const router = useRouter();

  // Funzione per calcolare i secondi iniziali dal testo (es. "1'30" -> 90)
  const calcolaSecondiRecupero = (testo) => {
    if (!testo) return 90;
    const t = testo.toLowerCase();
    if (t.includes("'")) {
      const parti = t.split("'");
      const min = parseInt(parti[0]) || 0;
      const sec = parseInt(parti[1]) || 0;
      return min * 60 + sec;
    }
    return parseInt(t) || 90;
  };

  // Stati per il Timer Manuale
  const tempoIniziale = calcolaSecondiRecupero(esercizio.recupero);
  const [timeLeft, setTimeLeft] = useState(tempoIniziale);
  const [isRunning, setIsRunning] = useState(false);

  // Logica Conto alla rovescia
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Controlli del Timer
  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(tempoIniziale);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

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

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    if (match && match[1]) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?playsinline=1&rel=0&modestbranding=1`;
    }
    return url;
  };

  const datiGrafico = esercizio.pesi
    ? [...esercizio.pesi].reverse().map((p) => ({
        data: new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
        peso: parseFloat(p.peso_kg) || 0,
      }))
    : [];

  const coloreGruppo = COLORI_GRUPPO[esercizio.gruppo_muscolare] || '#5C6169';
  const timerFinito = timeLeft === 0;
  const progressoTimer = tempoIniziale > 0 ? (timeLeft / tempoIniziale) * 100 : 0;

  // Anteprima: la miniatura del video YouTube, se c'è. Altrimenti il disco del gruppo muscolare.
  const idVideo = esercizio.video_url?.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  )?.[1];
  const urlAnteprima = idVideo ? `https://i.ytimg.com/vi/${idVideo}/mqdefault.jpg` : null;
  const eShort = /\/shorts\//.test(esercizio.video_url || '');

  // Il programma in forma compatta, visibile quando la card è chiusa
  const dati = [
    [esercizio.serie, 'serie'],
    [esercizio.ripetizioni, 'rip'],
    [esercizio.recupero, 'rec'],
  ].filter(([valore]) => valore);

  return (
    <div
      className={`card mb-3 overflow-hidden ${
        esercizio.is_superset ? 'border-l-[6px] border-l-signal' : ''
      }`}
    >
      {/* Intestazione: tocca per aprire o chiudere */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="w-full flex items-center gap-3.5 pl-4 pr-3 py-3.5 min-h-[68px] text-left active:bg-white"
      >
        <div className="relative w-[76px] h-[76px] shrink-0 rounded-[12px] overflow-hidden bg-chalk">
          {urlAnteprima && !anteprimaKo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={urlAnteprima}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setAnteprimaKo(true)}
              className={`w-full h-full object-cover ${eShort ? 'scale-[1.75]' : ''}`}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `${coloreGruppo}22` }}
            >
              <Piatto colore={coloreGruppo} size={34} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {esercizio.is_superset && (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold bg-rubber text-white pl-2 pr-2.5 py-1 rounded-full mb-1.5">
              <Link2 className="w-3.5 h-3.5 text-tape" strokeWidth={2.5} />
              Superset col prossimo
            </span>
          )}
          {esercizio.gruppo_muscolare && (
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-steel mb-0.5">
              <Piatto colore={coloreGruppo} size={12} />
              {esercizio.gruppo_muscolare}
            </p>
          )}
          <h3 className="font-display font-bold text-[20px] leading-[1.1] tracking-tight break-words">
            {esercizio.nome}
          </h3>
          {!isExpanded && dati.length > 0 && (
            <div className="inline-flex divide-x divide-line border border-line rounded-[8px] bg-white mt-2 overflow-hidden">
              {dati.map(([valore, etichetta]) => (
                <span key={etichetta} className="px-2.5 py-1 text-sm text-steel whitespace-nowrap">
                  <span className="font-display font-bold text-[17px] text-rubber mr-1">{valore}</span>
                  {etichetta}
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronDown
          className={`w-6 h-6 text-steel shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 apri">
          {/* Il programma dell'esercizio, a lettere grandi */}
          <div className="grid grid-cols-3 divide-x divide-line border-y border-line py-3 -mx-5 mb-4">
            {[
              [esercizio.serie, 'serie'],
              [esercizio.ripetizioni, 'ripetizioni'],
              [esercizio.recupero, 'recupero'],
            ].map(([valore, etichetta]) => (
              <div key={etichetta} className="text-center px-1">
                <p className="font-display font-bold text-[32px] leading-none tracking-tight">
                  {valore || '—'}
                </p>
                <p className="text-[13px] text-steel mt-1">{etichetta}</p>
              </div>
            ))}
          </div>

          {/* Istruzioni del PT: nastro giallo, la prima cosa da leggere */}
          {esercizio.note_pt && (
            <div className="mb-4 p-4 bg-tape text-rubber rounded-[12px]">
              <p className="flex items-center gap-1.5 font-bold mb-1">
                <Info className="w-[18px] h-[18px]" strokeWidth={2.5} /> Istruzioni del PT
              </p>
              <p className="text-base font-medium leading-snug">{esercizio.note_pt}</p>
            </div>
          )}

          {esercizio.nota_atleta && (
            <div className="mb-4 p-4 bg-white border border-line border-l-4 border-l-plate-blue rounded-[12px]">
              <p className="text-[13px] font-semibold text-steel mb-1">Nota di Simone</p>
              <p className="text-base leading-snug">{esercizio.nota_atleta}</p>
            </div>
          )}

          {esercizio.video_url && (
            <div className="w-full mb-5 relative pt-[56.25%] bg-black rounded-[12px] overflow-hidden">
              <iframe
                src={getEmbedUrl(esercizio.video_url)}
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                title={`Video ${esercizio.nome}`}
              ></iframe>
            </div>
          )}

          {/* Diario pesi */}
          <div>
            <h4 className="font-bold mb-2">Diario pesi</h4>
            {esercizio.pesi && esercizio.pesi.length > 0 ? (
              <ul className="mb-4 divide-y divide-line border-y border-line">
                {esercizio.pesi.map((p, i) => (
                  <li key={p.id} className="flex items-baseline justify-between py-2.5">
                    <span className={i === 0 ? 'text-rubber' : 'text-steel'}>
                      <span
                        className={`font-display font-bold tracking-tight ${
                          i === 0 ? 'text-[26px]' : 'text-[19px]'
                        }`}
                      >
                        {p.peso_kg ?? '—'}
                      </span>
                      <span className="text-sm font-semibold ml-1">kg</span>
                      {p.ripetizioni_fatte && (
                        <span className="text-[17px] font-semibold ml-2">× {p.ripetizioni_fatte}</span>
                      )}
                    </span>
                    <span className="text-sm text-steel">
                      {new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-steel mb-4">Ancora nessuna serie registrata.</p>
            )}

            {isAtleta && (
              <form onSubmit={registraSerie} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                <div>
                  <label htmlFor={`kg-${esercizio.id}`} className="field-label">Kg</label>
                  <input
                    id={`kg-${esercizio.id}`}
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    placeholder="0"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    className="field"
                  />
                </div>
                <div>
                  <label htmlFor={`reps-${esercizio.id}`} className="field-label">Ripetizioni</label>
                  <input
                    id={`reps-${esercizio.id}`}
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={ripetizioniFatte}
                    onChange={(e) => setRipetizioniFatte(e.target.value)}
                    className="field"
                  />
                </div>
                <button type="submit" disabled={registrando} className="btn-primary">
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                  Salva
                </button>
              </form>
            )}
          </div>

          {/* Timer di recupero: l'elemento più grande della scheda */}
          {isAtleta && (
            <div className="mt-5 bg-rubber text-white rounded-[14px] p-4 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`font-display font-extrabold text-[50px] leading-none tracking-tight ${
                      timerFinito ? 'text-[#FF6A5C]' : ''
                    }`}
                    aria-label={`Recupero: ${formatTime(timeLeft)}`}
                  >
                    {formatTime(timeLeft)}
                  </p>
                  <p className="text-sm text-white/60 mt-1">
                    {timerFinito ? 'Recupero finito, si riparte' : isRunning ? 'In recupero' : 'Recupero'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleTimer}
                    aria-label={isRunning ? 'Pausa' : 'Avvia recupero'}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                      isRunning ? 'bg-white text-rubber' : 'bg-signal text-white active:bg-signaldark'
                    }`}
                  >
                    {isRunning ? (
                      <Pause className="w-7 h-7 fill-current" />
                    ) : (
                      <Play className="w-7 h-7 fill-current ml-1" />
                    )}
                  </button>
                  <button
                    onClick={resetTimer}
                    aria-label="Azzera timer"
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 active:bg-white/20"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {/* La barra si svuota di secondo in secondo */}
              <div className="mt-4 h-1.5 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full rounded-full bg-signal transition-[width] duration-1000 ease-linear"
                  style={{ width: `${progressoTimer}%` }}
                />
              </div>
            </div>
          )}

          {/* Andamento dei carichi */}
          {esercizio.pesi && esercizio.pesi.length > 1 && (
            <div className="mt-5">
              <h4 className="font-bold mb-2">Andamento dei carichi</h4>
              <div className="h-28 w-full" data-no-swipe>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datiGrafico} margin={{ top: 8, right: 8, bottom: 4, left: 8 }}>
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '10px',
                        border: '1px solid #CFD1CA',
                        boxShadow: 'none',
                        fontSize: '14px',
                      }}
                      labelStyle={{ display: 'none' }}
                      itemStyle={{ color: '#15171A', fontWeight: 'bold' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="peso"
                      name="Kg"
                      stroke="#15171A"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#D42B1E', strokeWidth: 0 }}
                      activeDot={{ r: 7, fill: '#D42B1E' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {isAtleta && (
            <div className="mt-5 pt-4 border-t border-line">
              <label htmlFor={`nota-${esercizio.id}`} className="field-label">Le tue note</label>
              <textarea
                id={`nota-${esercizio.id}`}
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="Sensazioni, aggiustamenti, cosa cambieresti"
                rows={2}
                className="field"
              />
              <div className="flex justify-end mt-2">
                <button onClick={salvaNota} disabled={salvataggioNota} className="btn-quiet btn-sm">
                  {salvataggioNota ? 'Salvataggio…' : 'Salva nota'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
