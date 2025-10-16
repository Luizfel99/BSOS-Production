import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProviderWrapper from '@/components/AuthProviderWrapper';
import ErrorBoundary from '@/components/ErrorBoundary';
import I18nProvider from '@/components/I18nProvider';
import { Toaster } from 'react-hot-toast';
import { BSOSProvider } from '@/contexts/BSOSContext';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "B.S.O.S. - Bright & Shine Operating System",
  description: "Where Cleaning Meets Intelligence - Intelligent Operating System for Professional Cleaning Management",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <I18nProvider>
            <AuthProviderWrapper>
              <BSOSProvider>
                <div className="min-h-screen bg-gray-50">
                  {children}
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#363636',
                        color: '#fff',
                        maxWidth: '90vw',
                      },
                      success: {
                        duration: 3000,
                        iconTheme: {
                          primary: '#4ade80',
                          secondary: '#fff',
                        },
                      },
                      error: {
                        duration: 5000,
                        iconTheme: {
                          primary: '#ef4444',
                          secondary: '#fff',
                        },
                      },
                    }}
                  />
                </div>
              </BSOSProvider>
            </AuthProviderWrapper>
          </I18nProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}