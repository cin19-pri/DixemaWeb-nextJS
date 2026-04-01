"use client";

import "./carrito.css";
import { useState } from "react";
import Image from "next/image";

type CartItem = {
  price: number;
  quantity: number;
  selected: boolean;
};

export default function Page() {
  const products = [
    {
      name: "Laptop Gamer",
      price: 3000,
      img: "/laptop.png",
      badge: "Nuevo",
      desc: "Alto rendimiento para juegos y trabajo.",
    },
    {
      name: "Auriculares",
      price: 850,
      img: "/auriculares.png",
      badge: "Oferta",
      desc: "Sonido premium con cancelación.",
    },
    {
      name: "Smartwatch",
      price: 1200,
      img: "/smartwatch.png",
      badge: "Top",
      desc: "Monitoreo de salud y actividad.",
    },
    {
      name: "Teclado Mecánico",
      price: 950,
      img: "/teclado.png",
      badge: "Nuevo",
      desc: "RGB y switches profesionales.",
    },
  ];

  const [counts, setCounts] = useState<Record<string, number>>({
    "Laptop Gamer": 1,
    Auriculares: 1,
    Smartwatch: 1,
    "Teclado Mecánico": 1,
  });

  const [cart, setCart] = useState<Record<string, CartItem>>({});

  const addToCart = (p: typeof products[0]) => {
    setCart(prev => ({
      ...prev,
      [p.name]: {
        price: p.price,
        quantity: (prev[p.name]?.quantity || 0) + counts[p.name],
        selected: true,
      },
    }));
  };

  const toggleItem = (name: string) => {
    setCart(prev => ({
      ...prev,
      [name]: { ...prev[name], selected: !prev[name].selected },
    }));
  };

  const totalItems = Object.values(cart)
    .filter(i => i.selected)
    .reduce((a, b) => a + b.quantity, 0);

  const totalPrice = Object.values(cart)
    .filter(i => i.selected)
    .reduce((a, b) => a + b.quantity * b.price, 0);

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <i className="fa-solid fa-cart-shopping"></i>
          <span className="logo">Mi Carrito</span>
        </div>

        <div className="nav-search">
          <i className="fa fa-search"></i>
          <input type="text" placeholder="Buscar..." />
        </div>

        <ul className="nav-menu">
          <li><a href="/">Inicio</a></li>
          <li><a href="/guardados">Guardados</a></li>
          <li><a href="/chat">Chat</a></li>
          <li className="active"><a href="/carrito">Carrito</a></li>
          <li><a href="/perfil">Perfil</a></li>
        </ul>
      </nav>

      <div className="container">
        <main className="layout">
          <section className="products">
            {products.map(p => (
              <article className="card" key={p.name}>
                <span className="badge">{p.badge}</span>

                <Image src={p.img} alt={p.name} width={300} height={180} />

                <div className="content">
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>

                  <div className="price-row">
                    <span className="price">${p.price} MX</span>
                    <span className="stock">Disponible</span>
                  </div>

                  <div className="controls">
                    <div className="counter">
                      <button
                        onClick={() =>
                          setCounts(c => ({
                            ...c,
                            [p.name]: Math.max(1, c[p.name] - 1),
                          }))
                        }
                      >
                        -
                      </button>
                      <span>{counts[p.name]}</span>
                      <button
                        onClick={() =>
                          setCounts(c => ({
                            ...c,
                            [p.name]: c[p.name] + 1,
                          }))
                        }
                      >
                        +
                      </button>
                    </div>

                    <button className="add" onClick={() => addToCart(p)}>
                      <i className="fa fa-cart-plus"></i>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="summary">
            <h2>Resumen</h2>

            {Object.entries(cart).map(([name, item]) => (
              <div key={name} style={{ marginBottom: 10 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleItem(name)}
                  />{" "}
                  {name} ({item.quantity})
                </label>
              </div>
            ))}

            <div className="row">
              <span>Productos</span>
              <strong>{totalItems}</strong>
            </div>

            <div className="row">
              <span>Total</span>
              <strong>${totalPrice.toLocaleString()} MX</strong>
            </div>

            <a href="/forma_de_pago" className="pay">
              <i className="fa-solid fa-credit-card"></i>
              Comprar
            </a>
          </aside>
        </main>
      </div>
    </>
  );
}