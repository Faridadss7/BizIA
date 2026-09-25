import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/contexts/AuthContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "BizIA — Intelligence & Performance Commerciale",
  description: "Analyste de données IA autonome pour PME et entreprises.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BizIA",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <CompanyProvider>
            <ToastProvider>
              <AppShell>{children}</AppShell>
              <ServiceWorkerRegister />
            </ToastProvider>
          </CompanyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
