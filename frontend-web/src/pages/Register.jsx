import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('RETAILER');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, password, name, role });
      alert('Inscription réussie !');
      navigate('/login');
    } catch (error) { alert("Échec de l'inscription"); }
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nom complet" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="RETAILER">Commerçant</option>
          <option value="FARMER">Paysan</option>
          <option value="HUB">Hub de collecte</option>
        </select>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}
export default Register;
