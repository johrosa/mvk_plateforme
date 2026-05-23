import React, { useState, useEffect } from 'react';
import api from '../api';

function Marketplace() {
  const [products, setProducts] = useState([]);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const { data } = await api.get('/products');
    setProducts(data);
  };

  const handleOrder = async (productId) => {
    const qty = prompt('Quelle quantité ?', '1');
    if (!qty) return;
    try {
      await api.post('/orders', { productId, quantity: parseInt(qty) });
      alert('Commande passée avec succès !');
      fetchProducts();
    } catch (error) { alert('Échec de la commande'); }
  };

  return (
    <div>
      <h2>Marché</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '10px' }} />}
            <h3>{p.name}</h3>
            <p>Prix: {p.price}€/{p.unit} | Disponible: {p.quantity}</p>
            <p>Vendeur: {p.farmer?.name} {p.sourceFarmerName ? `(Origine: ${p.sourceFarmerName})` : ''}</p>
            <button onClick={() => handleOrder(p.id)}>Commander</button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Marketplace;
