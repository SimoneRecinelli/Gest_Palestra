'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Timer } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

export default function EsercizioCard({ esercizio, isAtleta }) {
  const [nota, setNota] = useState(esercizio.nota_atleta || '');
  const [salvataggioNota, setSalvataggioNota] = useState(false);
  const [peso, setPeso] = useState('');
  const [ripetizioniFatte, setRipetizioniFatte] = useState('');
  const [registrando, setRegistrando] = useState(false);
  
  // Stati per il Timer
  const [timer, setTimer] = useState(0);
  const [timerAttivo, setTimerAttivo] = useState(false);
  const router = useRouter();

  // Logica Timer
  useEffect(() => {
    let interval = null;
    if (timerAttivo && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0 && timerAttivo) {
      setTimerAttivo(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerAttivo, timer]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const calcolaSecondiRecupero = (testo) => {
    if (!testo) return 90; // Default 90s
    const t = testo.toLowerCase();
    if (t.includes("'")) {
      const parti = t.split("'");
      const min = parseInt(parti[0]) || 0;
      const sec = parseInt(parti[1]) || 0;
      return min * 60 + sec;
    }
    return parseInt(t) || 90;
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
    
    // Avvia il timer in automatico leggendo il recupero settato dal PT
    setTimer(calcolaSecondiRecupero(esercizio.recupero));
    setTimerAttivo(true);
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

  // Prepara i dati per il grafico (inverte array per avere ordine cronologico corretto)
  const datiGrafico = esercizio.pesi ? [...esercizio.pesi].reverse().map(p => ({
    data: new Date(p.data).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
    peso: parseFloat(p.peso_kg) || 0
  })) : [];

  return (
    <div className={`bg-card border border-border rounded-lg p-4 sm:p-5 mb-4 shadow-sm relative overflow-hidden transition-all ${esercizio.is_superset ? 'border-b-2 border-b-accent bg-amber-50/20' : ''} border-l-4 border-l-accent`}>
      
      {/* Etichetta Superserie Chiara ed Evidente */}
      {esercizio.is_superset && (
        <div className="mb-3 flex items-center justify-between bg-stone-900 text-white px-3 py-1.5 rounded-md shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
            ⚡ SUPERSERIE (collegato al successivo ↓)
          </span>
        </div>
      )}

      <h3 className="font-display font-semibold text-xl mb-3">{esercizio.nome}</h3>

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
        <p className="text-sm italic text-inkmuted border-l-2 border-border pl-3 mb-4">{esercizio.note_pt}</p>
      )}

      {esercizio.nota_atleta && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
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
            <button type="submit" disabled={registrando} className="flex-1 sm:flex-none flex justify-center items-center gap-1 bg-accent hover:bg-accentdark text-white text-base sm:text-sm font-medium px-4 py-2 sm:py-1.5 rounded transition-colors disabled:opacity-60">
              <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" strokeWidth={2.5} /> Registra
            </button>
          </form>
        )}
      </div>

      {/* OVERLAY TIMER */}
      {timerAttivo && (
        <div className="mt-4 p-4 bg-stone-900 text-white rounded-xl flex items-center justify-between shadow-lg transition-all animate-pulse">
          <div className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-accent" />
            <span className="font-display font-bold text-xl">{formatTime(timer)}</span>
          </div>
          <button onClick={() => setTimerAttivo(false)} className="text-xs font-medium bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
            Salta Recupero
          </button>
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
  );
}