'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  X
} from 'lucide-react';
import './dashboard.css';

// Definimos los tipos de pestañas permitidas
type TabType = 'panel' | 'productos' | 'ventas' | 'inventario';

export default function DashboardPage() {
  const [tab, setTab] = useState<TabType>('panel');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Cerrar menú al cambiar de pestaña en móvil
  const handleTabChange = (newTab: TabType) => {
    setTab(newTab);
    setIsMenuOpen(false);
  };

  const menu = [
    { id: 'panel' as TabType, label: 'Panel Principal', icon: <LayoutDashboard size={20} /> },
    { id: 'productos' as TabType, label: 'Mis Productos', icon: <Package size={20} /> },
    { id: 'ventas' as TabType, label: 'Ventas Mayoreo', icon: <ShoppingCart size={20} /> },
    { id: 'inventario' as TabType, label: 'Inventario', icon: <Boxes size={20} /> },
  ];

  return (
    <div className="layout">
      {/* Overlay para móviles */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>
      )}

      {/* Sidebar Responsivo */}
      <aside className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebarHeader">
          <div className="logo-box">
            <h2>Dixema</h2>
            <span>Proveedor Oficial</span>
          </div>
          {/* Botón cerrar móvil */}
          <button className="close-menu-btn" onClick={() => setIsMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="menu">
          {menu.map(item => (
            <button
              key={item.id}
              className={tab === item.id ? 'active' : ''}
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
            onClick={() => router.push('/gestion_producto')}
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
          {tab === 'panel' && <Panel />}
          {tab === 'productos' && <Productos />}
          {tab === 'ventas' && <Ventas />}
          {tab === 'inventario' && <Inventario />}
        </div>
      </main>
    </div>
  );
}

/* --- VISTAS INTERNAS --- */

function Panel() {
  return (
    <div className="fade-in">
      <div className="header-main">
        <h1>Resumen de <span>Negocio</span></h1>
        <p>Bienvenido, <strong>Distribuidora Global</strong></p>
      </div>

      <div className="stats-grid">
        <Stat title="Ventas Mes" value="$125,400" icon={<TrendingUp color="#f3961c" />} />
        <Stat title="Pedidos Nuevos" value="18" icon={<ShoppingCart color="#f3961c" />} />
        <Stat title="Clientes Pyme" value="54" icon={<Users color="#f3961c" />} />
        <Stat title="Stock Crítico" value="4" icon={<AlertTriangle color="#ef4444" />} />
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
              <strong>#552</strong> Abarrotes Lulú <span className="time">2m</span>
            </li>
            <li>
              <strong>#551</strong> Tienda Neto <span className="time">1h</span>
            </li>
            <li>
              <strong>Stock</strong> Laptop Air bajo <span className="time">3h</span>
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

function Productos() {
  const products = [
    { name: 'Auriculares Pro', price: '$450', img: '/images/auriculares.png', stock: 12 },
    { name: 'Laptop Air 13', price: '$12,500', img: '/images/laptop.png', stock: 2 },
    { name: 'Smartwatch V2', price: '$890', img: '/images/smartwatch.png', stock: 45 },
  ];

  return (
    <div className="fade-in">
      <h1>Mis <span>Productos</span></h1>
      <div className="products-grid">
        {products.map(p => (
          <div key={p.name} className="card product-card">
            <img src={p.img} alt={p.name} className="product-img-render" />
            <div className="product-info">
              <h3>{p.name}</h3>
              <div className="price-row">
                <strong>{p.price}</strong>
                <span className={`stock-label ${p.stock < 5 ? 'low-stock' : ''}`}>
                  Stock: {p.stock}
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
      <h1>Ventas <span>Mayoreo</span></h1>
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
                  <td><strong>$1,450</strong></td>
                  <td><span className="badge-status">Entregado</span></td>
                </tr>
                <tr>
                  <td>#ORD-553</td>
                  <td>Tienda Neto</td>
                  <td><strong>$3,200</strong></td>
                  <td><span className="badge-status">Procesando</span></td>
                </tr>
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

function Inventario() {
  return (
    <div className="fade-in">
      <h1>Inventario <span>General</span></h1>
      <div className="card alert-card">
        <AlertTriangle size={32} color="#f3961c" />
        <div className="alert-text">
          <h3>Laptop con stock crítico</h3>
          <p>Quedan menos de 3 unidades en el almacén central de Salamanca.</p>
        </div>
      </div>
    </div>
  );
}