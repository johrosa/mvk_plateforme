import React, { useState, useEffect } from 'react';
import api from '../api';
import { Users, Package, MapPin, Send, Map as MapIcon } from 'lucide-react';
import MapDisplay from '../components/MapDisplay';

function HubManagerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHubData();
  }, []);

  const fetchHubData = async () => {
    try {
      const { data } = await api.get('/products');
      // On filtre pour ne voir que les produits liés au Hub ou aux paysans du Hub
      setProducts(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-green-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2">Espace Responsable Hub</h1>
          <p className="text-green-100 text-lg opacity-90 font-medium">Gérez votre communauté de paysans et les expéditions locales.</p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <MapPin size={120} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Package className="text-green-600" /> Inventaire Consolidé
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-sm border-b uppercase tracking-wider">
                    <th className="pb-4 font-semibold">Produit</th>
                    <th className="pb-4 font-semibold">Producteur</th>
                    <th className="pb-4 font-semibold">Stock</th>
                    <th className="pb-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="py-4 font-bold text-gray-800">{p.name}</td>
                      <td className="py-4 text-gray-600">{p.sourceFarmerName || p.farmer.name}</td>
                      <td className="py-4 font-mono">{p.quantity} {p.unit}</td>
                      <td className="py-4">
                        <button className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1">
                          Expédier <Send size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapIcon className="text-green-600" /> Localisation
            </h2>
            <MapDisplay
              zoom={12}
              markers={products.filter(p => p.farmer?.latitude).map(p => ({
                lat: p.farmer.latitude,
                lng: p.farmer.longitude,
                title: p.sourceFarmerName || p.farmer.name,
                description: 'Producteur local'
              }))}
            />
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="text-green-600" /> Paysans Membres
            </h2>
            <div className="space-y-4">
              {/* Mock members for UI demo */}
              {['Jean Dupont', 'Marie Curie', 'Pierre Legrand'].map(name => (
                <div key={name} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition cursor-pointer">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                    {name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{name}</p>
                    <p className="text-xs text-gray-500">Dernier apport: 12/05</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-green-600 hover:text-green-600 transition">
                + Ajouter un paysan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HubManagerDashboard;
