import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession({ ...authOptions });
    const body = await req.json();
    const { tour, reserva } = body;

    const customerEmail = session?.user?.email;

    if (!customerEmail) {
      return new NextResponse("Usuario no autenticado", { status: 401 });
    }

    // Asegurarnos de que el precio sea un número
    const price = typeof tour.precio === 'string'
      ? parseInt(tour.precio.replace(/\D/g, ""))
      : Math.round(tour.precio);

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: tour.nombre,
              description: tour.descripcion.slice(0, 100),
              images: tour.fotos?.[0]?.startsWith("http") ? [tour.fotos[0]] : [],
            },
            unit_amount: price * 100, // Convertir a centavos
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/reservas?cancelled=true`,
      metadata: {
        nombre: reserva.nombre,
        fecha: reserva.fecha,
        tourId: tour.id,
      },
    });

    return NextResponse.json({ id: stripeSession.id, url: stripeSession.url });
  } catch (error) {
    console.error("Error al crear sesión de Stripe:", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}