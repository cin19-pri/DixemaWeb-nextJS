"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/componentes/Navbar";
import styles from "./categorias.module.css";
import { useShop } from "@/context/ShopContext";

export type ProductoCatalogo = {
  id: string;
  title: string;
  price: string;
  img: string;
  category: string;
  description: string;
  gallery: string[];
  specs: string[];
  stock: number;
  wholesaleTiers: {
    id: string;
    minQuantity: number;
    maxQuantity: number | null;
    unitPrice: number;
  }[];
  minOrderQty: number;
};

export type CategoriaCatalogo = {
  id: string;
  name: string;
  items: number;
  img: string;
};

type Props = {
  products: ProductoCatalogo[];
  categories: CategoriaCatalogo[];
};

export default function CategoriasClient({ products, categories }: Props) {
  const { addToFavorites, addToCart, favorites } = useShop();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todo");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductoCatalogo | null>(
    products[0] ?? null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    if (selectedProduct && selectedProduct.gallery.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % selectedProduct.gallery.length);
    }
  };

  const prevImage = () => {
    if (selectedProduct && selectedProduct.gallery.length > 0) {
      setCurrentIndex((prev) =>
        prev === 0 ? selectedProduct.gallery.length - 1 : prev - 1,
      );
    }
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todo" || prod.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleToggleFavorite = async (productId: string) => {
    setActionMessage(null);
    try {
      const result = await addToFavorites(productId);
      setActionMessage(
        result.success ? "Favorito actualizado." : result.error,
      );
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
      setActionMessage("No se pudo actualizar favoritos.");
    }
  };

  const handleBuyProduct = async () => {
    if (!selectedProduct) return;

    setIsAddingToCart(true);
    setActionMessage(null);
    try {
      const result = await addToCart(
        selectedProduct.id,
        selectedProduct.minOrderQty,
      );
      if (!result.success) {
        setActionMessage(result.error);
        return;
      }
      setActionMessage("Producto agregado al carrito.");
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
      setActionMessage("No se pudo agregar el producto al carrito.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  useEffect(() => {
    if (activeCardId) {
      const timer = setTimeout(() => setActiveCardId(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [activeCardId]);

  return (
    <div className={styles.homeWrapper}>
      <Navbar onSearch={setSearchTerm} />

      {/* CATEGORIAS */}
      <div className={styles.productCategoryContainer}>
        <span className={styles.sectionCategoryText}>Categorías</span>

        <div className={styles.productCategoryWrapper}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`${styles.productCategory} ${
                selectedCategory === cat.name ? styles.activeFilter : ""
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <div className={styles.productCategoryImageSection}>
                <Image src={cat.img} alt={cat.name} width={100} height={100} />
              </div>

              <div className={styles.productCategoryDescSection}>
                <span className={styles.productCategoryType}>{cat.name}</span>

                <span className={styles.productCategoryNumber}>
                  {cat.items} items
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedCategory !== "Todo" && (
          <button
            onClick={() => setSelectedCategory("Todo")}
            className={styles.btnClear}
          >
            Mostrar todos los productos
          </button>
        )}
      </div>

      {/* PRODUCTOS */}
      <section className={styles.products}>
        <span className={styles.sectionCategoryText}>Productos</span>
        {actionMessage && (
          <p role="status" aria-live="polite">
            {actionMessage}
          </p>
        )}

        <div className={styles.productsGrid}>
          {filteredProducts.map((prod) => {
            const isFavorite = favorites.some(
              (fav: { id: string }) => fav.id === prod.id,
            );

            return (
              <div
                key={prod.id}
                className={`${styles.pCard} ${
                  activeCardId === prod.id ? styles.isOpen : ""
                }`}
                onClick={() => setActiveCardId(prod.id)}
              >
                <div className={styles.pCardImage}>
                  <Image
                    src={prod.img}
                    alt={prod.title}
                    width={200}
                    height={300}
                  />
                </div>

                <div className={styles.pCardContent}>
                  <h3 className={styles.pCardTitle}>{prod.title}</h3>

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

                    <div
                      className={styles.pCardButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleToggleFavorite(prod.id);
                      }}
                    >
                      <i
                        className={isFavorite ? "bx bxs-heart" : "bx bx-heart"}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MODAL */}
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

            <div className={styles.modalGallery}>
              <button className={styles.arrowLeft} onClick={prevImage}>
                &#10094;
              </button>
              <button className={styles.arrowRight} onClick={nextImage}>
                &#10095;
              </button>

              <div
                className={styles.imageSlider}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {selectedProduct.gallery.map((img, index) => (
                  <div className={styles.slide} key={index}>
                    <Image
                      src={img}
                      alt={`${selectedProduct.title} ${index}`}
                      width={600}
                      height={450}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalInfo}>
              {selectedProduct.stock > 0 && (
                <span className={styles.available}>DISPONIBLE</span>
              )}

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

              {selectedProduct.wholesaleTiers.length > 0 && (
                <div>
                  <h3>Precios por volumen</h3>
                  {selectedProduct.wholesaleTiers.map((tier) => {
                    const rango =
                      tier.maxQuantity !== null
                        ? `${tier.minQuantity}–${tier.maxQuantity} unidades`
                        : `Desde ${tier.minQuantity} unidades`;

                    return (
                      <div className={styles.specPill} key={tier.id}>
                        {rango}: ${tier.unitPrice.toFixed(2)} MXN
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                className={`${styles.btnp} ${styles.detailsp}`}
                onClick={handleBuyProduct}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? "Agregando..." : "Comprar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
