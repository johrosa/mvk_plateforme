import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (onLogin) onLogin();
      if (data.user.role === 'FARMER' || data.user.role === 'HUB') navigate('/farmer');
      else navigate('/marketplace');
    } catch (error) {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8">Connexion</h2>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
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
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md">
          Se connecter
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Pas encore de compte ? <Link to="/register" className="text-green-600 font-semibold hover:underline">S'inscrire</Link>
      </p>
    </div>
  );
}
export default Login;
