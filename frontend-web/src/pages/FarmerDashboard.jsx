import React, { useState, useEffect } from 'react';
import api from '../api';

function FarmerDashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [quantity, setQuantity] = useState('');

  useEffect(() => { fetchMyProducts(); }, []);

  const fetchMyProducts = async () => {
    const { data } = await api.get('/products');
    const user = JSON.parse(localStorage.getItem('user'));
    setProducts(data.filter(p => p.farmerId === user.id));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', { name, description, price, unit, quantity });
      setName(''); setDescription(''); setPrice(''); setQuantity('');
      fetchMyProducts();
    } catch (error) { alert('Failed to add product'); }
  };

  return (
    <div>
      <h2>Farmer Dashboard</h2>
      <form onSubmit={handleAddProduct}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} required />
        <input placeholder="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        <button type="submit">Add Product</button>
      </form>
      <h3>My Products</h3>
      <ul>
        {products.map(p => <li key={p.id}>{p.name} - {p.quantity} {p.unit} - ${p.price}/{p.unit}</li>)}
      </ul>
    </div>
  );
}
export default FarmerDashboard;
