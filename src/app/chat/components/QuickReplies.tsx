type QuickRepliesProps = {
  send: (message: string) => void;
};

export default function QuickReplies({ send }: QuickRepliesProps) {
  return (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", padding: "6px" }}>
      <button onClick={() => send("comprar")}>Comprar</button>
      <button onClick={() => send("vender")}>Vender</button>
      <button onClick={() => send("pedido")}>Pedido</button>
    </div>
  );
}