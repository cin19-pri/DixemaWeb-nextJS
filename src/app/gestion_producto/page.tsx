"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react"; 
import Image from "next/image";
import Link from "next/link";
import "./gestion_producto.css"; 

const PRODUCTOS_DATA = [
  { id: 1, nombre: "Laptop profesional", precio: 300, unidades: 3, estatus: "Agotado" },
  { id: 2, nombre: "Laptop profesional", precio: 300, unidades: 3, estatus: "Disponible" },
  { id: 3, nombre: "Laptop profesional", precio: 300, unidades: 3, estatus: "Agotado" },
  { id: 4, nombre: "Laptop profesional", precio: 300, unidades: 3, estatus: "Agotado" },
];

export default function DashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Lógica para detectar scroll y ocultar el header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LÓGICA DEL CALENDARIO DINÁMICO ---
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
          <Link href="/gestion_producto" className="nav-item active">Gestión</Link>
          <Link href="#" className="nav-item">Dashboard</Link>
          <Link href="/nuevo_producto" className="nav-item">Añadir nuevo producto</Link>
          <Link href="#" className="nav-item">Mensajería</Link>
          <Link href="#" className="nav-item">Notificaciones</Link>
          <Link href="#" className="nav-item">Perfil</Link>
        </nav>
        <Link href="/login_proveedor" className="nav-item">Cerrar sesión</Link>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div className="header-left-group">
            {/* El botón de hamburguesa ahora también desaparece al bajar */}
            <button 
              className={`hamburger-btn ${isScrolled ? 'fade-out' : ''}`} 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
            <div className={`welcome-msg ${isScrolled ? 'fade-out' : ''}`}>
              <h1>Bienvenido <span>cosmica!</span></h1>
              <p>¿Qué desea hacer hoy?</p>
            </div>
          </div>

          <div className={`header-tools ${isScrolled ? 'fade-out' : ''}`}>
            <div className="search-bar">
              <input type="text" placeholder="Buscar producto..." />
            </div>
            <div className="notifications"></div>
          </div>
        </header>

        <section className="management-section">
          <div className="action-bar-text">
            <button className="btn-primary" onClick={() => router.push("/nuevo_producto")}>
                Añadir producto
            </button>
          </div>

          <div className="products-grid">
            {PRODUCTOS_DATA.map((prod) => (
              <div key={prod.id} className="product-card">
                <div className="product-image">
                  <Image src="/images/lap.jpg" alt={prod.nombre} fill className="product-image-element" />
                </div>
                <div className="product-info">
                  <h3>{prod.nombre}</h3>
                  <p className="price-info">${prod.precio} MXN / {prod.unidades} unidades</p>
                  <hr />
                  <div className="status-row">
                    <span>Estatus</span>
                    <div className="action-buttons-group">
                      <span className={`status-badge ${prod.estatus.toLowerCase()}`}>{prod.estatus}</span>
                      <button className="btn-edit-inline">Editar</button>
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
          <div className="profile-avatar"></div>
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