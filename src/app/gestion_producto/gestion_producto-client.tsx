"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutUser } from "@/actions/auth";
import {
  actualizarStock,
  eliminarProducto,
} from "@/actions/productos";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Bell,
  User,
  LogOut,
  Search,
  Menu,
  X,
} from "lucide-react";
import "./gestion_producto.css";

export type ProductoGestion = {
  id: string;
  title: string;
  basePrice: number;
  stock: number;
  images: string[];
  category: { name: string };
};

type Props = {
  productos: ProductoGestion[];
  nombreUsuario: string;
  datoUsuario: string;
};

export default function GestionProductoClient({
  productos: productosIniciales,
  nombreUsuario,
  datoUsuario,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [productos, setProductos] = useState(productosIniciales);
  const [stockEditado, setStockEditado] = useState<Record<string, string>>({});
  const [productoOcupado, setProductoOcupado] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    setProductos(productosIniciales);
  }, [productosIniciales]);

  const handleEliminarProducto = async (id: string) => {
    setProductoOcupado(id);
    setError(null);
    setMensaje(null);

    try {
      const resultado = await eliminarProducto(id);
      if (!resultado.success) {
        setError(resultado.error);
        return;
      }

      setProductos((actuales) => actuales.filter((producto) => producto.id !== id));
      setMensaje("Producto eliminado del catálogo.");
      router.refresh();
    } catch {
      setError("No se pudo eliminar el producto. Inténtalo de nuevo.");
    } finally {
      setProductoOcupado(null);
    }
  };

  const handleActualizarStock = async (producto: ProductoGestion) => {
    const stockTexto = stockEditado[producto.id] ?? String(producto.stock);
    const stock = Number(stockTexto);
    if (!stockTexto.trim() || !Number.isInteger(stock) || stock < 0) {
      setError("El stock debe ser un número entero igual o mayor que 0.");
      setMensaje(null);
      return;
    }

    setProductoOcupado(producto.id);
    setError(null);
    setMensaje(null);

    try {
      const resultado = await actualizarStock(producto.id, stock);
      if (!resultado.success) {
        setError(resultado.error);
        return;
      }

      setProductos((actuales) =>
        actuales.map((actual) =>
          actual.id === producto.id ? { ...actual, stock } : actual,
        ),
      );
      setStockEditado((actual) => ({ ...actual, [producto.id]: String(stock) }));
      setMensaje("Stock actualizado.");
      router.refresh();
    } catch {
      setError("No se pudo actualizar el stock. Inténtalo de nuevo.");
    } finally {
      setProductoOcupado(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LÓGICA DEL CALENDARIO ---
  const [fechaActual, setFechaActual] = useState(new Date());
  const mesNombres = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const diasSemana = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
  const primerDiaMes = new Date(
    fechaActual.getFullYear(),
    fechaActual.getMonth(),
    1,
  ).getDay();
  const totalDiasMes = new Date(
    fechaActual.getFullYear(),
    fechaActual.getMonth() + 1,
    0,
  ).getDate();

  const cambiarMes = (offset: number) => {
    setFechaActual(
      new Date(fechaActual.getFullYear(), fechaActual.getMonth() + offset, 1),
    );
  };

  const esHoy = (dia: number) => {
    const hoy = new Date();
    return (
      dia === hoy.getDate() &&
      fechaActual.getMonth() === hoy.getMonth() &&
      fechaActual.getFullYear() === hoy.getFullYear()
    );
  };

  return (
    <div className="dashboard-wrapper" key={pathname}>
      {isMenuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="logo-section">
          <span className="logo-text">Dixema</span>
        </div>
        <nav className="nav-menu">
          <Link
            href="/gestion_producto"
            className={`nav-item ${pathname === "/gestion_producto" ? "active" : ""}`}
          >
            <Package size={20} />
            <span>Gestión</span>
          </Link>
          <Link
            href="/dashboard"
            className={`nav-item ${pathname === "/dashboard" ? "active" : ""}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/nuevo_producto"
            className={`nav-item ${pathname === "/nuevo_producto" ? "active" : ""}`}
          >
            <PlusCircle size={20} />
            <span>Añadir nuevo producto</span>
          </Link>
          <Link
            href="/notificacionesprovedor"
            className={`nav-item ${pathname === "/notificaciones" ? "active" : ""}`}
          >
            <Bell size={20} />
            <span>Notificaciones</span>
          </Link>
          <Link href="#" className="nav-item">
            <User size={20} />
            <span>Perfil</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={() => logoutUser("/login_proveedor")}
            className="nav-item logout-link"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
            }}
          >
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div className="header-left-group">
            <button
              className={`hamburger-btn ${isScrolled ? "fade-out" : ""}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className={`welcome-msg ${isScrolled ? "fade-out" : ""}`}>
              <h1>
                Bienvenido <span>{nombreUsuario}!</span>
              </h1>
              <p>¿Qué desea hacer hoy?</p>
            </div>
          </div>

          <div className={`header-tools ${isScrolled ? "fade-out" : ""}`}>
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Buscar producto..." />
            </div>
          </div>
        </header>

        <section className="management-section">
          <div className="action-bar-text">
            <button
              className="btn-primary"
              onClick={() => router.push("/nuevo_producto")}
            >
              <PlusCircle size={18} style={{ marginRight: "8px" }} />
              Añadir producto
            </button>
          </div>

          {error && (
            <p role="alert" style={{ color: "#b42318" }}>
              {error}
            </p>
          )}
          {mensaje && (
            <p role="status" style={{ color: "#067647" }}>
              {mensaje}
            </p>
          )}

          <div className="products-grid">
            {productos.map((prod) => {
              const estatus = prod.stock > 0 ? "Disponible" : "Agotado";
              return (
                <div key={prod.id} className="product-card">
                  <div className="product-image">
                    <Image
                      src={prod.images[0] || "/images/lap.jpg"}
                      alt={prod.title}
                      fill
                      className="product-image-element"
                    />
                  </div>
                  <div className="product-info">
                    <h3>{prod.title}</h3>
                    <p>{prod.category.name}</p>
                    <p className="price-info">
                      ${prod.basePrice} MXN / {prod.stock} unidades
                    </p>
                    <hr />
                    <div className="status-row">
                      <span>Estatus</span>
                      <div className="action-buttons-group">
                        <span
                          className={`status-badge ${estatus.toLowerCase()}`}
                        >
                          {estatus}
                        </span>
                        <button
                          className="btn-edit-inline"
                          onClick={() => handleEliminarProducto(prod.id)}
                          disabled={productoOcupado !== null}
                          style={{ color: "#df1818", borderColor: "#df1818" }}
                        >
                          {productoOcupado === prod.id
                            ? "Procesando..."
                            : "Eliminar"}
                        </button>
                      </div>
                    </div>
                    <div className="stock-edit-row">
                      <label htmlFor={`stock-${prod.id}`}>Stock</label>
                      <input
                        id={`stock-${prod.id}`}
                        type="number"
                        min="0"
                        step="1"
                        value={stockEditado[prod.id] ?? prod.stock}
                        disabled={productoOcupado !== null}
                        onChange={(event) =>
                          setStockEditado((actual) => ({
                            ...actual,
                            [prod.id]: event.target.value,
                          }))
                        }
                      />
                      <button
                        className="btn-edit-inline"
                        onClick={() => handleActualizarStock(prod)}
                        disabled={productoOcupado !== null}
                      >
                        Actualizar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {productos.length === 0 && <p>No tienes productos en tu catálogo.</p>}
          </div>
        </section>
      </main>

      <aside className="right-panel">
        <div className="user-profile-mini">
          <div className="profile-info">
            <p className="profile-name">{nombreUsuario}</p>
            <p className="profile-id">{datoUsuario}</p>
          </div>
          <div className="profile-avatar">
            <User size={24} color="#666" />
          </div>
        </div>

        <div className="calendar-widget">
          <div className="calendar-header">
            <div className="calendar-arrows">
              <button onClick={() => cambiarMes(-1)}>❮</button>
              <button onClick={() => cambiarMes(1)}>❯</button>
            </div>
            <h3>
              {mesNombres[fechaActual.getMonth()]} {fechaActual.getFullYear()}
            </h3>
          </div>
          <div className="calendar-grid">
            {diasSemana.map((dia) => (
              <span key={dia} className="day-name">
                {dia}
              </span>
            ))}
            {Array.from({ length: primerDiaMes }).map((_, i) => (
              <span key={`empty-${i}`} className="day-empty"></span>
            ))}
            {Array.from({ length: totalDiasMes }).map((_, i) => (
              <span
                key={i + 1}
                className={`day-number ${esHoy(i + 1) ? "today" : ""}`}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
