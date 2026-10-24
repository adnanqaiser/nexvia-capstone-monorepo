import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (product) => {
    try {
      const res = await api.post('/orders', {
        items: [{ productId: product.id, quantity: 1, price: product.price }],
        totalAmount: product.price
      });
      setNotice(`Order logged! ID: ${res.data.order.id} | Platform Fee (10%): $${res.data.order.platformFee}`);
      setCartCount(prev => prev + 1);
      setTimeout(() => setNotice(''), 6000);
    } catch (err) {
      setNotice('Transaction failed. Make sure backend is running.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Project 1 (FS-01): Multi-Vendor E-Commerce Marketplace</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-tenant catalog with resilient database failover simulation fallback checks.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
          <span className="text-xs text-slate-300">Active Cart Orders:</span>
          <span className="bg-indigo-600 text-white font-bold text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
        </div>
      </div>

      {notice && (
        <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs rounded-lg flex justify-between items-center">
          <span>{notice}</span>
          <button onClick={() => setNotice('')} className="text-emerald-400 font-bold">✕</button>
        </div>
      )}

      {/* Grid Layout */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 animate-pulse">Loading product cluster items...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-slate-800/60 rounded-xl border border-slate-700/70 overflow-hidden flex flex-col justify-between hover:border-indigo-500/50 transition">
              <div>
                <div className="h-48 bg-slate-950 overflow-hidden relative">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop'}
                    alt={item.name}
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-slate-900/90 text-indigo-400 text-[10px] font-semibold px-2 py-1 rounded border border-slate-700">
                    {item.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-slate-100 text-base mb-1">{item.name}</h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Vendor: <strong className="text-slate-200">{item.vendorName || 'Apex Tech'}</strong></span>
                    <span>Stock: <strong className="text-slate-200">{item.stock}</strong></span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-700/40">
                <span className="text-lg font-bold text-emerald-400">${item.price.toFixed(2)}</span>
                <button
                  onClick={() => handleCheckout(item)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
                >
                  Checkout (10% Fee)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
