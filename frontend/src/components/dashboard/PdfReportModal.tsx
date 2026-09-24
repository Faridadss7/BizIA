"use client";

import { useEffect, useState } from "react";
import { useCompany } from "@/contexts/CompanyContext";
import { api } from "@/services/api";
import { formatCurrency, formatPercent } from "@/utils/format";
import { Button } from "@/components/ui/Button";
import { IconX } from "@/components/icons/Icons";
import type { AnalysisResult } from "@/types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  result?: AnalysisResult | null;
};

export function PdfReportModal({ isOpen, onClose, result }: Props) {
  const { currentCompany } = useCompany();
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleDownloadOfficialPdf() {
    setDownloadingPdf(true);
    try {
      await api.reports.download("pdf");
    } catch (err) {
      alert("Erreur lors du téléchargement du PDF officiel.");
    } finally {
      setDownloadingPdf(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  const currentDate = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

  const kpis = result?.kpis;
  const revenue = kpis ? Number(kpis.revenue) : 0;
  const cost = kpis ? Number(kpis.cost) : 0;
  const profit = kpis ? Number(kpis.profit) : 0;
  const marginPct = kpis ? Number(kpis.margin_pct) : 0;
  const salesCount = kpis ? Number(kpis.sales_count) : 0;
  const unitsSold = kpis ? Number(kpis.units_sold) : 0;
  const avgBasket = salesCount > 0 ? revenue / salesCount : 0;
  const hasData = salesCount > 0 || revenue > 0;

  return (
    <div
      className="modal-backdrop animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="modal-card modal-card--large card card--glass animate-scale-up pdf-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header no-print">
          <div>
            <h2>Consultation & Export du Bilan PDF</h2>
            <p className="muted">
              Bilan officiel pour {currentCompany.name} ({currentCompany.currency || "FCFA"}).
            </p>
          </div>
          <div className="pdf-modal__actions" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Button
              onClick={handleDownloadOfficialPdf}
              loading={downloadingPdf}
              className="btn--primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Télécharger le Fichier PDF (.pdf)</span>
            </Button>
            <Button variant="secondary" onClick={handlePrint}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Imprimer la page A4</span>
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
            >
              <IconX size={16} />
              <span>Fermer</span>
            </Button>
          </div>
        </div>

        {/* Zone de document PDF imprimable */}
        <div className="pdf-document" id="pdf-printable-document">
          <div className="pdf-document__header">
            <div className="pdf-document__brand">
              <div className="pdf-document__logo">
                <span className="logo-dot" />
                <strong>BizIA</strong>
              </div>
              <span className="pdf-document__tagline">
                Intelligence Artificielle & Audit de Performance PME
              </span>
            </div>
            <div className="pdf-document__meta">
              <span className="pdf-ref">RÉF : REP-{new Date().getFullYear()}-{currentCompany.id.slice(0, 6).toUpperCase()}</span>
              <span className="pdf-date">Généré le {currentDate}</span>
            </div>
          </div>

          <div className="pdf-document__divider" />

          <div className="pdf-document__company-info">
            <div>
              <span className="pdf-label">Entreprise auditée</span>
              <h3 className="pdf-company-name">{currentCompany.name}</h3>
              <p className="pdf-company-sub">
                Devise : {currentCompany.currency || "FCFA"} {currentCompany.category ? `· ${currentCompany.category}` : "· Commerce Général"}
              </p>
            </div>
            <div className="pdf-status-badge">
              <span>{hasData ? "STATUT : ANALYSÉ & CERTIFIÉ" : "STATUT : INITIALISATION"}</span>
            </div>
          </div>

          {/* 1. Synthèse financière et Bénéfices nets */}
          <div className="pdf-section">
            <h4 className="pdf-section__title">1. Synthèse Financière Globale & Bénéfices Nets</h4>
            <p className="pdf-text">
              {hasData
                ? `Ce rapport consolide les flux commerciaux, la structure des coûts et la rentabilité nette de ${currentCompany.name} sur la période analysée.`
                : `Aucune transaction enregistrée pour ${currentCompany.name} pour le moment. Enregistrez des ventes ou importez un fichier pour consolider le bilan.`}
            </p>
            <div className="pdf-kpi-grid">
              <div className="pdf-kpi-box">
                <span className="pdf-kpi-box__label">Chiffre d&apos;Affaires</span>
                <span className="pdf-kpi-box__value">{formatCurrency(revenue, currentCompany.currency || "FCFA")}</span>
              </div>
              <div className="pdf-kpi-box">
                <span className="pdf-kpi-box__label">Coûts Opérationnels</span>
                <span className="pdf-kpi-box__value">{formatCurrency(cost, currentCompany.currency || "FCFA")}</span>
              </div>
              <div className="pdf-kpi-box pdf-kpi-box--highlight">
                <span className="pdf-kpi-box__label">Bénéfice Net Réalisé</span>
                <span className="pdf-kpi-box__value">{formatCurrency(profit, currentCompany.currency || "FCFA")}</span>
              </div>
              <div className="pdf-kpi-box">
                <span className="pdf-kpi-box__label">Taux de Marge Brute</span>
                <span className="pdf-kpi-box__value" style={{ color: profit >= 0 ? "#059669" : "#dc2626" }}>
                  {formatPercent(marginPct)}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Indicateurs Commerciaux Clés */}
          <div className="pdf-section">
            <h4 className="pdf-section__title">2. Indicateurs Commerciaux Clés</h4>
            <div className="pdf-kpi-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              <div className="pdf-kpi-box">
                <span className="pdf-kpi-box__label">Nombre de Ventes</span>
                <span className="pdf-kpi-box__value">{salesCount} ventes</span>
              </div>
              <div className="pdf-kpi-box">
                <span className="pdf-kpi-box__label">Unités Vendues</span>
                <span className="pdf-kpi-box__value">{unitsSold} articles</span>
              </div>
              <div className="pdf-kpi-box">
                <span className="pdf-kpi-box__label">Panier Moyen</span>
                <span className="pdf-kpi-box__value">{formatCurrency(avgBasket, currentCompany.currency || "FCFA")}</span>
              </div>
              <div className="pdf-kpi-box">
                <span className="pdf-kpi-box__label">Références en Vente</span>
                <span className="pdf-kpi-box__value">{result?.top_sold?.length || 0} références</span>
              </div>
            </div>
          </div>

          {/* 3. Performance par Catégorie & Top Produits */}
          <div className="pdf-section">
            <h4 className="pdf-section__title">3. Répartition & Top Produits Rentables</h4>
            {result && result.top_profit && result.top_profit.length > 0 ? (
              <table className="pdf-table">
                <thead>
                  <tr>
                    <th>Produit / Référence</th>
                    <th className="text-right">Volume</th>
                    <th className="text-right">Chiffre d&apos;affaires</th>
                    <th className="text-right">Bénéfice Net</th>
                    <th className="text-right">Marge %</th>
                  </tr>
                </thead>
                <tbody>
                  {result.top_profit.map((p) => {
                    const margin = p.revenue > 0 ? (p.profit / p.revenue) * 100 : 0;
                    return (
                      <tr key={p.sku}>
                        <td><strong>{p.name}</strong> ({p.sku})</td>
                        <td className="text-right">{p.units_sold || "—"}</td>
                        <td className="text-right font-mono">{formatCurrency(p.revenue, currentCompany.currency || "FCFA")}</td>
                        <td className="text-right font-mono text-success">+{formatCurrency(p.profit, currentCompany.currency || "FCFA")}</td>
                        <td className="text-right font-bold">{formatPercent(margin)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="pdf-text" style={{ fontStyle: "italic", color: "#64748b" }}>
                Aucun produit vendu enregistré pour cette entreprise.
              </p>
            )}
          </div>

          {/* 4. Alertes Critiques & Opérationnelles */}
          <div className="pdf-section">
            <h4 className="pdf-section__title" style={{ color: "#b45309" }}>
              4. Alertes Critiques & Opérationnelles
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {result && result.alerts && result.alerts.length > 0 ? (
                result.alerts.map((a, idx) => (
                  <div key={idx} style={{ padding: "10px 14px", background: a.severity === "high" ? "#fef2f2" : "#fffbeb", borderLeft: `4px solid ${a.severity === "high" ? "#ef4444" : "#f59e0b"}`, borderRadius: 6 }}>
                    <strong style={{ color: a.severity === "high" ? "#991b1b" : "#92400e", fontSize: "0.9rem" }}>
                      {a.title}
                    </strong>
                    <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: a.severity === "high" ? "#7f1d1d" : "#78350f" }}>
                      {a.detail}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ padding: "10px 14px", background: "#f8fafc", borderLeft: "4px solid #94a3b8", borderRadius: 6 }}>
                  <strong style={{ color: "#334155", fontSize: "0.9rem" }}>
                    Aucune alerte critique
                  </strong>
                  <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "#64748b" }}>
                    Aucun seuil de rupture ou anomalie n&apos;a été détecté pour {currentCompany.name}.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 5. Insights IA & Recommandations Stratégiques */}
          <div className="pdf-section">
            <h4 className="pdf-section__title">5. Recommandations Stratégiques & Insights BizIA</h4>
            <div className="pdf-recommendations">
              {result && result.recommendations && result.recommendations.length > 0 ? (
                result.recommendations.map((rec, i) => (
                  <div key={i} className="pdf-rec-item">
                    <strong>Priorité [{rec.priority.toUpperCase()}] : {rec.action}</strong>
                    <p>{rec.why}</p>
                  </div>
                ))
              ) : result && result.insights && result.insights.length > 0 ? (
                result.insights.map((insight, i) => (
                  <div key={i} className="pdf-rec-item">
                    <strong>Constat d&apos;analyse #{i + 1}</strong>
                    <p>{insight}</p>
                  </div>
                ))
              ) : (
                <div className="pdf-rec-item">
                  <strong>Initialisation de l&apos;activité</strong>
                  <p>
                    Pour débloquer les prédictions et recommandations personnalisées de l&apos;IA, saisissez vos premiers produits et ventes dans BizIA.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 6. Signature & Validation */}
          <div className="pdf-footer">
            <div className="pdf-footer__left">
              <strong>BizIA Analytics Suite V2 — Rapport Certifié</strong>
              <span>Génération algorithmique autonome · {currentCompany.name}</span>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Horodatage : {currentDate}</span>
            </div>
            <div className="pdf-footer__right">
              <div className="pdf-signature-box">
                <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.85rem" }}>Visa Direction</span>
                <div style={{ height: 35, borderBottom: "1px dashed #94a3b8", margin: "4px 0" }} />
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Date & Signature</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
