import React, { useState, useEffect } from 'react';
import api from '../api';

function FarmerDashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [quantity, setQuantity] = useState('');
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
        sourceFarmerName: isHub ? sourceFarmerName : null
      });
      setName(''); setDescription(''); setPrice(''); setQuantity(''); setSourceFarmerName('');
      fetchMyProducts();
    } catch (error) { alert('Failed to add product'); }
  };

  return (
    <div>
      <h2>{isHub ? 'Hub Dashboard' : 'Farmer Dashboard'}</h2>
      <form onSubmit={handleAddProduct}>
        <h3>Add New Product</h3>
        {isHub && (
          <input
            placeholder="Origin Farmer Name"
            value={sourceFarmerName}
            onChange={(e) => setSourceFarmerName(e.target.value)}
            required
          />
        )}
        <input placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} required />
        <input placeholder="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        <button type="submit">Add Product</button>
      </form>
      <h3>Inventory</h3>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - {p.quantity} {p.unit} - ${p.price}/{p.unit}
            {p.sourceFarmerName && ` (From: ${p.sourceFarmerName})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default FarmerDashboard;
