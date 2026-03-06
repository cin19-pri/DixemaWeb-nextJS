"use client";

import { useEffect } from "react"; 
import { usePathname } from "next/navigation";
import "./registro_proveedor.css"; 
import Link from "next/link";
import Script from "next/script";

declare global {
  interface Window {
    iniciarLogicaPassword: () => void;
  }
}

export default function RegistroProveedor() {
  const pathname = usePathname();

  useEffect(() => {
    // Asegura que la lógica del ojo se active tras la navegación
    const timer = setTimeout(() => {
      if (window.iniciarLogicaPassword) {
        window.iniciarLogicaPassword();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]); 

  return (
    <div className="main-wrapper-register" key={pathname}>
      <Script 
        src="/scripts/login.js" 
        strategy="afterInteractive" 
        onLoad={() => window.iniciarLogicaPassword?.()}
      />

      <div className="main-container">
        <div className="form-section">
          <h1>Bienvenidos a<br /> <span>DIXEMA</span></h1>
          <p className="subtitle">Recuerda colocar los datos correctos y reales</p>

          <form action="#" id="registrationForm">
            <div className="input-group">
              <input type="email" placeholder="Email" required />
            </div>
            
            <div className="input-group password-wrapper">
              <input type="password" id="password" placeholder="Password" required />
              <i className="fa-solid fa-eye" id="togglePassword"></i>
            </div>

            <div className="input-group">
              <input type="text" placeholder="Nombre de negocio o empresa" required />
            </div>

            <div className="input-group">
              <input type="text" placeholder="RFC" required />
            </div>

            <div className="input-group">
              <input type="tel" placeholder="Número de teléfono" required />
            </div>

            <div className="input-group">
              <input type="text" placeholder="Nombre" required />
            </div>

            <div className="input-group">
              <input type="text" placeholder="Dirección" required />
            </div>

            <div className="form-options">
              <label>
                <input type="checkbox" /> Recordar contraseña
              </label>
            </div>

            <button type="submit" className="btn-submit">
              Crear cuenta?
              <div className="arrow-wrapper">
                <div className="arrow"></div>
              </div>
            </button>
          </form>

          <p className="footer-text">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login_proveedor" className="no-underline">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="image-section"></div>
      </div>
    </div>
  );
}