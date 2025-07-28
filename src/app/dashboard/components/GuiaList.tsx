"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

type Guia = {
  id: number;
  nombre: string;
  foto?: string;
  edad?: number;
  descripcion?: string;
  celular?: string;
  cedula?: string;
  createdAt?: string;
};

function getFotoUrl(foto?: string) {
  return foto && foto.startsWith("http") ? foto : "/images/avatar-default.png";
}

export default function GuiaList() {
  const [guias, setGuias] = useState<Guia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Guia>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados para la edición de imágenes
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchGuias();
  }, []);

  const fetchGuias = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/guias");
      const data = await res.json();
      setGuias(data.guias || []);
    } catch (error) {
      setGuias([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este guía?")) return;
    try {
      const res = await fetch(`/api/guias?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      setGuias(guias.filter(g => g.id !== id));
    } catch {
      alert("No se pudo eliminar el guía.");
    }
  };

  const handleEdit = (guia: Guia) => {
    setEditId(guia.id);
    setEditData({ ...guia });
    setEditPreviewUrl(guia.foto ? getFotoUrl(guia.foto) : null);
    setEditImageFile(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambio de imagen en la edición
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo y tamaño de imagen
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen excede 5MB");
      return;
    }

    setEditImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setEditPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Eliminar imagen en edición
  const handleRemoveEditImage = () => {
    setEditImageFile(null);
    setEditPreviewUrl("/images/avatar-default.png");
    setEditData(prev => ({ ...prev, foto: "" }));
  };

  const handleEditSave = async () => {
    if (!editId) return;
    setIsSaving(true);
    
    try {
      let newFotoUrl = editData.foto;
      
      // Subir nueva imagen si existe
      if (editImageFile) {
        const imgForm = new FormData();
        imgForm.append("file", editImageFile);
        const uploadRes = await fetch("/api/uploads/image", {
          method: "POST",
          body: imgForm,
        });
        
        if (!uploadRes.ok) {
          const text = await uploadRes.text();
          throw new Error(`Error al subir imagen: ${text}`);
        }
        
        const uploadData = await uploadRes.json();
        newFotoUrl = uploadData.url;
      }
      
      // Actualizar datos del guía
      const res = await fetch(`/api/guias`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...editData, 
          id: editId,
          foto: newFotoUrl
        }),
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error al editar: ${text}`);
      }
      
      await fetchGuias();
      setEditId(null);
      setEditData({});
      setEditImageFile(null);
      setEditPreviewUrl(null);
      toast.success("Guía actualizado correctamente");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "No se pudo editar el guía.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditData({});
    setEditImageFile(null);
    setEditPreviewUrl(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-10 text-center tracking-wide drop-shadow-lg">
          Lista de Guías Registrados
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-4 text-cyan-300 text-lg">Cargando guías...</span>
          </div>
        ) : guias.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            No hay guías registrados aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guias.map((guia) =>
              editId === guia.id ? (
                <div
                  key={guia.id}
                  className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-lg shadow-cyan-500/10 group transition-all duration-500 p-8"
                >
                  <div className="flex flex-col gap-3">
                    {/* CAMBIO SOLICITADO: Reemplazo del input de URL por botón de subida */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-cyan-300 mb-2">
                        Foto del Guía
                      </label>
                      <div className="flex flex-col items-center">
                        <div className="relative h-48 w-48 rounded-full overflow-hidden border-2 border-cyan-500/30 mb-4">
                          <Image
                            src={editPreviewUrl || "/images/avatar-default.png"}
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
                          <button
                            type="button"
                            onClick={handleRemoveEditImage}
                            className="px-4 py-2 rounded bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                          >
                            Eliminar
                          </button>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageChange}
                          className="hidden"
                        />
                        <p className="text-gray-500 text-xs mt-2">
                          Formatos: JPG, PNG, WEBP (Máx. 5MB)
                        </p>
                      </div>
                    </div>
                    
                    <input
                      className="w-full mb-2 p-2 rounded bg-gray-800 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                      name="nombre"
                      value={editData.nombre || ""}
                      onChange={handleEditChange}
                      placeholder="Nombre"
                    />
                    <input
                      className="w-full mb-2 p-2 rounded bg-gray-800 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                      name="edad"
                      value={editData.edad || ""}
                      onChange={handleEditChange}
                      placeholder="Edad"
                      type="number"
                    />
                    <textarea
                      className="w-full mb-2 p-2 rounded bg-gray-800 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                      name="descripcion"
                      value={editData.descripcion || ""}
                      onChange={handleEditChange}
                      placeholder="Descripción"
                      rows={2}
                    />
                    <input
                      className="w-full mb-2 p-2 rounded bg-gray-800 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                      name="celular"
                      value={editData.celular || ""}
                      onChange={handleEditChange}
                      placeholder="Celular"
                    />
                    <input
                      className="w-full mb-2 p-2 rounded bg-gray-800 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                      name="cedula"
                      value={editData.cedula || ""}
                      onChange={handleEditChange}
                      placeholder="Cédula"
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleEditSave}
                        disabled={isSaving}
                        className="flex-1 py-2 rounded bg-cyan-600 text-white font-bold hover:bg-cyan-700 transition"
                      >
                        {isSaving ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="flex-1 py-2 rounded bg-gray-700 text-white font-bold hover:bg-gray-800 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={guia.id}
                  className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 group transition-all duration-500"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={getFotoUrl(guia.foto)}
                      alt={guia.nombre}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                  <div className="p-6 flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-cyan-300 mb-1">{guia.nombre}</h3>
                    <p className="text-gray-300 text-sm mb-2">{guia.descripcion || "Sin descripción"}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-2">
                      {guia.edad && (
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                          </svg>
                          {guia.edad} años
                        </span>
                      )}
                      {guia.cedula && (
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.049l1.715-5.349L11 6.477V5h2a1 1 0 110 2H9a1 1 0 01-1-1V3a1 1 0 011-1h1z" />
                          </svg>
                          Cédula: {guia.cedula}
                        </span>
                      )}
                      {guia.celular && (
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          Celular: {guia.celular}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(guia)}
                          className="px-3 py-1 rounded bg-yellow-500 text-white text-xs font-semibold hover:bg-yellow-600 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(guia.id)}
                          className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
        </div>
    </div>
  );
}