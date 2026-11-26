/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  LogOut,
  TrendingUp,
  Users,
  AlertTriangle,
  Menu,
  X,
} from "lucide-react";
import "./dashboard.css";

export type DashboardProduct = {
  id: string;
  title: string;
  basePrice: number;
  stock: number;
  images: string[];
  category: { name: string };
};

type Props = {
  products: DashboardProduct[];
  companyName: string;
};

// Definimos los tipos de pestañas permitidas
type TabType = "panel" | "productos" | "ventas" | "inventario";

export default function DashboardClient({ products, companyName }: Props) {
  const [tab, setTab] = useState<TabType>("panel");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Cerrar menú al cambiar de pestaña en móvil
  const handleTabChange = (newTab: TabType) => {
    setTab(newTab);
    setIsMenuOpen(false);
  };

  const menu = [
    {
      id: "panel" as TabType,
      label: "Panel Principal",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "productos" as TabType,
      label: "Mis Productos",
      icon: <Package size={20} />,
    },
    {
      id: "ventas" as TabType,
      label: "Ventas Mayoreo",
      icon: <ShoppingCart size={20} />,
    },
    {
      id: "inventario" as TabType,
      label: "Inventario",
      icon: <Boxes size={20} />,
    },
  ];

  return (
    <div className="layout">
      {/* Overlay para móviles */}
      {isMenuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar Responsivo */}
      <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="sidebarHeader">
          <div className="logo-box">
            <h2>Dixema</h2>
            <span>Proveedor Oficial</span>
          </div>
          {/* Botón cerrar móvil */}
          <button
            className="close-menu-btn"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="menu">
          {menu.map((item) => (
            <button
              key={item.id}
              className={tab === item.id ? "active" : ""}
              onClick={() => handleTabChange(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebarFooter">
          <button
            className="logout"
            onClick={() => router.push("/gestion_producto")}
          >
            <LogOut size={18} />
            <span>Gestión Producto</span>
          </button>
        </div>
      </aside>

      <main className="content">
        {/* Mobile Header con Hamburguesa */}
        <header className="mobile-header">
          <button className="hamburger-btn" onClick={() => setIsMenuOpen(true)}>
            <Menu size={28} />
          </button>
          <h2 className="mobile-logo">Dixema</h2>
        </header>

        <div className="view-wrapper">
          {tab === "panel" && (
            <Panel
              companyName={companyName}
              criticalStockCount={products.filter((product) => product.stock < 5).length}
            />
          )}
          {tab === "productos" && <Productos products={products} />}
          {tab === "ventas" && <Ventas />}
          {tab === "inventario" && <Inventario products={products} />}
        </div>
      </main>
    </div>
  );
}

/* --- VISTAS INTERNAS --- */

function Panel({
  companyName,
  criticalStockCount,
}: {
  companyName: string;
  criticalStockCount: number;
}) {
  return (
    <div className="fade-in">
      <div className="header-main">
        <h1>
          Resumen de <span>Negocio</span>
        </h1>
        <p>
          Bienvenido, <strong>{companyName}</strong>
        </p>
      </div>

      <div className="stats-grid">
        <Stat
          title="Ventas Mes"
          value="$125,400"
          icon={<TrendingUp color="#f3961c" />}
        />
        <Stat
          title="Pedidos Nuevos"
          value="18"
          icon={<ShoppingCart color="#f3961c" />}
        />
        <Stat
          title="Clientes Pyme"
          value="54"
          icon={<Users color="#f3961c" />}
        />
        <Stat
          title="Stock Crítico"
          value={String(criticalStockCount)}
          icon={<AlertTriangle color="#ef4444" />}
        />
      </div>

      <div className="lower-grid">
        <div className="card main-chart">
          <h3>Rendimiento de Ventas</h3>
          <div className="chart-placeholder">
            Gráfica de actividad próximamente 📊
          </div>
        </div>

        <div className="card activity-feed">
          <h3>Actividad Reciente</h3>
          <ul className="list-minimal">
            <li>
              <strong>#552</strong> Abarrotes Lulú{" "}
              <span className="time">2m</span>
            </li>
            <li>
              <strong>#551</strong> Tienda Neto <span className="time">1h</span>
            </li>
            <li>
              <strong>Stock</strong> Laptop Air bajo{" "}
              <span className="time">3h</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

interface StatProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function Stat({ title, value, icon }: StatProps) {
  return (
    <div className="card stat-card">
      <div className="stat-content">
        <p>{title}</p>
        <strong>{value}</strong>
      </div>
      <div className="stat-icon">{icon}</div>
    </div>
  );
}

function Productos({ products }: { products: DashboardProduct[] }) {
  return (
    <div className="fade-in">
      <h1>
        Mis <span>Productos</span>
      </h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="card product-card">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.title}
                className="product-img-render"
              />
            ) : (
              <div
                className="product-img-render"
                role="img"
                aria-label={`Sin imagen para ${product.title}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "140px",
                  backgroundColor: "#F4F4FF",
                  color: "#737aa8",
                }}
              >
                <Package size={36} aria-hidden="true" />
              </div>
            )}
            <div className="product-info">
              <h3>{product.title}</h3>
              <div className="price-row">
                <strong>${product.basePrice}</strong>
                <span
                  className={`stock-label ${product.stock < 5 ? "low-stock" : ""}`}
                >
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Ventas() {
  return (
    <div className="fade-in">
      <h1>
        Ventas <span>Mayoreo</span>
      </h1>
      <div className="card table-card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Orden</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#ORD-552</td>
                <td>Abarrotes Lulú</td>
                <td>
                  <strong>$1,450</strong>
                </td>
                <td>
                  <span className="badge-status">Entregado</span>
                </td>
              </tr>
              <tr>
                <td>#ORD-553</td>
                <td>Tienda Neto</td>
                <td>
                  <strong>$3,200</strong>
                </td>
                <td>
                  <span className="badge-status">Procesando</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Inventario({ products }: { products: DashboardProduct[] }) {
  const productosCriticos = products.filter((product) => product.stock < 5);

  return (
    <div className="fade-in">
      <h1>
        Inventario <span>General</span>
      </h1>
      {productosCriticos.length === 0 ? (
        <div className="card alert-card">
          <div className="alert-text">
            <p>Todo el inventario está en orden</p>
          </div>
        </div>
      ) : (
        productosCriticos.map((product) => (
          <div className="card alert-card" key={product.id}>
            <AlertTriangle size={32} color="#f3961c" />
            <div className="alert-text">
              <h3>{product.title} con stock crítico</h3>
              <p>Quedan {product.stock} unidades en inventario.</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
