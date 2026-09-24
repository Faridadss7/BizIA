import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/contexts/AuthContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { ToastProvider } from "@/contexts/ToastContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "BizIA — Intelligence & Performance Commerciale",
  description: "Analyste de données IA autonome pour PME et entreprises.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
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
            </ToastProvider>
          </CompanyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
