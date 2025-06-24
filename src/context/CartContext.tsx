'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type?: 'product' | 'service';
}

interface CartContextType {
  cartItems: CartItem[];
  selectedItems: string[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  removeSelectedItems: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setSelectedItems: (itemIds: string[]) => void;
  getSelectedCartItems: () => CartItem[];
  totalItems: number;
  totalPrice: number;
  selectedTotalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedSelected = localStorage.getItem('selectedCartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedSelected) {
      setSelectedItems(JSON.parse(savedSelected));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems));
  }, [selectedItems]);

  const addToCart = useCallback((item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    
    // Auto-select new items
    setSelectedItems(prev => {
      if (!prev.includes(item.id)) {
        return [...prev, item.id];
      }
      return prev;
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    setSelectedItems(prev => prev.filter(id => id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setSelectedItems([]);
  }, []);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const getSelectedCartItems = useCallback(() => {
    return cartItems.filter(item => selectedItems.includes(item.id));
  }, [cartItems, selectedItems]);

  const selectedTotalPrice = cartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  const removeSelectedItems = useCallback(() => {
    setCartItems(prevItems => prevItems.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  }, [selectedItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedItems,
        addToCart,
        removeFromCart,
        removeSelectedItems,
        updateQuantity,
        clearCart,
        setSelectedItems,
        getSelectedCartItems,
        totalItems,
        totalPrice,
        selectedTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 