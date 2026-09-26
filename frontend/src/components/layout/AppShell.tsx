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

const PUBLIC_NAV_LINKS = [
  ["/", "Accueil"],
  ["/#fonctionnalites", "Fonctionnalités"],
  ["/#a-propos", "À propos"],
] as const;

const AUTH_NAV_LINKS = [
  ["/", "Accueil"],
  ["/dashboard", "Tableau de bord"],
  ["/produits", "Produits"],
  ["/ventes", "Ventes"],
  ["/scanner", "Scanner IA"],
  ["/import", "Import"],
  ["/chat", "Assistant & Voix"],
  ["/simulateur", "Simulateur What-If"],
] as const;

const AUTH_ROUTES = ["/connexion", "/inscription", "/mot-de-passe-oublie"];
const PROTECTED_ROUTES = ["/produits", "/ventes", "/scanner", "/import", "/dashboard", "/chat"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && showLogoutModal) {
        setShowLogoutModal(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLogoutModal]);

  const isAuthPage = pathname != null && AUTH_ROUTES.includes(pathname);
  const isPresentation = pathname === "/pitch" || pathname === "/presentation";
  const isHome = pathname === "/";
  // Visiteurs non connectés : Accueil, Fonctionnalités, À propos. Connectés : tous les outils métier.
  const activeNavLinks = isAuthenticated ? AUTH_NAV_LINKS : PUBLIC_NAV_LINKS;
  const showNav = !isAuthPage && !isLoading && !isPresentation;

  if (isPresentation) {
    return <>{children}</>;
  }

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
  }

  function isLinkActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
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
            {isAuthenticated && !isAuthPage && <CompanySelector />}
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
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    Déconnexion
                  </button>
                </>
              ) : isAuthPage ? (
                <Link
                  href="/"
                  className="btn btn--outline btn--sm"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  title="Revenir au site"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>Retour à l&apos;accueil</span>
                </Link>
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
            {isAuthenticated && (
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => {
                    setMenuOpen(false);
                    setShowLogoutModal(true);
                  }}
                >
                  Déconnexion
                </button>
              </div>
            )}
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

      {/* Modal de confirmation de déconnexion */}
      {showLogoutModal && (
        <div
          className="modal-backdrop animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="modal-card animate-scale-up"
            style={{ maxWidth: 440, padding: "1.75rem", borderRadius: "16px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: "rgba(239, 68, 68, 0.12)",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
                  Confirmer la déconnexion
                </h3>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: "var(--color-text-muted, #64748b)" }}>
                  Session de {user?.firstName || "votre compte"}
                </p>
              </div>
            </div>

            <p style={{ margin: "0 0 1.5rem", fontSize: "0.95rem", lineHeight: 1.5 }}>
              Voulez-vous vraiment vous déconnecter de votre espace BizIA ?
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setShowLogoutModal(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn--primary"
                style={{ backgroundColor: "#ef4444", borderColor: "#ef4444", color: "#ffffff" }}
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
