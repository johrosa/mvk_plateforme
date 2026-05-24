import React, { useState, useEffect } from 'react';
import api from '../api';
import { ShoppingBasket, ShoppingCart, User, MapPin, X } from 'lucide-react';

function Marketplace() {
  const [products, setProducts] = useState([]);
  const [orderModal, setOrderModal] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) { console.error(err); }
  };

  const handleOrder = async () => {
    if (!orderModal) return;
    try {
      await api.post('/orders', { productId: orderModal.id, quantity: parseInt(quantity) });
      alert('Commande passée avec succès !');
      setOrderModal(null);
      setQuantity(1);
      fetchProducts();
    } catch (error) { alert('Échec de la commande'); }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <ShoppingBasket size={32} className="text-green-600" />
          Marché Local
        </h2>
        <div className="text-sm bg-green-50 text-green-700 px-4 py-2 rounded-full font-medium">
          {products.length} produits disponibles
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
            <div className="h-48 bg-gray-100 relative overflow-hidden">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ShoppingBasket size={64} />
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-green-700 shadow-sm">
                {p.price}€ / {p.unit}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{p.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{p.description || "Pas de description."}</p>
              </div>

              <div className="space-y-2 py-3 border-y border-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} className="text-gray-400" />
                  <span>Vendu par : <span className="font-semibold text-gray-800">{p.farmer?.name}</span></span>
                </div>
                {p.sourceFarmerName && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <MapPin size={16} />
                    <span>Origine : <span className="font-semibold">{p.sourceFarmerName}</span></span>
                  </div>
                )}
                <div className="text-sm text-gray-600 flex justify-between">
                  <span>Disponible</span>
                  <span className="font-bold text-gray-900">{p.quantity} {p.unit}</span>
                </div>
              </div>

              <button
                onClick={() => setOrderModal(p)}
                className="w-full bg-green-600 text-white py-3 rounded-2xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <ShoppingCart size={20} />
                Commander
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Modal */}
      {orderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 flex justify-between items-center border-b">
              <h3 className="text-xl font-bold">Passer une commande</h3>
              <button onClick={() => setOrderModal(null)} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl">
                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border">
                  {orderModal.imageUrl && <img src={orderModal.imageUrl} alt={orderModal.name} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{orderModal.name}</h4>
                  <p className="text-green-600 font-bold">{orderModal.price}€ / {orderModal.unit}</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block font-semibold text-gray-700">Quantité à commander ({orderModal.unit})</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold hover:bg-gray-50"
                  >-</button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(orderModal.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="flex-1 h-12 text-center text-xl font-bold border-2 rounded-xl outline-none focus:border-green-500"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(orderModal.quantity, quantity + 1))}
                    className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold hover:bg-gray-50"
                  >+</button>
                </div>
                <p className="text-xs text-gray-500 text-center italic">Maximum disponible : {orderModal.quantity} {orderModal.unit}</p>
              </div>

              <div className="pt-4 border-t space-y-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total :</span>
                  <span className="text-green-600">{(orderModal.price * quantity).toFixed(2)}€</span>
                </div>
                <button
                  onClick={handleOrder}
                  className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 transition shadow-lg active:scale-95"
                >
                  Confirmer la commande
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Marketplace;
