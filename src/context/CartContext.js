import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartType, setCartType] = useState(null); // 'grocery' or 'food'
  const [restaurantId, setRestaurantId] = useState(null);

  const addToCart = (item, type, restId = null) => {
    if (cartType && cartType !== type) {
      if (!window.confirm('Changing order type will clear your cart. Continue?')) return;
      setCartItems([]);
    }
    setCartType(type);
    if (restId) setRestaurantId(restId);

    setCartItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) return prev.map(i => i._id === item._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const updated = prev.map(i => i._id === itemId ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0);
      if (updated.length === 0) { setCartType(null); setRestaurantId(null); }
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCartType(null);
    setRestaurantId(null);
  };

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartType, restaurantId, addToCart, removeFromCart, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
