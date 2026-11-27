import { obtenerDatosCheckout } from "@/actions/checkout";
import CheckoutClient from "./checkout-client";
import "./forma_de_pago.css";

export default async function CheckoutPage() {
  const checkoutData = await obtenerDatosCheckout();
  return <CheckoutClient initialData={checkoutData} />;
}
