export const responses = [
  {
    keywords: ["comprar"],
    answer: "🛒 Ve a categorías para comprar productos."
  },
  {
    keywords: ["vender"],
    answer: "📦 Regístrate como proveedor para vender."
  },
  {
    keywords: ["pedido"],
    answer: "📍 Revisa tu pedido en tu perfil."
  }
];

export function getResponse(msg: string) {
  const text = msg.toLowerCase();

  const found = responses.find(r =>
    r.keywords.some(k => text.includes(k))
  );

  return found
    ? found.answer
    : "🤖 Intenta escribir: comprar, vender o pedido.";
}