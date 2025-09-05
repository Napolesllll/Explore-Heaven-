"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [envInfo, setEnvInfo] = useState<any>(null);

  useEffect(() => {
    // Fetch environment info from API
    fetch("/api/debug-env")
      .then((res) => res.json())
      .then((data) => setEnvInfo(data))
      .catch((err) => console.error("Debug fetch error:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>

        {/* Session Info */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Session Information</h2>
          <div className="space-y-2">
            <p>
              <strong>Status:</strong> {status}
            </p>
            <p>
              <strong>User Email:</strong> {session?.user?.email || "No email"}
            </p>
            <p>
              <strong>User Role:</strong> {session?.user?.role || "No role"}
            </p>
            <p>
              <strong>User ID:</strong> {session?.user?.id || "No ID"}
            </p>
            <p>
              <strong>Session Exists:</strong> {session ? "Yes" : "No"}
            </p>
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Environment Information
          </h2>
          {envInfo ? (
            <div className="space-y-2">
              <p>
                <strong>NEXTAUTH_URL:</strong>{" "}
                {envInfo.nextAuthUrl || "Not set"}
              </p>
              <p>
                <strong>NODE_ENV:</strong> {envInfo.nodeEnv || "Not set"}
              </p>
              <p>
                <strong>Has NEXTAUTH_SECRET:</strong>{" "}
                {envInfo.hasSecret ? "Yes" : "No"}
              </p>
              <p>
                <strong>Has ADMIN_EMAIL:</strong>{" "}
                {envInfo.hasAdminEmail ? "Yes" : "No"}
              </p>
              <p>
                <strong>Has ADMIN_PASSWORD:</strong>{" "}
                {envInfo.hasAdminPassword ? "Yes" : "No"}
              </p>
              <p>
                <strong>Current URL:</strong> {window.location.href}
              </p>
            </div>
          ) : (
            <p>Loading environment info...</p>
          )}
        </div>

        {/* Current Location */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Current Location</h2>
          <div className="space-y-2">
            <p>
              <strong>Host:</strong>{" "}
              {typeof window !== "undefined" ? window.location.host : "SSR"}
            </p>
            <p>
              <strong>Protocol:</strong>{" "}
              {typeof window !== "undefined" ? window.location.protocol : "SSR"}
            </p>
            <p>
              <strong>Pathname:</strong>{" "}
              {typeof window !== "undefined" ? window.location.pathname : "SSR"}
            </p>
          </div>
        </div>

        {/* Test Links */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Test Links</h2>
          <div className="space-y-4">
            <a
              href="/admin/login"
              className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              → Go to Admin Login
            </a>
            <a
              href="/dashboard/admin"
              className="block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              → Try Admin Dashboard
            </a>
            <a
              href="/auth/signin"
              className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              → Go to User Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
