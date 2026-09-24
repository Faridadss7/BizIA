"use client";

import Link from "next/link";
import { LiveProductShowcase } from "@/components/home/LiveProductShowcase";
import { useAuth } from "@/contexts/AuthContext";
import { IconPackage, IconTrending, IconFile } from "@/components/icons/Icons";

export function HomeContent() {
  const { user, isLoading, isAuthenticated } = useAuth();

  return (
    <div className="landing" style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* ── Section Hero Principale ── */}
      <section style={{ padding: "3rem 0 4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "3.5rem", alignItems: "center" }}>
          
          {/* Colonne Texte & Appel à l'action */}
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#1D4ED8",
                marginBottom: "0.75rem",
              }}
            >
              Gestion Commerciale &amp; Analyse Financière
            </div>

            <h1
              style={{
                fontSize: "2.1rem",
                fontWeight: 750,
                lineHeight: 1.25,
                color: "#111827",
                letterSpacing: "-0.025em",
                margin: "0 0 1rem",
              }}
            >
              Pilotez vos ventes, stocks et marges en temps réel.
            </h1>

            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "#4B5563",
                marginBottom: "1.75rem",
              }}
            >
              Conçu pour les commerçants, grossistes et PME : encaissez rapidement vos ventes,
              simulez vos bénéfices avec le tableur What-If et éditez vos bilans financiers officiels.
            </p>

            {/* Piliers fonctionnels sobres */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.85rem",
                padding: "1rem",
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                marginBottom: "1.75rem",
              }}
            >
              <div>
                <strong style={{ fontSize: "0.8125rem", color: "#111827", display: "block" }}>Caisse &amp; Déstockage</strong>
                <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Saisie ou dictée vocale</span>
              </div>

              <div>
                <strong style={{ fontSize: "0.8125rem", color: "#111827", display: "block" }}>Simulateur What-If</strong>
                <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Marge brute en FCFA</span>
              </div>

              <div>
                <strong style={{ fontSize: "0.8125rem", color: "#111827", display: "block" }}>Bilans PDF Officiels</strong>
                <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Rapports de gestion</span>
              </div>

              <div>
                <strong style={{ fontSize: "0.8125rem", color: "#111827", display: "block" }}>Multi-Entreprises</strong>
                <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Isolation des comptes</span>
              </div>
            </div>

            {/* Boutons d'action sobres */}
            {isLoading ? (
              <p className="muted">Chargement…</p>
            ) : isAuthenticated && user ? (
              <div>
                <p style={{ fontSize: "0.8125rem", color: "#6B7280", marginBottom: "0.5rem" }}>
                  Espace actif : <strong>{user.firstName || user.email}</strong>
                </p>
                <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
                  <Link href="/dashboard" className="btn btn--primary btn--md">
                    Accéder au tableau de bord
                  </Link>
                  <Link href="/simulateur" className="btn btn--outline btn--md">
                    Ouvrir le Simulateur
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                  <Link href="/inscription" className="btn btn--primary btn--md">
                    Créer un compte
                  </Link>
                  <Link href="/connexion" className="btn btn--outline btn--md">
                    Se connecter
                  </Link>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>
                  Sans engagement • Aucune carte bancaire requise
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

      {/* ── 3 Piliers Fonctionnels ── */}
      <section style={{ padding: "2.5rem 0", borderTop: "1px solid #E5E7EB" }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", margin: "0 0 0.25rem" }}>
            Modules d&apos;exploitation intégrés
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", margin: 0 }}>
            Une couverture complète du cycle commercial pour les PME.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", padding: "1.25rem", borderRadius: "6px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", margin: "0 0 0.4rem" }}>
              Catalogue &amp; Stocks
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "#4B5563", lineHeight: 1.55, margin: 0 }}>
              Suivi unitaire des articles, coûts d&apos;achat, prix de vente et seuils de réapprovisionnement.
              Déstockage automatique à chaque vente.
            </p>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", padding: "1.25rem", borderRadius: "6px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", margin: "0 0 0.4rem" }}>
              Simulateur What-If
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "#4B5563", lineHeight: 1.55, margin: 0 }}>
              Testez des hypothèses de prix et de volumes pour anticiper votre rentabilité brute
              et estimer votre bénéfice net en FCFA.
            </p>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E5E7EB", padding: "1.25rem", borderRadius: "6px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111827", margin: "0 0 0.4rem" }}>
              Bilans Financiers PDF
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "#4B5563", lineHeight: 1.55, margin: 0 }}>
              Édition instantanée de rapports d&apos;exploitation avec récapitulatif des marges,
              chiffres d&apos;affaires et indicateurs de rotation.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

