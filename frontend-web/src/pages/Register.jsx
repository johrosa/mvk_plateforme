import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8">Créer un compte</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom ou Raison Sociale</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Ex: Ferme du Soleil"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vous êtes un(e) :</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
          >
            <option value="RETAILER">Commerçant</option>
            <option value="FARMER">Paysan</option>
            <option value="HUB">Hub de collecte</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md">
          S'inscrire
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Déjà un compte ? <Link to="/login" className="text-green-600 font-semibold hover:underline">Se connecter</Link>
      </p>
    </div>
  );
}
export default Register;
