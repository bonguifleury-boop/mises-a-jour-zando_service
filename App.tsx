import React, { useState, useEffect } from 'react';

import Login from './components/Login';
import Layout from './components/Layout';
import AdminDashboard from './components/admin/AdminDashboard';
import ReportDashboard from './components/admin/ReportDashboard';
import Settings from './components/admin/Settings';
import POSInterface from './components/pos/POSInterface';
import InventoryManager from './components/stock/InventoryManager';
import SupplierManager from './components/stock/SupplierManager';

import {
  User,
  Product,
  Transaction,
  CartItem,
  Supplier,
  StoreSettings,
} from './types';

import { INITIAL_STORE_SETTINGS } from './constants';
import { supabase } from './services/supabaseClient';
import { Database, Copy, CheckCircle, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [storeSettings, setStoreSettings] =
    useState<StoreSettings>(INITIAL_STORE_SETTINGS);

  const [currentView, setCurrentView] = useState<
    'dashboard' | 'inventory' | 'pos' | 'reports' | 'settings' | string
  >('inventory');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingTables, setMissingTables] = useState(false);

  // --- Mappers DB -> App ---
  const mapProductFromDb = (row: any): Product => ({
    id: row.id,
    name: row.name,
    category: row.category ?? 'General',
    price: Number(row.price ?? 0),
    purchasePrice: Number(row.purchase_price ?? 0),
    stock: Number(row.stock ?? 0),
    sku: row.sku ?? '',
    description: row.description ?? '',
    imageUrl: row.image_url ?? 'https://picsum.photos/300/300',
    supplierId: row.supplier_id ?? null,
  });

  const mapProductToDb = (p: Partial<Product>) => ({
    name: p.name,
    category: p.category,
    price: p.price,
    purchase_price: p.purchasePrice,
    stock: p.stock,
    sku: p.sku,
    description: p.description,
    image_url: p.imageUrl,
    supplier_id: p.supplierId === '' ? null : p.supplierId,
  });

  const mapSupplierFromDb = (row: any): Supplier => ({
    id: row.id,
    name: row.name,
    contactName: row.contact_name ?? '',
    email: row.email ?? '',
    phone: row.phone ?? '',
  });

  const mapSupplierToDb = (s: Partial<Supplier>) => ({
    name: s.name,
    contact_name: s.contactName,
    email: s.email,
    phone: s.phone,
  });

  const mapTransactionFromDb = (row: any): Transaction => ({
    id: row.id,
    date: row.date,
    total: Number(row.total ?? 0),
    cashierId: row.cashier_id,
    items: (row.items ?? []) as CartItem[],
  });

  // --- Fetch global data ---
  const fetchData = async () => {
    if (!supabase) return;

    setIsLoading(true);
    setError(null);
    setMissingTables(false);

    try {
      // Store Settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('store_settings')
        .select('*')
        .single();

      if (settingsError) {
        if (
          settingsError.message?.includes('Could not find the table') ||
          settingsError.code === '42P01'
        ) {
          throw new Error('MISSING_TABLES');
        }
      }

      if (settingsData) {
        setStoreSettings({
          name: settingsData.name,
          address: settingsData.address,
          city: settingsData.city,
          phone: settingsData.phone,
          email: settingsData.email,
          logoUrl: settingsData.logo_url,
          receiptFooter: settingsData.receipt_footer,
        });
      }

      // Suppliers
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*');

      if (suppliersError) throw suppliersError;

      if (suppliersData) {
        setSuppliers(suppliersData.map(mapSupplierFromDb));
      }

      // Products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;

      if (productsData) {
        setProducts(productsData.map(mapProductFromDb));
      }

      // Transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (transactionsError) throw transactionsError;

      if (transactionsData) {
        setTransactions(transactionsData.map(mapTransactionFromDb));
      }
    } catch (err: any) {
      console.error(err);

      if (err.message === 'MISSING_TABLES') {
        setMissingTables(true);
        setError('Les tables de la base de données sont manquantes.');
      } else {
        setError(err.message || 'Erreur inconnue.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch AFTER login
  useEffect(() => {
    if (currentUser) fetchData();
  }, [currentUser]);

  // Reset vue selon le rôle
  useEffect(() => {
    if (!currentUser) return;

    switch (currentUser.role) {
      case 'ADMIN':
        setCurrentView('dashboard');
        break;
      case 'CAISSE':
        setCurrentView('pos');
        break;
      case 'GESTOCK':
        setCurrentView('inventory');
        break;
      default:
        setCurrentView('dashboard');
    }
  }, [currentUser]);

  // --- CRUD Produits ---
  const handleAddProduct = async (newProduct: Product): Promise<boolean> => {
    const payload = mapProductToDb(newProduct);

    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select();

    if (error) {
      alert('Erreur ajout produit: ' + error.message);
      return false;
    }

    if (data && data[0]) {
      setProducts(prev => [...prev, mapProductFromDb(data[0])]);
      return true;
    }

    return false;
  };

  const handleUpdateProduct = async (
    updatedProduct: Product
  ): Promise<boolean> => {
    const payload = mapProductToDb(updatedProduct);

    const { error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', updatedProduct.id);

    if (error) {
      alert('Erreur mise à jour produit: ' + error.message);
      return false;
    }

    setProducts(prev =>
      prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );

    return true;
  };

  // ... (ton render & routing viendront après)
  
  return (
    <div>Ton JSX ici…</div>
  );
};

export default App;
