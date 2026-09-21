import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.ruolo !== 'pt') return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });

  const id = params.id;
  const data = await request.json();
  
  // Aggiunto 'ordine' nella destrutturazione
  const { nome, serie, ripetizioni, recupero, note_pt, video_url, is_superset, ordine } = data;

  try {
    await query(
      `UPDATE esercizi SET nome = $1, serie = $2, ripetizioni = $3, recupero = $4, note_pt = $5, video_url = $6, is_superset = $7, ordine = $8 WHERE id = $9`,
      [nome, serie, ripetizioni, recupero, note_pt, video_url, is_superset, ordine || 0, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) { 
    return NextResponse.json({ error: 'Errore' }, { status: 500 }); 
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.ruolo !== 'pt') return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });

  try {
    await query('DELETE FROM esercizi WHERE id = $1', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) { 
    return NextResponse.json({ error: 'Errore' }, { status: 500 }); 
  }
}