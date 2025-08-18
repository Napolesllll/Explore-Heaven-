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
      setGuias(guias.filter((g) => g.id !== id));
      toast.success("Guía eliminado correctamente");
    } catch {
      toast.error("No se pudo eliminar el guía.");
    }
  };

  const handleEdit = (guia: Guia) => {
    setEditId(guia.id);
    setEditData({ ...guia });
    setEditPreviewUrl(guia.foto ? getFotoUrl(guia.foto) : null);
    setEditImageFile(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
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
    setEditData((prev) => ({ ...prev, foto: "" }));
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
          foto: newFotoUrl,
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
    <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
          Guías Registrados
        </h3>
        <p className="text-gray-400 text-sm">
          Gestiona la información de tus guías
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-r-purple-500 animate-spin animate-reverse"></div>
          </div>
          <span className="ml-4 text-cyan-300 text-lg">Cargando guías...</span>
        </div>
      ) : guias.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-gray-300 mb-2">
            No hay guías registrados
          </h4>
          <p className="text-gray-500">
            Agrega tu primer guía usando el formulario
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-2">
          {guias.map((guia) =>
            editId === guia.id ? (
              <div
                key={guia.id}
                className="bg-gradient-to-br from-[#1a1f3a] to-[#2a2f4a] rounded-xl border border-cyan-500/30 shadow-lg p-6"
              >
                <div className="flex flex-col gap-4">
                  {/* Edición de imagen */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-cyan-300 mb-2">
                      Foto del Guía
                    </label>
                    <div className="flex flex-col items-center">
                      <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-cyan-500/30 mb-4">
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
                    className="w-full mb-2 p-3 rounded-lg bg-gray-800/50 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                    name="nombre"
                    value={editData.nombre || ""}
                    onChange={handleEditChange}
                    placeholder="Nombre"
                  />
                  <input
                    className="w-full mb-2 p-3 rounded-lg bg-gray-800/50 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                    name="edad"
                    value={editData.edad || ""}
                    onChange={handleEditChange}
                    placeholder="Edad"
                    type="number"
                  />
                  <textarea
                    className="w-full mb-2 p-3 rounded-lg bg-gray-800/50 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                    name="descripcion"
                    value={editData.descripcion || ""}
                    onChange={handleEditChange}
                    placeholder="Descripción"
                    rows={3}
                  />
                  <input
                    className="w-full mb-2 p-3 rounded-lg bg-gray-800/50 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                    name="celular"
                    value={editData.celular || ""}
                    onChange={handleEditChange}
                    placeholder="Celular"
                  />
                  <input
                    className="w-full mb-2 p-3 rounded-lg bg-gray-800/50 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                    name="cedula"
                    value={editData.cedula || ""}
                    onChange={handleEditChange}
                    placeholder="Cédula"
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleEditSave}
                      disabled={isSaving}
                      className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold hover:from-cyan-700 hover:to-purple-700 transition disabled:opacity-50"
                    >
                      {isSaving ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="flex-1 py-2 px-4 rounded-lg bg-gray-700 text-white font-bold hover:bg-gray-800 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                key={guia.id}
                className="bg-gradient-to-br from-[#1a1f3a] to-[#2a2f4a] rounded-xl border border-cyan-500/30 shadow-lg hover:shadow-cyan-500/20 group transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={getFotoUrl(guia.foto)}
                    alt={guia.nombre}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="p-4">
                  <h4 className="text-xl font-bold text-cyan-300 mb-2">
                    {guia.nombre}
                  </h4>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {guia.descripcion || "Sin descripción"}
                  </p>

                  <div className="space-y-2 mb-4">
                    {guia.edad && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <svg
                          className="h-4 w-4 text-cyan-400"
                          fill="none"
                          viewBox="0 0 20 20"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{guia.edad} años</span>
                      </div>
                    )}
                    {guia.celular && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <svg
                          className="h-4 w-4 text-cyan-400"
                          fill="none"
                          viewBox="0 0 20 20"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{guia.celular}</span>
                      </div>
                    )}
                    {guia.cedula && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <svg
                          className="h-4 w-4 text-cyan-400"
                          fill="none"
                          viewBox="0 0 20 20"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m-5 6V8a1 1 0 011-1h4a1 1 0 011 1v2m-5 6v-2a1 1 0 011-1h4a1 1 0 011 1v2"
                          />
                        </svg>
                        <span>C.C: {guia.cedula}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-cyan-500/20">
                    <button
                      onClick={() => handleEdit(guia)}
                      className="px-4 py-2 rounded-lg bg-yellow-600/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-600/30 transition-all text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(guia.id)}
                      className="px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 transition-all text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
