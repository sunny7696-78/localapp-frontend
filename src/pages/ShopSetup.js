import React, { useState, useEffect } from 'react';
import { shopAPI, productAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AREAS = ['Civil Lines','Model Town','Sarabha Nagar','Dugri','BRS Nagar','Gurdev Nagar','Focal Point','Jamalpur','Rahon Road','Ferozepur Road','Pakhowal Road','Ghumar Mandi'];
const CATEGORIES = ['kirana','pharmacy','bakery','electronics','clothing','other'];
const PRODUCT_CATS = ['fruits','vegetables','dairy','grains','snacks','beverages','household','personal_care','other'];

const ShopSetup = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('shop');
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [shopForm, setShopForm] = useState({ name:'', description:'', category:'kirana', address:{ street:'', area:'Civil Lines', city:'Ludhiana', pincode:'' }, phone:'', openTime:'09:00', closeTime:'21:00', minOrder:100, deliveryFee:20, deliveryRadius:5 });
  const [productForm, setProductForm] = useState({ name:'', price:'', mrp:'', category:'vegetables', unit:'kg', stock:10, description:'' });
  const [editProductId, setEditProductId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    shopAPI.getMy().then(r => { if(r.data){ setShop(r.data); setShopForm(r.data); } }).catch(()=>{});
    productAPI.getAll({}).then(r => setProducts(r.data.products||[])).catch(()=>{});
  }, []);

  const saveShop = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await shopAPI.update(shopForm);
      setShop(res.data);
      toast.success(shop ? 'Shop updated!' : 'Shop created!');
    } catch { toast.error('Error saving shop'); }
    finally { setSaving(false); }
  };

  const saveProduct = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = { ...productForm, price: Number(productForm.price), mrp: Number(productForm.mrp||0), stock: Number(productForm.stock) };
      if (editProductId) {
        await productAPI.update(editProductId, payload);
        setProducts(prev => prev.map(p => p._id===editProductId ? {...p,...payload} : p));
        toast.success('Product updated!');
        setEditProductId(null);
      } else {
        const res = await productAPI.create(payload);
        setProducts(prev => [res.data, ...prev]);
        toast.success('Product added!');
      }
      setProductForm({ name:'', price:'', mrp:'', category:'vegetables', unit:'kg', stock:10, description:'' });
    } catch { toast.error('Error saving product'); }
    finally { setSaving(false); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await productAPI.delete(id); setProducts(prev=>prev.filter(p=>p._id!==id)); toast.success('Deleted'); } catch { toast.error('Error'); }
  };

  const toggleShop = async () => {
    try { const r = await shopAPI.toggle(); setShop(prev=>({...prev,isOpen:r.data.isOpen})); toast.success(r.data.isOpen?'Shop is now OPEN':'Shop is now CLOSED'); } catch { toast.error('Error'); }
  };

  return (
    <div className="page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <h1 className="page-title" style={{marginBottom:0}}>🏪 My Shop</h1>
        {shop && (
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <span style={{fontWeight:600,color:shop.isOpen?'var(--green)':'var(--red)'}}>{shop.isOpen?'🟢 Open':'🔴 Closed'}</span>
            <button className="btn btn-sm" style={{background:shop.isOpen?'var(--red)':'var(--green)',color:'white'}} onClick={toggleShop}>
              {shop.isOpen?'Close Shop':'Open Shop'}
            </button>
          </div>
        )}
      </div>

      <div className="tabs">
        <button className={`tab ${tab==='shop'?'active':''}`} onClick={()=>setTab('shop')}>🏪 Shop Details</button>
        <button className={`tab ${tab==='products'?'active':''}`} onClick={()=>setTab('products')}>📦 Products ({products.length})</button>
        <button className={`tab ${tab==='add'?'active':''}`} onClick={()=>{setTab('add');setEditProductId(null);}}>➕ {editProductId?'Edit':'Add'} Product</button>
      </div>

      {tab==='shop' && (
        <div style={{maxWidth:640}}>
          {!shop && <div style={{background:'#fef3c7',border:'1px solid #f59e0b',borderRadius:10,padding:14,marginBottom:20,color:'#92400e',fontWeight:600}}>⚠️ Shop setup nahi hua — details fill karo!</div>}
          <div className="card card-body">
            <form onSubmit={saveShop}>
              <div className="form-group">
                <label className="form-label">Shop Name *</label>
                <input className="form-input" value={shopForm.name||''} onChange={e=>setShopForm({...shopForm,name:e.target.value})} required placeholder="e.g. Sharma Kirana Store"/>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" value={shopForm.description||''} onChange={e=>setShopForm({...shopForm,description:e.target.value})} placeholder="About your shop..."/>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input form-select" value={shopForm.category||'kirana'} onChange={e=>setShopForm({...shopForm,category:e.target.value})}>
                    {CATEGORIES.map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={shopForm.phone||''} onChange={e=>setShopForm({...shopForm,phone:e.target.value})} placeholder="98765XXXXX"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Street / House No.</label>
                  <input className="form-input" value={shopForm.address?.street||''} onChange={e=>setShopForm({...shopForm,address:{...shopForm.address,street:e.target.value}})} placeholder="H.No. 45, Street 3"/>
                </div>
                <div className="form-group">
                  <label className="form-label">Area</label>
                  <select className="form-input form-select" value={shopForm.address?.area||'Civil Lines'} onChange={e=>setShopForm({...shopForm,address:{...shopForm.address,area:e.target.value}})}>
                    {AREAS.map(a=><option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Open Time</label>
                  <input className="form-input" type="time" value={shopForm.openTime||'09:00'} onChange={e=>setShopForm({...shopForm,openTime:e.target.value})}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Close Time</label>
                  <input className="form-input" type="time" value={shopForm.closeTime||'21:00'} onChange={e=>setShopForm({...shopForm,closeTime:e.target.value})}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Min Order (₹)</label>
                  <input className="form-input" type="number" value={shopForm.minOrder||100} onChange={e=>setShopForm({...shopForm,minOrder:Number(e.target.value)})}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Fee (₹)</label>
                  <input className="form-input" type="number" value={shopForm.deliveryFee||20} onChange={e=>setShopForm({...shopForm,deliveryFee:Number(e.target.value)})}/>
                </div>
              </div>
              <button className="btn btn-primary btn-block" type="submit" disabled={saving}>{saving?'Saving...':shop?'Update Shop':'Save Shop'}</button>
            </form>
          </div>
        </div>
      )}

      {tab==='products' && (
        <div>
          {products.length===0 ? (
            <div className="empty"><div className="empty-icon">📦</div><h3>No products yet</h3><button className="btn btn-primary" onClick={()=>setTab('add')}>Add First Product</button></div>
          ) : (
            <div className="grid-4">
              {products.map(p=>(
                <div key={p._id} className="card">
                  <div style={{background:'linear-gradient(135deg,#f8f9fa,#e9ecef)',height:120,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem'}}>
                    {p.category==='dairy'?'🥛':p.category==='vegetables'?'🥦':p.category==='fruits'?'🍎':p.category==='grains'?'🌾':p.category==='snacks'?'🍿':p.category==='beverages'?'☕':'📦'}
                  </div>
                  <div style={{padding:12}}>
                    <div style={{fontWeight:700,fontSize:'0.9rem',marginBottom:4}}>{p.name}</div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                      <span style={{color:'var(--primary)',fontWeight:700}}>₹{p.price}</span>
                      <span className={`badge ${p.stock>0?'badge-green':'badge-red'}`} style={{fontSize:'0.7rem'}}>Stock: {p.stock}</span>
                    </div>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn-outline btn-sm" style={{flex:1}} onClick={()=>{setProductForm({name:p.name,price:p.price,mrp:p.mrp||'',category:p.category,unit:p.unit,stock:p.stock,description:p.description||''});setEditProductId(p._id);setTab('add');}}>Edit</button>
                      <button className="btn btn-sm" style={{background:'var(--red)',color:'white'}} onClick={()=>deleteProduct(p._id)}>🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab==='add' && (
        <div style={{maxWidth:560}}>
          <div className="card card-body">
            <h3 style={{marginBottom:20}}>{editProductId?'✏️ Edit Product':'➕ Add New Product'}</h3>
            <form onSubmit={saveProduct}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input className="form-input" value={productForm.name} onChange={e=>setProductForm({...productForm,name:e.target.value})} required placeholder="e.g. Amul Milk 1L"/>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" value={productForm.description} onChange={e=>setProductForm({...productForm,description:e.target.value})} placeholder="Optional..."/>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input form-select" value={productForm.category} onChange={e=>setProductForm({...productForm,category:e.target.value})}>
                    {PRODUCT_CATS.map(c=><option key={c} value={c}>{c.replace('_',' ')}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <select className="form-input form-select" value={productForm.unit} onChange={e=>setProductForm({...productForm,unit:e.target.value})}>
                    {['kg','litre','piece','pack','dozen','bundle','gram','ml'].map(u=><option key={u}>{u}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Selling Price (₹) *</label>
                  <input className="form-input" type="number" value={productForm.price} onChange={e=>setProductForm({...productForm,price:e.target.value})} required min="1"/>
                </div>
                <div className="form-group">
                  <label className="form-label">MRP (₹)</label>
                  <input className="form-input" type="number" value={productForm.mrp} onChange={e=>setProductForm({...productForm,mrp:e.target.value})} placeholder="Optional"/>
                </div>
                <div className="form-group" style={{gridColumn:'1/-1'}}>
                  <label className="form-label">Stock Quantity</label>
                  <input className="form-input" type="number" value={productForm.stock} onChange={e=>setProductForm({...productForm,stock:e.target.value})} min="0"/>
                </div>
              </div>
              <div style={{display:'flex',gap:10}}>
                <button className="btn btn-primary" type="submit" style={{flex:1}} disabled={saving}>{saving?'Saving...':editProductId?'Update':'Add Product'}</button>
                {editProductId && <button className="btn btn-outline" type="button" onClick={()=>{setEditProductId(null);setProductForm({name:'',price:'',mrp:'',category:'vegetables',unit:'kg',stock:10,description:''});setTab('products');}}>Cancel</button>}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopSetup;
