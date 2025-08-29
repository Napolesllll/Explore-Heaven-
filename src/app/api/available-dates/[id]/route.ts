// src/app/api/available-dates/[id]/route.ts
import prisma from "../../../../lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

// Tipo para Next.js 15 - params es ahora una Promise
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    // Await params para obtener los parámetros
    const { id } = await params;

    await prisma.availableDate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error eliminando fecha disponible:', error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}