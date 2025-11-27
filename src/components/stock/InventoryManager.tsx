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

  // état du formulaire d'ajout
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [category, setCategory] = useState('General');
  const [supplierId, setSupplierId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
      alert('Nom et SKU sont obligatoires.');
      return;
    }

    setIsSaving(true);
    const newProduct: Product = {
      id: '', // sera remplacé par Supabase
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Gestion des Stocks (Gestock)
        </h1>
      </div>

      {/* Formulaire simple d'ajout */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-4 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <input
          type="text"
          placeholder="Nom du produit *"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <input
          type="text"
          placeholder="SKU *"
          value={sku}
          onChange={e => setSku(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <input
          type="number"
          placeholder="Prix d'achat"
          value={purchasePrice}
          onChange={e => setPurchasePrice(Number(e.target.value))}
          className="border rounded px-2 py-1"
        />
        <input
          type="number"
          placeholder="Prix de vente"
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
          className="border rounded px-2 py-1"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={e => setStock(Number(e.target.value))}
          className="border rounded px-2 py-1"
        />
        <input
          type="text"
          placeholder="Catégorie"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <select
          value={supplierId}
          onChange={e => setSupplierId(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Fournisseur (optionnel)</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSaving ? 'Enregistrement...' : '+ Ajouter le produit'}
        </button>
      </form>

      {/* Recherche */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Rechercher par nom ou SKU..."
        className="w-full border rounded-lg px-3 py-2"
      />

      {/* Tableau produits */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-3">Produit</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Fournisseur</th>
              <th className="p-3">Achat</th>
              <th className="p-3">Vente</th>
              <th className="p-3">Marge</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => {
              const supplier = suppliers.find(s => s.id === p.supplierId);
              const margin = p.price - (p.purchasePrice ?? 0);

              return (
                <tr
                  key={p.id}
                  className="border-b last:border-0 hover:bg-slate-50"
                >
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{supplier?.name ?? '-'}</td>
                  <td className="p-3">
                    {p.purchasePrice !== undefined
                      ? p.purchasePrice.toFixed(2) + ' €'
                      : '-'}
                  </td>
                  <td className="p-3">{p.price.toFixed(2)} €</td>
                  <td className="p-3">{margin.toFixed(2)} €</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 space-x-2">
                    <button
                      className="text-indigo-600 text-sm"
                      onClick={() => onUpdateProduct(p)}
                    >
                      Modifier
                    </button>
                    <button
                      className="text-red-600 text-sm"
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
                <td colSpan={8} className="p-6 text-center text-slate-400">
                  Aucun produit trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManager;
