import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const TestSupabase: React.FC = () => {
  const [message, setMessage] = useState("Test de connexion en cours...");

  useEffect(() => {
    const check = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*").limit(1);

        if (error) {
          setMessage("❌ Erreur Supabase : " + error.message);
        } else {
          setMessage("✅ Connexion Supabase OK !");
        }
      } catch (err) {
        setMessage("❌ Impossible de contacter Supabase.");
      }
    };

    check();
  }, []);

  return (
    <div style={{ padding: 10, background: "#eee", marginTop: 20 }}>
      {message}
    </div>
  );
};

export default TestSupabase;
