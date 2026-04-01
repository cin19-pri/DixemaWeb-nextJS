"use client";

import Navbar from "../../componentes/Navbar";
import Footer from "../../componentes/Footer";
import { useShop } from "../../context/ShopContext";
import styles from "./favoritos.module.css";

export default function Favoritos() {
  const { favorites, addToFavorites, addToCart } = useShop();

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title}>Mis Favoritos</h1>

        {favorites.length === 0 ? (
          <div className={styles.empty}>No tienes productos en favoritos</div>
        ) : (
          <div className={styles.grid}>
            {favorites.map((prod: any) => (
              <div key={prod.id} className={styles.card}>
                <div className={styles.imageBox}>
                  <img src={prod.img} alt={prod.title} />
                </div>

                <div className={styles.info}>
                  <h3>{prod.title}</h3>

                  <span className={styles.price}>{prod.price}</span>

                  <div className={styles.actions}>
                    <button
                      className={styles.cartBtn}
                      onClick={() => addToCart(prod)}
                    >
                      Comprar
                    </button>

                    <button
                      className={styles.removeBtn}
                      onClick={() => addToFavorites(prod)}
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
