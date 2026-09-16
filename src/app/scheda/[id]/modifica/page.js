import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import ModificaEsercizio from './ModificaEsercizio';
import AggiungiEsercizio from './AggiungiEsercizio';
import RimuoviGiorno from './RimuoviGiorno';

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

  const giorniConEsercizi = await Promise.all(
    giorni.map(async (giorno) => {
      const { rows: esercizi } = await query(`SELECT * FROM esercizi WHERE giorno_id = $1 ORDER BY ordine`, [giorno.id]);
      return { ...giorno, esercizi };
    })
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-semibold text-2xl">Modifica: {scheda.titolo}</h1>
        <Link href={`/scheda/${scheda.id}`} className="text-stone-500 hover:text-stone-900 text-sm font-medium">
          ← Torna alla visualizzazione
        </Link>
      </div>

      {giorniConEsercizi.map((giorno) => (
        <div key={giorno.id} className="mb-10">
          <div className="flex justify-between items-center border-b border-stone-200 pb-2 mb-4">
            <h2 className="text-xl font-bold">{giorno.nome}</h2>
            <RimuoviGiorno giornoId={giorno.id} nomeGiorno={giorno.nome} />
          </div>
          {giorno.esercizi.map((esercizio) => (
            <ModificaEsercizio key={esercizio.id} esercizio={esercizio} />
          ))}
          {/* Tasto per aggiungere un nuovo esercizio vuoto a questo giorno */}
          <AggiungiEsercizio giornoId={giorno.id} />
        </div>
      ))}
    </div>
  );
}