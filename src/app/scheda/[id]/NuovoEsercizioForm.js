'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NuovoEsercizioForm({ giornoId }) {
  const [nome, setNome] = useState('');
  const [serie, setSerie] = useState('');
  const [ripetizioni, setRipetizioni] = useState('');
  const [recupero, setRecupero] = useState('');
  const [notePt, setNotePt] = useState('');
  const [file, setFile] = useState(null);
  const [caricamento, setCaricamento] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setCaricamento(true);

    let videoUrl = null;

    if (file) {
      const chiaveFile = `esercizi/${Date.now()}-${file.name}`;

      const rispostaUrl = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chiaveFile, tipoContenuto: file.type }),
      });
      const { urlCaricamento, urlPubblico } = await rispostaUrl.json();

      // Upload diretto dal browser a Backblaze B2, non passa dal nostro server
      await fetch(urlCaricamento, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      videoUrl = urlPubblico;
    }

    await fetch('/api/esercizi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ giornoId, nome, serie, ripetizioni, recupero, notePt, videoUrl }),
    });

    setCaricamento(false);
    setNome('');
    setSerie('');
    setRipetizioni('');
    setRecupero('');
    setNotePt('');
    setFile(null);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px dashed #aaa', padding: 16, borderRadius: 8 }}>
      <h4 style={{ marginTop: 0 }}>Aggiungi esercizio</h4>
      <input
        placeholder="Nome esercizio"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 6 }}
      />
      <input
        placeholder="Serie"
        value={serie}
        onChange={(e) => setSerie(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 6 }}
      />
      <input
        placeholder="Ripetizioni (es. 8-10)"
        value={ripetizioni}
        onChange={(e) => setRipetizioni(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 6 }}
      />
      <input
        placeholder="Recupero (es. 90s)"
        value={recupero}
        onChange={(e) => setRecupero(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 6 }}
      />
      <textarea
        placeholder="Nota per l'atleta"
        value={notePt}
        onChange={(e) => setNotePt(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 6 }}
      />
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ display: 'block', marginBottom: 8 }}
      />
      <button type="submit" disabled={caricamento}>
        {caricamento ? 'Caricamento...' : 'Salva esercizio'}
      </button>
    </form>
  );
}
