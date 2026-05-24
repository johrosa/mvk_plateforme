import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import Marketplace from './pages/Marketplace';
import AdminDashboard from './pages/AdminDashboard';
import { LogOut, Home, LayoutDashboard, ShoppingCart, ShieldCheck } from 'lucide-react';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const logout = () => { localStorage.clear(); setUser(null); window.location.href='/login'; };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
                  <Home size={24} />
                  <span>MVK Plateforme</span>
                </Link>
              </div>
              <div className="flex items-center gap-6">
                {!user ? (
                  <>
                    <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium">Connexion</Link>
                    <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Inscription</Link>
                  </>
                ) : (
                  <>
                    {user.role === 'ADMIN' && (
                      <Link to="/admin" className="text-gray-600 hover:text-green-600 font-medium flex items-center gap-1">
                        <ShieldCheck size={20} />
                        Admin
                      </Link>
                    )}
                    {(user.role === 'FARMER' || user.role === 'HUB') ? (
                      <Link to="/farmer" className="text-gray-600 hover:text-green-600 font-medium flex items-center gap-1">
                        <LayoutDashboard size={20} />
                        Tableau de Bord
                      </Link>
                    ) : user.role === 'RETAILER' ? (
                      <Link to="/marketplace" className="text-gray-600 hover:text-green-600 font-medium flex items-center gap-1">
                        <ShoppingCart size={20} />
                        Marché
                      </Link>
                    ) : null}
                    <button onClick={logout} className="text-gray-600 hover:text-red-600 flex items-center gap-1">
                      <LogOut size={20} />
                      Déconnexion
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<Login onLogin={() => setUser(JSON.parse(localStorage.getItem('user')))} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/farmer" element={<FarmerDashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/" element={
              <div className="text-center py-20">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Connecter les paysans aux commerçants</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                  Une plateforme solidaire pour favoriser les circuits courts et soutenir l'agriculture locale.
                </p>
                <div className="flex justify-center gap-4">
                  <Link to="/register" className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition shadow-lg">Commencer</Link>
                  <Link to="/marketplace" className="bg-white text-green-600 border border-green-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-green-50 transition">Voir le marché</Link>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;
