import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import SchedaTabs from './SchedaTabs';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto px-4 pt-5">
      <h1 className="font-display font-extrabold text-[38px] leading-[1.02] tracking-wide break-words">
        {scheda.titolo}
      </h1>

      {isPt && (
        <div className="flex items-center gap-2 mt-4">
          <Link href={`/scheda/${scheda.id}/modifica`} className="btn-dark btn-sm">
            <Pencil className="w-4 h-4" />
            Modifica
          </Link>
          <DuplicaSchedaBtn schedaId={scheda.id} />
        </div>
      )}

      <SchedaTabs giorni={giorniConEsercizi} isPt={isPt} isAtleta={isAtleta} schedaId={scheda.id} />
    </div>
  );
}
