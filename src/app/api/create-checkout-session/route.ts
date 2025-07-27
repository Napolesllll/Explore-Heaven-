import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Inicializa Stripe con tu clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});
 
// Endpoint para crear una sesión de pago de Stripe
export async function POST(req: Request) {
  try {
    // Obtiene la sesión del usuario autenticado
    const session = await getServerSession({ ...authOptions });

    // Parsea el cuerpo de la petición
    const body = await req.json();
    const { tour, reserva } = body;

    // Usa SIEMPRE el email del usuario autenticado para asociar la reserva
    const customerEmail = session?.user?.email;

    if (!customerEmail) {
      // Si no hay usuario autenticado, retorna error
      return new NextResponse("Usuario no autenticado", { status: 401 });
    }

    // Crea la sesión de Stripe
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
            unit_amount: parseInt(tour.precio.replace(/\D/g, "")) * 100, // convierte "100 USD" a 10000 centavos
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail, // <-- SIEMPRE el email autenticado
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/reservas?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      metadata: {
        nombre: reserva.nombre,
        fecha: reserva.fecha,
        tourId: tour.id,
        // Puedes agregar más campos si lo necesitas
      },
    });

    // Devuelve el id de la sesión de Stripe al frontend
    return NextResponse.json({ id: stripeSession.id });
  } catch (error) {
    console.error("Error al crear sesión de Stripe:", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}