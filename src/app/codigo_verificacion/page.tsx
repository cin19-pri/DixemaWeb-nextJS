"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPasswordResetCode } from "@/actions/auth";
import Link from "next/link";
import "./codigo_verificacion.css";

function CodigoVerificacionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // Regresamos a 6 dígitos
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");

    const res = await verifyPasswordResetCode(email, fullCode);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push(
        `/cambiar_contrasena?email=${encodeURIComponent(email)}&code=${fullCode}`,
      );
    }
  };

  return (
    <div className="background-dots">
      <div className="card">
        {/* Botón regresar */}
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-back"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Regresar
        </button>

        {/* Icono de correo */}
        <div className="icon-container">
          <div className="icon-circle">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
        </div>

        <h2>Ingresa tu código</h2>
        <p className="subtitle">
          Se ha enviado un código al correo <br />
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          {/* Contenedor de inputs (6 casillas) */}
          <div className="otp-container">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`code-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
              />
            ))}
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-reset">
            Continuar
          </button>
        </form>

        <p className="resend-text">
          No he recibido un correo{" "}
          <Link
            href={`/restablecer_contrasena?email=${encodeURIComponent(email)}`}
          >
            volver a enviar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CodigoVerificacionPage() {
  return (
    <Suspense fallback={<div className="background-dots">Cargando...</div>}>
      <CodigoVerificacionForm />
    </Suspense>
  );
}
