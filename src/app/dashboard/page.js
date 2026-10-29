import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import NuovaSchedaForm from './NuovaSchedaForm';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const isPt = session.user.ruolo === 'pt';

  const { rows: schede } = isPt
    ? await query(
        `SELECT s.id, s.titolo, u.nome AS atleta_nome
         FROM schede s JOIN utenti u ON u.id = s.atleta_id
         WHERE s.pt_id = $1 ORDER BY s.creata_il DESC`,
        [session.user.id]
      )
    : await query(
        `SELECT id, titolo FROM schede WHERE atleta_id = $1 AND attiva = true ORDER BY creata_il DESC`,
        [session.user.id]
      );

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6">
      <h1 className="font-display font-extrabold text-[40px] leading-none tracking-wide mb-6">
        {isPt ? 'I tuoi atleti' : 'Le tue schede'}
      </h1>

      {schede.length === 0 && (
        <div className="card p-6 mb-6">
          <p className="font-semibold">Nessuna scheda ancora.</p>
          <p className="text-steel mt-1">
            {isPt
              ? 'Crea la prima scheda qui sotto: serve l\'email di un atleta già registrato.'
              : 'Quando il tuo PT ne carica una, la trovi qui.'}
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {schede.map((s) => (
          <li key={s.id}>
            <Link
              href={`/scheda/${s.id}`}
              className="card flex items-center gap-4 pl-5 pr-4 py-5 min-h-[76px] active:bg-white active:border-rubber transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-[28px] leading-[1.05] tracking-wide break-words">
                  {s.titolo}
                </p>
                {isPt && <p className="text-steel mt-1">{s.atleta_nome}</p>}
              </div>
              <ChevronRight className="w-6 h-6 text-steel shrink-0" />
            </Link>
          </li>
        ))}
      </ul>

      {isPt && <NuovaSchedaForm />}
    </div>
  );
}
