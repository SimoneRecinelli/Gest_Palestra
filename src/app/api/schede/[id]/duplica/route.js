import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.ruolo !== 'pt') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }

  const oldSchedaId = params.id;

  try {
    // 1. Clona la scheda madre
    const { rows: schede } = await query('SELECT * FROM schede WHERE id = $1', [oldSchedaId]);
    const os = schede[0];
    const { rows: newSchede } = await query(
      'INSERT INTO schede (titolo, pt_id, atleta_id, attiva) VALUES ($1, $2, $3, $4) RETURNING id',
      [`${os.titolo} (Copia)`, os.pt_id, os.atleta_id, true]
    );
    const newSchedaId = newSchede[0].id;

    // 2. Clona iterativamente i giorni
    const { rows: giorni } = await query('SELECT * FROM giorni WHERE scheda_id = $1', [oldSchedaId]);
    for (const g of giorni) {
      const { rows: newGiorni } = await query(
        'INSERT INTO giorni (scheda_id, nome, ordine) VALUES ($1, $2, $3) RETURNING id',
        [newSchedaId, g.nome, g.ordine]
      );
      const newGiornoId = newGiorni[0].id;

      // 3. Clona iterativamente gli esercizi per ogni giorno
      const { rows: esercizi } = await query('SELECT * FROM esercizi WHERE giorno_id = $1', [g.id]);
      for (const e of esercizi) {
        await query(
          `INSERT INTO esercizi (giorno_id, nome, serie, ripetizioni, recupero, note_pt, video_url, ordine)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [newGiornoId, e.nome, e.serie, e.ripetizioni, e.recupero, e.note_pt, e.video_url, e.ordine]
        );
      }
    }
    return NextResponse.json({ success: true, newId: newSchedaId });
  } catch (error) {
    return NextResponse.json({ error: 'Errore durante la clonazione' }, { status: 500 });
  }
}