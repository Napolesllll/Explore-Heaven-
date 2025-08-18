import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";

import Providers from "./providers";

// Metadatos recomendados para Next.js App Router
export const metadata = {
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
