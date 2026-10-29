'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link2 } from 'lucide-react';
import { GRUPPI } from '@/app/components/gruppi';

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
  return (
    <div className={`card p-5 mb-3 ${formData.is_superset ? 'border-l-[6px] border-l-signal' : ''}`}>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <div className="sm:col-span-2">
          <label htmlFor={`nome-${id}`} className="field-label">Nome esercizio</label>
          <input id={`nome-${id}`} type="text" name="nome" value={formData.nome} onChange={handleChange} className="field" />
        </div>

        <div>
          <label htmlFor={`gruppo-${id}`} className="field-label">Gruppo muscolare</label>
          <select id={`gruppo-${id}`} name="gruppo_muscolare" value={formData.gruppo_muscolare} onChange={handleChange} className="field">
            <option value="">Nessuno</option>
            {GRUPPI.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`ordine-${id}`} className="field-label">Posizione</label>
          <input id={`ordine-${id}`} type="number" inputMode="numeric" name="ordine" value={formData.ordine} onChange={handleChange} className="field" />
        </div>

        <div>
          <label htmlFor={`serie-${id}`} className="field-label">Serie</label>
          <input id={`serie-${id}`} type="number" inputMode="numeric" name="serie" value={formData.serie} onChange={handleChange} className="field" />
        </div>
        <div>
          <label htmlFor={`rip-${id}`} className="field-label">Ripetizioni</label>
          <input id={`rip-${id}`} type="text" name="ripetizioni" value={formData.ripetizioni} onChange={handleChange} className="field" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`rec-${id}`} className="field-label">Recupero</label>
          <input id={`rec-${id}`} type="text" name="recupero" value={formData.recupero} onChange={handleChange} className="field" />
        </div>

        <div className="sm:col-span-4">
          <label htmlFor={`video-${id}`} className="field-label">Link video (YouTube)</label>
          <input id={`video-${id}`} type="url" inputMode="url" autoCapitalize="none" name="video_url" value={formData.video_url} onChange={handleChange} placeholder="https://…" className="field" />
        </div>

        <div className="sm:col-span-4">
          <label htmlFor={`note-${id}`} className="field-label">Istruzioni per l'atleta</label>
          <textarea id={`note-${id}`} name="note_pt" value={formData.note_pt} onChange={handleChange} placeholder="Es: schiena dritta, fase negativa lenta" rows={3} className="field" />
        </div>

        <label htmlFor={`superset-${id}`} className="sm:col-span-4 flex items-center gap-3 min-h-tap cursor-pointer">
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
  );
}
