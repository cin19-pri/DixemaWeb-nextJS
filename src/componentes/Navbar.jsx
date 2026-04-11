"use client";

import Link from "next/link";
import { handleLogout } from "../app/actions";
import Image from "next/image";
import { useShop } from "../context/ShopContext";
import styles from "../app/iniciousuarios/iniciousuarios.module.css";

export default function Navbar({ onSearch }) {
  const { favorites } = useShop();

  return (
    <nav className={styles.nav}>
      {/* FILA SUPERIOR */}
      <div className={styles.navTop}>
        <div className={styles.navLeft}>
          <Link href="#" className={styles.navlogo}>
            <Image
              src="/images/logo-dixema.png"
              alt="logo"
              className={styles.navimage}
              width={100}
              height={100}
            />
            <h2 className={styles.logotext}>DIXEMA</h2>
          </Link>
        </div>

        <div className={styles.navCenter}>
          <div className={styles.searchContainer}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Buscar productos..."
              onChange={(e) => onSearch?.(e.target.value)}
            />
            <button type="button" className={styles.searchButton}>
              <i className="bx bx-search"></i>
            </button>
          </div>
        </div>

        <div className={styles.navRight}>
          {/* FAVORITOS */}
          <Link
            href="/favoritos"
            className={styles.navIcon}
            style={{ position: "relative" }}
          >
            <i className="bx bx-heart"></i> Favoritos
            {favorites.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-10px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  fontSize: "12px",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {favorites.length}
              </span>
            )}
          </Link>

          {/* COMPRAS */}
          <Link href="/carrito" className={styles.navIcon}>
            <i className="bx bx-cart"></i> Mis compras
          </Link>

          {/* USUARIO */}
          <div className={styles.userInfo}>
            <div className={styles.userGroup}>
              <img
                src="/img/avatar.png.png"
                alt="user"
                className={styles.userAvatar}
              />
              <span className={styles.userName}>Manuel Mendoza</span>
            </div>
            <button onClick={() => handleLogout()} className={styles.btnlogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* FILA INFERIOR */}
      <ul className={styles.navBottom}>
        <li>
          <Link href="/iniciousuarios" className={styles.navLink}>
            <i className="bx bx-home"></i> Inicio
          </Link>
        </li>

        <li>
          <Link href="/perfilusuario" className={styles.navLink}>
            <i className="bx bx-user"></i> Perfil
          </Link>
        </li>

        <li>
          <Link href="/notificaciones" className={styles.navLink}>
            <i className="bx bx-bell"></i> Notificaciones
            <span className={styles.notificationBadge}>0</span>
          </Link>
        </li>

        <li>
          <Link href="/ayuda" className={styles.navLink}>
            <i className="bx bx-help-circle"></i> Ayuda
          </Link>
        </li>

        <li>
          <Link href="/categorias" className={styles.navLink}>
            <i className="bx bx-grid-alt"></i> Categorías
          </Link>
        </li>
      </ul>
    </nav>
  );
}
