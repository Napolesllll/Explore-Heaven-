import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prismadb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Versión explícita usando Promise.resolve
    const id = (await Promise.resolve(params)).id;
    
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