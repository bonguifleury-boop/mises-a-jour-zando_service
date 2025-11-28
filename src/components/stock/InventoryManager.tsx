import React, { useState } from 'react';
import { Product, Supplier } from '../../types';

interface InventoryManagerProps {
  products: Product[];
  suppliers: Supplier[];
  onAddProduct: (p: Product) => Promise<boolean>;
  onUpdateProduct: (p: Product) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<void> | void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({
  products,
  suppliers,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [search, setSearch] = useState('');

  // --- ÉTAT DU FORMULAIRE ---
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number>(0);         // Prix de Vente
  const [purchasePrice, setPurchasePrice] = useState<number>(0); // Prix d'Achat
  const [stock, setStock] = useState<number>(0);
  const [category, setCategory] = useState('General');
  const [supplierId, setSupplierId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Calcul de la marge en temps réel pour le formulaire
  const currentMargin = price - purchasePrice;

  // Filtrage pour le tableau
  const filteredProducts = products.filter(p => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.category ?? '').toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) {
      alert('Le Nom et le SKU sont obligatoires.');
      return;
    }

    setIsSaving(true);
    const newProduct: Product = {
      id: '', // sera remplacé par la DB
      name,
      sku,
      price,
      purchasePrice,
      stock,
      category,
      description: '',
      imageUrl: '',
      supplierId: supplierId || undefined,
    };

    const ok = await onAddProduct(newProduct);
    setIsSaving(false);

    if (ok) {
      // Reset du formulaire
      setName('');
      setSku('');
      setPrice(0);
      setPurchasePrice(0);
      setStock(0);
      setCategory('General');
      setSupplierId('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Gestion des Stocks (Gestock)
        </h1>
      </div>

      {/* --- FORMULAIRE CORRIGÉ AVEC LABELS --- */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Ajouter un nouveau produit</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: T-Shirt Coton"
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Code) *</label>
            <input
              type="text"
              required
              value={sku}
              onChange={e => setSku(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: TSH-001"
            />
          </div>

          {/* Fournisseur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
            <select
              value={supplierId}
              onChange={e => setSupplierId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="">-- Sélectionner --</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ligne des Prix (Ce que tu as écrit au crayon) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          
          {/* Achat */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Prix Achat (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={purchasePrice}
              onChange={e => setPurchasePrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Vente */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Prix Vente (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Stock Initial</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={e => setStock(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

           {/* Bouton Ajouter */}
           <div>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-indigo-600 text-white font-medium px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50 flex justify-center items-center"
            >
              {isSaving ? '...' : '+ Ajouter'}
            </button>
          </div>
        </div>

        {/* Petit indicateur de marge visuel */}
        <div className="mt-2 text-sm text-gray-500">
           Marge estimée : <span className={currentMargin >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
             {currentMargin.toFixed(2)} €
           </span>
        </div>
      </form>

      {/* --- BARRE DE RECHERCHE --- */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom, SKU ou catégorie..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none pl-10"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      {/* --- TABLEAU DES PRODUITS --- */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Produit</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fournisseur</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Achat</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vente</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Marge</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(p => {
                const supplier = suppliers.find(s => s.id === p.supplierId);
                const margin = p.price - (p.purchasePrice ?? 0);

                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{p.name}</td>
                    <td className="p-4 text-gray-500">{p.sku}</td>
                    <td className="p-4 text-gray-500">{supplier?.name ?? '-'}</td>
                    <td className="p-4 text-gray-500">
                      {p.purchasePrice ? p.purchasePrice.toFixed(2) + ' €' : '-'}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">{p.price.toFixed(2)} €</td>
                    <td className="p-4 text-gray-600">{margin.toFixed(2)} €</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock > 5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                        onClick={() => onUpdateProduct(p)}
                      >
                        Modifier
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 font-medium text-sm"
                        onClick={() => onDeleteProduct(p.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400 italic">
                    Aucun produit trouvé dans l'inventaire.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;