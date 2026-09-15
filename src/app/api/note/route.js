import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.ruolo !== 'atleta') {
    return NextResponse.json({ errore: 'Non autorizzato' }, { status: 403 });
  }

  const { esercizioId, testo } = await request.json();

  // Upsert: se la nota esiste già per questo esercizio+atleta, la aggiorna.
  await query(
    `INSERT INTO note_atleta (esercizio_id, atleta_id, testo, aggiornata_il)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (esercizio_id, atleta_id)
     DO UPDATE SET testo = EXCLUDED.testo, aggiornata_il = now()`,
    [esercizioId, session.user.id, testo]
  );

  return NextResponse.json({ ok: true });
}
