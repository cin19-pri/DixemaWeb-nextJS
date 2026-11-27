"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileText,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  crearPedido,
  type CheckoutAddress,
  type CheckoutAddressInput,
  type CheckoutData,
} from "@/actions/checkout";

const RFC_PATTERN = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;

const emptyAddress: CheckoutAddressInput = {
  street: "",
  numExt: "",
  numInt: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  country: "México",
};

function fromSavedAddress(address: CheckoutAddress): CheckoutAddressInput {
  return {
    street: address.street,
    numExt: address.numExt,
    numInt: address.numInt,
    neighborhood: address.neighborhood,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    country: address.country,
  };
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}

export default function CheckoutClient({
  initialData,
}: {
  initialData: CheckoutData;
}) {
  const router = useRouter();
  const defaultAddress =
    initialData.addresses.find((address) => address.isDefault) ??
    initialData.addresses[0] ??
    null;
  const [selectedAddressId, setSelectedAddressId] = useState(
    defaultAddress?.id ?? "",
  );
  const [isEditingAddress, setIsEditingAddress] = useState(
    initialData.addresses.length === 0,
  );
  const [addressForm, setAddressForm] =
    useState<CheckoutAddressInput>(emptyAddress);
  const [requiresInvoice, setRequiresInvoice] = useState(false);
  const [rfc, setRfc] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(
    null,
  );

  const selectedAddress =
    initialData.addresses.find(
      (address) => address.id === selectedAddressId,
    ) ?? null;
  const firstLineError = initialData.lines.find(
    (line) => line.validationError,
  )?.validationError;

  const startEditingAddress = () => {
    setAddressForm(
      selectedAddress ? fromSavedAddress(selectedAddress) : emptyAddress,
    );
    setSelectedAddressId("");
    setIsEditingAddress(true);
    setError(null);
  };

  const useSavedAddress = () => {
    const address =
      initialData.addresses.find((item) => item.isDefault) ??
      initialData.addresses[0];
    if (!address) return;
    setSelectedAddressId(address.id);
    setIsEditingAddress(false);
    setError(null);
  };

  const handleAddressChange = (
    field: keyof CheckoutAddressInput,
    value: string,
  ) => {
    setAddressForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (initialData.lines.length === 0) {
      setError("Agrega productos al carrito antes de continuar.");
      return;
    }
    if (firstLineError) {
      setError(firstLineError);
      return;
    }
    if (!selectedAddressId) {
      const requiredAddressFields = [
        addressForm.street,
        addressForm.numExt,
        addressForm.neighborhood,
        addressForm.city,
        addressForm.state,
      ];
      if (
        requiredAddressFields.some((value) => !value.trim()) ||
        !/^\d{5}$/.test(addressForm.zipCode)
      ) {
        setError("Completa la dirección y verifica que el código postal tenga 5 dígitos.");
        return;
      }
    }

    const normalizedRfc = rfc.trim().toUpperCase();
    if (requiresInvoice && !RFC_PATTERN.test(normalizedRfc)) {
      setError("Escribe un RFC válido de 12 o 13 caracteres para solicitar factura.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await crearPedido({
        addressId: selectedAddressId || null,
        newAddress: selectedAddressId ? null : addressForm,
        requiresInvoice,
        rfc: normalizedRfc,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setCreatedOrderNumber(result.orderNumber);
    } catch {
      setError("No se pudo crear el pedido. Revisa tus datos e inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-container">
        <header className="header-top">
          <button
            className="btn-regresar"
            type="button"
            onClick={() => router.back()}
          >
            <ChevronRight className="back-icon" aria-hidden="true" />
            <span>Volver</span>
          </button>
          <div className="main-title-header">
            <h1>Forma de Pago</h1>
            <p>Completa tus datos para procesar el pedido</p>
            <span className="title-underline" />
          </div>
          <span className="header-spacer" aria-hidden="true" />
        </header>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="grid-checkout">
            <div className="col-inputs">
              <section className="card">
                <h2>
                  <MapPin aria-hidden="true" />
                  Dirección de entrega
                </h2>

                {selectedAddress && !isEditingAddress ? (
                  <div className="address-selected">
                    <div className="address-copy">
                      <strong>
                        {selectedAddress.street} {selectedAddress.numExt}
                        {selectedAddress.numInt
                          ? `, Int. ${selectedAddress.numInt}`
                          : ""}
                      </strong>
                      <span>
                        {selectedAddress.neighborhood}, {selectedAddress.city},{" "}
                        {selectedAddress.state}, C.P. {selectedAddress.zipCode}
                      </span>
                      <span>{selectedAddress.country}</span>
                    </div>
                    {initialData.addresses.length > 1 && (
                      <label className="saved-address-select">
                        Cambiar dirección guardada
                        <select
                          value={selectedAddressId}
                          onChange={(event) =>
                            setSelectedAddressId(event.target.value)
                          }
                        >
                          {initialData.addresses.map((address) => (
                            <option key={address.id} value={address.id}>
                              {address.street} {address.numExt} · {address.city}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    <button
                      type="button"
                      className="edit-address-button"
                      onClick={startEditingAddress}
                    >
                      Editar dirección
                      <ChevronRight aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <div className="address-editor">
                    {initialData.addresses.length > 0 && (
                      <p className="address-note">
                        Al guardar una dirección modificada se creará una nueva;
                        las direcciones asociadas a pedidos anteriores no se alteran.
                      </p>
                    )}
                    <div className="form-grid">
                      <label className="input-group">
                        Calle
                        <input
                          className="input-field"
                          name="street"
                          autoComplete="address-line1"
                          placeholder="Calle"
                          value={addressForm.street}
                          onChange={(event) =>
                            handleAddressChange("street", event.target.value)
                          }
                          required
                        />
                      </label>
                      <label className="input-group">
                        Número exterior
                        <input
                          className="input-field"
                          name="numExt"
                          autoComplete="address-line2"
                          placeholder="Número exterior"
                          value={addressForm.numExt}
                          onChange={(event) =>
                            handleAddressChange("numExt", event.target.value)
                          }
                          required
                        />
                      </label>
                      <label className="input-group">
                        Número interior (opcional)
                        <input
                          className="input-field"
                          name="numInt"
                          placeholder="Número interior"
                          value={addressForm.numInt ?? ""}
                          onChange={(event) =>
                            handleAddressChange("numInt", event.target.value)
                          }
                        />
                      </label>
                      <label className="input-group">
                        Colonia
                        <input
                          className="input-field"
                          name="neighborhood"
                          autoComplete="address-level3"
                          placeholder="Colonia"
                          value={addressForm.neighborhood}
                          onChange={(event) =>
                            handleAddressChange(
                              "neighborhood",
                              event.target.value,
                            )
                          }
                          required
                        />
                      </label>
                      <label className="input-group">
                        Ciudad
                        <input
                          className="input-field"
                          name="city"
                          autoComplete="address-level2"
                          placeholder="Ciudad"
                          value={addressForm.city}
                          onChange={(event) =>
                            handleAddressChange("city", event.target.value)
                          }
                          required
                        />
                      </label>
                      <label className="input-group">
                        Estado
                        <input
                          className="input-field"
                          name="state"
                          autoComplete="address-level1"
                          placeholder="Estado"
                          value={addressForm.state}
                          onChange={(event) =>
                            handleAddressChange("state", event.target.value)
                          }
                          required
                        />
                      </label>
                      <label className="input-group">
                        Código postal
                        <input
                          className="input-field"
                          name="zipCode"
                          autoComplete="postal-code"
                          inputMode="numeric"
                          maxLength={5}
                          pattern="\d{5}"
                          placeholder="00000"
                          value={addressForm.zipCode}
                          onChange={(event) =>
                            handleAddressChange(
                              "zipCode",
                              event.target.value.replace(/\D/g, "").slice(0, 5),
                            )
                          }
                          required
                        />
                      </label>
                      <label className="input-group">
                        País
                        <input
                          className="input-field"
                          name="country"
                          autoComplete="country-name"
                          placeholder="País"
                          value={addressForm.country}
                          onChange={(event) =>
                            handleAddressChange("country", event.target.value)
                          }
                          required
                        />
                      </label>
                    </div>
                    {initialData.addresses.length > 0 && (
                      <button
                        type="button"
                        className="saved-address-button"
                        onClick={useSavedAddress}
                      >
                        Usar dirección guardada
                      </button>
                    )}
                  </div>
                )}
              </section>

              <section className="card">
                <h2>
                  <Truck aria-hidden="true" />
                  Método de envío
                </h2>
                <div className="shipping-option active">
                  <span className="shipping-radio" aria-hidden="true" />
                  <div className="option-info">
                    <strong>Envío estándar · cotización estimada</strong>
                    <small>
                      Entrega estimada: {initialData.estimatedDelivery} ·{" "}
                      {formatPrice(initialData.shippingCost)}
                    </small>
                  </div>
                </div>
                <details className="shipping-details">
                  <summary>
                    <span>Detalle de los artículos</span>
                    <ChevronDown aria-hidden="true" />
                  </summary>
                  <ul>
                    {initialData.lines.map((line) => (
                      <li key={line.productId}>
                        <span>
                          {line.title} × {line.quantity}
                          <small>{line.provider}</small>
                        </span>
                        <strong>{formatPrice(line.subtotal)}</strong>
                      </li>
                    ))}
                  </ul>
                </details>
              </section>

              <section className="card">
                <h2>
                  <CreditCard aria-hidden="true" />
                  Método de pago
                </h2>
                <div className="payment-option">
                  <CreditCard aria-hidden="true" />
                  <div>
                    <strong>Mercado Pago</strong>
                    <p>
                      Pagarás de forma segura con Mercado Pago. Podrás elegir
                      tarjeta, transferencia o efectivo en su pantalla de pago.
                    </p>
                  </div>
                </div>
              </section>

              <section className="card">
                <h2>
                  <FileText aria-hidden="true" />
                  Factura
                </h2>
                <label className="invoice-toggle">
                  <span>¿Requieres factura? (RFC)</span>
                  <input
                    type="checkbox"
                    role="switch"
                    checked={requiresInvoice}
                    onChange={(event) => {
                      setRequiresInvoice(event.target.checked);
                      setError(null);
                      if (!event.target.checked) setRfc("");
                    }}
                  />
                </label>
                {requiresInvoice && (
                  <label className="input-group rfc-group">
                    RFC
                    <input
                      className="input-field"
                      name="rfc"
                      autoComplete="off"
                      maxLength={13}
                      placeholder="XAXX010101000"
                      value={rfc}
                      onChange={(event) =>
                        setRfc(event.target.value.toUpperCase().slice(0, 13))
                      }
                      aria-invalid={rfc.length > 0 && !RFC_PATTERN.test(rfc)}
                      required
                    />
                    {rfc.length > 0 && !RFC_PATTERN.test(rfc) && (
                      <span className="field-error">
                        Ingresa un RFC válido de 12 o 13 caracteres.
                      </span>
                    )}
                  </label>
                )}
              </section>
            </div>

            <aside className="col-summary">
              <section className="resumen-card">
                <h2>Resumen</h2>
                <div className="linea-costo">
                  <span>Subtotal</span>
                  <span>{formatPrice(initialData.subtotal)}</span>
                </div>
                <div className="linea-costo">
                  <span>Gastos de envío</span>
                  <span>{formatPrice(initialData.shippingCost)}</span>
                </div>
                <div className="linea-costo">
                  <span>IVA estimado (16%)</span>
                  <span>{formatPrice(initialData.taxAmount)}</span>
                </div>
                <hr />
                <div className="total-row">
                  <span>Total a pagar</span>
                  <strong className="total-amount">
                    {formatPrice(initialData.totalAmount)}
                  </strong>
                </div>
                <details className="policy-details">
                  <summary>
                    <ShieldCheck aria-hidden="true" />
                    Políticas y privacidad
                  </summary>
                  <p>
                    Los datos de entrega y, si solicitas factura, tu RFC se
                    utilizarán para gestionar este pedido. Esta pantalla crea
                    un pedido pendiente; el pago se completa en Mercado Pago.
                  </p>
                </details>
                <button
                  className="btn-finalizar"
                  type="submit"
                  disabled={
                    isSaving ||
                    createdOrderNumber !== null ||
                    initialData.lines.length === 0 ||
                    firstLineError !== undefined
                  }
                >
                  {isSaving
                    ? "Guardando pedido..."
                    : createdOrderNumber
                      ? "Pedido pendiente creado"
                      : "Continuar de forma segura"}
                </button>
              </section>
            </aside>
          </div>

          {error && (
            <p className="checkout-message error-message" role="alert">
              <AlertCircle aria-hidden="true" />
              {error}
            </p>
          )}
          {firstLineError && (
            <p className="checkout-message error-message" role="alert">
              <AlertCircle aria-hidden="true" />
              {firstLineError}
            </p>
          )}
          {createdOrderNumber && (
            <p className="checkout-message success-message" role="status">
              <Package aria-hidden="true" />
              Pedido {createdOrderNumber} creado como pendiente. No se ha
              cobrado ni se modificaron el stock o el carrito.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
