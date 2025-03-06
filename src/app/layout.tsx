import Navbar from "@/components/navbar/Navbar";
import { ToastProvider } from "@/components/notifications/ToastContainer";
import { UserProvider } from "@/contexts/UserContext";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mon Application",
  description: "Application avec authentification",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-100`}>
        <UserProvider>
          <NextAuthProvider>
            <ToastProvider>
              <Navbar />
              <main className="max-w-screen-2xl mx-auto">{children}</main>
            </ToastProvider>
          </NextAuthProvider>
        </UserProvider>
      </body>
    </html>
  );
}
