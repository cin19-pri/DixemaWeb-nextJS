"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./registro_usuario.css";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { registerBuyer } from "@/actions/auth"; // Importamos la Server Action

declare global {
  interface Window {
    iniciarLogicaPassword: () => void;
  }
}

export default function RegistroUsuario() {
  const pathname = usePathname();
  const router = useRouter();

  // Estados para capturar las entradas del usuario
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.iniciarLogicaPassword) {
        window.iniciarLogicaPassword();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const res = await registerBuyer(formData);

    if (res.success) {
      // Redirigir al login o al inicio tras registrarse con éxito
      router.push("/iniciousuarios");
    } else {
      setErrorMsg(res.error || "Ocurrió un error");
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper-register" key={pathname}>
      <Script
        src="/scripts/login.js"
        strategy="afterInteractive"
        onLoad={() => window.iniciarLogicaPassword?.()}
      />

      <div className="main-container">
        <div className="form-section">
          <h1>
            Bienvenidos a<br /> <span>DIXEMA</span>
          </h1>
          <p className="subtitle">
            Llena cada espacio con tu información o inicia sesión con Google
          </p>

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

          <form onSubmit={handleSubmit} id="registrationForm">
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group password-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <i className="fa-solid fa-eye" id="togglePassword"></i>
            </div>

            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="tel"
                name="phone"
                placeholder="Número de teléfono"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-options">
              <label>
                <input type="checkbox" /> Recordar contraseña
              </label>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Guardando..." : "Crear cuenta"}
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
