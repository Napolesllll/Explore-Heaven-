import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../../src/lib/prismadb";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { action, nuevaFecha } = await req.json();
 
  try {
    if (action === "cancelar") {
      const reserva = await prisma.reserva.update({
        where: { id: params.id, usuarioEmail: session.user.email },
        data: { estado: "Cancelada" },
      });
      return NextResponse.json({ reserva });
    }
    if (action === "reprogramar" && nuevaFecha) {
      const reserva = await prisma.reserva.update({
        where: { id: params.id, usuarioEmail: session.user.email },
        data: { fecha: nuevaFecha, estado: "Reprogramada" },
      });
      return NextResponse.json({ reserva });
    }
    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar reserva" }, { status: 500 });
  }
}