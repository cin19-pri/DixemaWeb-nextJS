"use client";

import { useEffect } from "react"; 
import { usePathname } from "next/navigation";
import "./login_proveedor.css"; 
import Link from "next/link";
import Script from "next/script";

declare global {
  interface Window {
    iniciarLogicaPassword: () => void;
  }
}

export default function LoginProveedor() {
  const pathname = usePathname();

  useEffect(() => {
    // Usamos un timer de 100ms para asegurar que el DOM cargue antes de activar el ojo
    const timer = setTimeout(() => {
      if (window.iniciarLogicaPassword) {
        window.iniciarLogicaPassword();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]); 

  return (
    /* La 'key' basada en pathname es lo que evita que las letras desaparezcan */
    <div className="main-wrapper-login" key={pathname}>
      <Script 
        src="/scripts/login.js" 
        strategy="afterInteractive" 
        onLoad={() => window.iniciarLogicaPassword?.()}
      />

      <div className="main-container">
        <div className="form-section">
          <h1>Bienvenidos<br /> <span>Nuevamente</span></h1>
          <p className="subtitle">Coloca los datos correspondientes</p>

          <form action="#">
            <div className="input-group">
              <input type="email" placeholder="Email" required />
            </div>
            
            <div className="input-group password-wrapper">
              <input type="password" id="password" placeholder="Password" required />
              <i className="fa-solid fa-eye" id="togglePassword"></i>
            </div>

            <div className="form-options">
              <label>
                <input type="checkbox" /> Recordar contraseña
              </label>
              {/* CAMBIO CLAVE: Usamos 'n' en lugar de 'ñ' para evitar el 404 */}
              <Link href="/olvide_contrasena" className="forgot-link">
                Olvidé mi contraseña
              </Link>
            </div>

            <button type="submit" className="btn-submit">
              Iniciar 
              <div className="arrow-wrapper">
                <div className="arrow"></div>
              </div>
            </button>
          </form>

          <p className="footer-text">
            ¿Aun no tienes una cuenta?{" "}
            <Link href="/registro_proveedor" className="no-underline">
              Registrate aqui
            </Link>
          </p>
        </div>

        <div className="image-section"></div>
      </div>
    </div>
  );
}