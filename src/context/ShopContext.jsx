"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Cargar historial y favoritos al iniciar
  useEffect(() => {
    const savedHistory = localStorage.getItem("purchaseHistory");
    const savedFavorites = localStorage.getItem("favorites");

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Guardar historial
  useEffect(() => {
    localStorage.setItem("purchaseHistory", JSON.stringify(history));
  }, [history]);

  // ⭐ Guardar favoritos
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // ⭐ AGREGAR / QUITAR FAVORITOS
  const addToFavorites = (product) => {
    const exists = favorites.find((p) => p.id === product.id);

    if (exists) {
      setFavorites(favorites.filter((p) => p.id !== product.id));
    } else {
      setFavorites([...favorites, product]);
    }
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
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        checkout,
        history,
        favorites,
        addToFavorites,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);