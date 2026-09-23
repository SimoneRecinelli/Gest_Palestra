import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import ModificaSchedaClient from './ModificaSchedaClient';

export default async function ModificaSchedaPage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const schedaId = params.id;
  const { rows: schedeRows } = await query('SELECT * FROM schede WHERE id = $1', [schedaId]);
  const scheda = schedeRows[0];
  if (!scheda) notFound();

  // Sicurezza: solo il PT associato può entrare qui
  const isPt = session.user.ruolo === 'pt' && Number(session.user.id) === scheda.pt_id;
  if (!isPt) redirect(`/scheda/${schedaId}`);

  const { rows: giorni } = await query('SELECT * FROM giorni WHERE scheda_id = $1 ORDER BY ordine', [schedaId]);

  giorni.sort((a, b) => {
    if (a.nome.toLowerCase().includes('riscaldamento')) return -1;
    if (b.nome.toLowerCase().includes('riscaldamento')) return 1;
    return a.ordine - b.ordine;
  });
  
  const giorniConEsercizi = await Promise.all(
    giorni.map(async (giorno) => {
      // IMPORTANTE: Qui abbiamo aggiunto l'ordinamento doppio per far funzionare l'ordine personalizzato!
      const { rows: esercizi } = await query(`SELECT * FROM esercizi WHERE giorno_id = $1 ORDER BY ordine ASC, id ASC`, [giorno.id]);
      return { ...giorno, esercizi };
    })
  );

  // Rendiamo il nuovo componente Client passando i dati
  return <ModificaSchedaClient giorni={giorniConEsercizi} scheda={scheda} />;
}