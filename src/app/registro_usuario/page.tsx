"use client";

import { useEffect } from "react"; 
import { usePathname } from "next/navigation";
import "./registro_usuario.css"; 
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";

declare global {
  interface Window {
    iniciarLogicaPassword: () => void;
  }
}

export default function RegistroUsuario() {
  const pathname = usePathname();

  // Eliminamos el estado 'mounted' que causaba el error y usamos solo el pathname
  useEffect(() => {
    // Un pequeño delay asegura que el DOM esté listo antes de ejecutar el JS del ojo
    const timer = setTimeout(() => {
      if (window.iniciarLogicaPassword) {
        window.iniciarLogicaPassword();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]); 

  return (
    /* Usamos el pathname como key aquí para forzar a React a re-renderizar 
       todo el bloque y que las letras no desaparezcan al navegar */
    <div className="main-wrapper-register" key={pathname}>
      <Script 
        src="/scripts/login.js" 
        strategy="afterInteractive" 
        onLoad={() => window.iniciarLogicaPassword?.()}
      />

      <div className="main-container">
        <div className="form-section">
          {/* Título principal solicitado */}
          <h1>Bienvenidos a<br /> <span>DIXEMA</span></h1>
          <p className="subtitle">Llena cada espacio con tu información o inicia sesión con Google</p>

          {/* Botón de Google: Delgado, largo y fuente Poppins */}
          <button type="button" className="google-login-btn">
            <Image 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google Logo" 
              width={18}
              height={18}
            />
            <span>Regístrate con Google</span>
          </button>

          <div className="divider">Datos de usuario</div>

          <form action="#" id="registrationForm">
            <div className="input-group">
              <input type="email" placeholder="Email" required />
            </div>
            
            <div className="input-group password-wrapper">
              <input type="password" id="password" placeholder="Password" required />
              <i className="fa-solid fa-eye" id="togglePassword"></i>
            </div>

            <div className="input-group">
              <input type="text" placeholder="Nombre" required />
            </div>

            <div className="input-group">
              <input type="text" placeholder="Calle" required />
            </div>

            <div className="input-group">
              <input type="text" placeholder="Colonia" required />
            </div>

            <div className="input-group">
              <input type="text" placeholder="Estado" required />
            </div>

            <div className="input-group">
              <input type="text" placeholder="Municipio" required />
            </div>

            <div className="input-group">
              <input type="tel" placeholder="Número de teléfono" required />
            </div>

            <div className="form-options">
              <label>
                <input type="checkbox" /> Recordar contraseña
              </label>
            </div>

            <button type="submit" className="btn-submit">
              Crear cuenta
              <div className="arrow-wrapper">
                <div className="arrow"></div>
              </div>
            </button>
          </form>

          <p className="footer-text">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login_usuario" className="no-underline">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="image-section"></div>
      </div>
    </div>
  );
}