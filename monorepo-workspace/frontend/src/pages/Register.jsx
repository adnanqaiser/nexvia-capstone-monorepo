import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-800/80 p-8 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center text-white mb-2">Create Identity Account</h2>
        <p className="text-xs text-center text-slate-400 mb-6">Join Multi-Vendor Platform & Workspace</p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 text-xs rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Assign System Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-100"
            >
              <option value="CUSTOMER">Customer / Enterprise Buyer</option>
              <option value="VENDOR">Vendor / Merchant Partner</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded text-sm transition"
          >
            {loading ? 'Creating...' : 'Register Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Already registered? <Link to="/login" className="text-indigo-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
