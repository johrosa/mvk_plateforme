import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import Marketplace from './pages/Marketplace';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const logout = () => { localStorage.clear(); setUser(null); window.location.href='/login'; };

  return (
    <Router>
      <nav>
        {!user ? (<> <Link to="/login">Login</Link> | <Link to="/register">Register</Link> </>) : (<>
          {(user.role === 'FARMER' || user.role === 'HUB') ? <Link to="/farmer">Dashboard</Link> : <Link to="/marketplace">Marketplace</Link>}
          | <button onClick={logout}>Logout</button>
        </>)}
      </nav>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setUser(JSON.parse(localStorage.getItem('user')))} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/" element={<h2>Welcome</h2>} />
      </Routes>
    </Router>
  );
}
export default App;
