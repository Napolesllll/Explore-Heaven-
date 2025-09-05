"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function DebugFullPage() {
  const { data: session, status } = useSession();
  const [serverData, setServerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchServerData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/debug-session", {
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await response.json();
      setServerData(data);
    } catch (error) {
      console.error("Error fetching server data:", error);
      setServerData({ error: "Failed to fetch server data" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServerData();
  }, []);

  const testAdminAccess = () => {
    window.location.href = "/dashboard/admin";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">
          🔍 Debug Completo - Admin Auth
        </h1>

        {/* Client Session */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-green-400">
            🖥️ Client Session
          </h2>
          <div className="bg-gray-700 p-4 rounded text-sm overflow-auto">
            <pre>{JSON.stringify({ status, session }, null, 2)}</pre>
          </div>
        </div>

        {/* Server Session */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-yellow-400">
              🖥️ Server Session
            </h2>
            <button
              onClick={fetchServerData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Refrescar"}
            </button>
          </div>
          <div className="bg-gray-700 p-4 rounded text-sm overflow-auto">
            <pre>{JSON.stringify(serverData, null, 2)}</pre>
          </div>
        </div>

        {/* Status Summary */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-purple-400">
            📊 Status Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div
                className={`p-3 rounded ${session ? "bg-green-900" : "bg-red-900"}`}
              >
                <strong>Client Session:</strong>{" "}
                {session ? "✅ Exists" : "❌ Not found"}
              </div>
              <div
                className={`p-3 rounded ${session?.user?.role === "ADMIN" || session?.user?.id === "admin-system" ? "bg-green-900" : "bg-red-900"}`}
              >
                <strong>Admin Role:</strong>{" "}
                {session?.user?.role === "ADMIN" ||
                session?.user?.id === "admin-system"
                  ? "✅ Valid"
                  : "❌ Invalid"}
              </div>
            </div>
            <div className="space-y-2">
              <div
                className={`p-3 rounded ${serverData?.session?.exists ? "bg-green-900" : "bg-red-900"}`}
              >
                <strong>Server Session:</strong>{" "}
                {serverData?.session?.exists ? "✅ Exists" : "❌ Not found"}
              </div>
              <div
                className={`p-3 rounded ${serverData?.environmentCheck?.hasAdminPassword ? "bg-green-900" : "bg-red-900"}`}
              >
                <strong>Admin Password:</strong>{" "}
                {serverData?.environmentCheck?.hasAdminPassword
                  ? "✅ Configured"
                  : "❌ Missing"}
              </div>
            </div>
          </div>
        </div>

        {/* Test Actions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-red-400">
            🚀 Test Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={testAdminAccess}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold"
            >
              Test Admin Access
            </button>
            <button
              onClick={() => (window.location.href = "/admin/login")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-semibold"
            >
              Admin Login
            </button>
            <button
              onClick={() => (window.location.href = "/auth/signin")}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded font-semibold"
            >
              User Login
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-6 mt-6">
          <h3 className="text-xl font-semibold mb-2 text-yellow-400">
            📝 Instrucciones de Debug
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-yellow-200">
            <li>Verifica que ambas sesiones (client y server) existan</li>
            <li>Confirma que el role sea "ADMIN" o el id sea "admin-system"</li>
            <li>
              Asegúrate de que las variables de entorno estén configuradas
            </li>
            <li>Usa "Test Admin Access" para verificar el acceso directo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
