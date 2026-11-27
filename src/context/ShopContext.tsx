"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type {
  CarritoItemView,
  ProductoFavoritoView,
  ResultadoCarrito,
} from "@/actions/cart";
import {
  agregarAlCarrito,
  cambiarCantidad,
  obtenerCarrito,
  obtenerFavoritos,
  quitarDelCarrito,
  toggleFavorito,
} from "@/actions/cart";

type ProductReference = {
  id: string | number;
  minOrderQty?: number;
};

type ShopContextValue = {
  cart: CarritoItemView[];
  favorites: ProductoFavoritoView[];
  isLoading: boolean;
  loadError: string | null;
  refreshCart: () => Promise<CarritoItemView[]>;
  addToCart: (
    productOrId: string | ProductReference,
    requestedQuantity?: number,
  ) => Promise<ResultadoCarrito>;
  updateCartQuantity: (
    itemId: string,
    quantity: number,
  ) => Promise<ResultadoCarrito>;
  removeFromCart: (itemId: string) => Promise<ResultadoCarrito>;
  addToFavorites: (
    productOrId: string | ProductReference,
  ) => Promise<ResultadoCarrito & { isFavorite?: boolean }>;
};

const ShopContext = createContext<ShopContextValue | null>(null);

const failedResult = (error: string): ResultadoCarrito => ({
  success: false,
  error,
});

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CarritoItemView[]>([]);
  const [favorites, setFavorites] = useState<ProductoFavoritoView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refreshCart = async () => {
    const items = await obtenerCarrito();
    setCart(items);
    setLoadError(null);
    return items;
  };

  const refreshFavorites = async () => {
    const items = await obtenerFavoritos();
    setFavorites(items);
    setLoadError(null);
    return items;
  };

  useEffect(() => {
    let active = true;

    Promise.all([obtenerCarrito(), obtenerFavoritos()])
      .then(([cartItems, favoriteItems]) => {
        if (!active) return;
        setCart(cartItems);
        setFavorites(favoriteItems);
      })
      .catch(() => {
        if (active) setLoadError("No se pudieron cargar tus productos guardados.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const addToCart = async (
    productOrId: string | ProductReference,
    requestedQuantity?: number,
  ) => {
    const rawProductId =
      typeof productOrId === "string" ? productOrId : productOrId?.id;
    const productId = rawProductId === undefined ? "" : String(rawProductId);
    const quantity =
      requestedQuantity ??
      (typeof productOrId === "object"
        ? productOrId?.minOrderQty ?? 1
        : 1);

    if (!productId) {
      return failedResult("El producto seleccionado no tiene un identificador válido.");
    }

    const result = await agregarAlCarrito(productId, quantity);
    if (result.success) await refreshCart();
    return result;
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    const result = await cambiarCantidad(itemId, quantity);
    if (result.success) await refreshCart();
    return result;
  };

  const removeFromCart = async (itemId: string) => {
    const result = await quitarDelCarrito(itemId);
    if (result.success) await refreshCart();
    return result;
  };

  const addToFavorites = async (productOrId: string | ProductReference) => {
    const rawProductId =
      typeof productOrId === "string" ? productOrId : productOrId?.id;
    const productId = rawProductId === undefined ? "" : String(rawProductId);

    if (!productId) {
      return failedResult("El producto seleccionado no tiene un identificador válido.");
    }

    const result = await toggleFavorito(productId);
    if (result.success) await refreshFavorites();
    return result;
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        favorites,
        isLoading,
        loadError,
        refreshCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        addToFavorites,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop debe utilizarse dentro de ShopProvider.");
  }
  return context;
}
