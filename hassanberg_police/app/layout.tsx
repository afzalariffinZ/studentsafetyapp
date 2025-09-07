import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard Polis Bantuan",
  description: "Emergency Response Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Navbar />
        <div className="flex min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 lg:p-6 lg:ml-0 ml-0">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
