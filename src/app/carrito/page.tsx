"use client";

import React, { useState, useEffect } from 'react';

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
    { id: 1, name: "Laptop Gamer", desc: "Alto rendimiento para juegos y trabajo.", price: 3000, badge: "Nuevo", img: "images/laptop.png", count: 1 },
    { id: 2, name: "Auriculares", desc: "Sonido premium con cancelación.", price: 850, badge: "Oferta", img: "images/auriculares.png", count: 1 },
    { id: 3, name: "Smartwatch", desc: "Monitoreo de salud y actividad.", price: 1200, badge: "Top", img: "images/smartwatch.png", count: 1 },
    { id: 4, name: "Teclado Mecánico", desc: "RGB y switches profesionales.", price: 950, badge: "Nuevo", img: "images/teclado.png", count: 1 },
  ]);

  const [cart, setCart] = useState<{ [key: string]: { price: number; quantity: number; selected: boolean } }>({});
  const [activeNav, setActiveNav] = useState("Carrito");

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

  return (
    <>
      {/* ESTILOS INYECTADOS DIRECTAMENTE */}
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
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
          background-color: #ececf6;
          color: #333;
        }

        .mainContainer { min-height: 100vh; }

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
        }

        .navLeft { display: flex; align-items: center; gap: 12px; font-size: 1.6rem; }
        .logo { font-weight: 700; }

        .navSearch {
          display: flex;
          align-items: center;
          background: rgba(244, 244, 255, 0.55);
          border-radius: 30px;
          padding: 10px 18px;
          gap: 10px;
        }

        .navSearch input {
          background: transparent;
          border: none;
          outline: none;
          width: 150px;
          color: var(--primary);
          font-weight: 500;
        }

        .navMenu { list-style: none; display: flex; gap: 26px; margin: 0; padding: 0; }
        .navMenu li { cursor: pointer; font-weight: 500; opacity: 0.85; transition: 0.25s; color: white; }
        .navMenu li:hover { opacity: 1; color: var(--cta); }
        .active-link { color: var(--cta) !important; opacity: 1 !important; }

        .layout {
          display: grid;
          grid-template-columns: 3fr 1.2fr;
          gap: 30px;
          margin-top: 30px;
          max-width: 1300px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 20px 50px;
        }

        .products {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
        }

        .card {
          position: relative;
          background: var(--panel-bg);
          color: var(--light);
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 12px 28px rgba(0,0,0,0.2);
          transition: transform 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .card:hover { transform: translateY(-6px); }
        .card img { width: 100%; height: 180px; object-fit: cover; }

        .badge {
          position: absolute;
          top: 12px; left: 12px;
          background: var(--warning);
          color: var(--primary);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .content { padding: 20px; }
        .content h3 { margin: 0 0 5px 0; }
        .content p { font-size: 14px; opacity: 0.9; margin-bottom: 15px; }

        .priceRow { display: flex; justify-content: space-between; align-items: center; }
        .price { font-size: 1.2rem; color: var(--cta); font-weight: 600; }

        .controls {
          margin-top: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .counter {
          display: flex;
          align-items: center;
          background: rgba(0,0,0,0.3);
          border-radius: 20px;
          overflow: hidden;
        }

        .counter button {
          background: none; border: none;
          color: var(--light);
          padding: 6px 14px;
          cursor: pointer;
          font-size: 18px;
        }

        .add-btn {
          background: var(--accent);
          border: none;
          border-radius: 50%;
          width: 42px; height: 42px;
          color: var(--light);
          cursor: pointer;
          transition: 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .add-btn:hover { background: var(--cta); }

        .summary {
          position: sticky;
          top: 30px;
          background: var(--panel-bg);
          color: var(--light);
          border-radius: 24px;
          padding: 28px;
          height: fit-content;
          box-shadow: 0 12px 28px rgba(0,0,0,0.2);
        }

        .summary h2 { margin-top: 0; margin-bottom: 20px; }

        .cartItem {
          display: flex; gap: 10px; margin-bottom: 12px;
          align-items: center; font-size: 14px;
        }

        .summary-row { display: flex; justify-content: space-between; margin-bottom: 14px; }

        .pay {
          width: 100%; margin-top: 25px;
          padding: 14px; border: none;
          border-radius: 14px;
          background: var(--cta);
          color: var(--light);
          font-weight: 600;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          gap: 8px; transition: 0.3s;
        }

        @media (max-width: 900px) {
          .layout { grid-template-columns: 1fr; }
          .navbar { flex-direction: column; gap: 18px; margin: 10px; }
        }
      `}</style>

      <div className="mainContainer">
        {/* NAVBAR */}
        <nav className="navbar">
          <div className="navLeft">
            <i className="fa-solid fa-cart-shopping"></i>
            <span className="logo">Mi Carrito</span>
          </div>
          <div className="navSearch">
            <i className="fa fa-search"></i>
            <input type="text" placeholder="Buscar..." />
          </div>
          <ul className="navMenu">
            {["Inicio", "Guardados", "Chat", "Carrito", "Perfil"].map((item) => (
              <li 
                key={item} 
                className={activeNav === item ? "active-link" : ""}
                onClick={() => setActiveNav(item)}
              >
                {item}
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
            <h2>Resumen</h2>
            <div>
              {cartEntries.length === 0 && <p style={{opacity: 0.6}}>Carrito vacío</p>}
              {cartEntries.map(([name, item]) => (
                <div key={name} className="cartItem">
                  <input 
                    type="checkbox" 
                    checked={item.selected} 
                    onChange={() => toggleSelect(name)} 
                  />
                  <span>{name} ({item.quantity})</span>
                </div>
              ))}
            </div>

            <div className="summary-row" style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
              <span>Productos</span>
              <strong>{totalItems}</strong>
            </div>

            <div className="summary-row">
              <span>Total</span>
              <strong>${totalPrice.toLocaleString()} MX</strong>
            </div>

            <button className="pay">
              <i className="fa-solid fa-credit-card"></i> Comprar
            </button>
          </aside>
        </main>
      </div>
    </>
  );
}