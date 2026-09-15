import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import NuovaSchedaForm from './NuovaSchedaForm';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  if (session.user.ruolo === 'pt') {
    const { rows: schede } = await query(
      `SELECT s.id, s.titolo, u.nome AS atleta_nome
       FROM schede s JOIN utenti u ON u.id = s.atleta_id
       WHERE s.pt_id = $1 ORDER BY s.creata_il DESC`,
      [session.user.id]
    );
    return (
      <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
        <h1>Le tue schede (PT)</h1>
        <ul>
          {schede.map((s) => (
            <li key={s.id} style={{ marginBottom: 4 }}>
              <Link href={`/scheda/${s.id}`}>
                {s.titolo} — {s.atleta_nome}
              </Link>
            </li>
          ))}
        </ul>
        <NuovaSchedaForm />
      </div>
    );
  }

  const { rows: schede } = await query(
    `SELECT id, titolo FROM schede WHERE atleta_id = $1 AND attiva = true ORDER BY creata_il DESC`,
    [session.user.id]
  );

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Le tue schede</h1>
      <ul>
        {schede.map((s) => (
          <li key={s.id} style={{ marginBottom: 4 }}>
            <Link href={`/scheda/${s.id}`}>{s.titolo}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
