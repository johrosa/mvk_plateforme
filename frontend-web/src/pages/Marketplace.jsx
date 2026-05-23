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
    const qty = prompt('How many?', '1');
    if (!qty) return;
    try {
      await api.post('/orders', { productId, quantity: parseInt(qty) });
      alert('Order placed!');
      fetchProducts();
    } catch (error) { alert('Order failed'); }
  };

  return (
    <div>
      <h2>Marketplace</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {products.map(p => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <h3>{p.name}</h3>
            <p>Price: ${p.price}/{p.unit} | Available: {p.quantity}</p>
            <button onClick={() => handleOrder(p.id)}>Order</button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Marketplace;
