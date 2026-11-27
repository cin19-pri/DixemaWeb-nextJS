"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Navbar from "@/componentes/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Minus,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import type { CarritoItemView } from "@/actions/cart";
import { useShop } from "@/context/ShopContext";
import styles from "./carrito.module.css";

export default function CarritoPage() {
  const router = useRouter();
  const {
    cart,
    isLoading,
    loadError,
    refreshCart,
    updateCartQuantity,
    removeFromCart,
  } = useShop();
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string> | null>(null);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [retryError, setRetryError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const selectedItems = cart.filter(
    (item) => selectedIds === null || selectedIds.has(item.id),
  );
  const allSelected = cart.length > 0 && selectedItems.length === cart.length;
  const selectedTotal = selectedItems.reduce(
    (total, item) => total + item.subtotal,
    0,
  );
  const selectedQuantity = selectedItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const groups = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const visibleItems = cart.filter((item) => {
      if (!normalizedQuery) return true;
      return (
        item.product.title.toLocaleLowerCase().includes(normalizedQuery) ||
        item.product.provider.toLocaleLowerCase().includes(normalizedQuery)
      );
    });

    return visibleItems.reduce<Map<string, CarritoItemView[]>>(
      (result, item) => {
        const provider = item.product.provider.trim() || "Proveedor";
        const providerItems = result.get(provider) ?? [];
        providerItems.push(item);
        result.set(provider, providerItems);
        return result;
      },
      new Map(),
    );
  }, [cart, query]);

  const toggleItem = (itemId: string) => {
    const next = new Set(selectedIds ?? cart.map((item) => item.id));
    if (next.has(itemId)) next.delete(itemId);
    else next.add(itemId);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    setSelectedIds(
      allSelected ? new Set() : new Set(cart.map((item) => item.id)),
    );
  };

  const handleUpdateQuantity = async (
    item: CarritoItemView,
    quantity: number,
  ) => {
    setBusyItemId(item.id);
    setActionError(null);
    try {
      const result = await updateCartQuantity(item.id, quantity);
      if (!result.success) setActionError(result.error);
    } catch {
      setActionError("No se pudo actualizar la cantidad.");
    } finally {
      setBusyItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setBusyItemId(itemId);
    setActionError(null);
    try {
      const result = await removeFromCart(itemId);
      if (!result.success) setActionError(result.error);
    } catch {
      setActionError("No se pudo quitar el producto del carrito.");
    } finally {
      setBusyItemId(null);
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryError(null);
    try {
      await refreshCart();
    } catch {
      setRetryError(
        "No se pudo volver a cargar el carrito. Inténtalo de nuevo.",
      );
    } finally {
      setIsRetrying(false);
    }
  };

  const renderSummary = (mobile = false) => (
    <aside
      className={`${styles.summary} ${mobile ? styles.mobileSummary : ""}`}
      aria-label="Resumen del pedido"
    >
      <label className={styles.selectAll}>
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleAll}
          disabled={cart.length === 0}
        />
        <span>Todos</span>
      </label>
      <div className={styles.summaryTotals}>
        <span className={styles.summaryCaption}>
          Total ({selectedQuantity}{" "}
          {selectedQuantity === 1 ? "producto" : "productos"})
        </span>
        <strong className={styles.totalPrice}>
          ${selectedTotal.toFixed(2)} <span>MXN</span>
        </strong>
      </div>
      <button
        className={styles.buyButton}
        type="button"
        disabled={selectedItems.length === 0}
        onClick={() => router.push("/forma_de_pago")}
      >
        Comprar
      </button>
    </aside>
  );

  return (
    <main className={styles.page}>
      <Navbar onSearch={setSearchTerm} />
      <div className={styles.container}>
        <div className={styles.searchWrap}>
          <Search className={styles.searchIcon} aria-hidden="true" />
          <input
            className={styles.searchInput}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar en el carrito"
            aria-label="Buscar en el carrito"
          />
          {query && (
            <button
              type="button"
              className={styles.clearSearch}
              onClick={() => setQuery("")}
              aria-label="Limpiar búsqueda"
            >
              <X aria-hidden="true" />
            </button>
          )}
        </div>

        {actionError && (
          <p className={styles.actionError} role="alert">
            <AlertCircle aria-hidden="true" />
            {actionError}
          </p>
        )}

        <div className={styles.layout}>
          <section
            className={styles.itemsColumn}
            aria-label="Productos en tu carrito"
          >
            {isLoading ? (
              <div className={styles.stateCard} role="status">
                <span className={styles.spinner} />
                <p>Cargando carrito...</p>
              </div>
            ) : loadError || retryError ? (
              <div className={styles.stateCard} role="alert">
                <AlertCircle className={styles.stateIcon} aria-hidden="true" />
                <h2>No se pudo cargar el carrito</h2>
                <p>{retryError ?? loadError}</p>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleRetry}
                  disabled={isRetrying}
                >
                  <RefreshCw aria-hidden="true" />
                  {isRetrying ? "Reintentando..." : "Reintentar"}
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className={styles.stateCard}>
                <ShoppingCart className={styles.stateIcon} aria-hidden="true" />
                <h2>Tu carrito está vacío</h2>
                <p>Explora el catálogo y agrega productos para tu negocio.</p>
                <Link href="/categorias" className={styles.secondaryButton}>
                  Seguir comprando
                </Link>
              </div>
            ) : groups.size === 0 ? (
              <div className={styles.stateCard}>
                <Search className={styles.stateIcon} aria-hidden="true" />
                <h2>No hay coincidencias</h2>
                <p>Prueba con otro nombre de producto o proveedor.</p>
              </div>
            ) : (
              <>
                {Array.from(groups.entries()).map(([provider, items]) => (
                  <section className={styles.providerGroup} key={provider}>
                    <h2 className={styles.providerTitle}>
                      <PackageCheck aria-hidden="true" />
                      {provider}
                    </h2>
                    <div className={styles.productList}>
                      {items.map((item) => {
                        return (
                          <article className={styles.productCard} key={item.id}>
                            <label className={styles.productSelection}>
                              <input
                                type="checkbox"
                                checked={
                                  selectedIds === null ||
                                  selectedIds.has(item.id)
                                }
                                onChange={() => toggleItem(item.id)}
                                aria-label={`Seleccionar ${item.product.title}`}
                              />
                            </label>
                            <div className={styles.productImage}>
                              <Image
                                src={item.product.image}
                                alt={item.product.title}
                                fill
                                sizes="(max-width: 700px) 88px, 112px"
                              />
                            </div>
                            <div className={styles.productDetails}>
                              <div className={styles.productHeading}>
                                <div>
                                  <span className={styles.category}>
                                    {item.isActive
                                      ? item.product.category
                                      : "No disponible"}
                                  </span>
                                  <h3>{item.product.title}</h3>
                                </div>
                                <button
                                  type="button"
                                  className={styles.removeButton}
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={busyItemId !== null}
                                  aria-label={`Quitar ${item.product.title} del carrito`}
                                >
                                  <Trash2 aria-hidden="true" />
                                </button>
                              </div>
                              {item.product.description && (
                                <p className={styles.description}>
                                  {item.product.description}
                                </p>
                              )}
                              <p className={styles.stock}>
                                Stock: {item.stock} · Mínimo: {item.minOrderQty}
                              </p>
                              <div className={styles.productFooter}>
                                <div className={styles.quantityControl}>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item,
                                        item.quantity - 1,
                                      )
                                    }
                                    disabled={
                                      busyItemId !== null ||
                                      item.quantity <= item.minOrderQty ||
                                      !item.isActive
                                    }
                                    aria-label={`Disminuir cantidad de ${item.product.title}`}
                                  >
                                    <Minus aria-hidden="true" />
                                  </button>
                                  <span aria-live="polite">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item,
                                        item.quantity + 1,
                                      )
                                    }
                                    disabled={
                                      busyItemId !== null ||
                                      item.quantity >= item.stock ||
                                      !item.isActive
                                    }
                                    aria-label={`Aumentar cantidad de ${item.product.title}`}
                                  >
                                    <Plus aria-hidden="true" />
                                  </button>
                                </div>
                                <div className={styles.priceBlock}>
                                  <span>
                                    ${item.unitPrice.toFixed(2)} MXN / c/u
                                  </span>
                                  <strong>
                                    ${item.subtotal.toFixed(2)} MXN
                                  </strong>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </>
            )}
          </section>
          {renderSummary()}
        </div>
      </div>
      {renderSummary(true)}
    </main>
  );
}
