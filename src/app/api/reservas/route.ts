import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../../../src/lib/prismadb";

// Endpoint GET para obtener las reservas del usuario autenticado, incluyendo el Tour relacionado
export async function GET(req: Request) {
  try {
    // Obtiene la sesión del usuario autenticado
    const session = await getServerSession(authOptions);

    // Si no hay usuario autenticado, retorna un array vacío
    if (!session?.user?.email) {
      return NextResponse.json({ reservas: [] });
    }
 
    // Busca las reservas cuyo campo 'correo' coincide con el email del usuario
    // e incluye la información del Tour relacionado
    const reservas = await prisma.reserva.findMany({
      where: { correo: session.user.email },
      orderBy: { fecha: "desc" },
      include: {
        Tour: true, // Incluye el modelo Tour relacionado
      },
    });

    // Devuelve las reservas encontradas (cada una tendrá un campo .Tour con los datos del tour)
    return NextResponse.json({ reservas });
  } catch (error) {
    // Si ocurre un error, devuelve un array vacío y el error
    return NextResponse.json({ reservas: [], error: "Error al obtener reservas" }, { status: 500 });
  }
}