"use client";

import { useSession } from "next-auth/react";

export default function DebugPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>

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
              <strong>Session Exists:</strong> {session ? "Yes" : "No"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Test Links</h2>
          <div className="space-y-4">
            <a
              href="/admin/login"
              className="block bg-blue-500 text-white px-4 py-2 rounded"
            >
              Admin Login
            </a>
            <a
              href="/dashboard/admin"
              className="block bg-red-500 text-white px-4 py-2 rounded"
            >
              Admin Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
