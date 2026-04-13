import { products } from "@/datac/products";

export const responses = [
  {
    keywords: ["comprar", "producto"],
    answer: "🛒 Puedes explorar los productos en la sección de categorías."
  },
  {
    keywords: ["vender", "proveedor"],
    answer: "📦 Puedes registrarte como proveedor para comenzar a vender."
  },
  {
    keywords: ["pedido", "orden"],
    answer: "📍 Puedes revisar el estado de tu pedido en tu perfil."
  },
  {
    keywords: ["envio", "entrega"],
    answer: "🚚 Realizamos envíos a todo México."
  },
  {
    keywords: ["hola", "buenas"],
    answer: "👋 Hola, soy tu asistente Dixema ¿En qué puedo ayudarte?"
  }
];

export function getResponse(msg: string) {
  const text = msg.toLowerCase();

  // 🔍 BUSCAR PRODUCTO POR NOMBRE
  const foundProduct = products.find((p) =>
    p.title.toLowerCase().includes(text)
  );

  if (foundProduct) {
    return `🔍 Encontré este producto:\n\n${foundProduct.title}\n💰 ${foundProduct.price}`;
  }

  // 🛒 RECOMENDAR PRODUCTOS
  if (text.includes("recomienda") || text.includes("quiero ver")) {
    const randomProducts = products.slice(0, 3);

    return `🛒 Te recomiendo estos productos:\n\n${randomProducts
      .map((p) => `• ${p.title} - ${p.price}`)
      .join("\n")}`;
  }

  // 🧠 RESPUESTAS NORMALES
  const found = responses.find(r =>
    r.keywords.some(k => text.includes(k))
  );

  return found
    ? found.answer
    : "🤖 Puedo ayudarte con compras, productos, envíos o pedidos.";
}