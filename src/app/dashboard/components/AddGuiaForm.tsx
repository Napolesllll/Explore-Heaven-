"use client";

import { useState, ChangeEvent, useRef } from "react";
import Image from "next/image";

export default function AddGuiaForm() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [celular, setCelular] = useState("");
  const [cedula, setCedula] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });

  // Estados para la imagen
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (
      !nombre.trim() ||
      !edad.trim() ||
      !descripcion.trim() ||
      !celular.trim() ||
      !cedula.trim()
    ) {
      setModal({
        isOpen: true,
        message: "Todos los campos son obligatorios",
        type: "error",
      });
      return;
    }

    // Validar que se haya subido una imagen
    if (!imageFile) {
      setModal({
        isOpen: true,
        message: "Debes subir una foto del guía",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Subir imagen a Cloudinary
      const imgForm = new FormData();
      imgForm.append("file", imageFile);

      const uploadRes = await fetch("/api/uploads/image", {
        method: "POST",
        body: imgForm,
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        throw new Error(`Error al subir imagen: ${text}`);
      }

      const uploadData = await uploadRes.json();
      const fotoUrl = uploadData.url;

      // Crear el guía con la URL de la imagen
      const res = await fetch("/api/guias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          foto: fotoUrl,
          edad,
          descripcion,
          celular,
          cedula,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al agregar el guía");
      }

      const data = await res.json();
      setModal({
        isOpen: true,
        message: `Guía "${data.guia.nombre}" agregado exitosamente`,
        type: "success",
      });

      // Resetear el formulario
      setNombre("");
      setEdad("");
      setDescripcion("");
      setCelular("");
      setCedula("");
      setImageFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: unknown) {
      console.error("Error al agregar guía:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Hubo un problema al agregar el guía. Intenta nuevamente.";
      setModal({
        isOpen: true,
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "nombre":
        setNombre(value);
        break;
      case "edad":
        setEdad(value);
        break;
      case "descripcion":
        setDescripcion(value);
        break;
      case "celular":
        setCelular(value);
        break;
      case "cedula":
        setCedula(value);
        break;
      default:
        break;
    }
  };

  // Manejar cambio de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo y tamaño de imagen
    if (!file.type.startsWith("image/")) {
      setModal({
        isOpen: true,
        message: "Solo se permiten imágenes",
        type: "error",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setModal({
        isOpen: true,
        message: "La imagen excede 5MB",
        type: "error",
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Eliminar imagen seleccionada
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
              Registro de Nuevo Guía
            </h3>
            <p className="text-gray-400 text-sm">
              Completa todos los campos para registrar un nuevo guía
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo nombre */}
            <div className="space-y-2">
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-cyan-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Nombre del guía
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Ingresa el nombre completo"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-3 text-cyan-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Campo para subir imagen */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-cyan-300">
                Foto del Guía
              </label>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500/30 mb-4">
                  <Image
                    src={previewUrl || "/images/avatar-default.png"}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-700 transition"
                  >
                    Subir Imagen
                  </button>
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-4 py-2 rounded bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-gray-500 text-xs mt-2">
                  Formatos: JPG, PNG, WEBP (Máx. 5MB)
                </p>
              </div>
            </div>

            {/* Campo edad */}
            <div className="space-y-2">
              <label
                htmlFor="edad"
                className="block text-sm font-medium text-cyan-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                Edad
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="edad"
                  name="edad"
                  value={edad}
                  onChange={handleChange}
                  className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Ingresa la edad"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-3 text-cyan-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Campo cédula */}
            <div className="space-y-2">
              <label
                htmlFor="cedula"
                className="block text-sm font-medium text-cyan-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.049l1.715-5.349L11 6.477V5h2a1 1 0 110 2H9a1 1 0 01-1-1V3a1 1 0 011-1h1z" />
                  <path d="M5 8a1 1 0 011-1h1a1 1 0 011 1v.382a1 1 0 01-.553.894L5.5 9.118l-.947.474A1 1 0 014 8.382V8zm-2 6a1 1 0 011-1h1a1 1 0 011 1v.382a1 1 0 01-.553.894l-.947.474a1 1 0 01-.894-1.789l.947-.474A1 1 0 003 14.382V14zm4 0a1 1 0 011-1h1a1 1 0 011 1v.382a1 1 0 01-.553.894l-.947.474a1 1 0 01-.894-1.789l.947-.474A1 1 0 007 14.382V14z" />
                </svg>
                Número de cédula
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cedula"
                  name="cedula"
                  value={cedula}
                  onChange={handleChange}
                  className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Ingresa la cédula"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-3 text-cyan-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.049l1.715-5.349L11 6.477V5h2a1 1 0 110 2H9a1 1 0 01-1-1V3a1 1 0 011-1h1z" />
                  <path d="M5 8a1 1 0 011-1h1a1 1 0 011 1v.382a1 1 0 01-.553.894L5.5 9.118l-.947.474A1 1 0 014 8.382V8zm-2 6a1 1 0 011-1h1a1 1 0 011 1v.382a1 1 0 01-.553.894l-.947.474a1 1 0 01-.894-1.789l.947-.474A1 1 0 003 14.382V14zm4 0a1 1 0 011-1h1a1 1 0 011 1v.382a1 1 0 01-.553.894l-.947.474a1 1 0 01-.894-1.789l.947-.474A1 1 0 007 14.382V14z" />
                </svg>
              </div>
            </div>

            {/* Campo descripción */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-cyan-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Breve descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={descripcion}
                onChange={handleChange}
                className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all min-h-[120px]"
                placeholder="Ingresa una descripción del guía..."
              />
            </div>

            {/* Campo celular */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="celular"
                className="block text-sm font-medium text-cyan-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Número de celular
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="celular"
                  name="celular"
                  value={celular}
                  onChange={handleChange}
                  className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Ingresa el número de celular"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-3 text-cyan-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center mt-6
             ${
               isLoading
                 ? "bg-gray-700 cursor-not-allowed"
                 : "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
             }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Agregando...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Agregar Guía
              </>
            )}
          </button>
        </form>
      </div>

      {/* Modal Futurista */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div
            className={`relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 
             ${modal.type === "success" ? "shadow-cyan-500/30" : "shadow-red-500/30"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-90"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent"></div>

            <div className="relative z-10 p-8 max-w-md">
              <div className="flex justify-center mb-6">
                <div
                  className={`p-4 rounded-full ${modal.type === "success" ? "bg-cyan-500/20" : "bg-red-500/20"}`}
                >
                  <div
                    className={`p-3 rounded-full ${modal.type === "success" ? "bg-cyan-500/30" : "bg-red-500/30"}`}
                  >
                    {modal.type === "success" ? (
                      <svg
                        className="h-12 w-12 text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-12 w-12 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              <h3
                className={`text-2xl font-bold text-center mb-3 ${modal.type === "success" ? "text-cyan-400" : "text-red-400"}`}
              >
                {modal.type === "success" ? "¡Operación Exitosa!" : "¡Error!"}
              </h3>

              <div className="text-center mb-8">
                <p className="text-gray-300 text-lg">{modal.message}</p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setModal({ ...modal, isOpen: false })}
                  className={`px-8 py-3 rounded-xl font-bold transition-all duration-300
                   ${
                     modal.type === "success"
                       ? "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                       : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                   }`}
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
