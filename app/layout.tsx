import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/lib/context/DataContext";
import { AuthProvider } from "@/lib/context/AuthContext";

export const metadata: Metadata = {
  title: "Anichin | Review & Rekomendasi Donghua Legal",
  description: "Situs review dan rekomendasi Donghua legal. Tidak menyimpan file video, semua episode menggunakan link/embed eksternal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <body className="bg-[#0f0f0f] text-white antialiased min-h-screen">
        <AuthProvider>
          <DataProvider>{children}</DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
