import React, { useState, useEffect } from 'react';
import api from '../api';
import { PlusCircle, Package, User, Euro, Box } from 'lucide-react';

function FarmerDashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [quantity, setQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sourceFarmerName, setSourceFarmerName] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const isHub = user?.role === 'HUB';

  useEffect(() => { fetchMyProducts(); }, []);

  const fetchMyProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.filter(p => p.farmerId === user.id));
    } catch (err) { console.error(err); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        name, description, price, unit, quantity, imageUrl,
        sourceFarmerName: isHub ? sourceFarmerName : null
      });
      setName(''); setDescription(''); setPrice(''); setQuantity(''); setSourceFarmerName(''); setImageUrl('');
      fetchMyProducts();
      alert('Produit ajouté !');
    } catch (error) { alert('Échec de l’ajout'); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-green-700">
            <PlusCircle size={24} />
            Ajouter un Produit
          </h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            {isHub && (
              <div className="bg-blue-50 p-3 rounded-xl mb-4">
                <label className="text-xs font-semibold text-blue-700 uppercase">Paysan d'origine</label>
                <input
                  placeholder="Nom du paysan"
                  className="w-full bg-transparent border-b border-blue-200 focus:border-blue-500 outline-none py-1"
                  value={sourceFarmerName}
                  onChange={(e) => setSourceFarmerName(e.target.value)}
                  required
                />
              </div>
            )}
            <input placeholder="Nom du produit" className="w-full px-4 py-2 border rounded-xl" value={name} onChange={(e) => setName(e.target.value)} required />
            <textarea placeholder="Description" className="w-full px-4 py-2 border rounded-xl" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Prix (€)" type="number" step="0.01" className="w-full px-4 py-2 border rounded-xl" value={price} onChange={(e) => setPrice(e.target.value)} required />
              <input placeholder="Unité (kg, sac...)" className="w-full px-4 py-2 border rounded-xl" value={unit} onChange={(e) => setUnit(e.target.value)} required />
            </div>
            <input placeholder="Quantité" type="number" className="w-full px-4 py-2 border rounded-xl" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            <input placeholder="URL de l'image" className="w-full px-4 py-2 border rounded-xl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
              Enregistrer le produit
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package size={28} className="text-green-600" />
          Votre Inventaire
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition">
              <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><Box size={32} /></div>}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{p.name}</h3>
                <div className="text-sm text-gray-600 space-y-1 mt-1">
                  <p className="flex items-center gap-1"><Euro size={14} /> {p.price}€ / {p.unit}</p>
                  <p className="flex items-center gap-1"><Box size={14} /> Stock: {p.quantity} {p.unit}</p>
                  {p.sourceFarmerName && <p className="flex items-center gap-1 text-blue-600 font-medium"><User size={14} /> Origine: {p.sourceFarmerName}</p>}
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && <div className="col-span-2 text-center py-12 text-gray-400 italic bg-white rounded-2xl border-2 border-dashed">Aucun produit pour le moment.</div>}
        </div>
      </div>
    </div>
  );
}
export default FarmerDashboard;
