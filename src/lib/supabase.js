import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

// Usa la chiave segreta: serve solo lato server per generare URL di upload firmati.
export const supabase = createClient(supabaseUrl, supabaseSecretKey);
