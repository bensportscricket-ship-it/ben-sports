import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { session, role, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between text-white">
      <Link to="/" className="text-xl font-black text-emerald-400 tracking-tight">
        BEN SPORTS
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
        <Link to="/tournaments" className="hover:text-emerald-400 transition-colors">Tournaments</Link>
        <Link to="/heroes" className="hover:text-emerald-400 transition-colors">Heroes</Link>
        <Link to="/gallery" className="hover:text-emerald-400 transition-colors">Gallery</Link>
        <Link to="/shop" className="hover:text-emerald-400 transition-colors">Shop</Link>
        <Link to="/register-team" className="hover:text-emerald-400 transition-colors">Register Team</Link>
        <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link>
        {(role === 'super_admin' || role === 'team_admin') && (
          <Link to="/score" className="hover:text-emerald-400 transition-colors">Live Scoring</Link>
        )}
        {role === 'super_admin' && (
          <Link to="/admin" className="hover:text-emerald-400 transition-colors">Admin</Link>
        )}
      </div>

      <div>
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline-block bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
              ⚡ {(role || 'member').toUpperCase().replace('_', ' ')}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-5 py-2 rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-500/10"
          >
            Login Portal
          </Link>
        )}
      </div>
    </nav>
  );
}
