import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.ruolo !== 'atleta') {
    return NextResponse.json({ errore: 'Non autorizzato' }, { status: 403 });
  }

  const { esercizioId, pesoKg, ripetizioniFatte } = await request.json();

  await query(
    `INSERT INTO log_pesi (esercizio_id, atleta_id, peso_kg, ripetizioni_fatte)
     VALUES ($1, $2, $3, $4)`,
    [esercizioId, session.user.id, pesoKg || null, ripetizioniFatte || null]
  );

  return NextResponse.json({ ok: true });
}
