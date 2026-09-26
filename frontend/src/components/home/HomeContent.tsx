"use client";

import Link from "next/link";
import { LiveProductShowcase } from "@/components/home/LiveProductShowcase";
import { BizIALogo } from "@/components/brand/BizIALogo";
import { useAuth } from "@/contexts/AuthContext";
import {
  IconMic,
  IconCamera,
  IconChartBar,
  IconUpload,
  IconSparkles,
  IconCheckCircle,
  IconLock,
  IconArrowRight,
} from "@/components/icons/Icons";

export function HomeContent() {
  const { user, isLoading, isAuthenticated, login } = useAuth();

  return (
    <div className="landing-container">
      {/* ── Section Hero Principale ── */}
      <section className="landing-hero">
        <div className="landing-hero__grid">
          {/* Colonne Texte & Appel à l'action */}
          <div className="landing-hero__text">
            <div className="landing-badge">
              <span className="landing-badge__dot" />
              Plateforme Commerciale &amp; Analyse Financière IA
            </div>

            <h1 className="landing-hero__title">
              Pilotez vos ventes, stocks et marges en temps réel.
            </h1>

            <p className="landing-hero__subtitle">
              Conçu pour les commerçants, grossistes et PME : encaissez vos ventes au comptoir ou par dictée vocale, scannez vos factures avec l&apos;IA Vision, simulez vos bénéfices avec le tableur What-If et éditez vos bilans officiels en FCFA.
            </p>

            {/* Grille de 4 Piliers Clés */}
            <div className="landing-pillars">
              <div className="landing-pillar-item">
                <div className="landing-pillar-item__header">
                  <span className="landing-pillar-icon"><IconMic size={16} /></span>
                  <strong>Caisse &amp; Déstockage</strong>
                </div>
                <span>Saisie rapide &amp; Dictée vocale</span>
              </div>

              <div className="landing-pillar-item">
                <div className="landing-pillar-item__header">
                  <span className="landing-pillar-icon"><IconCamera size={16} /></span>
                  <strong>Scanner OCR IA</strong>
                </div>
                <span>Photo &amp; Factures PDF</span>
              </div>

              <div className="landing-pillar-item">
                <div className="landing-pillar-item__header">
                  <span className="landing-pillar-icon"><IconChartBar size={16} /></span>
                  <strong>Simulateur What-If</strong>
                </div>
                <span>Calcul de marge en FCFA</span>
              </div>

              <div className="landing-pillar-item">
                <div className="landing-pillar-item__header">
                  <span className="landing-pillar-icon"><IconLock size={16} /></span>
                  <strong>Multi-Entreprises</strong>
                </div>
                <span>Isolation Cloud Supabase</span>
              </div>
            </div>

            {/* Boutons d'actions */}
            {isLoading ? (
              <p className="muted">Chargement…</p>
            ) : isAuthenticated && user ? (
              <div className="landing-cta-box">
                <div className="landing-cta-buttons">
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
                <p className="landing-cta-user">
                  Connecté en tant que <strong>{user.firstName || user.email}</strong>
                </p>
              </div>
            ) : (
              <div className="landing-cta-box">
                <div className="landing-cta-buttons">
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
                <div className="landing-trust-bar">
                  <span className="trust-item"><IconCheckCircle size={14} /> Accès immédiat</span>
                  <span className="trust-item"><IconLock size={14} /> Supabase PostgreSQL &amp; Clerk</span>
                  <span className="trust-item"><IconCheckCircle size={14} /> 100% Devises FCFA</span>
                </div>
              </div>
            )}
          </div>

          {/* Démonstration Produit Haute Fidélité */}
          <div className="landing-hero__visual">
            <LiveProductShowcase />
          </div>
        </div>
      </section>

      {/* ── 4 Cartes Fonctionnelles Complètes avec Icônes Vectorielles ── */}
      <section id="fonctionnalites" className="landing-modules" style={{ scrollMarginTop: "80px" }}>
        <div className="landing-modules__header">
          <h2>
            Modules d&apos;exploitation opérationnels
          </h2>
          <p>
            Une suite complète et intégrée pour gérer vos encaissements, vos stocks et vos bilans financiers.
          </p>
        </div>

        <div className="landing-cards-grid">
          
          <Link href="/chat" className="landing-card-link">
            <div className="landing-card card card--glass">
              <div>
                <div className="landing-card__top">
                  <span className="badge badge--primary">Dictée Vocale</span>
                  <div className="landing-card__icon-box landing-card__icon-box--primary">
                    <IconMic size={20} />
                  </div>
                </div>
                <h3>
                  Assistant &amp; Caisse Vocale
                </h3>
                <p>
                  Dictez vos ventes au micro en français ou en langues locales. BizIA calcule le montant total, déduit le stock et met à jour la marge nette instantanément.
                </p>
              </div>
              <div className="landing-card__footer">
                <span>Ouvrir l&apos;assistant</span>
                <IconArrowRight size={14} />
              </div>
            </div>
          </Link>

          <Link href="/scanner" className="landing-card-link">
            <div className="landing-card card card--glass">
              <div>
                <div className="landing-card__top">
                  <span className="badge badge--success">Gemini Vision OCR</span>
                  <div className="landing-card__icon-box landing-card__icon-box--success">
                    <IconCamera size={20} />
                  </div>
                </div>
                <h3>
                  Scanner Reçus &amp; Factures
                </h3>
                <p>
                  Prenez en photo vos factures fournisseurs ou tickets de caisse via la caméra en direct. L&apos;IA extrait automatiquement les articles, prix d&apos;achat et quantités.
                </p>
              </div>
              <div className="landing-card__footer">
                <span>Scanner un document</span>
                <IconArrowRight size={14} />
              </div>
            </div>
          </Link>

          <Link href="/simulateur" className="landing-card-link">
            <div className="landing-card card card--glass">
              <div>
                <div className="landing-card__top">
                  <span className="badge badge--info">Rentabilité</span>
                  <div className="landing-card__icon-box landing-card__icon-box--info">
                    <IconChartBar size={20} />
                  </div>
                </div>
                <h3>
                  Simulateur What-If
                </h3>
                <p>
                  Ajustez les prix et les volumes de vente avec des curseurs interactifs. Observez l&apos;impact en direct sur votre marge brute et votre résultat net.
                </p>
              </div>
              <div className="landing-card__footer">
                <span>Simuler les marges</span>
                <IconArrowRight size={14} />
              </div>
            </div>
          </Link>

          <Link href="/import" className="landing-card-link">
            <div className="landing-card card card--glass">
              <div>
                <div className="landing-card__top">
                  <span className="badge badge--warning">Multi-Formats</span>
                  <div className="landing-card__icon-box landing-card__icon-box--warning">
                    <IconUpload size={20} />
                  </div>
                </div>
                <h3>
                  Import CSV &amp; Excel
                </h3>
                <p>
                  Importez vos fichiers de catalogue ou historiques de ventes en un clic. Détection automatique des séparateurs (; ou ,) et encodages français.
                </p>
              </div>
              <div className="landing-card__footer">
                <span>Importer un fichier</span>
                <IconArrowRight size={14} />
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* ── Section À propos (Mission, Problème & Solution) ── */}
      <section id="a-propos" className="landing-about" style={{ scrollMarginTop: "80px", marginTop: "4rem", marginBottom: "2rem" }}>
        <div className="landing-modules__header">
          <div className="landing-badge" style={{ margin: "0 auto 0.75rem" }}>
            <span className="landing-badge__dot" />
            Notre Raison d&apos;Être
          </div>
          <h2>À propos de BizIA</h2>
          <p style={{ maxWidth: "680px", margin: "0 auto" }}>
            Rendre la puissance de l&apos;Intelligence Artificielle et de l&apos;analyse financière accessible à chaque PME, commerçant et grossiste du continent africain.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginTop: "2.25rem" }}>
          {/* Carte 1 : Le Défi */}
          <div className="card card--glass" style={{ padding: "1.75rem" }}>
            <div style={{ display: "inline-flex", padding: "0.55rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.14)", color: "#ef4444", marginBottom: "1rem" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.6rem", color: "var(--color-text)" }}>
              Le Problème Résolu
            </h3>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--color-text-muted)", margin: 0 }}>
              En Afrique de l&apos;Ouest, plus de 80% des commerçants gèrent encore leurs activités sur des carnets papier ou des feuilles volantes. Les pertes invisibles de stocks, les prix fixés sans calcul précis de marge et l&apos;absence de traçabilité empêchent les entreprises de grandir et d&apos;obtenir des financements bancaires.
            </p>
          </div>

          {/* Carte 2 : La Solution */}
          <div className="card card--glass" style={{ padding: "1.75rem" }}>
            <div style={{ display: "inline-flex", padding: "0.55rem", borderRadius: "8px", background: "rgba(16, 185, 129, 0.14)", color: "#10b981", marginBottom: "1rem" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.6rem", color: "var(--color-text)" }}>
              La Solution BizIA
            </h3>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--color-text-muted)", margin: 0 }}>
              BizIA transforme n&apos;importe quel smartphone ou ordinateur en copilote commercial complet. Vous dictez vos ventes vocalement, vous scannez vos factures avec l&apos;IA Vision en quelques secondes, vous simulez vos prix dans un tableur interactif What-If et vous éditez des bilans certifiés en FCFA.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
