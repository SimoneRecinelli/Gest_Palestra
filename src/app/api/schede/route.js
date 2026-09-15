import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.ruolo !== 'pt') {
    return NextResponse.json({ errore: 'Non autorizzato' }, { status: 403 });
  }

  const { titolo, atletaEmail } = await request.json();

  const { rows: atletaRows } = await query(
    'SELECT id FROM utenti WHERE email = $1 AND ruolo = $2',
    [atletaEmail, 'atleta']
  );
  if (atletaRows.length === 0) {
    return NextResponse.json({ errore: 'Atleta non trovato' }, { status: 404 });
  }

  const { rows } = await query(
    'INSERT INTO schede (titolo, atleta_id, pt_id) VALUES ($1, $2, $3) RETURNING id',
    [titolo, atletaRows[0].id, session.user.id]
  );

  return NextResponse.json({ id: rows[0].id });
}
