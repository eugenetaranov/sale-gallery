import type { Metadata } from "next";
import "./globals.css";
import { BucketProvider } from "@/lib/bucket";

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
      <body className="min-h-screen font-sans antialiased">
        <BucketProvider>{children}</BucketProvider>
      </body>
    </html>
  );
}
