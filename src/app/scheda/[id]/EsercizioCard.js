'use client';
import { useState } from 'react';

export default function EsercizioCard({ esercizio, isAtleta }) {
  const [nota, setNota] = useState(esercizio.nota_atleta || '');
  const [salvataggio, setSalvataggio] = useState(false);

  async function salvaNota() {
    setSalvataggio(true);
    await fetch('/api/note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ esercizioId: esercizio.id, testo: nota }),
    });
    setSalvataggio(false);
  }

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 12 }}>
      <h3 style={{ margin: '0 0 8px' }}>{esercizio.nome}</h3>
      <p style={{ margin: '0 0 8px', color: '#555' }}>
        Serie: {esercizio.serie ?? '-'} · Ripetizioni: {esercizio.ripetizioni ?? '-'} · Recupero:{' '}
        {esercizio.recupero ?? '-'}
      </p>
      {esercizio.note_pt && (
        <p style={{ fontStyle: 'italic', margin: '0 0 8px' }}>Nota del PT: {esercizio.note_pt}</p>
      )}
      {esercizio.video_url && (
        <video controls width="100%" style={{ maxWidth: 400, borderRadius: 8, display: 'block' }}>
          <source src={esercizio.video_url} />
          Il tuo browser non supporta la riproduzione video.
        </video>
      )}
      {isAtleta && (
        <div style={{ marginTop: 8 }}>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Le tue note personali..."
            rows={2}
            style={{ width: '100%', padding: 6 }}
          />
          <button onClick={salvaNota} disabled={salvataggio} style={{ marginTop: 4 }}>
            {salvataggio ? 'Salvataggio...' : 'Salva nota'}
          </button>
        </div>
      )}
    </div>
  );
}
