export default function Cart() {
  const cartItems = [
    {
      id: 1,
      name: "Batería LTH 12V",
      store: "Auto Adornos El Primo",
      price: 3500.0,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1605336060136-11f8fa5534cb?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 2,
      name: "Aceite de Motor Sintético 5W-30",
      store: "Gomería Los Hermanos",
      price: 800.0,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1620021614282-358ce746779d?auto=format&fit=crop&w=200&q=80",
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <h1 style={{ marginBottom: "2rem" }}>Tu Carrito de Compras</h1>
      
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 60%" }}>
          {cartItems.map((item) => (
            <div className="card" key={item.id} style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", padding: "1rem" }}>
              <img src={item.image} alt={item.name} style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "1.2rem" }}>{item.name}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>🏪 {item.store}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>RD$ {item.price.toFixed(2)}</span>
                  <div>
                    <button className="btn" style={{ background: "var(--border)", padding: "5px 15px" }}>-</button>
                    <span style={{ padding: "0 15px", fontWeight: "bold" }}>{item.quantity}</span>
                    <button className="btn" style={{ background: "var(--border)", padding: "5px 15px" }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass" style={{ flex: "1 1 35%", padding: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem" }}>Resumen del Pedido</h2>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span>Subtotal</span>
            <span style={{ fontWeight: "bold" }}>RD$ {subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span>Envío</span>
            <span style={{ fontWeight: "bold" }}>RD$ 250.00</span>
          </div>
          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "1.5rem 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", fontSize: "1.5rem", fontWeight: "bold" }}>
            <span>Total</span>
            <span style={{ color: "var(--primary)" }}>RD$ {(subtotal + 250).toFixed(2)}</span>
          </div>

          <a href="/checkout" className="btn btn-primary" style={{ width: "100%", padding: "15px", fontSize: "1.2rem", background: "#0070ba", display: "flex", justifyContent: "center" }}>
             💳 Proceder al Checkout
          </a>
          <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "1rem" }}>
            Pago seguro procesado por PayPal Commerce Platform.
          </p>
        </div>
      </div>
    </div>
  );
}
