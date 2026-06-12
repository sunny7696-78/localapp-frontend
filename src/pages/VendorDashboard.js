import React, { useState, useEffect } from 'react';
import { productAPI, orderAPI, restaurantAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['fruits', 'vegetables', 'dairy', 'grains', 'snacks', 'beverages', 'household', 'personal_care', 'other'];

const VendorDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', mrp: '', category: 'vegetables', unit: 'kg', stock: 10, description: '' });
  const [editId, setEditId] = useState(null);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0 });

  useEffect(() => {
    productAPI.getAll({}).then(r => {
      const mine = r.data.products || [];
      setProducts(mine);
      setStats(s => ({ ...s, products: mine.length }));
    }).catch(() => {});
    orderAPI.myOrders().then(r => {
      setOrders(r.data || []);
      const revenue = (r.data || []).filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
      setStats(s => ({ ...s, orders: r.data.length, revenue }));
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), mrp: Number(form.mrp), stock: Number(form.stock) };
      if (editId) {
        await productAPI.update(editId, payload);
        setProducts(prev => prev.map(p => p._id === editId ? { ...p, ...payload } : p));
        toast.success('Product updated!');
        setEditId(null);
      } else {
        const res = await productAPI.create(payload);
        setProducts(prev => [res.data, ...prev]);
        toast.success('Product added!');
      }
      setForm({ name: '', price: '', mrp: '', category: 'vegetables', unit: 'kg', stock: 10, description: '' });
    } catch {
      toast.error('Error saving product');
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, price: p.price, mrp: p.mrp || '', category: p.category, unit: p.unit, stock: p.stock, description: p.description || '' });
    setEditId(p._id);
    setTab('add');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await productAPI.delete(id); } catch {}
    setProducts(prev => prev.filter(p => p._id !== id));
    toast.success('Product deleted');
  };

  const handleOrderStatus = async (id, status) => {
    try { await orderAPI.updateStatus(id, status); } catch {}
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    toast.success(`Order ${status}`);
  };

  const STATUS_BADGE = { pending: 'badge-yellow', accepted: 'badge-blue', preparing: 'badge-orange', picked_up: 'badge-orange', delivered: 'badge-green', cancelled: 'badge-red' };

  return (
    <div className="page">
      <h1 className="page-title">🏪 Vendor Dashboard</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Welcome, {user?.name}</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '🛒', label: 'My Products', value: stats.products },
          { icon: '📦', label: 'Total Orders', value: stats.orders },
          { icon: '💰', label: 'Revenue', value: `₹${stats.revenue}` },
        ].map(s => (
          <div key={s.label} className="card card-body" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem' }}>{s.icon}</div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary)' }}>{s.value}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'products' ? 'active' : ''}`} onClick={() => { setTab('products'); setEditId(null); }}>📦 My Products</button>
        <button className={`tab ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>{editId ? '✏️ Edit Product' : '➕ Add Product'}</button>
        <button className={`tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>📋 Orders</button>
      </div>

      {tab === 'products' && (
        <div>
          {products.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📦</div>
              <h3>No products yet</h3>
              <button className="btn btn-primary" onClick={() => setTab('add')}>Add First Product</button>
            </div>
          ) : (
            <div className="card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)' }}>
                    {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: '12px 16px' }}><span className="badge badge-blue">{p.category}</span></td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{p.price}</span>
                        {p.mrp && <span style={{ color: 'var(--muted)', textDecoration: 'line-through', fontSize: '0.8rem', marginLeft: 6 }}>₹{p.mrp}</span>}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ color: p.stock < 5 ? 'var(--red)' : 'var(--text)', fontWeight: 600 }}>{p.stock}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${p.isAvailable ? 'badge-green' : 'badge-red'}`}>{p.isAvailable ? 'Active' : 'Off'}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                          <button className="btn btn-sm" style={{ background: 'var(--red)', color: 'white' }} onClick={() => handleDelete(p._id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'add' && (
        <div className="card card-body" style={{ maxWidth: 600 }}>
          <h3 style={{ marginBottom: 20 }}>{editId ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Toor Dal 1kg" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description..." />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-input form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Unit</label>
                <select className="form-input form-select" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                  {['kg', 'litre', 'piece', 'pack', 'dozen', 'bundle', 'gram', 'ml'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Selling Price (₹) *</label>
                <input className="form-input" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">MRP (₹)</label>
                <input className="form-input" type="number" value={form.mrp} onChange={e => setForm({ ...form, mrp: e.target.value })} placeholder="Optional" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Stock Quantity</label>
                <input className="form-input" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} min="0" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" type="submit" style={{ flex: 1 }}>
                {editId ? 'Update Product' : 'Add Product'}
              </button>
              {editId && (
                <button className="btn btn-outline" type="button" onClick={() => { setEditId(null); setForm({ name: '', price: '', mrp: '', category: 'vegetables', unit: 'kg', stock: 10, description: '' }); setTab('products'); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📋</div>
              <h3>No orders yet</h3>
            </div>
          ) : (
            orders.map(o => (
              <div key={o._id} className="card card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700 }}>#{o._id.slice(-6).toUpperCase()} · {o.type}</span>
                  <span className={`badge ${STATUS_BADGE[o.status] || 'badge-blue'}`}>{o.status}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 8 }}>
                  {o.items?.map(i => `${i.name} ×${i.quantity}`).join(' · ')}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{o.total}</span>
                  {o.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-green btn-sm" onClick={() => handleOrderStatus(o._id, 'accepted')}>Accept</button>
                      <button className="btn btn-sm" style={{ background: 'var(--red)', color: 'white' }} onClick={() => handleOrderStatus(o._id, 'cancelled')}>Reject</button>
                    </div>
                  )}
                  {o.status === 'accepted' && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleOrderStatus(o._id, 'preparing')}>Start Preparing</button>
                  )}
                  {o.status === 'preparing' && (
                    <button className="btn btn-green btn-sm" onClick={() => handleOrderStatus(o._id, 'picked_up')}>Ready for Pickup</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
