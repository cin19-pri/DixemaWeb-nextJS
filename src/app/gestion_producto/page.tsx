"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react"; 
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
  Trash2 // Importamos icono de basura opcionalmente
} from 'lucide-react';
import "./gestion_producto.css"; 

interface Producto {
  id: number;
  nombre: string;
  precio?: number;
  precioMenudeo?: number;
  unidades?: number;
  stock?: number;
  estatus: string;
  imagen: string;
}

const PRODUCTOS_INICIALES: Producto[] = [
  { id: 1, nombre: "Laptop profesional", precio: 300, unidades: 3, estatus: "Agotado", imagen: "/images/lap.jpg" },
  { id: 2, nombre: "Termo Dixema", precio: 150, unidades: 10, estatus: "Disponible", imagen: "/images/termo.jpg" },
];

export default function DashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);

  // CARGAR PRODUCTOS
  useEffect(() => {
    const cargarProductos = () => {
      const guardados = localStorage.getItem('productos_dixema');
      let listaFinal: Producto[] = [];

      if (guardados) {
        listaFinal = JSON.parse(guardados);
      } else {
        listaFinal = PRODUCTOS_INICIALES;
        localStorage.setItem('productos_dixema', JSON.stringify(PRODUCTOS_INICIALES));
      }

      const listaSinRepetidos = listaFinal.filter((valorActual: Producto, indice: number, arrayCompleto: Producto[]) => {
        return arrayCompleto.findIndex((t: Producto) => t.nombre === valorActual.nombre) === indice;
      });

      setProductos(listaSinRepetidos);
    };

    cargarProductos();
  }, []);

  // FUNCIÓN PARA ELIMINAR PRODUCTO
  const eliminarProducto = (id: number) => {
    // 1. Filtrar el producto de la lista actual
    const nuevaLista = productos.filter(p => p.id !== id);
    
    // 2. Actualizar el estado para que desaparezca de la pantalla
    setProductos(nuevaLista);
    
    // 3. Sincronizar con localStorage para que no vuelva a aparecer al recargar
    localStorage.setItem('productos_dixema', JSON.stringify(nuevaLista));
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
  const mesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const diasSemana = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
  const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay();
  const totalDiasMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();

  const cambiarMes = (offset: number) => {
    setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + offset, 1));
  };

  const esHoy = (dia: number) => {
    const hoy = new Date();
    return dia === hoy.getDate() && fechaActual.getMonth() === hoy.getMonth() && fechaActual.getFullYear() === hoy.getFullYear();
  };

  return (
    <div className="dashboard-wrapper" key={pathname}>
      {isMenuOpen && <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>}

      <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="logo-section"><span className="logo-text">Dixema</span></div>
        <nav className="nav-menu">
          <Link href="/gestion_producto" className={`nav-item ${pathname === '/gestion_producto' ? 'active' : ''}`}>
            <Package size={20} />
            <span>Gestión</span>
          </Link>
          <Link href="/dashboard" className={`nav-item ${pathname === '/dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/nuevo_producto" className={`nav-item ${pathname === '/nuevo_producto' ? 'active' : ''}`}>
            <PlusCircle size={20} />
            <span>Añadir nuevo producto</span>
          </Link>
          <Link href="/notificaciones" className={`nav-item ${pathname === '/notificaciones' ? 'active' : ''}`}>
            <Bell size={20} />
            <span>Notificaciones</span>
          </Link>
          <Link href="#" className="nav-item">
            <User size={20} />
            <span>Perfil</span>
          </Link>
        </nav>
        
        <div className="sidebar-footer">
          <Link href="/bienvenida" className="nav-item logout-link">
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </Link>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div className="header-left-group">
            <button 
              className={`hamburger-btn ${isScrolled ? 'fade-out' : ''}`} 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className={`welcome-msg ${isScrolled ? 'fade-out' : ''}`}>
              <h1>Bienvenido <span>cosmica!</span></h1>
              <p>¿Qué desea hacer hoy?</p>
            </div>
          </div>

          <div className={`header-tools ${isScrolled ? 'fade-out' : ''}`}>
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Buscar producto..." />
            </div>
          </div>
        </header>

        <section className="management-section">
          <div className="action-bar-text">
            <button className="btn-primary" onClick={() => router.push("/nuevo_producto")}>
                <PlusCircle size={18} style={{ marginRight: '8px' }} />
                Añadir producto
            </button>
          </div>

          <div className="products-grid">
            {productos.map((prod) => (
              <div key={prod.id} className="product-card">
                <div className="product-image">
                  <Image 
                    src={prod.imagen || "/images/lap.jpg"} 
                    alt={prod.nombre} 
                    fill 
                    className="product-image-element" 
                  />
                </div>
                <div className="product-info">
                  <h3>{prod.nombre}</h3>
                  <p className="price-info">
                    ${prod.precio ?? prod.precioMenudeo} MXN / {prod.unidades ?? prod.stock} unidades
                  </p>
                  <hr />
                  <div className="status-row">
                    <span>Estatus</span>
                    <div className="action-buttons-group">
                      <span className={`status-badge ${(prod.estatus || "").toLowerCase()}`}>{prod.estatus}</span>
                      {/* BOTÓN CAMBIADO A ELIMINAR */}
                      <button 
                        className="btn-edit-inline" 
                        onClick={() => eliminarProducto(prod.id)}
                        style={{ color: '#df1818', borderColor: '#df1818' }} // Rojo para peligro
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <aside className="right-panel">
        <div className="user-profile-mini">
          <div className="profile-info">
            <p className="profile-name">Pedrito Buena Onda</p>
            <p className="profile-id">1094881999</p>
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
            <h3>{mesNombres[fechaActual.getMonth()]} {fechaActual.getFullYear()}</h3>
          </div>
          <div className="calendar-grid">
            {diasSemana.map(dia => <span key={dia} className="day-name">{dia}</span>)}
            {Array.from({ length: primerDiaMes }).map((_, i) => <span key={`empty-${i}`} className="day-empty"></span>)}
            {Array.from({ length: totalDiasMes }).map((_, i) => (
              <span key={i+1} className={`day-number ${esHoy(i+1) ? 'today' : ''}`}>{i+1}</span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
