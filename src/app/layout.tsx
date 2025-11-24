import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import { Toaster } from "react-hot-toast";
import { BSOSProvider } from "@/contexts/BSOSContext";
import { Analytics } from "@vercel/analytics/react";
import DebugOverlay from "@/components/DebugOverlay";
import GlobalActionBus from "@/components/GlobalActionBus";
import AppHeader from "@/components/AppHeader";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import DemoModeGate from "@/components/DemoModeGate";
import ShowChrome from "@/components/ShowChrome";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "B.S.O.S. - Bright & Shine Operating System",
  description:
    "Where Cleaning Meets Intelligence - Intelligent Operating System for Professional Cleaning Management",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {/* Invisível: só lê ?demo=1|0 e ajusta sessionStorage; sem UI */}
        <DemoModeGate />
        <ClientProviders>
          <BSOSProvider>
            <div className="min-h-screen bg-gray-50">
              <div className="fixed right-3 top-3 z-50">
                <LocaleSwitcher />
              </div>
              <ShowChrome>
                <AppHeader />
              </ShowChrome>
              {children}
              <DebugOverlay />
              <GlobalActionBus />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                    maxWidth: "90vw",
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: "#4ade80",
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
            </div>
          </BSOSProvider>
        </ClientProviders>
        <Analytics />
      </body>
    </html>
  );
}
