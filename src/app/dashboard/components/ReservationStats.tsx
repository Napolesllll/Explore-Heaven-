"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Award,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
} from "lucide-react";
import { useReservationStats } from "./hooks/useReservations";
import { ReservationStatus } from "../../../types/reservations";

// Componente para tarjeta de estadística
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = "cyan",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  trend?: "up" | "down";
  trendValue?: string;
  color?: "cyan" | "purple" | "green" | "orange" | "blue" | "red";
}) {
  const colorClasses = {
    cyan: {
      bg: "bg-cyan-900/20",
      border: "border-cyan-500/30",
      text: "text-cyan-300",
      icon: "text-cyan-400",
    },
    purple: {
      bg: "bg-purple-900/20",
      border: "border-purple-500/30",
      text: "text-purple-300",
      icon: "text-purple-400",
    },
    green: {
      bg: "bg-green-900/20",
      border: "border-green-500/30",
      text: "text-green-300",
      icon: "text-green-400",
    },
    orange: {
      bg: "bg-orange-900/20",
      border: "border-orange-500/30",
      text: "text-orange-300",
      icon: "text-orange-400",
    },
    blue: {
      bg: "bg-blue-900/20",
      border: "border-blue-500/30",
      text: "text-blue-300",
      icon: "text-blue-400",
    },
    red: {
      bg: "bg-red-900/20",
      border: "border-red-500/30",
      text: "text-red-300",
      icon: "text-red-400",
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`${colors.bg} ${colors.border} border rounded-xl p-6 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`${colors.text} text-sm font-medium mb-1`}>{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-white mb-2">
            {value}
          </p>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              {trend === "up" ? (
                <TrendingUp className="text-green-400" size={16} />
              ) : (
                <TrendingDown className="text-red-400" size={16} />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                {trendValue}
              </span>
              <span className="text-gray-400 text-sm">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className={`${colors.bg} p-3 rounded-full`}>
          <Icon className={colors.icon} size={24} />
        </div>
      </div>
    </motion.div>
  );
}

// Componente para gráfico de barras simple
function SimpleBarChart({
  data,
  title,
  color = "cyan",
}: {
  data: Array<{ label: string; value: number }>;
  title: string;
  color?: string;
}) {
  const maxValue = Math.max(...data.map((d) => d.value));

  if (maxValue === 0 || data.length === 0) {
    return (
      <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6">
        <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
          {title}
        </h3>
        <div className="text-center py-8 text-gray-400">
          <BarChart3 className="mx-auto h-12 w-12 mb-4" />
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6">
      <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
        {title}
      </h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">{item.label}</span>
              <span className="text-white font-semibold">{item.value}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`bg-gradient-to-r ${
                  color === "cyan"
                    ? "from-cyan-500 to-blue-500"
                    : "from-purple-500 to-pink-500"
                } h-2 rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente principal de estadísticas
export default function ReservationStats() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );
  const { stats, loading, error, refetch } = useReservationStats(timeRange);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-cyan-300">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
        <p className="text-red-400 mb-4">
          Error al cargar estadísticas: {error || "Error desconocido"}
        </p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors mx-auto"
        >
          <RefreshCw size={16} />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Estadísticas de Reservas
          </h2>
          <p className="text-cyan-200 mt-1">
            Análisis detallado del rendimiento de tus tours
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refetch}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            title="Actualizar datos"
          >
            <RefreshCw size={16} />
          </button>

          <div className="flex items-center bg-gray-800/50 rounded-lg border border-cyan-500/20">
            {(["week", "month", "year"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  timeRange === range
                    ? "bg-cyan-600 text-white rounded-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {range === "week"
                  ? "Semana"
                  : range === "month"
                    ? "Mes"
                    : "Año"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Reservas"
          value={stats.totalReservas}
          subtitle={`+${stats.reservasMes} este mes`}
          icon={Calendar}
          trend={stats.tasaCrecimiento > 0 ? "up" : "down"}
          trendValue={`${Math.abs(stats.tasaCrecimiento).toFixed(1)}%`}
          color="cyan"
        />

        <StatCard
          title="Total Personas"
          value={stats.totalPersonas}
          subtitle={`Promedio: ${stats.promedioPersonasPorReserva} por reserva`}
          icon={Users}
          color="purple"
        />

        <StatCard
          title="Ingresos Totales"
          value={`${stats.ingresosTotales.toLocaleString()}`}
          subtitle="Ingresos brutos"
          icon={DollarSign}
          color="green"
        />

        <StatCard
          title="Tour Más Popular"
          value={stats.tourMasPopular}
          subtitle={`${stats.tourStats[0]?.reservas || 0} reservas`}
          icon={Award}
          color="orange"
        />
      </div>

      {/* Tarjetas de métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Reservas Hoy"
          value={stats.reservasHoy}
          icon={Clock}
          color="blue"
        />

        <StatCard
          title="Esta Semana"
          value={stats.reservasSemana}
          icon={Target}
          color="purple"
        />

        <StatCard
          title="Este Mes"
          value={stats.reservasMes}
          trend={stats.tasaCrecimiento > 0 ? "up" : "down"}
          trendValue={`${Math.abs(stats.tasaCrecimiento).toFixed(1)}%`}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Gráficos y análisis detallado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservas por mes */}
        <SimpleBarChart
          title="Reservas por Mes"
          data={stats.reservasPorMes.map((item) => ({
            label: item.mes,
            value: item.reservas,
          }))}
          color="cyan"
        />

        {/* Tours más populares */}
        <SimpleBarChart
          title="Tours Más Reservados"
          data={stats.tourStats.slice(0, 6).map((tour) => ({
            label:
              tour.tourNombre.length > 20
                ? tour.tourNombre.substring(0, 20) + "..."
                : tour.tourNombre,
            value: tour.reservas,
          }))}
          color="purple"
        />
      </div>

      {/* Estado de las reservas */}
      <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 p-6">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">
          Estado de las Reservas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(stats.reservasPorEstado).map(([estado, cantidad]) => {
            const statusConfig = {
              confirmada: {
                color: "text-green-400",
                bg: "bg-green-900/20",
                border: "border-green-500/30",
                label: "Confirmadas",
              },
              pendiente: {
                color: "text-yellow-400",
                bg: "bg-yellow-900/20",
                border: "border-yellow-500/30",
                label: "Pendientes",
              },
              cancelada: {
                color: "text-red-400",
                bg: "bg-red-900/20",
                border: "border-red-500/30",
                label: "Canceladas",
              },
              completada: {
                color: "text-blue-400",
                bg: "bg-blue-900/20",
                border: "border-blue-500/30",
                label: "Completadas",
              },
              en_proceso: {
                color: "text-purple-400",
                bg: "bg-purple-900/20",
                border: "border-purple-500/30",
                label: "En Proceso",
              },
            };

            const config = statusConfig[estado as ReservationStatus];
            const percentage =
              stats.totalReservas > 0
                ? ((cantidad / stats.totalReservas) * 100).toFixed(1)
                : "0.0";

            return (
              <motion.div
                key={estado}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay:
                    Object.keys(stats.reservasPorEstado).indexOf(estado) * 0.1,
                }}
                className={`${config.bg} ${config.border} border rounded-lg p-4 text-center`}
              >
                <div className={`${config.color} text-2xl font-bold mb-1`}>
                  {cantidad}
                </div>
                <div className="text-white text-sm font-medium mb-1">
                  {config.label}
                </div>
                <div className="text-gray-400 text-xs">
                  {percentage}% del total
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Análisis detallado por tour */}
      <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Rendimiento por Tour
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <BarChart3 size={16} />
            Análisis detallado
          </div>
        </div>

        {stats.tourStats.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <PieChart className="mx-auto h-12 w-12 mb-4" />
            <p>No hay datos de tours disponibles</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-500/30">
                  <th className="text-left text-cyan-300 font-semibold py-3 px-4">
                    Tour
                  </th>
                  <th className="text-center text-cyan-300 font-semibold py-3 px-4">
                    Reservas
                  </th>
                  <th className="text-center text-cyan-300 font-semibold py-3 px-4">
                    Personas
                  </th>
                  <th className="text-center text-cyan-300 font-semibold py-3 px-4">
                    Ingresos
                  </th>
                  <th className="text-center text-cyan-300 font-semibold py-3 px-4">
                    Promedio/Reserva
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.tourStats.map((tour, index) => {
                  const promedioPersonas =
                    tour.reservas > 0
                      ? (tour.personas / tour.reservas).toFixed(1)
                      : "0.0";
                  const promedioIngresos =
                    tour.reservas > 0 ? tour.ingresos / tour.reservas : 0;

                  return (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="text-white font-medium">
                          {tour.tourNombre}
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="text-white font-semibold">
                          {tour.reservas}
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="text-purple-400 font-semibold">
                          {tour.personas}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {promedioPersonas} prom.
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="text-green-400 font-semibold">
                          ${tour.ingresos.toLocaleString()}
                        </div>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="text-cyan-400 font-semibold">
                          ${promedioIngresos.toLocaleString()}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resumen de ingresos por mes */}
      <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Ingresos Mensuales
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Activity size={16} />
            Tendencia de crecimiento
          </div>
        </div>

        {stats.reservasPorMes.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <DollarSign className="mx-auto h-12 w-12 mb-4" />
            <p>No hay datos de ingresos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.reservasPorMes.slice(-4).map((mes, index) => {
              const ingresoPromedio =
                mes.reservas > 0 ? mes.ingresos / mes.reservas : 0;

              return (
                <motion.div
                  key={mes.mes}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-4"
                >
                  <div className="text-green-300 text-sm font-medium mb-1">
                    {mes.mes}
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    ${mes.ingresos.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {mes.reservas} reservas
                  </div>
                  <div className="text-green-400 text-sm">
                    ${ingresoPromedio.toLocaleString()} promedio
                  </div>

                  {/* Barra de progreso visual */}
                  <div className="mt-3 w-full bg-gray-700 rounded-full h-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(mes.ingresos / Math.max(...stats.reservasPorMes.map((m) => m.ingresos))) * 100}%`,
                      }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-1 rounded-full"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Métricas de rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-cyan-600/20 p-3 rounded-full">
              <Target className="text-cyan-400" size={24} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">
                Tasa de Conversión
              </h4>
              <p className="text-gray-400 text-sm">Reservas confirmadas</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-cyan-400 mb-2">
            {stats.totalReservas > 0
              ? (
                  (stats.reservasPorEstado.confirmada / stats.totalReservas) *
                  100
                ).toFixed(1)
              : "0.0"}
            %
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width:
                  stats.totalReservas > 0
                    ? `${(stats.reservasPorEstado.confirmada / stats.totalReservas) * 100}%`
                    : "0%",
              }}
              transition={{ duration: 1.2 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
            />
          </div>
        </div>

        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-500/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-600/20 p-3 rounded-full">
              <Users className="text-purple-400" size={24} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">
                Capacidad Promedio
              </h4>
              <p className="text-gray-400 text-sm">Personas por reserva</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {stats.promedioPersonasPorReserva}
          </div>
          <p className="text-gray-400 text-sm">Ideal para grupos familiares</p>
        </div>

        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-orange-500/30 shadow-lg shadow-orange-500/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-600/20 p-3 rounded-full">
              {stats.tasaCrecimiento >= 0 ? (
                <TrendingUp className="text-orange-400" size={24} />
              ) : (
                <TrendingDown className="text-orange-400" size={24} />
              )}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Crecimiento</h4>
              <p className="text-gray-400 text-sm">Vs mes anterior</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-400 mb-2">
            {stats.tasaCrecimiento >= 0 ? "+" : ""}
            {stats.tasaCrecimiento}%
          </div>
          <p className="text-gray-400 text-sm">
            {stats.tasaCrecimiento >= 0
              ? "Tendencia positiva"
              : "Tendencia negativa"}
          </p>
        </div>
      </div>
    </div>
  );
}
