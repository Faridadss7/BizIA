"use client";

import { usePathname } from "next/navigation";
import { useApiHealth } from "@/hooks/useApiHealth";
import { useAuth } from "@/contexts/AuthContext";

export function ApiStatusBanner() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const apiOk = useApiHealth();

  // Ne pas encombrer la page d'accueil ou les pages de présentation
  const isLandingOrGuest = pathname === "/" || pathname === "/pitch" || pathname === "/presentation" || !isAuthenticated;
  if (isLandingOrGuest || apiOk === null || apiOk) return null;

  return (
    <div className="api-banner" role="status">
      <div className="api-banner__inner">
        <span className="api-banner__dot" aria-hidden="true" />
        <p>
          <strong>Synchronisation en cours</strong> — Connexion au serveur distant...
        </p>
      </div>
    </div>
  );
}

