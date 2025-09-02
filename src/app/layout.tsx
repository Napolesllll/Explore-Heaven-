import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import type { Metadata } from "next";

// Se evita la carga de Google Fonts en tiempo de compilación para prevenir
// errores de red durante el build en entornos sin conexión.
// Usamos las fuentes definidas en CSS (globals.css) o las fuentes del sistema.

// Metadatos recomendados para Next.js App Router con metadataBase
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: "Explore Heaven Medellín | Turismo Seguro y Experiencias Únicas",
  description:
    "Descubre Medellín de forma segura con Explore Heaven. Tours exclusivos, guías certificados y recomendaciones de seguridad para turistas.",
  openGraph: {
    title: "Explore Heaven Medellín | Turismo Seguro",
    description:
      "Vive Medellín con seguridad y experiencias únicas. Tours, mapas de zonas seguras y más.",
    type: "website",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`antialiased font-sans`}>
        <Providers>
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
