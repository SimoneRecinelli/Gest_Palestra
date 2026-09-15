import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.ruolo !== 'pt') {
    return NextResponse.json({ errore: 'Non autorizzato' }, { status: 403 });
  }

  const { schedaId, nome } = await request.json();

  const { rows: schedaRows } = await query(
    'SELECT id FROM schede WHERE id = $1 AND pt_id = $2',
    [schedaId, session.user.id]
  );
  if (schedaRows.length === 0) {
    return NextResponse.json({ errore: 'Scheda non trovata o non tua' }, { status: 403 });
  }

  const { rows: maxOrdine } = await query(
    'SELECT COALESCE(MAX(ordine), -1) AS max FROM giorni WHERE scheda_id = $1',
    [schedaId]
  );

  await query('INSERT INTO giorni (scheda_id, nome, ordine) VALUES ($1, $2, $3)', [
    schedaId,
    nome,
    maxOrdine[0].max + 1,
  ]);

  return NextResponse.json({ ok: true });
}
