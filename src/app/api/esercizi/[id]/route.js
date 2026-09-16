import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.ruolo !== 'pt') return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });

  const id = params.id;
  const data = await request.json();

  try {
    await query(
      `UPDATE esercizi SET nome = $1, serie = $2, ripetizioni = $3, recupero = $4, note_pt = $5, video_url = $6 WHERE id = $7`,
      [data.nome, data.serie || null, data.ripetizioni, data.recupero, data.note_pt, data.video_url, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: 'Errore' }, { status: 500 }); }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.ruolo !== 'pt') return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });

  try {
    await query('DELETE FROM esercizi WHERE id = $1', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: 'Errore' }, { status: 500 }); }
}