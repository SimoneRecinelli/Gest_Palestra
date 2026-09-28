'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Timer, Play, Pause, RotateCcw, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

export default function EsercizioCard({ esercizio, isAtleta, espansioneGlobale }) {
  const [nota, setNota] = useState(esercizio.nota_atleta || '');
  const [salvataggioNota, setSalvataggioNota] = useState(false);
  const [peso, setPeso] = useState('');
  const [ripetizioniFatte, setRipetizioniFatte] = useState('');
  const [registrando, setRegistrando] = useState(false);
  
  // Stato per l'apertura/chiusura della card (Fisarmonica)
  const [isExpanded, setIsExpanded] = useState(true); // Di default aperto


  // --- 2. AGGIUNGI QUESTO EFFETTO QUI ---
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

  // Stati per il Nuovo Timer Manuale
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

  const datiGrafico = esercizio.pesi ? [...esercizio.pesi].reverse().map(p => ({
    data: new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
    peso: parseFloat(p.peso_kg) || 0
  })) : [];

  return (
    <div className={`bg-card border border-border rounded-lg mb-4 shadow-sm relative overflow-hidden transition-all ${esercizio.is_superset ? 'border-b-2 border-b-accent bg-amber-50/20' : ''} border-l-4 border-l-accent`}>
      
      {/* HEADER CARD - CLICCABILE PER APRIRE/CHIUDERE */}
      <div 
        className="p-4 sm:p-5 cursor-pointer hover:bg-stone-50 transition-colors flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="pr-3">
          {esercizio.is_superset && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-amber-400 px-2 py-1 rounded mb-2 inline-block shadow-sm">
              ⚡ Superset (collegato al successivo)
            </span>
          )}
          <h3 className="font-display font-semibold text-xl">{esercizio.nome}</h3>
        </div>
        
        {/* IL BADGE DEL GRUPPO MUSCOLARE E LA FRECCIA */}
        <div className="flex items-center gap-3 shrink-0">
          
          {esercizio.gruppo_muscolare && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 shadow-sm">
              {esercizio.gruppo_muscolare}
            </span>
          )}
          
          <button className="text-stone-400 hover:text-stone-700 bg-stone-100 p-2 rounded-full shrink-0">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* CONTENUTO DELLA CARD (VISIBILE SOLO SE EXPANDED) */}
      {isExpanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-4 border-t border-stone-100">

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

          {/* BOX NOTE PT IN RISALTO */}
          {esercizio.note_pt && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
              <span className="flex items-center gap-1.5 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
                <Info className="w-4 h-4" /> Istruzioni del PT:
              </span>
              <p className="text-sm text-blue-900 font-medium">{esercizio.note_pt}</p>
            </div>
          )}

          {esercizio.nota_atleta && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
              <span className="block text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">📝 Nota di Simone:</span>
              <p className="text-sm text-yellow-900">{esercizio.nota_atleta}</p>
            </div>
          )}

          {esercizio.video_url && (
            <div className="w-full mb-5 relative pt-[56.25%] bg-black rounded overflow-hidden shadow-sm">
              <iframe 
                src={getEmbedUrl(esercizio.video_url)} 
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                title={`Video ${esercizio.nome}`}
              ></iframe>
            </div>
          )}

          <div className="border-t border-border pt-4">
            <p className="text-sm font-bold text-inkmuted uppercase tracking-wide mb-3">Diario pesi</p>
            {esercizio.pesi && esercizio.pesi.length > 0 ? (
              <ul className="space-y-2 mb-4">
                {esercizio.pesi.map((p, i) => (
                  <li key={p.id} className={`flex items-center justify-between text-sm p-2 rounded ${i === 0 ? 'bg-stone-50 border border-stone-100 font-medium' : 'text-inkmuted'}`}>
                    <span>
                      <span className={`font-display ${i === 0 ? 'text-stone-900 font-bold' : ''}`}>{p.peso_kg ?? '—'} kg</span>
                      {p.ripetizioni_fatte && <span> × {p.ripetizioni_fatte}</span>}
                    </span>
                    <span className="text-xs">{new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-inkmuted mb-4">Ancora nessuna serie registrata.</p>
            )}

            {isAtleta && (
              <form onSubmit={registraSerie} className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                <input type="number" step="0.5" placeholder="kg" value={peso} onChange={(e) => setPeso(e.target.value)} className="w-[80px] sm:w-20 px-2 py-2 sm:py-1.5 bg-white border border-border rounded text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                <input type="text" placeholder="reps" value={ripetizioniFatte} onChange={(e) => setRipetizioniFatte(e.target.value)} className="w-[90px] sm:w-24 px-2 py-2 sm:py-1.5 bg-white border border-border rounded text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                <button type="submit" disabled={registrando} className="flex-1 sm:flex-none flex justify-center items-center gap-1 bg-stone-900 hover:bg-stone-800 text-white text-base sm:text-sm font-medium px-4 py-2 sm:py-1.5 rounded transition-colors disabled:opacity-60">
                  <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" strokeWidth={2.5} /> Salva
                </button>
              </form>
            )}
          </div>

          {/* NUOVO TIMER CON PULSANTIERA PLAY/STOP/RESET */}
          {isAtleta && (
            <div className="mt-5 p-3 sm:p-4 bg-stone-100 rounded-xl flex items-center justify-between border border-stone-200 shadow-inner">
              <div className="flex items-center gap-3">
                <Timer className={`w-6 h-6 ${isRunning ? 'text-accent animate-pulse' : 'text-stone-400'}`} />
                <span className="font-display font-bold text-3xl tracking-tight text-stone-800 w-[70px]">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={toggleTimer} 
                  className={`flex items-center justify-center w-12 h-12 rounded-full shadow-sm transition-all ${isRunning ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-white text-stone-700 hover:text-accent hover:bg-stone-50'}`}
                >
                  {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                </button>
                <button 
                  onClick={resetTimer} 
                  className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* GRAFICO TREND CARICHI */}
          {esercizio.pesi && esercizio.pesi.length > 1 && (
            <div className="mt-5 pt-4 border-t border-stone-100">
              <p className="text-[10px] uppercase font-bold tracking-widest text-stone-400 mb-2">Trend di Carico</p>
              <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datiGrafico}>
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} labelStyle={{ display: 'none' }} itemStyle={{ color: '#1c1917', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="peso" name="Kg" stroke="#1c1917" strokeWidth={3} dot={{ r: 4, fill: '#1c1917', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {isAtleta && (
            <div className="border-t border-border pt-4 mt-4">
              <textarea value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Le tue note, sensazioni, aggiustamenti..." rows={2} className="w-full px-3 py-2 bg-white border border-border rounded text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent placeholder-stone-400" />
              <button onClick={salvaNota} disabled={salvataggioNota} className="mt-2 text-sm text-accent hover:text-accentdark font-semibold disabled:opacity-60 flex justify-end w-full">
                {salvataggioNota ? 'Salvataggio...' : 'Salva nota'}
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}