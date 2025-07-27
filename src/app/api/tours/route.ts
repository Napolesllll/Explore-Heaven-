// src/app/api/tours/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../lib/prismadb"; // ✅ Correcto


// Maneja GET para listar tours
export async function GET() {
  try {
    const tours = await prisma.tour.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(tours);
  } catch (error) {
    console.error("Error fetching tours:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 

// Maneja POST para crear un tour
export async function POST(req: Request) {
  try {
    const {
      nombre,
      descripcion,
      salida,
      regreso,
      maxReservas,
      guias,
      imagenUrl,
      info, // ✅ nuevo
    } = await req.json();

    const tour = await prisma.tour.create({
      data: {
        nombre,
        descripcion,
        salida: new Date(salida),
        regreso: new Date(regreso),
        maxReservas,
        guias,
        imagen: imagenUrl,
        info, // ✅ nuevo
      },
    });

    return NextResponse.json(tour);
  } catch (error: any) {
    console.error("Error creando tour:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Solo permitir método DELETE
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.query;

  // Validar ID
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID de tour inválido" });
  }

  try {
    // Eliminar el tour
    await prisma.tour.delete({
      where: { id },
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting tour:", error);
    
    // Manejar error específico cuando el tour no existe
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Tour no encontrado" });
    }
    
    res.status(500).json({ error: "Error al eliminar el tour" });
  }
}