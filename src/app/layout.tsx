import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import type { Metadata } from "next";

// Vercel
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Metadatos optimizados para SEO y rendimiento
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "Explore Heaven Medellín | Turismo Seguro y Experiencias Únicas",
    template: "%s | Explore Heaven Medellín",
  },
  description:
    "Descubre Medellín de forma segura con Explore Heaven. Tours exclusivos, guías certificados y recomendaciones de seguridad para turistas.",
  keywords: [
    "Medellín",
    "turismo",
    "tours",
    "seguridad",
    "Colombia",
    "viajes",
    "guías",
  ],
  authors: [{ name: "Explore Heaven" }],
  creator: "Explore Heaven",
  publisher: "Explore Heaven",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: process.env.NEXTAUTH_URL || "http://localhost:3000",
    siteName: "Explore Heaven Medellín",
    title: "Explore Heaven Medellín | Turismo Seguro",
    description:
      "Vive Medellín con seguridad y experiencias únicas. Tours, mapas de zonas seguras y más.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Explore Heaven Medellín - Turismo Seguro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Heaven Medellín | Turismo Seguro",
    description:
      "Descubre Medellín de forma segura con tours exclusivos y guías certificados.",
    images: ["/og-image.jpg"],
    creator: "@exploreheavenco",
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: process.env.NEXTAUTH_URL || "http://localhost:3000",
  },
  category: "travel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS Prefetch para recursos críticos */}
        <link rel="dns-prefetch" href="https://vercel.live" />
        <link rel="dns-prefetch" href="https://vitals.vercel-analytics.com" />

        {/* Viewport optimizado */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* Theme color */}
        <meta name="theme-color" content="#1f2937" />
        <meta name="msapplication-TileColor" content="#1f2937" />

        {/* Apple touch icon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="icon" type="image/svg+xml" href="/images/SVG-01.svg" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/images/logoExploreee.png"
          as="image"
          type="image/png"
        />
      </head>
      <body className="antialiased font-sans bg-white text-gray-900">
        <Providers>
          {/* Toaster optimizado */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerStyle={{
              top: 20,
              right: 20,
            }}
            toastOptions={{
              // Reducir duración para mejor UX
              duration: 4000,
              style: {
                background: "#1f2937",
                color: "#fff",
                fontSize: "14px",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
          {children}

          {/* Analytics cargados de forma diferida */}
          <Analytics />
          <SpeedInsights />
        </Providers>

        {/* Script inline crítico para prevenir FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function setTheme() {
                  var theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.className = theme;
                }
                setTheme();
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
