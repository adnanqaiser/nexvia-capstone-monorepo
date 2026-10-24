import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800';

  return (
    <nav className="bg-slate-950 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Enterprise Multi-Benchmark
        </Link>

        {token && (
          <div className="flex space-x-2 text-sm font-medium">
            <Link to="/dashboard" className={`px-3 py-1.5 rounded-md transition ${isActive('/dashboard')}`}>
              🛒 Marketplace (FS-01)
            </Link>
            <Link to="/workspace" className={`px-3 py-1.5 rounded-md transition ${isActive('/workspace')}`}>
              📝 Workspace (FS-02)
            </Link>

            {(user.role === 'VENDOR' || user.role === 'ADMIN') && (
              <Link to="/vendor-dashboard" className={`px-3 py-1.5 rounded-md transition ${isActive('/vendor-dashboard')}`}>
                📦 Vendor Panel
              </Link>
            )}

            {user.role === 'ADMIN' && (
              <Link to="/admin-dashboard" className={`px-3 py-1.5 rounded-md transition ${isActive('/admin-dashboard')}`}>
                📊 Admin Financials
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {token ? (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-200">{user.name || 'User'}</p>
              <span className="text-[10px] bg-slate-800 text-indigo-400 px-2 py-0.5 rounded border border-slate-700">
                {user.role || 'GUEST'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs bg-red-950 text-red-300 border border-red-800 rounded-md hover:bg-red-900 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Link to="/login" className="px-3 py-1.5 text-xs bg-slate-800 text-slate-200 rounded-md hover:bg-slate-700">
              Sign In
            </Link>
            <Link to="/register" className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-500">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
