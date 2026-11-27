"use client";

import { useState } from "react";
import type { ProductoFavoritoView } from "@/actions/cart";
import Navbar from "../../componentes/Navbar";
import Image from "next/image";
import { useShop } from "../../context/ShopContext";
import styles from "./favoritos.module.css";

export default function Favoritos() {
  const { favorites, addToFavorites, addToCart } = useShop();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleBuy = async (product: ProductoFavoritoView) => {
    try {
      const result = await addToCart(product);
      setFeedback(result.success ? "Producto agregado al carrito." : result.error);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof error.digest === "string" &&
        error.digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }
      setFeedback("No se pudo agregar el producto al carrito.");
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const result = await addToFavorites(productId);
      setFeedback(result.success ? "Producto quitado de favoritos." : result.error);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof error.digest === "string" &&
        error.digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }
      setFeedback("No se pudo actualizar favoritos.");
    }
  };

  return (
    <div className={styles.page}>
      <Navbar onSearch={() => {}} />

      <div className={styles.container}>
        <h1 className={styles.title}>Mis Favoritos</h1>
        {feedback && (
          <p role="status" aria-live="polite">
            {feedback}
          </p>
        )}

        {favorites.length === 0 ? (
          <div className={styles.empty}>No tienes productos en favoritos</div>
        ) : (
          <div className={styles.grid}>
            {favorites.map((prod) => (
              <div key={prod.id} className={styles.card}>
                <div className={styles.imageBox}>
                  <Image
                    src={prod.img}
                    alt={prod.title}
                    width={400}
                    height={300}
                  />
                </div>

                <div className={styles.info}>
                  <h3>{prod.title}</h3>

                  <span className={styles.price}>{prod.price}</span>

                  <div className={styles.actions}>
                    <button
                      className={styles.cartBtn}
                      onClick={() => handleBuy(prod)}
                    >
                      Comprar
                    </button>

                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemove(prod.id)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
