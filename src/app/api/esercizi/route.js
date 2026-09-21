import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.ruolo !== 'pt') {
    return NextResponse.json({ errore: 'Non autorizzato' }, { status: 403 });
  }

  const data = await request.json();
  // Il frontend ora manda 'giorno_id', quindi lo peschiamo in modo flessibile
  const giornoId = data.giornoId || data.giorno_id; 

  // Verifica che il giorno appartenga a una scheda di questo PT (Ottima sicurezza!)
  const { rows: giornoRows } = await query(
    `SELECT g.id FROM giorni g
     JOIN schede s ON s.id = g.scheda_id
     WHERE g.id = $1 AND s.pt_id = $2`,
    [giornoId, session.user.id]
  );
  
  if (giornoRows.length === 0) {
    return NextResponse.json({ errore: 'Giorno non trovato o non tuo' }, { status: 403 });
  }

  // Prende l'ordine dal form (se esiste e non è vuoto)
  let ordineFinale = data.ordine !== undefined && data.ordine !== '' ? parseInt(data.ordine) : null;

  // Se l'ordine non è stato fornito dal form, lo calcola in automatico mettendolo in fondo
  if (ordineFinale === null || isNaN(ordineFinale)) {
    const { rows: maxOrdine } = await query(
      'SELECT COALESCE(MAX(ordine), -1) AS max FROM esercizi WHERE giorno_id = $1',
      [giornoId]
    );
    ordineFinale = maxOrdine[0].max + 1;
  }

  // Assicuriamoci di prendere anche is_superset
  const is_superset = data.is_superset || false;

  await query(
    `INSERT INTO esercizi (giorno_id, nome, serie, ripetizioni, recupero, note_pt, video_url, ordine, is_superset)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      giornoId,
      data.nome || 'Nuovo Esercizio',
      data.serie || null,
      data.ripetizioni || null,
      data.recupero || null,
      data.notePt || data.note_pt || null,
      data.videoUrl || data.video_url || null,
      ordineFinale,
      is_superset
    ]
  );

  return NextResponse.json({ ok: true });
}