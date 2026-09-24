"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompany } from "@/contexts/CompanyContext";
import {
  IconBuilding,
  IconHome,
  IconPackage,
  IconCoins,
  IconFile,
  IconTrending,
  IconBot,
  IconUpload,
} from "@/components/icons/Icons";

const APP_SECTIONS = [
  { href: "/produits", label: "Produits", icon: <IconPackage size={15} /> },
  { href: "/ventes", label: "Ventes", icon: <IconCoins size={15} /> },
  { href: "/simulateur", label: "Simulateur Excel", icon: <IconFile size={15} /> },
  { href: "/dashboard", label: "Dashboard", icon: <IconTrending size={15} /> },
  { href: "/chat", label: "Assistant & Voix", icon: <IconBot size={15} /> },
  { href: "/import", label: "Import", icon: <IconUpload size={15} /> },
] as const;

type AppPageLayoutProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  hideDefaultBanner?: boolean;
};

export function AppPageLayout({
  eyebrow,
  title,
  description,
  actions,
  children,
  className = "",
  hideDefaultBanner = false,
}: AppPageLayoutProps) {
  const { currentCompany } = useCompany();
  const pathname = usePathname();

  return (
    <section className={`app-page ${className}`.trim()}>
      {!hideDefaultBanner && (
        <div className="app-page-banner">
          <div className="app-page-banner__inner">
            <div className="app-page-banner__left">
              <div className="app-page-banner__meta">
                <Link href="/" className="app-page-banner__home-btn" title="Retour à l'accueil">
                  <IconHome size={14} /> Accueil
                </Link>
                {eyebrow && <span className="app-page-banner__badge">{eyebrow}</span>}
                {currentCompany && (
                  <span className="app-page-banner__company">
                    <IconBuilding size={14} /> {currentCompany.name}
                  </span>
                )}
              </div>
              <h1 className="app-page-banner__title">{title}</h1>
              {description && <p className="app-page-banner__desc">{description}</p>}
            </div>

            {actions && <div className="app-page-banner__actions">{actions}</div>}
          </div>

          {/* Barre de navigation rapide entre sections de l'application */}
          <nav className="app-page-nav no-print" aria-label="Sections de gestion">
            {APP_SECTIONS.map((section) => {
              const isActive = pathname === section.href;
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className={`app-page-nav__item ${isActive ? "app-page-nav__item--active" : ""}`}
                >
                  <span className="app-page-nav__icon">{section.icon}</span>
                  <span>{section.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <div className="app-page__content">{children}</div>
    </section>
  );
}
