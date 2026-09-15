import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.ruolo !== 'pt') {
    return NextResponse.json({ errore: 'Non autorizzato' }, { status: 403 });
  }

  const { giornoId, nome, serie, ripetizioni, recupero, notePt, videoUrl } =
    await request.json();

  // Verifica che il giorno appartenga a una scheda di questo PT
  const { rows: giornoRows } = await query(
    `SELECT g.id FROM giorni g
     JOIN schede s ON s.id = g.scheda_id
     WHERE g.id = $1 AND s.pt_id = $2`,
    [giornoId, session.user.id]
  );
  if (giornoRows.length === 0) {
    return NextResponse.json({ errore: 'Giorno non trovato o non tuo' }, { status: 403 });
  }

  const { rows: maxOrdine } = await query(
    'SELECT COALESCE(MAX(ordine), -1) AS max FROM esercizi WHERE giorno_id = $1',
    [giornoId]
  );

  await query(
    `INSERT INTO esercizi (giorno_id, nome, serie, ripetizioni, recupero, note_pt, video_url, ordine)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      giornoId,
      nome,
      serie || null,
      ripetizioni || null,
      recupero || null,
      notePt || null,
      videoUrl || null,
      maxOrdine[0].max + 1,
    ]
  );

  return NextResponse.json({ ok: true });
}
