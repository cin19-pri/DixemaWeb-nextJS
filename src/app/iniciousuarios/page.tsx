"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../componentes/Navbar";
import Footer from "../../componentes/Footer";
import { products, categories } from "../../datac/products";
import styles from "./iniciousuarios.module.css";
import { useShop } from "../../context/ShopContext";
import { useRouter } from "next/navigation";

export default function iniciousuarios() {
  const router = useRouter();

  const { addToCart, checkout } = useShop();

  // ESTADOS
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todo");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  // FILTRO DE PRODUCTOS
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todo" || prod.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // CERRAR TARJETA AUTOMÁTICAMENTE
  useEffect(() => {
    if (activeCardId) {
      const timer = setTimeout(() => setActiveCardId(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [activeCardId]);

  return (
    <div className={styles.homeWrapper}>
      {/* NAVBAR */}
      <Navbar onSearch={setSearchTerm} />

      {/* PUBLICIDAD */}
      <div className={styles.wrapper}>
        <div
          className={styles.inner}
          style={{ "--quantity": 14 } as React.CSSProperties}
        >
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className={styles.card}
              style={
                {
                  "--index": i,
                  "--color-card": "142, 249, 252",
                } as React.CSSProperties
              }
            >
              <div className={styles.img}>
                <img src={`/img/pub${(i % 4) + 1}.png`} alt="Publicidad" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIAS */}
      <div className={styles.productCategoryContainer}>
        <span className={styles.sectionCategoryText}>Categorías</span>

        <div className={styles.productCategoryWrapper}>
          {categories.slice(0, 5).map((cat, index) => (
            <div
              key={index}
              className={styles.productCategory}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <div className={styles.productCategoryImageSection}>
                <img src={cat.img} alt={cat.name} />
              </div>

              <div className={styles.productCategoryDescSection}>
                <span className={styles.productCategoryType}>{cat.name}</span>
                <span className={styles.productCategoryNumber}>
                  {cat.items}
                </span>
              </div>
            </div>
          ))}

          {/* BOTON TODO */}
          <div
            className={styles.productCategory}
            onClick={() => router.push("/categorias")}
          >
            <div className={styles.productCategoryImageSection}>
              <img src="/img/cuadernos.png" alt="Todo" />
            </div>

            <div className={styles.productCategoryDescSection}>
              <span className={styles.productCategoryType}>Todo</span>
              <span className={styles.productCategoryNumber}>Ver todas</span>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTOS */}
      <section className={styles.products}>
        <span className={styles.sectionCategoryText}>Productos</span>

        <div className={styles.productsGrid}>
          {filteredProducts.map((prod: any) => (
            <div
              key={prod.id}
              className={`${styles.pCard} ${
                activeCardId === prod.id ? styles.isOpen : ""
              }`}
              onClick={() => setActiveCardId(prod.id)}
            >
              <div className={styles.pCardImage}>
                <img src={prod.img} alt={prod.title} />
              </div>

              <div className={styles.pCardContent}>
                <div className={styles.pCardTop}>
                  <h3 className={styles.pCardTitle}>{prod.title}</h3>
                </div>

                <div className={styles.cardActions}>
                  <button
                    className={`${styles.btn} ${styles.details}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(prod);
                      setIsModalOpen(true);
                    }}
                  >
                    Ver detalles
                  </button>
                </div>

                <div className={styles.pCardFooter}>
                  <span className={styles.pCardPrice}>{prod.price}</span>
                  <div className={styles.pCardButton}>
                    <i className="bx bx-heart"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL PRODUCTO */}
      {isModalOpen && selectedProduct && (
        <div
          className={`${styles.modalOverlay} ${styles.active}`}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={styles.pillModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.btnClosePill}
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>

            {/* GALERÍA */}
            <div className={styles.modalGallery}>
              {selectedProduct.gallery.map((img, index) => (
                <img key={index} src={img} alt={selectedProduct.title} />
              ))}
            </div>

            {/* INFO */}
            <div className={styles.modalInfo}>
              <span className={styles.available}>DISPONIBLE</span>

              <h2>{selectedProduct.title}</h2>

              <p>{selectedProduct.description}</p>

              <div>
                {selectedProduct.specs.map((spec, index) => (
                  <div key={index} className={styles.specPill}>
                    {spec}
                  </div>
                ))}
              </div>

              <h3>{selectedProduct.price}</h3>

              <button
                className={`${styles.btnp} ${styles.detailsp}`}
                onClick={() => addToCart(selectedProduct)}
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
