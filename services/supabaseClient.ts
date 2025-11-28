import { createClient } from '@supabase/supabase-js';

// ⚠️ Ici on récupère les variables via Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL ou ANON key manquante. Vérifie tes variables d'environnement !"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);
