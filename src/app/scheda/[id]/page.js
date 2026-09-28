import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import SchedaTabs from './SchedaTabs';
import Link from 'next/link';
import DuplicaSchedaBtn from '@/app/components/DuplicaSchedaBtn';

// QUESTA RIGA DISATTIVA LA CACHE: carica sempre i dati freschi dal database!
export const dynamic = 'force-dynamic';

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

  giorni.sort((a, b) => {
    if (a.nome.toLowerCase().includes('riscaldamento')) return -1;
    if (b.nome.toLowerCase().includes('riscaldamento')) return 1;
    return a.ordine - b.ordine;
  }); // <-- RIMOSSO L'8 DI ERRORE CHE ERA QUI

  const giorniConEsercizi = await Promise.all(
    giorni.map(async (giorno) => {
      const { rows: esercizi } = await query(
        `SELECT e.*, n.testo AS nota_atleta
         FROM esercizi e
         LEFT JOIN note_atleta n ON n.esercizio_id = e.id AND n.atleta_id = $2
         WHERE e.giorno_id = $1 ORDER BY e.ordine ASC, e.id ASC`, // <-- AGGIUNTO ORDINAMENTO PRECISO
        [giorno.id, scheda.atleta_id]
      );
      return { ...giorno, esercizi };
    })
  );

  // Diario pesi: una query sola per tutti gli esercizi della scheda, poi raggruppo per esercizio.
  const tuttiGliEsercizi = giorniConEsercizi.flatMap((g) => g.esercizi);
  if (tuttiGliEsercizi.length > 0) {
    const idEsercizi = tuttiGliEsercizi.map((e) => e.id);
    const { rows: pesi } = await query(
      `SELECT * FROM log_pesi WHERE esercizio_id = ANY($1::int[]) AND atleta_id = $2 ORDER BY creato_il DESC`,
      [idEsercizi, scheda.atleta_id]
    );
    for (const esercizio of tuttiGliEsercizi) {
      esercizio.pesi = pesi.filter((p) => p.esercizio_id === esercizio.id).slice(0, 5);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display font-semibold text-2xl">{scheda.titolo}</h1>
        
        {/* Inseriamo i due bottoni affiancati se l'utente è il PT */}
        {isPt && (
          <div className="flex items-center gap-3">
            <DuplicaSchedaBtn schedaId={scheda.id} />
            
            <Link
              href={`/scheda/${scheda.id}/modifica`}
              className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              Modifica Scheda
            </Link>
          </div>
        )}

      </div>
      <SchedaTabs giorni={giorniConEsercizi} isPt={isPt} isAtleta={isAtleta} schedaId={scheda.id} />
    </div>
  );
}