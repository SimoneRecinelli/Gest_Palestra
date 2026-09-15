import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Dumbbell, ChevronRight } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-8">
        <Dumbbell className="w-5 h-5 text-accent" strokeWidth={2.5} />
        <h1 className="font-display font-semibold text-2xl">
          {isPt ? 'I tuoi atleti' : 'Le tue schede'}
        </h1>
      </div>

      {schede.length === 0 && (
        <p className="text-inkmuted mb-6">
          {isPt ? 'Non hai ancora creato nessuna scheda.' : 'Il tuo PT non ha ancora caricato una scheda.'}
        </p>
      )}

      <div className="space-y-3">
        {schede.map((s) => (
          <Link
            key={s.id}
            href={`/scheda/${s.id}`}
            className="flex items-center justify-between bg-card border border-border border-l-4 border-l-accent rounded-lg px-5 py-4 hover:border-l-accentdark transition-colors group"
          >
            <div>
              <p className="font-display font-semibold text-lg leading-tight">{s.titolo}</p>
              {isPt && <p className="text-sm text-inkmuted">{s.atleta_nome}</p>}
            </div>
            <ChevronRight className="w-5 h-5 text-inkmuted group-hover:text-accent transition-colors" />
          </Link>
        ))}
      </div>

      {isPt && <NuovaSchedaForm />}
    </div>
  );
}
