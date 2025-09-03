import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil"
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Se requiere el ID de sesión' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product', 'customer']
    });

    // Obtener metadatos de la reserva
    const metadata = session.metadata || {};

    // Formatear fecha si existe en metadata
    let formattedDate = 'Fecha no especificada';
    if (metadata.fecha) {
      const dateObj = new Date(metadata.fecha);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }

    // Obtener nombre del producto de manera segura
    let tourName = 'Tour Premium'; // Valor por defecto

    if (metadata.tourName) {
      tourName = metadata.tourName;
    } else if (session.line_items?.data[0]?.price?.product) {
      const product = session.line_items.data[0].price.product;
      // Verificar que el producto no sea string y tenga la propiedad name
      if (typeof product === 'object' && product !== null && 'name' in product) {
        tourName = product.name || 'Tour Premium';
      }
    }

    // Obtener email del cliente de manera segura
    let customerEmail = 'No proporcionado';

    if (session.customer_details?.email) {
      customerEmail = session.customer_details.email;
    } else if (session.customer) {
      const customer = session.customer;
      // Verificar que el customer no sea string y tenga la propiedad email
      if (typeof customer === 'object' && customer !== null && 'email' in customer) {
        customerEmail = customer.email || 'No proporcionado';
      }
    }

    return NextResponse.json({
      success: true,
      tourName,
      date: formattedDate,
      amount: `${session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00'}`,
      reference: session.id,
      email: customerEmail
    });

  } catch (error) {
    console.error('Error al verificar reserva:', error);
    return NextResponse.json(
      { error: 'Error al verificar la reserva con Stripe' },
      { status: 500 }
    );
  }
}