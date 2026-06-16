import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Grocery from './pages/Grocery';
import Food from './pages/Food';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';
import RideMap from './pages/RideMap';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import DriverDashboard from './pages/DriverDashboard';
import VendorDashboard from './pages/VendorDashboard';
import ShopSetup from './pages/ShopSetup';
import Notifications from './pages/Notifications';
import Wallet from './pages/Wallet';
import SavedAddresses from './pages/SavedAddresses';
import EarningsDriver from './pages/EarningsDriver';
import Referral from './pages/Referral';
import PromoAdmin from './pages/PromoAdmin';
import './index.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader"><div className="spinner"/></div>;
  return user ? children : <Navigate to="/login" />;
};
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader"><div className="spinner"/></div>;
  return user?.role === 'admin' ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
  const { user } = useAuth();
  const HomeComponent = () => {
    if (user?.role === 'driver') return <Navigate to="/driver" />;
    if (user?.role === 'vendor') return <Navigate to="/vendor" />;
    return <Home />;
  };
  return (
    <><Navbar />
    <Routes>
      <Route path="/" element={<HomeComponent />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/grocery" element={<PrivateRoute><Grocery /></PrivateRoute>} />
      <Route path="/food" element={<PrivateRoute><Food /></PrivateRoute>} />
      <Route path="/food/:id" element={<PrivateRoute><RestaurantDetail /></PrivateRoute>} />
      <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
      <Route path="/orders/:id" element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
      <Route path="/ride" element={<PrivateRoute><RideMap /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
      <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
      <Route path="/addresses" element={<PrivateRoute><SavedAddresses /></PrivateRoute>} />
      <Route path="/referral" element={<PrivateRoute><Referral /></PrivateRoute>} />
      <Route path="/earnings" element={<PrivateRoute><EarningsDriver /></PrivateRoute>} />
      <Route path="/driver" element={<PrivateRoute><DriverDashboard /></PrivateRoute>} />
      <Route path="/vendor" element={<PrivateRoute><VendorDashboard /></PrivateRoute>} />
      <Route path="/shop" element={<PrivateRoute><ShopSetup /></PrivateRoute>} />
      <Route path="/promos" element={<AdminRoute><PromoAdmin /></AdminRoute>} />
      <Route path="/admin/*" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes></>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider><CartProvider>
      <Toaster position="top-center" toastOptions={{ duration: 2500, style: { borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem' } }} />
      <AppRoutes />
    </CartProvider></AuthProvider>
  </BrowserRouter>
);

export default App;
