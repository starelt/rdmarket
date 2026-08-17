import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await req.json();
    const { orderID } = body; // El ID que retorna PayPal después de que el usuario aprueba en su popup

    // SI TUVIÉRAMOS CREDENCIALES REALES DE PAYPAL, HARÍAMOS ESTO:
    /*
    const paypalAuth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${paypalAuth}`,
      }
    });
    const captureData = await response.json();
    if (captureData.status !== "COMPLETED") {
       return NextResponse.json({ error: "Pago no completado en PayPal" }, { status: 400 });
    }
    */

    // Simulación: Creamos la orden en la BD de RDMarket
    // Asumiremos un carrito fijo para demostración
    const cartTotal = 4300;
    const shippingCost = 250;
    const store = await prisma.store.findFirst();

    if (!store) {
      return NextResponse.json({ error: "Tienda no encontrada" }, { status: 404 });
    }

    const newOrder = await prisma.order.create({
      data: {
        buyerId: session.user.id,
        totalAmount: cartTotal + shippingCost,
        status: "PENDING", // Ya pagada, esperando que la tienda despache
        shippingStatus: "PENDING",
        shippingAddress: "Dirección de Prueba 123",
        paypalOrderId: orderID,
        // Agregamos un item de prueba
        items: {
          create: {
            storeId: store.id,
            productId: (await prisma.product.findFirst({ where: { storeId: store.id } }))?.id || "",
            quantity: 1,
            price: cartTotal
          }
        }
      }
    });

    return NextResponse.json({ success: true, orderId: newOrder.id });

  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
