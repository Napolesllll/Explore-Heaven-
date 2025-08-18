// app/api/reviews/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "../../../../lib/prismadb";
import { authOptions } from "../../../../app/api/auth/[...nextauth]/route";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "No autorizado. Inicia sesión primero." },
      { status: 401 }
    );
  }

  const reviewId = params.id;

  try {
    // Verificar que la reseña existe y pertenece al usuario
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Reseña no encontrada." },
        { status: 404 }
      );
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar esta reseña." },
        { status: 403 }
      );
    }

    // Eliminar la reseña
    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json(
      { message: "Reseña eliminada correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar la reseña:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}