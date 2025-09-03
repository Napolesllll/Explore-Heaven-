import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth/auth.config";

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(req: Request) {
  try {
    // Tipo local mínimo para la sesión (evita uso de any)
    type SessionUser = { id?: string; email?: string };
    const session = await getServerSession(authOptions);
    const sessionUser = (session as unknown as { user?: SessionUser })?.user;
    const body = await req.json();
    const { tour, reserva } = body;

    const customerEmail = sessionUser?.email;

    if (!customerEmail) {
      return new NextResponse("Usuario no autenticado", { status: 401 });
    }

    // Validaciones básicas
    if (!tour || !reserva) {
      return new NextResponse('tour y reserva son requeridos', { status: 400 });
    }

    // Asegurarnos de que el precio sea un número
    const price = typeof tour.precio === 'string'
      ? parseInt(tour.precio.replace(/\D/g, ""))
      : Math.round(tour.precio || 0);

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
        // Usar solo claves ASCII y valores simples. Evitar acentos y caracteres especiales en las claves.
        nombre: String(reserva.nombre || ''),
        fecha: String(reserva.fecha || ''),
        tourId: String(tour.id || ''),
        telefono: String(reserva.telefono || ''),
        userId: String(session?.user?.id || session?.user?.email || ''),
        adultos: String(reserva.adultos ?? '1'),
        ninos: String(reserva.ninos ?? reserva.niños ?? '0'),
      },
    });

    return NextResponse.json({ id: stripeSession.id, url: stripeSession.url });
  } catch (error) {
    console.error("Error al crear sesión de Stripe:", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}