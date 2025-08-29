// src/app/api/guias/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prismadb";

// Obtener disponibilidad de guías por fecha y tour, o lista completa de guías
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fecha = searchParams.get("fecha");
  const tourId = searchParams.get("tourId");
  const action = searchParams.get("action"); // Para diferenciar entre diferentes acciones

  try {
    // Caso 1: Obtener fechas disponibles para un tour
    if (action === "fechas-disponibles") {
      if (!tourId) {
        return NextResponse.json({ error: "El parámetro 'tourId' es requerido" }, { status: 400 });
      }

      // Obtener todas las reservas para el tour
      const reservas = await prisma.reserva.findMany({
        where: { tourId: parseInt(tourId, 10) },
        select: { fecha: true },
      });

      // Obtener todas las fechas únicas con reservas
      const fechasReservadas = new Set(reservas.map((reserva) => reserva.fecha));

      // Generar fechas disponibles (por ejemplo, los próximos 30 días)
      const fechasDisponibles: string[] = [];
      const hoy = new Date();
      for (let i = 0; i < 30; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + i);
        const fechaStr = fecha.toISOString().split("T")[0];
        if (!fechasReservadas.has(fechaStr)) {
          fechasDisponibles.push(fechaStr);
        }
      }

      return NextResponse.json({ fechas: fechasDisponibles });
    }

    // Caso 2: Si se proporcionan `fecha` y `tourId`, devolver disponibilidad
    if (fecha && tourId) {
      // Validar formato de la fecha
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return NextResponse.json({ error: "El formato de 'fecha' es inválido. Use 'YYYY-MM-DD'" }, { status: 400 });
      }

      // Validar que `tourId` sea un número válido
      const tourIdNumber = parseInt(tourId, 10);
      if (isNaN(tourIdNumber)) {
        return NextResponse.json({ error: "El 'tourId' debe ser un número válido" }, { status: 400 });
      }

      // Obtener las reservas existentes para la fecha y el tour
      const reservas = await prisma.reserva.findMany({
        where: {
          fecha,
          tourId: tourIdNumber,
        },
        select: {
          hora: true,
          guiaId: true,
        },
      });

      // Contar cuántos guías están ocupados por hora
      const disponibilidad: { [hora: string]: number } = {};
      reservas.forEach((reserva) => {
        disponibilidad[reserva.hora] = (disponibilidad[reserva.hora] || 0) + 1;
      });

      return NextResponse.json({ disponibilidad });
    }

    // Caso 3: Si no se proporcionan `fecha` y `tourId`, devolver lista completa de guías
    const guias = await prisma.guia.findMany({
      select: {
        id: true,
        nombre: true,
        foto: true,
        edad: true,
        descripcion: true,
        celular: true,
        cedula: true,
      },
    });

    return NextResponse.json({ guias });
  } catch (error) {
    console.error("Error al obtener guías:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// Crear un nuevo guía o una reserva
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // Caso 1: Crear una reserva
    if (action === "crear-reserva") {
      const { nombre, correo, fecha, hora, tourId } = body;

      // Validar los datos de la reserva
      if (!nombre || !correo || !fecha || !hora || !tourId) {
        return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
      }

      // Validar formato de la fecha
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return NextResponse.json({ error: "El formato de 'fecha' es inválido. Use 'YYYY-MM-DD'" }, { status: 400 });
      }

      // Obtener guías disponibles para la fecha y hora
      const reservas = await prisma.reserva.findMany({
        where: { fecha, hora, tourId: parseInt(tourId, 10) },
        select: { guiaId: true },
      });

      const guiasReservados = new Set(reservas.map((reserva) => reserva.guiaId));
      const guias = await prisma.guia.findMany({
        where: { id: { notIn: Array.from(guiasReservados) } },
        select: { id: true },
      });

      if (guias.length === 0) {
        return NextResponse.json({ error: "No hay guías disponibles para esta fecha y hora" }, { status: 400 });
      }

      // Asignar el primer guía disponible
      const guiaAsignado = guias[0];

      // Crear la reserva
      const nuevaReserva = await prisma.reserva.create({
        data: {
          nombre,
          correo,
          fecha,
          hora,
          tourId: parseInt(tourId, 10),
          guiaId: guiaAsignado.id,
        },
      });

      return NextResponse.json({ reserva: nuevaReserva });
    }

    // Caso 2: Crear un nuevo guía (comportamiento por defecto)
    const { nombre, foto, edad, descripcion, celular, cedula } = body;

    // Validar los datos del guía
    if (!nombre || !foto || !edad || !descripcion || !celular || !cedula) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // Convertir edad a número
    const edadInt = parseInt(edad, 10);

    // Validar que edad sea un número válido
    if (isNaN(edadInt)) {
      return NextResponse.json({ error: "La edad debe ser un número válido" }, { status: 400 });
    }

    // Crear el nuevo guía
    const nuevoGuia = await prisma.guia.create({
      data: {
        nombre,
        foto,
        edad: edadInt,
        descripcion,
        celular,
        cedula,
      },
    });

    return NextResponse.json({ guia: nuevoGuia });
  } catch (error) {
    console.error("Error al crear:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// Editar un guía existente
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, nombre, foto, edad, descripcion, celular, cedula } = body;

    if (!id) {
      return NextResponse.json({ error: "ID del guía es obligatorio" }, { status: 400 });
    }

    // Validar y convertir edad si se proporciona
    const edadInt = edad ? parseInt(edad, 10) : undefined;
    if (edad && isNaN(edadInt)) {
      return NextResponse.json({ error: "La edad debe ser un número válido" }, { status: 400 });
    }

    const guiaActualizado = await prisma.guia.update({
      where: { id: parseInt(id, 10) },
      data: {
        nombre,
        foto: foto === "" ? null : foto,
        edad: edadInt,
        descripcion,
        celular,
        cedula,
      },
    });

    return NextResponse.json({ guia: guiaActualizado });
  } catch (error) {
    console.error("Error al editar el guía:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// Eliminar un guía
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "El parámetro 'id' es requerido" }, { status: 400 });
  }

  try {
    // Eliminar el guía
    await prisma.guia.delete({
      where: {
        id: parseInt(id, 10),
      },
    });

    return NextResponse.json({ message: "Guía eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el guía:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}