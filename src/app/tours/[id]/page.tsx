"use client";

  import { notFound } from "next/navigation";
  import Image from "next/image";
  import Link from "next/link";
  import { useState, useEffect } from "react";
  import { FaUsers, FaCalendarAlt, FaUserTie, FaArrowLeft, FaMapMarkerAlt, FaMoneyBillWave, FaStar, FaTimes } from "react-icons/fa";

  function parseGallery(gallery?: string | null): string[] {
    if (!gallery) return [];
    try {
      const arr = JSON.parse(gallery);
      if (Array.isArray(arr)) return arr;
      return [];
    } catch {
      return [];
    }
  }

  export default function TourDetailPage({ params }: { params: { id: string } }) {
    const [tour, setTour] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showReserveModal, setShowReserveModal] = useState(false);
    const [formData, setFormData] = useState({
      nombre: '',
      correo: '',
      telefono: '',
      fechaId: ''
    });

    useEffect(() => {
      const fetchTour = async () => {
        try {
          const response = await fetch(`/api/tours/${params.id}`);
          const data = await response.json();
          if (!data) {
            return notFound();
          }
          setTour(data);
        } catch (error) {
          console.error("Error fetching tour:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTour();
    }, [params.id]);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    if (!tour) return notFound();

    const galleryImages = parseGallery(tour.gallery);
    const salida = tour.salida || "Por definir";
    const regreso = tour.regreso || "Por definir";

  const handleReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tour: {
            id: tour.id,
            nombre: tour.nombre,
            descripcion: tour.descripcion,
            precio: tour.precio,
            fotos: [tour.imagenUrl, ...galleryImages]
          },
          reserva: {
            nombre: formData.nombre,
            correo: formData.correo,
            telefono: formData.telefono,
            fecha: tour.availableDates.find((d) => d.id === formData.fechaId)?.date
          }
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la sesión de pago');
      }

      const session = await response.json();
      
      if (session.url) {
        // Redirigir a Stripe Checkout
        window.location.href = session.url;
      } else if (session.id) {
        // Alternativa si la URL no viene directamente
        window.location.href = `https://checkout.stripe.com/pay/${session.id}`;
      } else {
        throw new Error('No se recibió una URL válida para el pago');
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Ocurrió un error al procesar tu reserva. Por favor intenta nuevamente.");
    } finally {
      setShowReserveModal(false);
    }
  };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-white relative z-10">
        {/* Fondo con efecto de partículas */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d0c1d] via-[#1a193b] to-[#2a285f] opacity-95" />
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full bg-indigo-400 animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 10 + 2}px`,
                  height: `${Math.random() * 10 + 2}px`,
                  animationDuration: `${Math.random() * 5 + 3}s`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
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

        {/* Header del tour */}
        <div className="mb-10 text-center">
          <div className="inline-block px-5 py-2 bg-indigo-700/80 backdrop-blur rounded-full mb-4 text-md font-medium text-indigo-100 border border-indigo-500/30">
            Experiencia Premium
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
            {tour.nombre}
          </h1>
          <div className="flex justify-center mt-4 gap-2">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`text-xl ${i < 4 ? 'text-yellow-400' : 'text-indigo-700'}`} 
              />
            ))}
            <span className="ml-2 text-indigo-300">(128 reseñas)</span>
          </div>
        </div>

        {/* Contenido principal - Imagen y descripción lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Columna de imagen */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 group transition-all duration-500">
            <Image
              src={tour.imagenUrl}
              alt={tour.nombre}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            
            {/* Precio destacado */}
            <div className="absolute bottom-6 left-6 bg-indigo-700/90 backdrop-blur-sm px-5 py-3 rounded-xl border border-indigo-500/30 shadow-lg">
              <div className="text-sm text-indigo-300">Desde</div>
              <div className="text-2xl font-bold text-white">${tour.precio} <span className="text-sm font-normal">por persona</span></div>
            </div>
          </div>

          {/* Columna de descripción */}
          <div className="bg-black/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-inner shadow-indigo-500/10 transition-all hover:border-indigo-400/50 h-full">
            <h2 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-400 mr-2 animate-pulse"></div>
              Descripción del Tour
            </h2>
            <p className="whitespace-pre-line text-lg leading-relaxed text-gray-200 tracking-wide mb-6">
              {tour.descripcion}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <InfoItem
                icon={<FaMapMarkerAlt className="text-indigo-300 text-xl" />}
                label="Ubicación"
                value={tour.ubicacion}
              />
              <InfoItem
                icon={<FaMoneyBillWave className="text-indigo-300 text-xl" />}
                label="Precio"
                value={`$${tour.precio}`}
              />
            </div>
            
            <div className="mt-8 pt-6 border-t border-indigo-700/50">
              <button 
                onClick={() => setShowReserveModal(true)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-600/30 flex items-center justify-center gap-3"
              >
                Reservar ahora
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Información Clave */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <InfoItem
            icon={<FaCalendarAlt className="text-indigo-300 text-xl" />}
            label="Salida"
            value={salida}
          />
          <InfoItem
            icon={<FaCalendarAlt className="text-indigo-300 text-xl" />}
            label="Regreso"
            value={regreso}
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

        {/* Galería de imágenes */}
        {galleryImages.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-6 text-indigo-300 flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-400 mr-2 animate-pulse"></div>
              Galería del Tour
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="relative h-40 rounded-xl overflow-hidden border border-indigo-500/30 transition-transform hover:scale-105">
                  <Image
                    src={img}
                    alt={`Imagen ${idx + 1} de ${tour.nombre}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonios */}
        <div className="bg-black/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 md:p-8 transition-all hover:border-indigo-400/50">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-300 flex items-center">
            <div className="w-3 h-3 rounded-full bg-indigo-400 mr-2 animate-pulse"></div>
            Experiencias de Viajeros
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Testimonial 
              name="Carlos Martínez" 
              rating={5}
              comment="Una experiencia increíble. Los paisajes eran impresionantes y el guía conocía cada detalle del lugar. Definitivamente volveré."
            />
            <Testimonial 
              name="María González" 
              rating={4}
              comment="El tour superó mis expectativas. La organización fue impecable y los lugares visitados eran mágicos. Lo recomiendo totalmente."
            />
          </div>
        </div>

        {/* Modal de Reserva */}
        {showReserveModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-[#0f172a] border border-indigo-500/30 rounded-2xl shadow-2xl w-full max-w-md relative">
              <button
                onClick={() => setShowReserveModal(false)}
                className="absolute top-4 right-4 text-indigo-300 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">
                  Reservar Tour
                </h2>
                
                <form onSubmit={handleReserveSubmit} className="space-y-4">
                  <div>
                    <label className="block text-indigo-300 mb-1">Nombre completo</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded bg-gray-800 text-white border border-indigo-500/20 focus:ring-2 focus:ring-indigo-400 outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-indigo-300 mb-1">Correo electrónico</label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded bg-gray-800 text-white border border-indigo-500/20 focus:ring-2 focus:ring-indigo-400 outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-indigo-300 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded bg-gray-800 text-white border border-indigo-500/20 focus:ring-2 focus:ring-indigo-400 outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-indigo-300 mb-1">Fecha disponible</label>
                    <select
                      name="fechaId"
                      value={formData.fechaId}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded bg-gray-800 text-white border border-indigo-500/20 focus:ring-2 focus:ring-indigo-400 outline-none"
                      required
                    >
                      <option value="">Seleccione una fecha</option>
                      {tour.availableDates.map((date) => (
                        <option key={date.id} value={date.id}>
                          {new Date(date.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-600/30"
                  >
                    Confirmar Reserva
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
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

  function Testimonial({ name, rating, comment }: { name: string; rating: number; comment: string }) {
    return (
      <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-5 transition-all hover:border-indigo-400/50">
        <div className="flex items-center mb-3">
          <div className="flex mr-3">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={`text-md ${i < rating ? 'text-yellow-400' : 'text-indigo-700'}`} 
              />
            ))}
          </div>
          <div className="font-semibold text-white">{name}</div>
        </div>
        <p className="text-gray-200 italic">"{comment}"</p>
      </div>
    );
  }