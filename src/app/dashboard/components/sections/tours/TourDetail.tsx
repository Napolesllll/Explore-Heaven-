"use client"

import { notFound } from "next/navigation";
import prisma from "../../../../../lib/prismadb";
import Image from "next/image";
import Link from "next/link";
import { FaUsers, FaCalendarAlt, FaUserTie, FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";

function ParticulasFondo() {
  const [particulas, setParticulas] = useState<any[]>([]);
 
  useEffect(() => {
    const arr = Array.from({ length: 20 }, (_, i) => ({
      key: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      width: Math.random() * 10 + 2,
      height: Math.random() * 10 + 2,
      animationDuration: Math.random() * 5 + 3,
      animationDelay: Math.random() * 2,
    }));
    setParticulas(arr);
  }, []);

  return (
    <div className="absolute inset-0 opacity-20">
      {particulas.map((p) => (
        <div
          key={p.key}
          className="absolute rounded-full bg-indigo-400 animate-pulse"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.width}px`,
            height: `${p.height}px`,
            animationDuration: `${p.animationDuration}s`,
            animationDelay: `${p.animationDelay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default async function TourDetailPage({ params }: { params: { id: string } }) {
  const tour = await prisma.tour.findUnique({
    where: { id: params.id },
  });

  if (!tour) return notFound();

  // Formato de fecha fijo para evitar problemas de hidratación
  const formatDate = (date: Date) =>
    new Date(date).toISOString().slice(0, 16).replace("T", " ");

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-white relative z-10">
      {/* Fondo con efecto de partículas */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0c1d] via-[#1a193b] to-[#2a285f] opacity-95" />
        {/* Solo se renderiza en el cliente */}
        <ParticulasFondo />
      </div>

      {/* Botón de Volver - Posición fija */}
      <div className="fixed top-6 left-6 z-20">
        <Link href="/dashboard">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-indigo-700/80 backdrop-blur-sm hover:bg-indigo-600 transition-all duration-300 shadow-lg hover:shadow-indigo-600/40 border border-indigo-500/30">
            <FaArrowLeft className="text-indigo-200" />
            Volver al Dashboard
          </button>
        </Link>
      </div>

      {/* Hero Tour */}
      <div className="relative h-72 md:h-[28rem] rounded-3xl overflow-hidden shadow-2xl mb-12 border border-indigo-500/30 group transition-all duration-500">
        <Image
          src={tour.imagenUrl}
          alt={tour.nombre}
          fill
          priority
          className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6">
          <div className="inline-block px-4 py-1.5 bg-indigo-700/80 backdrop-blur rounded-full mb-3 text-sm font-medium text-indigo-100 border border-indigo-500/30">
            Experiencia Premium
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
            {tour.nombre}
          </h1>
        </div>
      </div>

      {/* Descripción */}
      <div className="bg-black/20 backdrop-blur-sm border border-indigo-500/30 rounded-3xl p-8 md:p-10 shadow-inner shadow-indigo-500/10 mb-12 transition-all hover:border-indigo-400/50">
        <h2 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center">
          <div className="w-3 h-3 rounded-full bg-indigo-400 mr-2 animate-pulse"></div>
          Descripción del Tour
        </h2>
        <p className="whitespace-pre-line text-lg leading-relaxed text-gray-200 tracking-wide">
          {tour.descripcion}
        </p>
      </div>

      {/* Información Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <InfoItem
          icon={<FaCalendarAlt className="text-indigo-300 text-xl" />}
          label="Salida"
          value={formatDate(tour.salida)}
        />
        <InfoItem
          icon={<FaCalendarAlt className="text-indigo-300 text-xl" />}
          label="Regreso"
          value={formatDate(tour.regreso)}
        />
        <InfoItem
          icon={<FaUsers className="text-indigo-300 text-xl" />}
          label="Capacidad"
          value={`${tour.maxReservas} personas`}
        />
        <InfoItem
          icon={<FaUserTie className="text-indigo-300 text-xl" />}
          label="Guías"
          value={`${tour.guias}`}
        />
      </div>

      {/* Detalles adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-black/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 transition-all hover:border-indigo-400/50">
          <h3 className="text-xl font-semibold mb-4 text-indigo-300">Incluye</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">✓</span>
              <span>Transporte privado con aire acondicionado</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">✓</span>
              <span>Guía turístico certificado</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">✓</span>
              <span>Entradas a todas las atracciones</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">✓</span>
              <span>Almuerzo gourmet con opciones vegetarianas</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 transition-all hover:border-indigo-400/50">
          <h3 className="text-xl font-semibold mb-4 text-indigo-300">Recomendaciones</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">•</span>
              <span>Usar calzado cómodo para caminar</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">•</span>
              <span>Llevar protección solar y sombrero</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">•</span>
              <span>Cámara fotográfica para capturar momentos</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-400 mr-2">•</span>
              <span>Llegar 15 minutos antes de la salida</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 p-6 bg-black/20 backdrop-blur-sm rounded-2xl border border-indigo-500/20 hover:border-indigo-400/50 transition-all duration-300 shadow-sm hover:shadow-indigo-500/20 group">
      <div className="p-3 rounded-xl bg-indigo-900/50 border border-indigo-500/20 shadow-inner group-hover:bg-indigo-800/50 transition-all">
        {icon}
      </div>
      <div>
        <div className="text-sm text-indigo-300">{label}</div>
        <div className="text-lg font-semibold text-white mt-1">{value}</div>
      </div>
    </div>
  );
}