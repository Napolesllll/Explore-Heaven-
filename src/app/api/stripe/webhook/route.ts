import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "../../../../lib/prismadb";

// Ejecutar en runtime de Node para poder usar Buffer/raw body y prisma libremente
export const runtime = 'nodejs';

// Inicializa Stripe con tu clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

// Endpoint para recibir eventos de Stripe (webhook)
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    console.error('Missing stripe-signature header');
    return new NextResponse('Missing stripe-signature header', { status: 400 });
  }
  const buf = await req.arrayBuffer();
  const body = Buffer.from(buf);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    return new NextResponse(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};
    const nombre = (meta.nombre ?? '').toString().trim();
    const fecha = (meta.fecha ?? '').toString().trim();
    const tourId = (meta.tourId ?? '').toString().trim();
    const correo = (session.customer_email ?? '').toString().trim();

    // Obtener datos adicionales de metadatos si están disponibles
    // Usamos claves ASCII seguras: 'telefono', 'userId', 'adultos', 'ninos'
    const telefono = (meta.telefono ?? '').toString().trim();
    const metaUserId = (meta.userId ?? '').toString().trim();
    const adultos = Number.isFinite(Number(meta.adultos)) ? parseInt(String(meta.adultos), 10) : 1;
    const ninos = Number.isFinite(Number(meta.ninos)) ? parseInt(String(meta.ninos), 10) : 0;

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
    console.log("WEBHOOK - Creando reserva (raw metadata):", {
      nombre,
      fecha,
      tourId,
      correo,
      telefono,
      metaUserId,
      adultos,
      ninos,
    });

    // Parsear fecha en objeto Date. Aceptar strings ISO o timestamps.
    const fechaDate = (() => {
      const d = new Date(fecha as string);
      if (!isNaN(d.getTime())) return d;
      // intentar parsear como entero (timestamp)
      const t = parseInt(fecha as string);
      if (!isNaN(t)) return new Date(t);
      return null;
    })();

    if (!fechaDate) {
      console.error('Fecha inválida en metadata:', fecha);
      return new NextResponse('Fecha inválida en metadata', { status: 400 });
    }

    // Evitar duplicados si Stripe reintenta el webhook: buscar por stripeSessionId (session.id) primero
    try {
      const stripeSessionId = session.id ?? null;

      if (!stripeSessionId) {
        console.warn('No session.id presente en el objeto de Stripe. Se usará búsqueda por campos.');
      }

      // Intentar búsqueda por stripeSessionId
      const existingBySession = stripeSessionId
        ? await prisma.reserva.findUnique({ where: { stripeSessionId } }).catch(() => null)
        : null;

      if (existingBySession) {
        console.log('Reserva ya existe por stripeSessionId, evitando duplicado. Reserva id:', existingBySession.id);
        return NextResponse.json({ received: true });
      }

      // Si no existe por session id, fallback a búsqueda por campos compuestos
      const existing = await prisma.reserva.findFirst({
        where: {
          correo,
          tourId,
          nombre,
          fecha: fechaDate,
        },
      });

      if (existing) {
        console.log('Reserva ya existe por campos (correo/tour/fecha/nombre), evitando duplicado. Reserva id:', existing.id);
        return NextResponse.json({ received: true });
      }

      // Resolver userId para la FK: preferir metaUserId, sino buscar por email, sino crear usuario mínimo
      let userIdToUse = metaUserId || '';
      if (!userIdToUse) {
        const foundUser = await prisma.user.findUnique({ where: { email: correo } });
        if (foundUser) {
          userIdToUse = foundUser.id;
        } else {
          // Crear usuario mínimo para asociar la reserva
          const newUser = await prisma.user.create({
            data: {
              email: correo,
              name: nombre || 'Cliente',
            },
          });
          userIdToUse = newUser.id;
          console.log('Usuario creado automáticamente para reserva:', newUser.id);
        }
      }

      try {
        await prisma.reserva.create({
          data: {
            nombre,
            fecha: fechaDate,
            tourId,
            correo,
            telefono,
            userId: userIdToUse,
            adultos,
            niños: ninos,
            estado: 'Pagada',
            hora: '',
            stripeSessionId,
          },
        });
        console.log('Reserva creada correctamente');
      } catch (createErr) {
        // Manejar unique constraint (p. ej. race condition entre reintentos)
        function isPrismaUniqueError(e: unknown): e is { code: string; meta?: { target?: string[] } } {
          if (typeof e !== 'object' || e === null) return false;
          const rec = e as Record<string, unknown>;
          return 'code' in rec && typeof rec['code'] === 'string';
        }

        if (isPrismaUniqueError(createErr)) {
          const rec = createErr as { code: string; meta?: { target?: string[] } };
          if (rec.code === 'P2002' && Array.isArray(rec.meta?.target) && rec.meta!.target.includes('stripeSessionId')) {
            console.warn('Unique constraint violated for stripeSessionId, assuming duplicate and skipping.');
            return NextResponse.json({ received: true });
          }
        }

        console.error('Error al guardar reserva:', createErr);
        return new NextResponse('Error al guardar reserva', { status: 500 });
      }
    } catch (error) {
      console.error('Error procesando webhook:', error);
      return new NextResponse('Error procesando webhook', { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}