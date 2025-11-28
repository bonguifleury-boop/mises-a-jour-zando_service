import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis .env.local
dotenv.config();

// Récupérer les clés Supabase depuis process.env
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

// Vérifier que les variables existent
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or ANON key is missing. Vérifie ton fichier .env.local !"
  );
}

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Petit helper pour vérifier la configuration
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
