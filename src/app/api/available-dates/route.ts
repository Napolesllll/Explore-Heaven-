// src/app/api/available-dates/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth/auth.config';
import prisma from "../../../lib/prismadb"; // Asegúrate de que la ruta sea correcta

export async function POST(req: NextRequest) {
  try {
    const { date, tourId } = await req.json();

    const existing = await prisma.availableDate.findFirst({
      where: {
        tourId,
        date: new Date(date),
      },
    });

    if (existing) {
      return NextResponse.json({ error: "La fecha ya existe" }, { status: 400 });
    }

    const newDate = await prisma.availableDate.create({
      data: {
        date: new Date(date),
        tourId,
      },
    });

    return NextResponse.json(newDate);
  } catch (error) {
    console.error('Error creando fecha disponible:', error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tourId = searchParams.get("tourId");

  if (!tourId) {
    return NextResponse.json({ error: "Falta tourId" }, { status: 400 });
  }

  try {
    // Obtener la sesión del usuario para validaciones personalizadas
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Obtener todas las fechas disponibles para el tour
    const allDates = await prisma.availableDate.findMany({
      where: { tourId },
      orderBy: { date: "asc" },
    });

    // Para cada fecha, verificar disponibilidad y restricciones del usuario
    const datesWithAvailability = await Promise.all(
      allDates.map(async (date) => {
        // Contar reservas activas para esta fecha
        const reservasCount = await prisma.reserva.count({
          where: {
            tourId,
            fecha: date.date,
            estado: {
              not: 'Cancelada' // No contar canceladas
            }
          }
        });

        // Verificar si el usuario ya tiene una reserva en esta fecha para este tour
        let userHasReservation = false;
        if (userId) {
          const userReservation = await prisma.reserva.findFirst({
            where: {
              userId,
              tourId,
              fecha: date.date,
              estado: {
                not: 'Cancelada'
              }
            }
          });
          userHasReservation = !!userReservation;
        }

        // Determinar disponibilidad
        const isAvailable = reservasCount < 3 && !userHasReservation;
        const spotsLeft = 3 - reservasCount;

        return {
          ...date,
          reservasCount,
          spotsLeft: Math.max(0, spotsLeft),
          isAvailable,
          userHasReservation,
          reason: !isAvailable
            ? (userHasReservation
              ? 'Ya tienes una reserva para esta fecha'
              : 'Fecha completamente reservada')
            : null
        };
      })
    );

    // Filtrar solo fechas futuras
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDates = datesWithAvailability.filter(
      date => new Date(date.date) >= today
    );

    console.log(`📅 Fechas procesadas para tour ${tourId}:`, {
      total: allDates.length,
      futuras: futureDates.length,
      disponibles: futureDates.filter(d => d.isAvailable).length
    });

    return NextResponse.json(futureDates);

  } catch (error) {
    console.error('Error obteniendo fechas disponibles:', error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}