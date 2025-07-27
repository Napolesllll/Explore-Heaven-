import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../../lib/prismadb";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  } 

  const { name, email } = await req.json();

  // Opcional: Validar datos aquí

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name, email },
    });
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 });
  }
}