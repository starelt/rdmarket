import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // En la vida real, leeríamos el carrito desde la base de datos o el request
    // const cart = await req.json();
    
    // Hardcodeado para propósitos de demostración en base al checkout actual
    const cartTotal = 4300;
    const shippingCost = 250;
    const finalTotal = cartTotal + shippingCost;
    const platformFee = finalTotal * 0.10; // 10% de comisión

    // Buscamos una tienda para sacar el paypalEmail (Simulación: asumiendo que compramos de la primera tienda)
    const store = await prisma.store.findFirst();

    if (!store?.paypalEmail) {
      return NextResponse.json({ error: "La tienda no ha configurado su cuenta de PayPal." }, { status: 400 });
    }

    // SI TUVIÉRAMOS CREDENCIALES REALES DE PAYPAL, HARÍAMOS ESTO:
    /*
    const paypalAuth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
    const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${paypalAuth}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: { currency_code: "USD", value: (finalTotal / 60).toFixed(2) }, // Convertido a USD aprox
            payee: { email_address: store.paypalEmail },
            payment_instruction: {
              disbursement_mode: "INSTANT",
              platform_fees: [{ amount: { currency_code: "USD", value: (platformFee / 60).toFixed(2) } }]
            }
          }
        ]
      })
    });
    const orderData = await response.json();
    return NextResponse.json({ id: orderData.id });
    */

    // Simulación de respuesta de la API de PayPal
    return NextResponse.json({ id: `PAYPAL-MOCK-ORDER-${Date.now()}` });

  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
