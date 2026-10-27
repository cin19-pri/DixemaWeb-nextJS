"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./login_proveedor.css";
import Link from "next/link";
import Script from "next/script";
import { loginUser } from "@/actions/auth"; // Importamos la Server Action

declare global {
  interface Window {
    iniciarLogicaPassword: () => void;
  }
}

export default function LoginProveedor() {
  const pathname = usePathname();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /*useEffect(() => {
    const timer = setTimeout(() => {
      if (window.iniciarLogicaPassword) {
        window.iniciarLogicaPassword();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);
  */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const res = await loginUser({ email, password });

    if (res.success) {
      // Redirigir según el rol o ir directo a gestion_producto para proveedores
      router.push("/gestion_producto");
    } else {
      setErrorMsg(res.error || "Credenciales incorrectas");
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper-login" key={pathname}>
      <Script
        src="/scripts/login.js"
        strategy="afterInteractive"
        onLoad={() => window.iniciarLogicaPassword?.()}
      />

      <div className="main-container">
        <div className="form-section">
          <h1>
            Bienvenidos
            <br /> <span>Nuevamente</span>
          </h1>
          <p className="subtitle">Coloca los datos correspondientes</p>

          {errorMsg && (
            <p
              style={{
                color: "#d9534f",
                textAlign: "center",
                marginBottom: "10px",
                fontSize: "0.85rem",
              }}
            >
              {errorMsg}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group password-wrapper">
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="fa-solid fa-eye" id="togglePassword"></i>
            </div>

            <div className="form-options">
              <label>
                <input type="checkbox" /> Recordar contraseña
              </label>
              <Link href="/olvide_contrasena" className="forgot-link">
                Olvidé mi contraseña
              </Link>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Entrando..." : "Iniciar"}
              <div className="arrow-wrapper">
                <div className="arrow"></div>
              </div>
            </button>
          </form>

          <p className="footer-text">
            ¿Aún no tienes una cuenta?{" "}
            <Link href="/registro_proveedor" className="no-underline">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div className="image-section"></div>
      </div>
    </div>
  );
}
