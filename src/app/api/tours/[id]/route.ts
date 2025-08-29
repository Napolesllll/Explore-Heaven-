// app/api/tours/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prismadb';

// Tipo para Next.js 15 - params es ahora una Promise
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    // Await params directamente para obtener los parámetros
    const { id } = await params;

    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        availableDates: true
      }
    });

    if (!tour) {
      return new NextResponse("Tour not found", { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('[TOUR_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}