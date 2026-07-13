import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "En venta",
  description: "Artículos en venta — mudanza en Madrid",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
