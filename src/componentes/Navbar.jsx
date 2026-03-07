import Link from "next/link";
import styles from "../app/iniciousuarios/iniciousuarios.module.css";

export default function Navbar({ onSearch }) {
  return (
    <nav className={styles.nav}>
      {/* FILA SUPERIOR */}
      <div className={styles.navTop}>
        <div className={styles.navLeft}>
          <img src="/img/image 52.png" alt="logo" height="70" />
        </div>

        <div className={styles.navCenter}>
          <div className={styles.searchContainer}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Buscar productos..."
              onChange={(e) => onSearch(e.target.value)}
            />
            <button type="button" className={styles.searchButton}>
              <i className="bx bx-search"></i>
            </button>
          </div>
        </div>

        <div className={styles.navRight}>
          <Link href="#favoritos" className={styles.navIcon}>
            <i className="bx bx-heart"></i> Favoritos
          </Link>
          <Link href="/miscompras" className={styles.navIcon}>
            <i className="bx bx-cart"></i> Mis compras
          </Link>
          <div className={styles.userInfo}>
            <img
              src="/img/avatar.png.png"
              alt="user"
              className={styles.userAvatar}
            />
            <span className={styles.userName}>Manuel Mendoza</span>
          </div>
        </div>
      </div>

      {/* FILA INFERIOR */}
      <ul className={styles.navBottom}>
        <li>
          <Link href="../../iniciousuarios" className={styles.navLink}>
            <i className="bx bx-home"></i> Inicio
          </Link>
        </li>
        <li>
          <Link href="@/app/perfilusuario" className={styles.navLink}>
            <i className="bx bx-user"></i> Perfil
          </Link>
        </li>
        <li>
          <Link href="../app/notificaciones" className={styles.navLink}>
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
          <Link href="../app/categorias" className={styles.navLink}>
            <i className="bx bx-grid-alt"></i> Categorías
          </Link>
        </li>
      </ul>
    </nav>
  );
}
