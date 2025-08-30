import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
