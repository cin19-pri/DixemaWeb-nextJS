"use client";

import { useEffect } from "react"; 
import { useRouter, usePathname } from "next/navigation";
import "./cambiar_contraseña.css"; 
import Script from "next/script";

declare global {
  interface Window {
    iniciarLogicaCambioPassword: () => void;
  }
}

export default function CambiarContrasena() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Obtener los elementos del DOM
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const confirmInput = document.getElementById("confirm-password") as HTMLInputElement;
    const errorAlert = document.getElementById("errorAlert");

    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    // --- Lógica de Validación ---
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
    const passwordsMatch = password === confirmPassword;

    if (hasMinLength && hasUpperCase && hasNumberOrSymbol && passwordsMatch) {
      // Si todo es correcto, ocultamos error y redirigimos
      if (errorAlert) errorAlert.style.display = "none";
      console.log("Contraseña válida, redirigiendo...");
      router.push("bienvenida"); 
    } else {
      // Si falla algo, mostramos la alerta y NO redirigimos
      if (errorAlert) {
        errorAlert.style.display = "flex";
        // Opcional: ocultar la alerta automáticamente después de 3 segundos
        setTimeout(() => {
          errorAlert.style.display = "none";
        }, 3000);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.iniciarLogicaCambioPassword) {
        window.iniciarLogicaCambioPassword();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]); 

  return (
    <div className="background-dots" key={pathname}>
      <Script 
        src="/scripts/cambiar_contraseña.js" 
        strategy="afterInteractive" 
        onLoad={() => window.iniciarLogicaCambioPassword?.()}
      />

      <div className="card">
        <button className="btn-back" onClick={() => router.back()}>
          <svg height="16" width="16" viewBox="0 0 1024 1024">
            <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
          </svg>
          <span>Regresar</span>
        </button>

        <div className="icon-container">
          <div className="icon-circle">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
            </svg>
          </div>
        </div>

        <h2>Ingresa una nueva contraseña</h2>
        <p>de al menos 8 caracteres</p>

        <form id="passwordForm" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">Nueva contraseña</label>
            <div className="password-wrapper">
              <input type="password" id="password" placeholder="Contraseña" required />
              <i className="fa-solid fa-eye toggle-password" data-target="password"></i>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password">Confirmar contraseña</label>
            <div className="password-wrapper">
              <input type="password" id="confirm-password" placeholder="Contraseña" required />
              <i className="fa-solid fa-eye toggle-password" data-target="confirm-password"></i>
            </div>
          </div>

          <div className="strength-meter">
            <div className="strength-bar"></div>
            <div className="strength-bar"></div>
            <div className="strength-bar"></div>
          </div>

          <div className="password-requirements">
            <p className="requirements-title">Tu contraseña debe contener al menos:</p>
            <ul>
              <li className="requirement" id="req-length">
                <span className="icon">×</span> Al menos 8 caracteres
              </li>
              <li className="requirement" id="req-upper">
                <span className="icon">×</span> Una letra mayúscula
              </li>
              <li className="requirement" id="req-number">
                <span className="icon">×</span> Un número o símbolo
              </li>
            </ul>
          </div>

          <div className="actions">
            <button type="button" className="btn-discard" onClick={() => router.push('/login_proveedor')}>
              Regresar a inicio
            </button>
            <button type="submit" className="btn-reset" id="submitBtn">
              Cambiar contraseña
            </button>
          </div>
        </form>
      </div>

      <div id="errorAlert" className="warning" style={{ display: 'none', borderLeft: '5px solid #ce3838' }}>
        <div className="warning__icon">
          <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="m13 14h-2v-5h2zm0 4h-2v-2h2zm-12 3h22l-11-19z" fill="#ce3838"></path>
          </svg>
        </div>
        <div className="warning__title">Revisa que las contraseñas coincidan y cumplan los requisitos</div>
      </div>
    </div>
  );
}