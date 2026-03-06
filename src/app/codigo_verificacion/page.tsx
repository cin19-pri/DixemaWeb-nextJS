"use client";

import { useRouter, usePathname } from "next/navigation";
import "./codigo_verificacion.css";
import Link from "next/link";

export default function VerificarCodigo() {
  const router = useRouter(); 
  const pathname = usePathname();

  /**
   * Maneja el envío del código OTP.
   * Redirige a la página de cambio de contraseña usando una ruta segura.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // IMPORTANTE: Asegúrate de que el nombre de la carpeta sea 'cambiar_contrasena' 
    // sin la 'ñ' para evitar errores 404 en el navegador.
    router.push("/cambiar_contrasena"); 
  };

  return (
    /* La 'key' fuerza a React a renderizar todo el bloque de nuevo al entrar */
    <div className="background-dots" key={pathname}>
      <div className="card">
        
        {/* Botón regresar usando el historial del router de Next.js */}
        <button className="btn-back" onClick={() => router.back()}>
          <svg height="16" width="16" viewBox="0 0 1024 1024">
            <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
          </svg>
          <span>Regresar</span>
        </button>

        <div className="icon-container">
          <div className="icon-circle">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </div>
        </div>

        <h2>Ingresa tu código</h2>
        <p>Se ha enviado un código al correo <strong>usuario@ejemplo.com</strong></p>

        <form onSubmit={handleSubmit}>
          <div className="otp-container">
            {/* Inputs con inputMode="numeric" para mejorar la experiencia en móviles */}
            <input type="text" maxLength={1} pattern="\d*" inputMode="numeric" required />
            <input type="text" maxLength={1} pattern="\d*" inputMode="numeric" required />
            <input type="text" maxLength={1} pattern="\d*" inputMode="numeric" required />
            <input type="text" maxLength={1} pattern="\d*" inputMode="numeric" required />
          </div>

          <button type="submit" className="btn-reset">
            Continuar
          </button>
        </form>

        <p className="resend-text">
          No he recibido un correo <Link href="#">volver a enviar</Link>
        </p>
      </div>
    </div>
  );
}