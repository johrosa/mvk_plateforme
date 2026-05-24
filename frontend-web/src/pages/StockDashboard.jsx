import React, { useState, useEffect } from 'react';
import api from '../api';
import { Warehouse, Package, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

function StockDashboard() {
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorages();
  }, []);

  const fetchStorages = async () => {
    try {
      const { data } = await api.get('/stock/my-storages');
      setStorages(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Warehouse className="text-green-600" size={32} />
          Gestion des Stocks
        </h1>
        <button className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition">
          Nouvelle Entrée
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {storages.map(s => (
          <div key={s.id} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{s.name}</h2>
                <p className="text-gray-500">{s.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-400 uppercase">Capacité Utilisée</p>
                <p className="text-xl font-black text-green-600">
                  {Math.round((s.currentLoad / s.capacity) * 100)}%
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden mb-8">
              <div
                className="bg-green-600 h-full transition-all duration-1000"
                style={{ width: `${(s.currentLoad / s.capacity) * 100}%` }}
              ></div>
            </div>

            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Package size={18} className="text-gray-400" /> Produits en stock
            </h3>
            <div className="space-y-3">
              {s.records.length > 0 ? s.records.map(r => (
                <div key={r.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800">{r.product.name}</p>
                    <p className="text-xs text-gray-500 italic">Entré le {new Date(r.entryDate).toLocaleDateString()}</p>
                  </div>
                  <p className="font-bold text-green-600">+{r.quantity} {r.product.unit}</p>
                </div>
              )) : (
                <p className="text-gray-400 italic text-sm">Aucun produit actuellement.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StockDashboard;
