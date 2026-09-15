import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import EsercizioCard from './EsercizioCard';
import NuovoEsercizioForm from './NuovoEsercizioForm';
import NuovoGiornoForm from './NuovoGiornoForm';

export default async function SchedaPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const schedaId = params.id;

  const { rows: schedeRows } = await query('SELECT * FROM schede WHERE id = $1', [schedaId]);
  const scheda = schedeRows[0];
  if (!scheda) notFound();

  const isPt = session.user.ruolo === 'pt' && Number(session.user.id) === scheda.pt_id;
  const isAtleta = session.user.ruolo === 'atleta' && Number(session.user.id) === scheda.atleta_id;
  if (!isPt && !isAtleta) redirect('/dashboard');

  const { rows: giorni } = await query('SELECT * FROM giorni WHERE scheda_id = $1 ORDER BY ordine', [
    schedaId,
  ]);

  const giorniConEsercizi = await Promise.all(
    giorni.map(async (giorno) => {
      const { rows: esercizi } = await query(
        `SELECT e.*, n.testo AS nota_atleta
         FROM esercizi e
         LEFT JOIN note_atleta n ON n.esercizio_id = e.id AND n.atleta_id = $2
         WHERE e.giorno_id = $1 ORDER BY e.ordine`,
        [giorno.id, scheda.atleta_id]
      );
      return { ...giorno, esercizi };
    })
  );

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 700, margin: '0 auto' }}>
      <h1>{scheda.titolo}</h1>
      {giorniConEsercizi.map((giorno) => (
        <div key={giorno.id} style={{ marginBottom: 32 }}>
          <h2>{giorno.nome}</h2>
          {giorno.esercizi.map((es) => (
            <EsercizioCard key={es.id} esercizio={es} isAtleta={isAtleta} />
          ))}
          {isPt && <NuovoEsercizioForm giornoId={giorno.id} />}
        </div>
      ))}
      {isPt && <NuovoGiornoForm schedaId={scheda.id} />}
    </div>
  );
}
