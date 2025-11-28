import React, { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";

const TestSupabase: React.FC = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        // Exemple simple pour vérifier la table "products"
        const { data, error } = await supabase.from("products").select("*").limit(1);
        if (error) throw error;
        setTables(data ? ["products"] : []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erreur inconnue");
      }
    };

    fetchTables();
  }, []);

  return (
    <div>
      <h2>Test connexion Supabase</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && <p>Tables trouvées : {tables.join(", ") || "Aucune"}</p>}
    </div>
  );
};

export default TestSupabase;
