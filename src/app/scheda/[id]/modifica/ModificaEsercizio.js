'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ModificaEsercizio({ esercizio }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: esercizio.nome || '',
    serie: esercizio.serie || '',
    ripetizioni: esercizio.ripetizioni || '',
    recupero: esercizio.recupero || '',
    note_pt: esercizio.note_pt || '',
    video_url: esercizio.video_url || '',
    is_superset: esercizio.is_superset || false,
    ordine: esercizio.ordine ?? 0 // <--- Aggiunto stato ordine
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
    if (res.ok) { setMsg('Salvato! ✅'); router.refresh(); } 
    else setMsg('Errore');
    setLoading(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const eliminaEsercizio = async () => {
    if (!confirm('Sei sicuro di voler eliminare questo esercizio?')) return;
    Loading(true); // piccolo fix se gestisci il loading
    await fetch(`/api/esercizi/${esercizio.id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-stone-200 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="col-span-1 md:col-span-3">
          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Nome Esercizio</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full border rounded-md p-2" />
        </div>

        {/* --- CAMPO ORDINE AGGIUNTO QUI --- */}
        <div className="col-span-1 md:col-span-1">
          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Ordine (N°)</label>
          <input type="number" name="ordine" value={formData.ordine} onChange={handleChange} className="w-full border rounded-md p-2" />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Serie</label>
          <input type="number" name="serie" value={formData.serie} onChange={handleChange} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Ripetizioni</label>
          <input type="text" name="ripetizioni" value={formData.ripetizioni} onChange={handleChange} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Recupero</label>
          <input type="text" name="recupero" value={formData.recupero} onChange={handleChange} className="w-full border rounded-md p-2" />
        </div>
        
        <div className="col-span-1 md:col-span-4">
          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Link Video (YouTube)</label>
          <input type="url" name="video_url" value={formData.video_url} onChange={handleChange} placeholder="https://..." className="w-full border rounded-md p-2" />
        </div>
        
        <div className="col-span-1 md:col-span-4">
          <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Istruzioni (Note PT)</label>
          <textarea name="note_pt" value={formData.note_pt} onChange={handleChange} placeholder="Es: Schiena dritta, focus in negativa..." className="w-full border rounded-md p-2 h-20 resize-none"></textarea>
        </div>

        <div className="col-span-1 md:col-span-4 flex items-center space-x-2 pt-2">
          <input 
            type="checkbox" 
            id={`superset-${esercizio.id}`}
            name="is_superset" 
            checked={formData.is_superset} 
            onChange={handleChange} 
            className="w-4 h-4 text-stone-900 border-stone-300 rounded focus:ring-stone-900 cursor-pointer" 
          />
          <label htmlFor={`superset-${esercizio.id}`} className="text-sm font-medium text-stone-700 cursor-pointer">
            ⚡ In superset con l'esercizio successivo
          </label>
        </div>
      </div>

      <div className="flex justify-end items-center space-x-3 mt-4 pt-4 border-t border-stone-100">
        {msg && <span className="text-sm font-semibold text-green-600">{msg}</span>}
        <button onClick={eliminaEsercizio} disabled={loading} className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold">Rimuovi</button>
        <button onClick={salvaModifiche} disabled={loading} className="bg-stone-900 text-white hover:bg-stone-800 px-5 py-2 rounded-lg text-sm font-semibold">Salva Modifiche</button>
      </div>
    </div>
  );
}