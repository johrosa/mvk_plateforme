import React, { useState, useEffect } from 'react';
import api from '../api';
import { Users, Truck, Warehouse, Package, Settings, ChevronRight } from 'lucide-react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [transports, setTransports] = useState([]);
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const { data } = await api.get('/admin/users');
        setUsers(data);
      } else if (activeTab === 'logistics') {
        const t = await api.get('/admin/transports');
        const s = await api.get('/admin/storages');
        setTransports(t.data);
        setStorages(s.data);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 space-y-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'users' ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
        >
          <Users size={20} /> <span className="font-semibold">Utilisateurs</span>
        </button>
        <button
          onClick={() => setActiveTab('logistics')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'logistics' ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
        >
          <Truck size={20} /> <span className="font-semibold">Logistique</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white rounded-3xl shadow-xl p-8">
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="text-green-600" /> Gestion des Personnels & Membres
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-gray-500 text-sm">
                    <th className="pb-4 font-medium">Nom</th>
                    <th className="pb-4 font-medium">Email</th>
                    <th className="pb-4 font-medium">Rôle</th>
                    <th className="pb-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(u => (
                    <tr key={u.id} className="text-gray-700">
                      <td className="py-4 font-medium">{u.name}</td>
                      <td className="py-4">{u.email}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'HUB' ? 'bg-blue-100 text-blue-700' :
                          u.role === 'FARMER' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 text-green-600 font-semibold cursor-pointer hover:underline italic">Modifier</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Truck className="text-green-600" /> Flotte de Transport
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {transports.map(t => (
                  <div key={t.id} className="border p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="font-bold">{t.vehicleType} - {t.plateNumber}</p>
                      <p className="text-sm text-gray-500">Capacité: {t.capacity} tonnes</p>
                    </div>
                    <span className="text-xs font-bold uppercase text-green-600 bg-green-50 px-2 py-1 rounded">{t.status}</span>
                  </div>
                ))}
                <button className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-gray-500 hover:border-green-600 hover:text-green-600 transition">+ Ajouter un véhicule</button>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Warehouse className="text-green-600" /> Stockage & Entrepôts
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {storages.map(s => (
                  <div key={s.id} className="border p-4 rounded-2xl">
                    <p className="font-bold text-lg">{s.name}</p>
                    <p className="text-gray-500 text-sm mb-4">{s.location}</p>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-600 h-full" style={{ width: `${(s.currentLoad / s.capacity) * 100}%` }}></div>
                    </div>
                    <p className="text-xs mt-1 text-right text-gray-500">{s.currentLoad} / {s.capacity} tonnes</p>
                  </div>
                ))}
                <button className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-gray-500 hover:border-green-600 hover:text-green-600 transition">+ Configurer un entrepôt</button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
