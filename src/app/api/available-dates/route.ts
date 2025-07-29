// src/app/api/available-dates/route.ts

import { NextRequest, NextResponse } from "next/server";
import  prisma  from "../../../lib/prismadb"; // Asegúrate de que la ruta sea correcta

export async function POST(req: NextRequest) {
  try {
    const { date, tourId } = await req.json();

    const existing = await prisma.availableDate.findFirst({
      where: {
        tourId,
        date: new Date(date),
      },
    });

    if (existing) {
      return NextResponse.json({ error: "La fecha ya existe" }, { status: 400 });
    }

    const newDate = await prisma.availableDate.create({
      data: {
        date: new Date(date),
        tourId,
      },
    });

    return NextResponse.json(newDate);
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tourId = searchParams.get("tourId");

  if (!tourId) {
    return NextResponse.json({ error: "Falta tourId" }, { status: 400 });
  }

  const dates = await prisma.availableDate.findMany({
    where: { tourId },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(dates);
}
