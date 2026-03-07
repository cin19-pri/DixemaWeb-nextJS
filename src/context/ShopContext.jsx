"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);

  // cargar historial guardado
  useEffect(() => {
    const savedHistory = localStorage.getItem("purchaseHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // guardar historial
  useEffect(() => {
    localStorage.setItem("purchaseHistory", JSON.stringify(history));
  }, [history]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const checkout = () => {
    if (cart.length === 0) return;

    const purchase = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      items: cart,
    };

    setHistory([purchase, ...history]);
    setCart([]);
  };

  return (
    <ShopContext.Provider value={{ cart, addToCart, checkout, history }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
