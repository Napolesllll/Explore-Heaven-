// src/app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth/auth.config";
import prisma from "../../../lib/prismadb";

// === GET: listar reseñas por tourId ===
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tourId = searchParams.get("tourId");

  if (!tourId) {
    return NextResponse.json(
      {
        error: "Parámetro 'tourId' es requerido en la URL: /api/reviews?tourId=..."
      },
      { status: 400 }
    );
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { tourId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, image: true } } },
    });
    return NextResponse.json(reviews, { status: 200 });
  } catch (err) {
    console.error("Error GET /api/reviews:", err);
    return NextResponse.json(
      { error: "Error al obtener reseñas" },
      { status: 500 }
    );
  }
}

// === POST: crear nueva reseña ===
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  // Normalizar email a minúsculas
  const email = session.user.email.toLowerCase();

  try {
    // Buscar usuario con email normalizado
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      console.error(`Usuario no encontrado para email: ${email}`);
      return NextResponse.json(
        { error: "Usuario no existe en la base de datos" },
        { status: 404 }
      );
    }

    const { tourId, rating, comment } = await req.json();

    // Validación de datos requeridos
    if (!tourId || !rating) {
      return NextResponse.json(
        { error: "Faltan datos requeridos: tourId y rating son obligatorios" },
        { status: 400 }
      );
    }

    // Crear la reseña
    const newReview = await prisma.review.create({
      data: {
        tourId,
        userId: user.id,
        rating: Number(rating), // Asegurar que sea número
        comment: comment || "", // Manejar comentario opcional
      },
      include: { user: { select: { name: true, image: true } } },
    });

    return NextResponse.json(newReview, { status: 201 });

  } catch (err) {
    console.error("Error POST /api/reviews:", err);
    return NextResponse.json(
      { error: "Error interno al crear reseña" },
      { status: 500 }
    );
  }
}