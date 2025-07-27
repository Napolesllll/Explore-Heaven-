import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../../lib/prismadb";
import { compare, hash } from "bcryptjs";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || !user.hashedPassword) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
 
  const isValid = await compare(currentPassword, user.hashedPassword);
  if (!isValid) {
    return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 });
  }

  const newHashed = await hash(newPassword, 10);
  await prisma.user.update({
    where: { email: session.user.email },
    data: { hashedPassword: newHashed },
  });

  return NextResponse.json({ ok: true });
}