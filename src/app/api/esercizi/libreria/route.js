import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.ruolo !== 'pt') {
    return NextResponse.json({ errore: 'Non autorizzato' }, { status: 403 });
  }

  try {
    // Aggiunto il prefisso "e." a tutte le colonne per evitare ambiguità con la tabella "giorni"
    const { rows } = await query(
      `SELECT DISTINCT 
          e.nome, 
          LAST_VALUE(e.serie) OVER w AS serie, 
          LAST_VALUE(e.ripetizioni) OVER w AS ripetizioni, 
          LAST_VALUE(e.recupero) OVER w AS recupero, 
          LAST_VALUE(e.note_pt) OVER w AS note_pt, 
          LAST_VALUE(e.video_url) OVER w AS video_url
       FROM esercizi e
       JOIN giorni g ON e.giorno_id = g.id
       JOIN schede s ON g.scheda_id = s.id
       WHERE s.pt_id = $1
       WINDOW w AS (PARTITION BY e.nome ORDER BY e.id ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
       ORDER BY e.nome ASC`,
      [session.user.id]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Errore recupero libreria esercizi:', error);
    return NextResponse.json({ errore: 'Errore server' }, { status: 500 });
  }
}