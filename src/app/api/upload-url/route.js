import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.ruolo !== 'pt') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { filename } = await request.json();
    const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;

    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .createSignedUploadUrl(uniqueFilename);

    if (error) throw error;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${uniqueFilename}`;

    return NextResponse.json({ 
      uploadUrl: data.signedUrl, 
      videoUrl: publicUrl 
    });
  } catch (error) {
    console.error('Errore upload Supabase:', error);
    return NextResponse.json({ error: 'Errore generazione URL' }, { status: 500 });
  }
}