import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "../../../../../src/lib/prismadb";

// Inicializa Stripe con tu clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Endpoint para recibir eventos de Stripe (webhook)
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") as string;
  const buf = await req.arrayBuffer();
  const body = Buffer.from(buf);

  let event: Stripe.Event;
 
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new NextResponse(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const nombre = session.metadata?.nombre;
    const fecha = session.metadata?.fecha;
    const tourId = session.metadata?.tourId;
    const correo = session.customer_email;

    // Verifica que los campos requeridos no sean undefined
    if (!nombre || !fecha || !tourId || !correo) {
      console.error("Faltan datos requeridos para crear la reserva:", { nombre, fecha, tourId, correo });
      return new NextResponse("Faltan datos requeridos para crear la reserva", { status: 400 });
    }

    // Verifica que el tour exista
    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) {
      console.error("El tourId no existe en la base de datos:", tourId);
      return new NextResponse("El tourId no existe", { status: 400 });
    }

    console.log("WEBHOOK - Creando reserva:", { nombre, fecha, tourId, correo });

    try {
      await prisma.reserva.create({
        data: {
          nombre,
          fecha,
          tourId,
          correo,
          estado: "Pagada",
          hora: "", // Ajusta si tienes el dato
        },
      });
      console.log("Reserva creada correctamente");
    } catch (error) {
      console.error("Error al guardar reserva:", error);
      return new NextResponse("Error al guardar reserva", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}