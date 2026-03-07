import Link from "next/link";
import styles from "../app/iniciousuarios/iniciousuarios.module.css"; // Asegúrate de que el archivo CSS esté en la misma carpeta

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerLeft}>
          <h2>Comunícate con Dixema</h2>
          <p>Conoce más sobre nuestros términos</p>

          <ul className={styles.secondaryLinks}>
            <li>
              <Link href="/terminos" className={styles.secondaryLink}>
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link href="/privacidad" className={styles.secondaryLink}>
                Privacidad
              </Link>
            </li>
            <li>
              <Link href="/acerca" className={styles.secondaryLink}>
                Acerca de Dixema
              </Link>
            </li>
          </ul>
        </div>

        <form
          className={styles.footerForm}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Nombre"
            className={styles.footerInput}
          />
          <input
            type="email"
            placeholder="Email"
            className={styles.footerInput}
          />
          <input
            type="text"
            placeholder="Escribe tu mensaje"
            className={styles.footerInput}
          ></input>
          <button type="submit" className={styles.footerButton}>
            Enviar
          </button>
        </form>
      </div>

      <div className={styles.footerBottom}>
        <ul className={styles.footerBottomLinks}>
          <li>
            <Link href="/" className={styles.footerBottomLink}>
              Inicio
            </Link>
          </li>
          <li>
            <Link href="/productos" className={styles.footerBottomLink}>
              Productos
            </Link>
          </li>
          <li>
            <Link href="/filosofia" className={styles.footerBottomLink}>
              Filosofía
            </Link>
          </li>
          <li>
            <Link href="/about" className={styles.footerBottomLink}>
              About
            </Link>
          </li>
        </ul>
        <p>© Dixema 2026</p>
      </div>
    </footer>
  );
}
