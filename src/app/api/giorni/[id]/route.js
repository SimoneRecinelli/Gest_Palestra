import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.ruolo !== 'pt') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }

  try {
    await query('DELETE FROM giorni WHERE id = $1', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) { 
    return NextResponse.json({ error: 'Errore' }, { status: 500 }); 
  }
}