import React, { useState } from "react";
import Login from "./components/Login";
import Layout from "./components/Layout";
import InventoryManager from "./components/stock/InventoryManager";
import TestSupabase from "./TestSupabase";

import { User, Product, Supplier, StoreSettings } from "./types";
import { INITIAL_STORE_SETTINGS } from "./constants";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  if (!currentUser) return <Login onLogin={setCurrentUser} />;

  return (
    <Layout
      user={currentUser}
      onLogout={() => setCurrentUser(null)}
      currentView="inventory"
      onNavigate={() => {}}
    >
      <InventoryManager
        products={[]}
        suppliers={[]}
        onAddProduct={() => Promise.resolve(false)}
        onUpdateProduct={() => Promise.resolve(false)}
        onDeleteProduct={() => {}}
      />

      {/* Test de la connexion Supabase */}
      <TestSupabase />
    </Layout>
  );
};

export default App;
