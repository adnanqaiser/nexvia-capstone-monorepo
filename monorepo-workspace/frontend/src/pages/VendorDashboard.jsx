import React, { useState } from 'react';
import api from '../services/api';

export default function VendorDashboard() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Hardware & Storage',
    stock: ''
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('stock', form.stock);
      if (file) {
        formData.append('image', file);
      }

      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setStatus('Product created successfully and synced to catalog!');
      setForm({ name: '', description: '', price: '', category: 'Hardware & Storage', stock: '' });
      setFile(null);
    } catch (err) {
      setStatus('Failed to upload product. ' + (err?.response?.data?.error || 'Check server connection.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Vendor Product Inventory Panel</h1>
      <p className="text-xs text-slate-400 mb-8">
        Add new inventory items with S3 multi-part binary upload middleware support.
      </p>

      {status && (
        <div className="mb-6 p-4 bg-indigo-950 border border-indigo-700 text-indigo-200 text-xs rounded-lg">
          {status}
        </div>
      )}

      <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-100"
                placeholder="e.g., Tactile Mechanical Keyboard"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-100"
              >
                <option value="Hardware & Storage">Hardware & Storage</option>
                <option value="Peripherals">Peripherals</option>
                <option value="Workspace Wellness">Workspace Wellness</option>
                <option value="Networking">Networking</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-100 h-24"
              placeholder="Provide product specifications..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-100"
                placeholder="149.50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Stock Quantity</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-slate-100"
                placeholder="50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Product Media Asset (S3 Direct Upload Pipeline)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-400"
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded text-sm transition"
          >
            {loading ? 'Processing S3 Direct Upload...' : 'Publish Product to Marketplace'}
          </button>
        </form>
      </div>
    </div>
  );
}
