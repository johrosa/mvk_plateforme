import React, { useState, useEffect } from 'react';
import api from '../api';
import { UserPlus, ShoppingBag, History, CheckCircle } from 'lucide-react';

function SalesRepDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [retailerName, setRetailerName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const prodRes = await api.get('/products');
      const orderRes = await api.get('/orders');
      setProducts(prodRes.data);
      setOrders(orderRes.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !retailerName) return;

    try {
      await api.post('/orders', {
        productId: selectedProduct.id,
        quantity: parseInt(quantity),
        retailerName
      });
      setMessage('Commande enregistrée avec succès !');
      setRetailerName('');
      setSelectedProduct(null);
      setQuantity(1);
      fetchData();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      alert('Erreur lors de la commande');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl">
        <h1 className="text-4xl font-black mb-2">Espace Démarcheur</h1>
        <p className="text-blue-100 text-lg opacity-90">Aidez les commerçants à s'approvisionner sur le terrain.</p>
      </div>

      {message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-xl flex items-center gap-3 animate-bounce">
          <CheckCircle /> {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
            <ShoppingBag /> Nouvelle Commande
          </h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nom du Commerçant / Boutique</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: Boutique chez Issa"
                value={retailerName}
                onChange={(e) => setRetailerName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sélectionner un Produit</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setSelectedProduct(products.find(p => p.id === parseInt(e.target.value)))}
                value={selectedProduct?.id || ''}
                required
              >
                <option value="">-- Choisir un produit --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - {p.price}€ / {p.unit} (Dispo: {p.quantity})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quantité</label>
              <input
                type="number"
                min="1"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition transform active:scale-95"
            >
              Enregistrer la Commande
            </button>
          </form>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-700">
            <History /> Mes Commandes Récentes
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {orders.length === 0 ? (
              <p className="text-gray-400 italic">Aucune commande enregistrée.</p>
            ) : orders.map(order => (
              <div key={order.id} className="p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{order.retailerName || 'Client anonyme'}</h3>
                  <span className="text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">{order.status}</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-600">{order.product.name} x {order.quantity}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="font-black text-blue-600">{order.total}€</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesRepDashboard;
