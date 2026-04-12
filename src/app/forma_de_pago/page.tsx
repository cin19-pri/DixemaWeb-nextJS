'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './forma_de_pago.css';

export default function CheckoutPage() {
  const router = useRouter();

  // ===== LÓGICA SOLO PARA MÉTODO DE ENVÍO =====
  const [envio, setEnvio] = useState<number>(5);

  const subtotal = 50.0;
  const impuestos = 4.0;
  const total = subtotal + envio + impuestos;

  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">

        {/* ===== CABECERA ===== */}
        <div className="header-top">
          <button className="btn-regresar" onClick={() => router.back()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Volver</span>
          </button>

          <div className="main-title-header">
            <h1>Finalizar Compra</h1>
            <p>Completa tus datos para procesar el pedido</p>
          </div>
        </div>

        {/* ===== CONTENIDO ===== */}
        <div className="grid-checkout">

          {/* ===== COLUMNA IZQUIERDA ===== */}
          <div className="col-inputs">

            {/* DIRECCIÓN DE ENTREGA */}
            <div className="card">
              <h2>Dirección de Entrega</h2>
              <div className="form-grid">
                <input className="input-field" placeholder="Nombre completo" />
                <input className="input-field" placeholder="Teléfono" />
                <input className="input-field" placeholder="Dirección" />
                <input className="input-field" placeholder="Ciudad" />
                <input className="input-field full-width" placeholder="Código Postal" />
              </div>
            </div>

            {/* MÉTODO DE ENVÍO (CON FUNCIÓN) */}
            <div className="card">
              <h2>Método de Envío</h2>

              <div
                className={`shipping-option ${envio === 5 ? 'active' : ''}`}
                onClick={() => setEnvio(5)}
              >
                <input type="radio" checked={envio === 5} readOnly />
                <div className="option-info">
                  <strong>Envío Estándar</strong><br />
                  <small>3–5 días hábiles — $5.00</small>
                </div>
              </div>

              <div
                className={`shipping-option ${envio === 10 ? 'active' : ''}`}
                onClick={() => setEnvio(10)}
              >
                <input type="radio" checked={envio === 10} readOnly />
                <div className="option-info">
                  <strong>Envío Express</strong><br />
                  <small>Entrega en 24h — $10.00</small>
                </div>
              </div>
            </div>

            {/* MÉTODO DE PAGO (SOLO TEXTO) */}
            <div className="payment-info-card">
              <div className="icon">💳</div>
              <div className="text">
                <p><strong>Nota importante:</strong></p>
                <p>
                  Al hacer clic en <strong>"Realizar Pago"</strong>, se habilitarán
                  las opciones de tarjeta, PayPal o transferencia.
                </p>
              </div>
            </div>

          </div>

          {/* ===== COLUMNA DERECHA ===== */}
          <div className="col-summary">
            <div className="resumen-card">
              <h2>Resumen</h2>

              <div className="product-preview">
                <h4>Audífonos Bluetooth Pro</h4>
                <p style={{ opacity: 0.8 }}>Unidad: $50.00</p>
              </div>

              <div className="linea-costo">
                <span>Subtotal</span>
                <span>$50.00</span>
              </div>

              <div className="linea-costo">
                <span>Envío</span>
                <span>${envio.toFixed(2)}</span>
              </div>

              <div className="linea-costo">
                <span>Impuestos</span>
                <span>$4.00</span>
              </div>

              <hr style={{ opacity: 0.15, margin: '20px 0' }} />

              <div className="linea-costo">
                <span style={{ fontSize: '1.2rem' }}>Total</span>
                <span className="total-amount">${total.toFixed(2)}</span>
              </div>

              <button className="btn-finalizar">
                Realizar Pago
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}