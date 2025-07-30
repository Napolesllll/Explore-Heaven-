'use client';

import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

export default function AddTourForm() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [salida, setSalida] = useState("");
  const [regreso, setRegreso] = useState("");
  const [maxReservas, setMaxReservas] = useState("");
  const [guias, setGuias] = useState("");
  const [precio, setPrecio] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0);
  const [dateError, setDateError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "nombre": setNombre(value); break;
      case "descripcion": setDescripcion(value); break;
      case "salida": setSalida(value); break;
      case "regreso": setRegreso(value); break;
      case "maxReservas": setMaxReservas(value); break;
      case "guias": setGuias(value); break;
      case "precio": setPrecio(value); break;
      case "ubicacion": setUbicacion(value); break;
    }
    
    // Validar fechas al cambiar
    if ((name === "salida" || name === "regreso") && salida && regreso) {
      validateDates();
    }
  };

  // Validación de fechas
  const validateDates = (): boolean => {
    if (!salida || !regreso) return true;
    
    const salidaDate = new Date(salida);
    const regresoDate = new Date(regreso);
    
    if (isNaN(salidaDate.getTime() )) {
      setDateError("Fecha de salida inválida");
      return false;
    } 
    
    if (isNaN(regresoDate.getTime())) {
      setDateError("Fecha de regreso inválida");
      return false;
    }
    
    if (salidaDate >= regresoDate) {
      setDateError("Fecha de regreso debe ser posterior a la de salida");
      return false;
    }
    
    setDateError(null);
    return true;
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + previewUrls.length > 10) {
      toast.error("Máximo 10 imágenes");
      return;
    }
    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        toast.error("Solo imágenes");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Imagen ${file.name} excede 5MB`);
        return false;
      }
      return true;
    });
    if (validFiles.length === 0) return;
    setImageFiles(prev => [...prev, ...validFiles]);
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newUrls = [...previewUrls];
    newFiles.splice(index, 1);
    newUrls.splice(index, 1);
    setImageFiles(newFiles);
    setPreviewUrls(newUrls);
    if (featuredImageIndex === index) {
      setFeaturedImageIndex(0);
    } else if (featuredImageIndex > index) {
      setFeaturedImageIndex(featuredImageIndex - 1);
    }
  };

  const handleSetFeatured = (index: number) => {
    setFeaturedImageIndex(index);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    if (
      !nombre ||
      !descripcion ||
      !maxReservas ||
      !guias ||
      !precio ||
      !ubicacion ||
      previewUrls.length === 0
    ) {
      toast.error("Todos los campos obligatorios");
      return;
    }
    
    // Validar fechas antes de enviar
    if (!validateDates()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Subir todas las imágenes
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const imgForm = new FormData();
        imgForm.append("file", file);
        const uploadRes = await fetch("/api/uploads/image", {
          method: "POST",
          body: imgForm,
        });
        if (!uploadRes.ok) {
          const text = await uploadRes.text();
          throw new Error(`Error al subir imagen: ${text}`);
        }
        const uploadData = await uploadRes.json();
        imageUrls.push(uploadData.url);
      }
      
      // Crear el tour con todas las URLs de imágenes
      const createRes = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          descripcion,
          salida: new Date(salida).toISOString(), // Convertir a ISO string
          regreso: new Date(regreso).toISOString(), // Convertir a ISO string
          maxReservas: parseInt(maxReservas, 10),
          guias: parseInt(guias, 10),
          precio: parseFloat(precio),
          ubicacion,
          imagenUrl: imageUrls[featuredImageIndex], // Imagen destacada
          gallery: JSON.stringify(imageUrls) // Guardar como JSON string
        }),
      });
      
      if (!createRes.ok) {
        const text = await createRes.text();
        throw new Error(`Error creando tour: ${text}`);
      }
      
      const createData = await createRes.json();
      toast.success(`Tour "${nombre}" creado correctamente`);
      
      // Resetear formulario
      setNombre("");
      setDescripcion("");
      setSalida("");
      setRegreso("");
      setMaxReservas("");
      setGuias("");
      setPrecio("");
      setUbicacion("");
      setImageFiles([]);
      setPreviewUrls([]);
      setFeaturedImageIndex(0);
      setDateError(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Hubo un problema");
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto decorativo flotante
  useEffect(() => {
    const interval = setInterval(() => {
      const elements = document.querySelectorAll('.floating-element');
      elements.forEach(el => {
        const currentTop = parseFloat(el.getAttribute('data-top') || "0");
        const currentLeft = parseFloat(el.getAttribute('data-left') || "0");
        const newTop = (currentTop + (Math.random() - 0.5) * 0.2) % 100;
        const newLeft = (currentLeft + (Math.random() - 0.5) * 0.2) % 100;
        el.setAttribute('data-top', newTop.toString());
        el.setAttribute('data-left', newLeft.toString());
        (el as HTMLElement).style.top = `${newTop}%`;
        (el as HTMLElement).style.left = `${newLeft}%`;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d] p-4 flex flex-col items-center justify-center overflow-hidden">
      {/* Elementos decorativos flotantes */}
      {[...Array(8)].map((_, i) => (
        <div 
          key={i}
          className="floating-element absolute rounded-full bg-cyan-500/10 animate-pulse"
          style={{
            width: `${Math.random() * 60 + 20}px`,
            height: `${Math.random() * 60 + 20}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 10 + 5}s`,
          }}
          data-top={Math.random() * 100}
          data-left={Math.random() * 100}
        />
      ))}

      <div className="w-full max-w-5xl relative z-10">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent rounded-3xl"></div>
        <div className="relative bg-[#0f172a]/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-500/10 p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
              Crear Nuevo Tour
            </h1>
            <p className="text-gray-400 max-w-md mx-auto">
              Diseña experiencias inolvidables con nuestro formulario futurista
            </p>
          </div>
          {/* Tabs de navegación */}
          <div className="flex border-b border-cyan-700/50 mb-8">
            <button
              className={`px-6 py-3 font-medium transition-all duration-300 ${
                activeTab === 'info'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-500 hover:text-cyan-300'
              }`}
              onClick={() => setActiveTab('info')}
            >
              Información
            </button>
            <button
              className={`px-6 py-3 font-medium transition-all duration-300 ${
                activeTab === 'images'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-500 hover:text-cyan-300'
              }`}
              onClick={() => setActiveTab('images')}
            >
              Imágenes ({previewUrls.length})
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Sección de imágenes */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Galería de Imágenes
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {previewUrls.map((url, index) => (
                      <div 
                        key={index} 
                        className={`relative h-48 rounded-xl overflow-hidden border-2 transition-all duration-300 group ${
                          featuredImageIndex === index 
                            ? 'border-cyan-500 ring-2 ring-cyan-400 ring-opacity-50' 
                            : 'border-cyan-500/20'
                        }`}
                      >
                        <Image 
                          src={url} 
                          alt={`Preview ${index}`} 
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetFeatured(index);
                            }}
                            className={`px-3 py-1 rounded-full text-xs ${
                              featuredImageIndex === index
                                ? 'bg-cyan-600 text-white'
                                : 'bg-gray-800/80 text-gray-300 hover:bg-cyan-600 hover:text-white'
                            }`}
                          >
                            {featuredImageIndex === index ? 'Destacada' : 'Destacar'}
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                            className="px-3 py-1 rounded-full bg-red-600/80 text-white text-xs hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                        <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-full text-xs text-white">
                          {index + 1}/{previewUrls.length}
                        </div>
                      </div>
                    ))}
                    <div 
                      className="relative h-48 border-2 border-dashed border-cyan-500/30 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:border-cyan-500/60 hover:bg-cyan-900/10"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="bg-gray-900/50 p-3 rounded-full mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="text-cyan-400 font-medium">Agregar imágenes</p>
                      <p className="text-gray-500 text-xs mt-1">Máx. 10 imágenes</p>
                    </div>
                  </div>
                  <input 
                    ref={fileInputRef} 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                    multiple
                  />
                </div>
                <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-xl p-5">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-cyan-300 font-medium mb-1">Consejos para las imágenes</h3>
                      <ul className="text-gray-400 text-sm space-y-1">
                        <li>• Selecciona imágenes de alta calidad (mínimo 1200x800px)</li>
                        <li>• Usa la primera imagen como portada principal del tour</li>
                        <li>• Muestra diferentes perspectivas y atracciones</li>
                        <li>• Máximo 10 imágenes por tour</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Campos del formulario */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Campo nombre */}
                  <div className="space-y-2">
                    <label htmlFor="nombre" className="block text-sm font-medium text-cyan-300 flex items-center">
                      Nombre del Tour
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      value={nombre}
                      onChange={handleChange}
                      className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Nombre del tour"
                    />
                  </div>
                  {/* Campo ubicación */}
                  <div className="space-y-2">
                    <label htmlFor="ubicacion" className="block text-sm font-medium text-cyan-300 flex items-center">
                      Ubicación
                    </label>
                    <input
                      id="ubicacion"
                      name="ubicacion"
                      value={ubicacion}
                      onChange={handleChange}
                      className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Destino principal"
                    />
                  </div>
                  {/* Campo maxReservas */}
                  <div className="space-y-2">
                    <label htmlFor="maxReservas" className="block text-sm font-medium text-cyan-300 flex items-center">
                      Máx. Reservas
                    </label>
                    <input
                      id="maxReservas"
                      name="maxReservas"
                      type="number"
                      min="1"
                      value={maxReservas}
                      onChange={handleChange}
                      className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Número máximo"
                    />
                  </div>
                  {/* Campo precio */}
                  <div className="space-y-2">
                    <label htmlFor="precio" className="block text-sm font-medium text-cyan-300 flex items-center">
                      Precio por persona
                    </label>
                    <input
                      id="precio"
                      name="precio"
                      type="number"
                      min="0"
                      step="0.01"
                      value={precio}
                      onChange={handleChange}
                      className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Precio en USD"
                    />
                  </div>
                  {/* Campo salida */}
                  <div className="space-y-2">
                    <label htmlFor="salida" className="block text-sm font-medium text-cyan-300 flex items-center">
                      Fecha de Salida
                    </label>
                    <input
                      id="salida"
                      name="salida"
                      type="datetime-local"
                      value={salida}
                      onChange={handleChange}
                      className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {/* Campo regreso */}
                  <div className="space-y-2">
                    <label htmlFor="regreso" className="block text-sm font-medium text-cyan-300 flex items-center">
                      Fecha de Regreso
                    </label>
                    <input
                      id="regreso"
                      name="regreso"
                      type="datetime-local"
                      value={regreso}
                      onChange={handleChange}
                      className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {/* Campo guias */}
                  <div className="space-y-2">
                    <label htmlFor="guias" className="block text-sm font-medium text-cyan-300 flex items-center">
                      Número de Guías
                    </label>
                    <input
                      id="guias"
                      name="guias"
                      type="number"
                      min="1"
                      value={guias}
                      onChange={handleChange}
                      className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      placeholder="Número de guías"
                    />
                  </div>
                </div>
                
                {/* Mensaje de error de fechas */}
                {dateError && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 text-red-300">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {dateError}
                    </div>
                  </div>
                )}
                
                {/* Campo descripción */}
                <div className="space-y-2">
                  <label htmlFor="descripcion" className="block text-sm font-medium text-cyan-300 flex items-center">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all min-h-[150px]"
                    placeholder="Describe la experiencia del tour..."
                  />
                </div>
              </div>
            )}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-4 px-6 rounded-xl font-bold transition-all duration-500 flex items-center justify-center
                  ${
                    isLoading
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                  }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando Tour...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Crear Nueva Experiencia
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'info' ? 'images' : 'info')}
                className="py-4 px-6 rounded-xl font-medium bg-gray-800/50 border border-cyan-700/30 text-cyan-300 hover:bg-gray-800/80 transition-all flex items-center justify-center"
              >
                {activeTab === 'info' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    Gestionar Imágenes
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Información del Tour
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}