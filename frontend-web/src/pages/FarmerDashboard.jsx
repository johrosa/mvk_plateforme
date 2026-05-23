import React, { useState, useEffect } from 'react';
import api from '../api';

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
    const { data } = await api.get('/products');
    setProducts(data.filter(p => p.farmerId === user.id));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        name,
        description,
        price,
        unit,
        quantity,
        imageUrl,
        sourceFarmerName: isHub ? sourceFarmerName : null
      });
      setName(''); setDescription(''); setPrice(''); setQuantity(''); setSourceFarmerName(''); setImageUrl('');
      fetchMyProducts();
    } catch (error) { alert('Échec de l’ajout du produit'); }
  };

  return (
    <div>
      <h2>{isHub ? 'Tableau de Bord du Hub' : 'Tableau de Bord Paysan'}</h2>
      <form onSubmit={handleAddProduct}>
        <h3>Ajouter un Nouveau Produit</h3>
        {isHub && (
          <input
            placeholder="Nom du Paysan d'Origine"
            value={sourceFarmerName}
            onChange={(e) => setSourceFarmerName(e.target.value)}
            required
          />
        )}
        <input placeholder="Nom du Produit" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input placeholder="Prix" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input placeholder="Unité (ex: kg, sac)" value={unit} onChange={(e) => setUnit(e.target.value)} required />
        <input placeholder="Quantité" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        <input placeholder="URL de l'image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <button type="submit">Ajouter</button>
      </form>
      <h3>Inventaire</h3>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', verticalAlign: 'middle', marginRight: '10px' }} />}
            {p.name} - {p.quantity} {p.unit} - {p.price}€/{p.unit}
            {p.sourceFarmerName && ` (Origine: ${p.sourceFarmerName})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default FarmerDashboard;
