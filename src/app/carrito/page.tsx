"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CarritoPage() {
  // Carga de Iconos (FontAwesome)
  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // --- ESTADO ---
  const [productos, setProductos] = useState([
    { id: 1, name: "Laptop Gamer", desc: "Alto rendimiento para juegos y trabajo.", price: 3000, badge: "Nuevo", img: "/images/laptop.png", count: 1 },
    { id: 2, name: "Auriculares", desc: "Sonido premium con cancelación.", price: 850, badge: "Oferta", img: "/images/auriculares.png", count: 1 },
    { id: 3, name: "Smartwatch", desc: "Monitoreo de salud y actividad.", price: 1200, badge: "Top", img: "/images/smartwatch.png", count: 1 },
    { id: 4, name: "Teclado Mecánico", desc: "RGB y switches profesionales.", price: 950, badge: "Nuevo", img: "/images/teclado.png", count: 1 },
  ]);

  const [cart, setCart] = useState<{ [key: string]: { price: number; quantity: number; selected: boolean } }>({});
  const [activeNav, setActiveNav] = useState("Carrito");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para menú hamburguesa

  // --- LÓGICA ---
  const updateLocalCount = (id: number, delta: number) => {
    setProductos(prev => prev.map(p => 
      p.id === id ? { ...p, count: Math.max(1, p.count + delta) } : p
    ));
  };

  const addToCart = (product: typeof productos[0]) => {
    setCart(prev => {
      const existing = prev[product.name];
      if (existing) {
        return { ...prev, [product.name]: { ...existing, quantity: existing.quantity + product.count } };
      }
      return { ...prev, [product.name]: { price: product.price, quantity: product.count, selected: true } };
    });
  };

  const toggleSelect = (name: string) => {
    setCart(prev => ({ ...prev, [name]: { ...prev[name], selected: !prev[name].selected } }));
  };

  const cartEntries = Object.entries(cart);
  const totalItems = cartEntries.reduce((acc, [_, item]) => item.selected ? acc + item.quantity : acc, 0);
  const totalPrice = cartEntries.reduce((acc, [_, item]) => item.selected ? acc + (item.price * item.quantity) : acc, 0);

  const navLinks: { [key: string]: string } = {
    "Inicio": "/iniciousuarios",
    "Guardados": "/favoritos",
    "Notificaciones": "/notificaciones",
    "Carrito": "/carrito",
    "Perfil": "/perfilusuario"
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --primary: #343959;
          --primary-soft: #4C5075;
          --accent: #737AA8;
          --light: #F4F4FF;
          --warning: #F8BB84;
          --cta: #EC802B;
          --panel-bg: rgba(76, 80, 117, 0.95);
        }

        body {
          margin: 0; padding: 0;
          font-family: 'Poppins', sans-serif;
          background-color: #ececf6;
          color: #333;
        }

        .navbar {
          max-width: 1300px;
          margin: 20px auto 0;
          padding: 16px 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--panel-bg);
          color: var(--light);
          border-radius: 22px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          backdrop-filter: blur(8px);
          position: relative;
          z-index: 1000;
        }

        .logo { font-size: 1.6rem; font-weight: 700; color: white; text-decoration: none; display: flex; align-items: center; gap: 12px; }

        .navSearch {
          display: flex; align-items: center;
          background: rgba(244, 244, 255, 0.2);
          border-radius: 30px;
          padding: 8px 18px;
          gap: 10px;
        }

        .navSearch input { background: transparent; border: none; outline: none; width: 120px; color: white; }
        .navSearch input::placeholder { color: rgba(255,255,255,0.7); }

        .navMenu { list-style: none; display: flex; gap: 20px; margin: 0; padding: 0; }
        .navMenu li a { text-decoration: none; color: white; font-weight: 500; opacity: 0.8; transition: 0.25s; }
        .navMenu li a:hover, .active-link { opacity: 1; color: var(--cta) !important; }

        .hamburger { display: none; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; }

        .layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 30px;
          max-width: 1300px;
          margin: 30px auto;
          padding: 0 20px 50px;
        }

        .products {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .card {
          position: relative; background: var(--panel-bg); color: var(--light);
          border-radius: 22px; overflow: hidden; box-shadow: 0 12px 28px rgba(0,0,0,0.2);
          transition: transform 0.3s ease;
        }
        .card:hover { transform: translateY(-5px); }
        .card img { width: 100%; height: 200px; object-fit: cover; }

        .badge {
          position: absolute; top: 12px; left: 12px;
          background: var(--warning); color: var(--primary);
          padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;
        }

        .content { padding: 15px; }
        .price { font-size: 1.3rem; color: var(--cta); font-weight: 700; }

        .controls { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; }
        .counter { display: flex; align-items: center; background: rgba(0,0,0,0.3); border-radius: 20px; }
        .counter button { background: none; border: none; color: white; padding: 5px 12px; cursor: pointer; font-size: 1.2rem; }
        .counter span { width: 25px; text-align: center; font-weight: 600; }

        .add-btn {
          background: var(--accent); border: none; border-radius: 50%;
          width: 40px; height: 40px; color: white; cursor: pointer; transition: 0.3s;
        }
        .add-btn:hover { background: var(--cta); transform: rotate(90deg); }

        .summary {
          position: sticky; top: 20px; height: fit-content;
          background: var(--panel-bg); color: white; padding: 25px;
          border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .pay {
          width: 100%; margin-top: 20px; padding: 15px; border: none;
          border-radius: 12px; background: var(--cta); color: white;
          font-weight: 700; cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 10px; text-decoration: none;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .layout { grid-template-columns: 1fr; }
          .summary { position: relative; top: 0; order: -1; } /* Resumen arriba en tablets/movil */
        }

        @media (max-width: 768px) {
          .navbar { margin: 0; border-radius: 0; padding: 15px 20px; }
          .navSearch, .navMenu { display: none; }
          .hamburger { display: block; }

          .navMenu.open {
            display: flex; flex-direction: column;
            position: absolute; top: 100%; left: 0; width: 100%;
            background: var(--primary); padding: 20px; gap: 15px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          }
          
          .products { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 480px) {
          .products { grid-template-columns: 1fr; }
          .layout { padding: 0 15px 30px; }
        }
      `}</style>

      <div className="mainContainer">
        {/* NAVBAR */}
        <nav className="navbar">
          <Link href="/" className="logo">
            <i className="fa-solid fa-cart-shopping"></i>
            <span>Dixema</span>
          </Link>

          <div className="navSearch">
            <i className="fa fa-search"></i>
            <input type="text" placeholder="Buscar..." />
          </div>

          <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>

          <ul className={`navMenu ${isMenuOpen ? 'open' : ''}`}>
            {Object.keys(navLinks).map((item) => (
              <li key={item} onClick={() => { setActiveNav(item); setIsMenuOpen(false); }}>
                <Link 
                  href={navLinks[item]} 
                  className={activeNav === item ? "active-link" : ""}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CONTENIDO */}
        <main className="layout">
          <section className="products">
            {productos.map((prod) => (
              <article className="card" key={prod.id}>
                <span className="badge">{prod.badge}</span>
                <img src={prod.img} alt={prod.name} />
                <div className="content">
                  <h3>{prod.name}</h3>
                  <p>{prod.desc}</p>
                  <div className="priceRow">
                    <span className="price">${prod.price} MX</span>
                  </div>
                  <div className="controls">
                    <div className="counter">
                      <button onClick={() => updateLocalCount(prod.id, -1)}>-</button>
                      <span>{prod.count}</span>
                      <button onClick={() => updateLocalCount(prod.id, 1)}>+</button>
                    </div>
                    <button className="add-btn" onClick={() => addToCart(prod)}>
                      <i className="fa fa-cart-plus"></i>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* RESUMEN */}
          <aside className="summary">
            <h2>Tu Pedido</h2>
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '15px' }}>
              {cartEntries.length === 0 && <p style={{opacity: 0.6}}>No hay productos seleccionados</p>}
              {cartEntries.map(([name, item]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                  <label style={{ display: 'flex', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={item.selected} 
                      onChange={() => toggleSelect(name)} 
                    />
                    {name} (x{item.quantity})
                  </label>
                  <span>${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Total Items:</span>
                <strong>{totalItems}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem' }}>
                <span>Total:</span>
                <strong style={{ color: 'var(--cta)' }}>${totalPrice.toLocaleString()}</strong>
              </div>
            </div>

            <Link href="/forma_de_pago" className="pay">
                <i className="fa-solid fa-credit-card"></i> Finalizar Compra
            </Link>
          </aside>
        </main>
      </div>
    </>
  );
}