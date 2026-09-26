"use client";

import Link from "next/link";
import { LiveProductShowcase } from "@/components/home/LiveProductShowcase";
import { useAuth } from "@/contexts/AuthContext";
import { IconPackage, IconTrending, IconFile, IconSparkles } from "@/components/icons/Icons";

export function HomeContent() {
  const { user, isLoading, isAuthenticated, login } = useAuth();

  return (
    <div className="landing" style={{ maxWidth: 1240, margin: "0 auto", padding: "1.5rem 1.25rem 3.5rem" }}>
      {/* ── Section Hero Principale ── */}
      <section style={{ padding: "2.5rem 0 3.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          {/* Colonne Texte & Appel à l'action */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-primary, #1D4ED8)",
                backgroundColor: "var(--color-primary-subtle, rgba(29, 78, 216, 0.08))",
                padding: "0.35rem 0.75rem",
                borderRadius: "9999px",
                marginBottom: "1rem",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--color-primary, #1D4ED8)" }} />
              Gestion Commerciale &amp; Analyse Financière IA
            </div>

            <h1
              style={{
                fontSize: "2.35rem",
                fontWeight: 800,
                lineHeight: 1.2,
                color: "var(--color-text, #111827)",
                letterSpacing: "-0.03em",
                margin: "0 0 1.15rem",
              }}
            >
              Pilotez vos ventes, stocks et marges en temps réel.
            </h1>

            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.6,
                color: "var(--color-text-muted, #4B5563)",
                marginBottom: "2rem",
              }}
            >
              Conçu pour les commerçants, grossistes et PME africaines : encaissez vos ventes au comptoir ou par dictée vocale, scannez vos factures avec l&apos;IA Vision, simulez vos bénéfices avec le tableur What-If et éditez vos bilans financiers officiels en FCFA.
            </p>

            {/* Grille de 4 Piliers Clés */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "0.85rem",
                padding: "1.15rem",
                background: "var(--color-surface, #F9FAFB)",
                border: "1px solid var(--color-border, #E5E7EB)",
                borderRadius: "8px",
                marginBottom: "2rem",
              }}
            >
              <div>
                <strong style={{ fontSize: "0.85rem", color: "var(--color-text, #111827)", display: "block", marginBottom: 2 }}>
                  Caisse &amp; Déstockage
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6B7280)" }}>
                  Saisie rapide &amp; Dictée vocale
                </span>
              </div>

              <div>
                <strong style={{ fontSize: "0.85rem", color: "var(--color-text, #111827)", display: "block", marginBottom: 2 }}>
                  Scanner OCR IA
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6B7280)" }}>
                  Photo &amp; Factures PDF
                </span>
              </div>

              <div>
                <strong style={{ fontSize: "0.85rem", color: "var(--color-text, #111827)", display: "block", marginBottom: 2 }}>
                  Simulateur What-If
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6B7280)" }}>
                  Calcul de marge en FCFA
                </span>
              </div>

              <div>
                <strong style={{ fontSize: "0.85rem", color: "var(--color-text, #111827)", display: "block", marginBottom: 2 }}>
                  Multi-Entreprises
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6B7280)" }}>
                  Isolation des comptes
                </span>
              </div>
            </div>

            {/* Boutons d'actions */}
            {isLoading ? (
              <p className="muted">Chargement…</p>
            ) : isAuthenticated && user ? (
              <div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  <Link href="/dashboard" className="btn btn--primary btn--md">
                    Accéder au Tableau de bord
                  </Link>
                  <Link href="/chat" className="btn btn--outline btn--md">
                    Assistant &amp; Voix
                  </Link>
                  <Link href="/scanner" className="btn btn--outline btn--md">
                    Scanner une Facture
                  </Link>
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted, #6B7280)", margin: 0 }}>
                  Connecté en tant que <strong>{user.firstName || user.email}</strong>
                </p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
                  <Link href="/inscription" className="btn btn--primary btn--md">
                    Créer un compte
                  </Link>
                  <button
                    type="button"
                    className="btn btn--outline btn--md"
                    onClick={async () => {
                      await login({ email: "demo@bizia.africa", password: "password123" }).catch(() => {
                        window.location.href = "/connexion";
                      });
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <IconSparkles size={16} /> Tester la Démo (1 clic)
                    </span>
                  </button>
                  <Link href="/connexion" className="btn btn--ghost btn--md">
                    Se connecter
                  </Link>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted, #6B7280)", margin: 0 }}>
                  Accès gratuit • Données sécurisées • 100% conforme devises FCFA
                </p>
              </div>
            )}
          </div>

          {/* Démonstration Produit Haute Fidélité */}
          <div>
            <LiveProductShowcase />
          </div>
        </div>
      </section>

      {/* ── 4 Cartes Fonctionnelles Complètes ── */}
      <section style={{ padding: "2.5rem 0", borderTop: "1px solid var(--color-border, #E5E7EB)" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 700, color: "var(--color-text, #111827)", margin: "0 0 0.35rem" }}>
            Modules d&apos;exploitation opérationnels
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted, #6B7280)", margin: 0 }}>
            Une suite complète et intégrée pour gérer vos encaissements, vos stocks et vos bilans.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "1.25rem" }}>
          
          <Link href="/chat" style={{ textDecoration: "none", color: "inherit" }}>
            <div
              className="card card--glass"
              style={{
                background: "var(--color-surface, #FFFFFF)",
                border: "1px solid var(--color-border, #E5E7EB)",
                padding: "1.5rem",
                borderRadius: "8px",
                height: "100%",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span className="badge badge--primary">Dictée Vocale</span>
                  <span style={{ fontSize: "1.2rem" }}>🎙️</span>
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text, #111827)", margin: "0 0 0.5rem" }}>
                  Assistant &amp; Caisse Vocale
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted, #4B5563)", lineHeight: 1.55, margin: 0 }}>
                  Dictez vos ventes au micro en français ou en langues locales. BizIA calcule le montant total, déduit le stock et met à jour la marge nette instantanément.
                </p>
              </div>
              <div style={{ marginTop: "1rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-primary, #1D4ED8)" }}>
                Ouvrir l&apos;assistant →
              </div>
            </div>
          </Link>

          <Link href="/scanner" style={{ textDecoration: "none", color: "inherit" }}>
            <div
              className="card card--glass"
              style={{
                background: "var(--color-surface, #FFFFFF)",
                border: "1px solid var(--color-border, #E5E7EB)",
                padding: "1.5rem",
                borderRadius: "8px",
                height: "100%",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span className="badge badge--success">Gemini Vision OCR</span>
                  <span style={{ fontSize: "1.2rem" }}>📸</span>
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text, #111827)", margin: "0 0 0.5rem" }}>
                  Scanner Reçus &amp; Factures
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted, #4B5563)", lineHeight: 1.55, margin: 0 }}>
                  Prenez en photo vos factures fournisseurs ou tickets de caisse via la caméra en direct. L&apos;IA extrait automatiquement les articles, prix d&apos;achat et quantités.
                </p>
              </div>
              <div style={{ marginTop: "1rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-primary, #1D4ED8)" }}>
                Scanner un document →
              </div>
            </div>
          </Link>

          <Link href="/simulateur" style={{ textDecoration: "none", color: "inherit" }}>
            <div
              className="card card--glass"
              style={{
                background: "var(--color-surface, #FFFFFF)",
                border: "1px solid var(--color-border, #E5E7EB)",
                padding: "1.5rem",
                borderRadius: "8px",
                height: "100%",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span className="badge badge--info">Rentabilité</span>
                  <span style={{ fontSize: "1.2rem" }}>📊</span>
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text, #111827)", margin: "0 0 0.5rem" }}>
                  Simulateur What-If
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted, #4B5563)", lineHeight: 1.55, margin: 0 }}>
                  Ajustez les prix et les volumes de vente avec des curseurs interactifs. Observez l&apos;impact en direct sur votre marge brute et votre résultat net.
                </p>
              </div>
              <div style={{ marginTop: "1rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-primary, #1D4ED8)" }}>
                Simuler les marges →
              </div>
            </div>
          </Link>

          <Link href="/import" style={{ textDecoration: "none", color: "inherit" }}>
            <div
              className="card card--glass"
              style={{
                background: "var(--color-surface, #FFFFFF)",
                border: "1px solid var(--color-border, #E5E7EB)",
                padding: "1.5rem",
                borderRadius: "8px",
                height: "100%",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span className="badge badge--warning">Multi-Formats</span>
                  <span style={{ fontSize: "1.2rem" }}>📁</span>
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text, #111827)", margin: "0 0 0.5rem" }}>
                  Import CSV &amp; Excel
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted, #4B5563)", lineHeight: 1.55, margin: 0 }}>
                  Importez vos fichiers de catalogue ou historiques de ventes en un clic. Détection automatique des séparateurs (; ou ,) et encodages français.
                </p>
              </div>
              <div style={{ marginTop: "1rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-primary, #1D4ED8)" }}>
                Importer un fichier →
              </div>
            </div>
          </Link>

        </div>
      </section>
    </div>
  );
}
