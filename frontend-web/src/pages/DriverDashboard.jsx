import React, { useState, useEffect } from 'react';
import api from '../api';
import { Truck, MapPin, CheckCircle, Clock } from 'lucide-react';

function DriverDashboard() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const { data } = await api.get('/driver/my-deliveries');
      setMissions(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const updateStatus = async (deliveryId, status) => {
    try {
      await api.put(`/driver/delivery/${deliveryId}`, { status });
      fetchMissions();
    } catch (err) { alert('Erreur lors de la mise à jour'); }
  };

  return (
    <div className="space-y-8">
      <div className="bg-orange-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2">Espace Chauffeur</h1>
          <p className="text-orange-100 text-lg opacity-90 font-medium">Gérez vos livraisons et missions en cours.</p>
        </div>
        <Truck className="absolute top-0 right-0 p-8 opacity-20" size={120} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl text-center shadow-xl">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium text-lg">Aucune mission assignée pour le moment.</p>
          </div>
        ) : missions.map(m => (
          <div key={m.id} className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  m.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                  m.status === 'PICKED_UP' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {m.status}
                </span>
                <p className="text-xs text-gray-400">ID: #{m.id}</p>
              </div>
              <h3 className="text-xl font-bold mb-2">{m.order.product.name}</h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} className="text-orange-600" />
                  <p className="text-sm">Client: <span className="font-semibold text-gray-800">{m.order.retailerName || m.order.buyer?.name}</span></p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={16} className="text-orange-600" />
                  <p className="text-sm">Quantité: <span className="font-semibold text-gray-800">{m.order.quantity} {m.order.product.unit}</span></p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              {m.status === 'PENDING' && (
                <button
                  onClick={() => updateStatus(m.id, 'PICKED_UP')}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Récupérer la marchandise
                </button>
              )}
              {m.status === 'PICKED_UP' && (
                <button
                  onClick={() => updateStatus(m.id, 'DELIVERED')}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
                >
                  Confirmer la livraison
                </button>
              )}
              {m.status === 'DELIVERED' && (
                <div className="flex items-center justify-center gap-2 text-green-600 font-bold py-3">
                  <CheckCircle size={20} /> Mission accomplie
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DriverDashboard;
