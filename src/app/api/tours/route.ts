import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";

// GET: Listar tours
export async function GET() {
  try {
    const tours = await prisma.tour.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(tours);
  } catch (error) {
    console.error("Error fetching tours:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST: Crear tour
export async function POST(req: Request) {
  try {
    const {
      nombre,
      descripcion,
      salida,
      regreso,
      maxReservas,
      guias,
      precio,
      ubicacion,
      imagenUrl,
      gallery,
      info,
    } = await req.json();

    const tour = await prisma.tour.create({
      data: {
        nombre,
        descripcion,
        salida: new Date(salida),
        regreso: new Date(regreso),
        maxReservas,
        guias,
        precio,
        ubicacion,
        imagenUrl,
        gallery,
        info,
      },
    });

    return NextResponse.json(tour);
  } catch (error: any) {
    console.error("Error creando tour:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}