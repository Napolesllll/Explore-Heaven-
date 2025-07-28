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

// Editar un tour
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    const tour = await prisma.tour.update({
      where: { id },
      data,
    });

    return NextResponse.json(tour);
  } catch (error) {
    return NextResponse.json({ error: "Error al editar el tour" }, { status: 500 });
  }
}

// Eliminar un tour
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    await prisma.tour.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar el tour" }, { status: 500 });
  }
}