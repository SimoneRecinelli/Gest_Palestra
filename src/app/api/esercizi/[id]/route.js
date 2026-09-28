import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.ruolo !== 'pt') {
    return NextResponse.json({ errore: 'Non autorizzato' }, { status: 403 });
  }

  const id = params.id;
  const data = await request.json();

  try {
    await query(
      `UPDATE esercizi 
       SET 
         nome = $1, 
         serie = $2, 
         ripetizioni = $3, 
         recupero = $4, 
         note_pt = $5, 
         video_url = $6,
         gruppo_muscolare = $7,
         is_superset = $8,
         ordine = $9
       WHERE id = $10`,
      [
        data.nome || 'Esercizio',
        // Trasforma le stringhe vuote in null per evitare errori nel database
        data.serie === '' ? null : data.serie,
        data.ripetizioni === '' ? null : data.ripetizioni,
        data.recupero === '' ? null : data.recupero,
        data.note_pt === '' ? null : data.note_pt,
        data.video_url === '' ? null : data.video_url,
        data.gruppo_muscolare === '' ? null : data.gruppo_muscolare,
        data.is_superset || false,
        data.ordine !== '' && data.ordine !== undefined ? parseInt(data.ordine) : 0,
        id
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Errore modifica esercizio:', error);
    return NextResponse.json({ errore: 'Errore server' }, { status: 500 });
  }
}