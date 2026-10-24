import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('admin@corporate.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed. Verify server is running on port 6000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-800/80 p-8 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center text-white mb-2">Corporate Portal Access</h2>
        <p className="text-xs text-center text-slate-400 mb-6">Select or enter benchmark user credentials</p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 text-xs rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded text-sm transition shadow-lg shadow-indigo-600/30"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-400">
          <p className="font-semibold mb-2">Quick Preset Roles:</p>
          <div className="flex justify-between gap-2">
            <button
              onClick={() => { setEmail('admin@corporate.com'); setPassword('admin123'); }}
              className="flex-1 bg-slate-900 hover:bg-slate-700 py-1.5 rounded text-[11px] border border-slate-700 text-indigo-300"
            >
              Admin
            </button>
            <button
              onClick={() => { setEmail('vendor@corporate.com'); setPassword('vendor123'); }}
              className="flex-1 bg-slate-900 hover:bg-slate-700 py-1.5 rounded text-[11px] border border-slate-700 text-emerald-300"
            >
              Vendor
            </button>
            <button
              onClick={() => { setEmail('customer@corporate.com'); setPassword('customer123'); }}
              className="flex-1 bg-slate-900 hover:bg-slate-700 py-1.5 rounded text-[11px] border border-slate-700 text-cyan-300"
            >
              Customer
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Need an account? <Link to="/register" className="text-indigo-400 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}
