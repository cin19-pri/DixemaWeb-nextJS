"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation"; // Importamos usePathname para la estabilidad visual
import "./login_usuario.css";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";

declare global {
  interface Window {
    iniciarLogicaPassword: () => void;
  }
}

export default function LoginPage() {
  const pathname = usePathname(); // Detecta la ruta actual

  // Esta lógica asegura que el evento del ojo se vincule cada vez que entras a la página
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.iniciarLogicaPassword) {
        window.iniciarLogicaPassword();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    /* Agregamos la key basada en pathname para forzar el repintado de los títulos */
    <div className="main-wrapper-login" key={pathname}>
      <Script
        src="/scripts/login.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.iniciarLogicaPassword) {
            window.iniciarLogicaPassword();
          }
        }}
      />

      <div className="main-container">
        <div className="form-section">
          <h1>
            Bienvenidos
            <br /> <span>Nuevamente</span>
          </h1>
          <p className="subtitle">Coloca los datos correspondientes</p>

          <button type="button" className="google-login-btn">
            <Image
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google Logo"
              width={18}
              height={18}
            />
            <span>Inicia con Google</span>
          </button>

          <div className="divider">tambien puedes iniciar con</div>

          <form action="#">
            <div className="input-group">
              <input type="email" placeholder="Email" required />
            </div>

            <div className="input-group password-wrapper">
              <input
                type="password"
                id="password"
                placeholder="Password"
                required
              />
              <i className="fa-solid fa-eye" id="togglePassword"></i>
            </div>

            <div className="form-options">
              <label>
                <input type="checkbox" /> Recordar contraseña
              </label>
              {/* Ruta corregida a /olvide_contrasena para evitar errores de servidor */}
              <Link href="/olvide_contrasena" className="forgot-link">
                Olvidé mi contraseña
              </Link>
            </div>
            <Link href="/iniciousuarios">
              <button type="submit" className="btn-submit">
                Iniciar
                <div className="arrow-wrapper">
                  <div className="arrow"></div>
                </div>
              </button>
            </Link>
          </form>

          <p className="footer-text">
            ¿Aun no tienes una cuenta?{" "}
            <Link href="/registro_usuario" className="no-underline">
              Registrate aqui
            </Link>
          </p>
        </div>

        <div className="image-section"></div>
      </div>
    </div>
  );
}
