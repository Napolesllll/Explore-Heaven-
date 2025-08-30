// app/blog-tours/page.tsx
"use client";

export default function ToursPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <h1 className="text-4xl font-bold text-center mb-12">
        Nuestros Destinos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4"></div>
    </div>
  );
}
