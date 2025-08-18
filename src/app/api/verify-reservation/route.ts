import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16'
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

    return NextResponse.json({
      success: true,
      tourName: metadata.tourName || session.line_items?.data[0]?.price?.product?.name || 'Tour Premium',
      date: formattedDate,
      amount: `$${session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00'}`,
      reference: session.id,
      email: session.customer_details?.email || session.customer?.email || 'No proporcionado'
    });


  } catch (error) {
    console.error('Error al verificar reserva:', error);
    return NextResponse.json(
      { error: 'Error al verificar la reserva con Stripe' },
      { status: 500 }
    );
  }
}
