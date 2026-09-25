"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BizIALogo } from "@/components/brand/BizIALogo";
import { ApiStatusBanner } from "@/components/layout/ApiStatusBanner";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { CompanySelector } from "@/components/layout/CompanySelector";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NetworkStatusIndicator } from "@/components/layout/NetworkStatusIndicator";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { useAuth } from "@/contexts/AuthContext";

const NAV_LINKS = [
  ["/", "Accueil"],
  ["/produits", "Produits"],
  ["/ventes", "Ventes"],
  ["/scanner", "Scanner"],
  ["/import", "Import"],
  ["/simulateur", "Simulateur Excel"],
  ["/dashboard", "Dashboard"],
  ["/chat", "Assistant & Voix"],
] as const;

const GUEST_NAV_LINKS = [
  ["/", "Accueil"],
  ["/simulateur", "Simulateur Excel"],
] as const;

const AUTH_ROUTES = ["/connexion", "/inscription", "/mot-de-passe-oublie"];
const PROTECTED_ROUTES = ["/produits", "/ventes", "/scanner", "/import", "/simulateur", "/dashboard", "/chat"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthPage = pathname != null && AUTH_ROUTES.includes(pathname);
  const isHome = pathname === "/";
  const activeNavLinks = isAuthenticated ? NAV_LINKS : GUEST_NAV_LINKS;
  const showNav = !isAuthPage && !isLoading;

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
  }

  function isLinkActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(href + "/");
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div className="header__inner header__inner--landing">
          <div className="header__left">
            <Link href="/" className="header__brand" onClick={() => setMenuOpen(false)}>
              <BizIALogo size="md" showTagline />
            </Link>
            {!isAuthPage && isAuthenticated && <CompanySelector />}
          </div>

          {showNav && (
            <nav className="header__links header__links--center" aria-label="Navigation principale">
              {activeNavLinks.map(([href, label]) => {
                const active = isLinkActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={active ? "header__link header__link--active" : "header__link"}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="header__right">
            <NetworkStatusIndicator />
            <ThemeToggle />

            <div className="header__auth">
              {isLoading ? (
                <span className="muted">…</span>
              ) : isAuthenticated && user ? (
                <>
                  <div className="header__user-pill" title={`${user.firstName} ${user.lastName || ""}`}>
                    <span className="header__avatar">{user.firstName?.[0]?.toUpperCase() || "U"}</span>
                    <span className="header__user">{user.firstName}</span>
                  </div>
                  <button type="button" className="btn btn--outline btn--sm" onClick={handleLogout}>
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/connexion" className="btn btn--outline btn--sm">
                    Connexion
                  </Link>
                  <Link href="/inscription" className="btn btn--primary btn--sm">
                    Inscription
                  </Link>
                </>
              )}
            </div>

            {showNav && (
              <button
                type="button"
                className="header__menu-btn"
                aria-expanded={menuOpen}
                aria-label="Menu de navigation"
                onClick={() => setMenuOpen((o) => !o)}
              >
                <span /><span /><span />
              </button>
            )}
          </div>
        </div>

        {showNav && (
          <nav
            className={`header__mobile-drawer ${menuOpen ? "header__mobile-drawer--open" : ""}`}
            aria-label="Menu mobile"
          >
            {activeNavLinks.map(([href, label]) => {
              const active = isLinkActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={active ? "header__link header__link--active" : "header__link"}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <ApiStatusBanner />

      <main
        className={`main ${isAuthPage ? "main--auth" : ""} ${isHome ? "main--home main--landing" : "main--app"}`}
      >
        <AuthGuard>{children}</AuthGuard>
      </main>

      <SiteFooter />
    </div>
  );
}
