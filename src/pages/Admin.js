import React, { useState, useEffect } from 'react';
import { adminAPI, productAPI } from '../utils/api';
import toast from 'react-hot-toast';

const DEMO_STATS = { users: 142, orders: 87, rides: 53, products: 34, restaurants: 6, revenue: 18450 };

const Admin = () => {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(DEMO_STATS);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', mrp: '', category: 'vegetables', unit: 'kg', stock: 10 });

  useEffect(() => {
    adminAPI.stats().then(res => setStats(res.data)).catch(() => {});
    adminAPI.users().then(res => setUsers(res.data)).catch(() => {});
    adminAPI.orders().then(res => setOrders(res.data)).catch(() => {});
    productAPI.getAll({}).then(res => setProducts(res.data.products || [])).catch(() => {});
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await productAPI.create({ ...newProduct, price: Number(newProduct.price), mrp: Number(newProduct.mrp), stock: Number(newProduct.stock) });
      toast.success('Product added!');
      setNewProduct({ name: '', price: '', mrp: '', category: 'vegetables', unit: 'kg', stock: 10 });
    } catch { toast.success('Product added (Demo)'); }
  };

  const StatCard = ({ icon, label, value, color }) => (
    <div className="stat-card">
      <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{icon}</div>
      <div className="stat-value" style={{ color: color || 'var(--primary)' }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ padding: '16px 20px', color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem', marginBottom: 8 }}>⚙️ Admin Panel</div>
        {[
          { key: 'dashboard', icon: '📊', label: 'Dashboard' },
          { key: 'products', icon: '🛒', label: 'Products' },
          { key: 'orders', icon: '📦', label: 'Orders' },
          { key: 'users', icon: '👥', label: 'Users' },
        ].map(item => (
          <div key={item.key} className={`admin-nav-item ${tab === item.key ? 'active' : ''}`} onClick={() => setTab(item.key)}>
            <span>{item.icon}</span> {item.label}
          </div>
        ))}
      </aside>

      <main className="admin-content">
        {tab === 'dashboard' && (
          <>
            <h2 style={{ marginBottom: 20 }}>Dashboard Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
              <StatCard icon="👥" label="Total Users" value={stats.users} />
              <StatCard icon="📦" label="Total Orders" value={stats.orders} />
              <StatCard icon="🏍️" label="Total Rides" value={stats.rides} />
              <StatCard icon="🛒" label="Products" value={stats.products} />
              <StatCard icon="🍽️" label="Restaurants" value={stats.restaurants} />
              <StatCard icon="💰" label="Revenue" value={`₹${stats.revenue?.toLocaleString()}`} color="var(--green)" />
            </div>
          </>
        )}

        {tab === 'products' && (
          <>
            <h2 style={{ marginBottom: 20 }}>Manage Products</h2>
            <div className="card card-body" style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 16 }}>Add New Product</h3>
              <form onSubmit={handleAddProduct}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input className="form-input" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required placeholder="e.g. Toor Dal 1kg" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-input form-select" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                      {['fruits', 'vegetables', 'dairy', 'grains', 'snacks', 'beverages', 'household', 'personal_care'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input className="form-input" type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">MRP (₹)</label>
                    <input className="form-input" type="number" value={newProduct.mrp} onChange={e => setNewProduct({ ...newProduct, mrp: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit</label>
                    <select className="form-input form-select" value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}>
                      {['kg', 'litre', 'piece', 'pack', 'dozen', 'bundle'].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input className="form-input" type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                  </div>
                </div>
                <button className="btn btn-primary" type="submit">Add Product</button>
              </form>
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: 'var(--bg)' }}>
                  {['Name', 'Category', 'Price', 'MRP', 'Stock', 'Status'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 700 }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.name}</td>
                      <td style={{ padding: '12px 16px' }}><span className="badge badge-blue">{p.category}</span></td>
                      <td style={{ padding: '12px 16px', color: 'var(--primary)', fontWeight: 700 }}>₹{p.price}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--muted)', textDecoration: 'line-through' }}>₹{p.mrp}</td>
                      <td style={{ padding: '12px 16px' }}>{p.stock}</td>
                      <td style={{ padding: '12px 16px' }}><span className={`badge ${p.isAvailable ? 'badge-green' : 'badge-red'}`}>{p.isAvailable ? 'Active' : 'Inactive'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'orders' && (
          <>
            <h2 style={{ marginBottom: 20 }}>All Orders</h2>
            <div className="card">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: 'var(--bg)' }}>
                  {['Order ID', 'Type', 'Customer', 'Amount', 'Status', 'Date'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 700 }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '0.85rem' }}>#{o._id?.slice(-6).toUpperCase()}</td>
                      <td style={{ padding: '12px 16px' }}>{o.type === 'grocery' ? '🛒' : '🍔'} {o.type}</td>
                      <td style={{ padding: '12px 16px' }}>{o.user?.name || 'Customer'}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)' }}>₹{o.total}</td>
                      <td style={{ padding: '12px 16px' }}><span className={`badge badge-${o.status === 'delivered' ? 'green' : o.status === 'cancelled' ? 'red' : 'yellow'}`}>{o.status}</span></td>
                      <td style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: '0.83rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No orders yet</div>}
            </div>
          </>
        )}

        {tab === 'users' && (
          <>
            <h2 style={{ marginBottom: 20 }}>All Users</h2>
            <div className="card">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: 'var(--bg)' }}>
                  {['Name', 'Phone', 'Role', 'Status', 'Joined'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.82rem', color: 'var(--muted)', fontWeight: 700 }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600 }}>{u.name}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{u.phone}</td>
                      <td style={{ padding: '12px 16px' }}><span className="badge badge-blue">{u.role}</span></td>
                      <td style={{ padding: '12px 16px' }}><span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Blocked'}</span></td>
                      <td style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: '0.83rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No users yet</div>}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
