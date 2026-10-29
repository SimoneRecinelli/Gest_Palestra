'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link2, ChevronDown } from 'lucide-react';
import { GRUPPI, COLORI_GRUPPO } from '@/app/components/gruppi';
import Piatto from '@/app/components/Piatto';
import Anteprima from '@/app/components/Anteprima';

export default function ModificaEsercizio({ esercizio }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: esercizio.nome || '',
    gruppo_muscolare: esercizio.gruppo_muscolare || '', // <-- Aggiunto al form state
    serie: esercizio.serie || '',
    ripetizioni: esercizio.ripetizioni || '',
    recupero: esercizio.recupero || '',
    note_pt: esercizio.note_pt || '',
    video_url: esercizio.video_url || '',
    is_superset: esercizio.is_superset || false,
    ordine: esercizio.ordine ?? 0
  });
  const [loading, setLoading] = useState(false);
  const [aperto, setAperto] = useState(false); // chiusa di default: la seduta si legge come lista
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const salvaModifiche = async () => {
    setLoading(true); setMsg('');
    const res = await fetch(`/api/esercizi/${esercizio.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) { setMsg('Salvato'); router.refresh(); } 
    else setMsg('Errore');
    setLoading(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const eliminaEsercizio = async () => {
    if (!confirm('Sei sicuro di voler eliminare questo esercizio?')) return;
    setLoading(true); 
    await fetch(`/api/esercizi/${esercizio.id}`, { method: 'DELETE' });
    router.refresh();
  };

  const id = esercizio.id;
  const colore = COLORI_GRUPPO[formData.gruppo_muscolare] || '#5C6169';
  const dati = [
    [formData.serie, 'serie'],
    [formData.ripetizioni, 'rip'],
    [formData.recupero, 'rec'],
  ].filter(([valore]) => valore);

  return (
    <div className={`card mb-3 overflow-hidden ${formData.is_superset ? 'border-l-[6px] border-l-signal' : ''}`}>
      {/* Riga compatta, uguale a quella che vede l'atleta: tocca per modificare */}
      <button
        type="button"
        onClick={() => setAperto(!aperto)}
        aria-expanded={aperto}
        className="w-full flex items-center gap-3.5 pl-4 pr-3 py-3.5 min-h-[68px] text-left active:bg-white"
      >
        <Anteprima videoUrl={formData.video_url} colore={colore} />
        <div className="flex-1 min-w-0">
          {formData.is_superset && (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold bg-rubber text-white pl-2 pr-2.5 py-1 rounded-full mb-1.5">
              <Link2 className="w-3.5 h-3.5 text-tape" strokeWidth={2.5} />
              Superset col prossimo
            </span>
          )}
          {formData.gruppo_muscolare && (
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-steel mb-0.5">
              <Piatto colore={colore} size={12} />
              {formData.gruppo_muscolare}
            </p>
          )}
          <h3 className="font-display font-bold text-[20px] leading-[1.1] tracking-tight break-words">
            {formData.nome || 'Nuovo esercizio'}
          </h3>
          {!aperto && dati.length > 0 && (
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
        <ChevronDown className={`w-6 h-6 text-steel shrink-0 transition-transform ${aperto ? 'rotate-180' : ''}`} />
      </button>

      {aperto && (
        <div className="px-4 pb-4 pt-4 border-t border-line apri">
          <div className="grid grid-cols-6 gap-3 mb-4">
            <div className="col-span-6">
              <label htmlFor={`nome-${id}`} className="field-label">Nome esercizio</label>
              <input id={`nome-${id}`} type="text" name="nome" value={formData.nome} onChange={handleChange} className="field" />
            </div>

            <div className="col-span-4">
              <label htmlFor={`gruppo-${id}`} className="field-label">Gruppo muscolare</label>
              <select id={`gruppo-${id}`} name="gruppo_muscolare" value={formData.gruppo_muscolare} onChange={handleChange} className="field">
                <option value="">Nessuno</option>
                {GRUPPI.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label htmlFor={`ordine-${id}`} className="field-label">Posizione</label>
              <input id={`ordine-${id}`} type="number" inputMode="numeric" name="ordine" value={formData.ordine} onChange={handleChange} className="field" />
            </div>

            <div className="col-span-2">
              <label htmlFor={`serie-${id}`} className="field-label">Serie</label>
              <input id={`serie-${id}`} type="number" inputMode="numeric" name="serie" value={formData.serie} onChange={handleChange} className="field" />
            </div>
            <div className="col-span-2">
              <label htmlFor={`rip-${id}`} className="field-label">Rip.</label>
              <input id={`rip-${id}`} type="text" name="ripetizioni" value={formData.ripetizioni} onChange={handleChange} className="field" />
            </div>
            <div className="col-span-2">
              <label htmlFor={`rec-${id}`} className="field-label">Recupero</label>
              <input id={`rec-${id}`} type="text" name="recupero" value={formData.recupero} onChange={handleChange} className="field" />
            </div>

            <div className="col-span-6">
              <label htmlFor={`video-${id}`} className="field-label">Link video (YouTube)</label>
              <input id={`video-${id}`} type="url" inputMode="url" autoCapitalize="none" name="video_url" value={formData.video_url} onChange={handleChange} placeholder="https://…" className="field" />
            </div>

            <div className="col-span-6">
              <label htmlFor={`note-${id}`} className="field-label">Istruzioni per l'atleta</label>
              <textarea id={`note-${id}`} name="note_pt" value={formData.note_pt} onChange={handleChange} placeholder="Es: schiena dritta, fase negativa lenta" rows={3} className="field" />
            </div>

            <label htmlFor={`superset-${id}`} className="col-span-6 flex items-center gap-3 min-h-tap cursor-pointer">
              <input
                type="checkbox"
                id={`superset-${id}`}
                name="is_superset"
                checked={formData.is_superset}
                onChange={handleChange}
                className="w-6 h-6 rounded-md border-line accent-[#D42B1E] cursor-pointer"
              />
              <span className="flex items-center gap-1.5 font-semibold">
                <Link2 className="w-4 h-4 text-signal" strokeWidth={2.5} />
                Superset con l'esercizio successivo
              </span>
            </label>
          </div>

          <div className="flex justify-end items-center gap-2 pt-4 border-t border-line">
            {msg && (
              <span role="status" className={`text-sm font-semibold mr-auto ${msg === 'Errore' ? 'text-signaldark' : 'text-plate-green'}`}>
                {msg}
              </span>
            )}
            <button onClick={eliminaEsercizio} disabled={loading} className="btn-danger btn-sm">Rimuovi</button>
            <button onClick={salvaModifiche} disabled={loading} className="btn-dark btn-sm">Salva modifiche</button>
          </div>
        </div>
      )}
    </div>
  );
}
