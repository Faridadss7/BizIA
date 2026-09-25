"use client";

import { useState } from "react";
import Link from "next/link";
import { formatAmount } from "@/utils/format";

export function LiveProductShowcase() {
  const [activeTab, setActiveTab] = useState<"simulator" | "sales" | "kpi">("simulator");
  const [priceAdj, setPriceAdj] = useState<number>(10);

  // Données interactives de démonstration
  const baseProducts = [
    { name: "Smartphone 4G Pro", cost: 45000, price: 65000, stock: 18, sales: 8 },
    { name: "Montre AMOLED V2", cost: 12000, price: 20000, stock: 34, sales: 14 },
    { name: "Calculatrice Scient.", cost: 3500, price: 6000, stock: 45, sales: 22 },
    { name: "Écouteurs TWS Sans-fil", cost: 5000, price: 9500, stock: 26, sales: 15 },
  ];

  const simulatedProducts = baseProducts.map((p) => {
    const adjPrice = Math.round(p.price * (1 + priceAdj / 100));
    const marginAmount = adjPrice - p.cost;
    const marginPct = adjPrice > 0 ? (marginAmount / adjPrice) * 100 : 0;
    const revenue = adjPrice * p.sales;
    const profit = marginAmount * p.sales;
    return { ...p, adjPrice, marginAmount, marginPct, revenue, profit };
  });

  const totalSimRevenue = simulatedProducts.reduce((s, p) => s + p.revenue, 0);
  const totalSimProfit = simulatedProducts.reduce((s, p) => s + p.profit, 0);

  // Format simple sans double suffixe
  function fmtShort(num: number): string {
    return new Intl.NumberFormat("fr-FR").format(num) + " F";
  }

  return (
    <div
      style={{
        background: "var(--color-surface, #ffffff)",
        border: "1px solid var(--color-border, #e2e8f0)",
        borderRadius: "14px",
        boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.06)",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Barre d'onglets du produit */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--color-border, #e2e8f0)",
          background: "#F8FAFC",
          padding: "0.5rem 0.85rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.35rem" }}>
          <button
            type="button"
            onClick={() => setActiveTab("simulator")}
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: activeTab === "simulator" ? "#1D4ED8" : "transparent",
              color: activeTab === "simulator" ? "#FFFFFF" : "#64748B",
              transition: "all 0.15s ease",
            }}
          >
            Simulateur What-If
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sales")}
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: activeTab === "sales" ? "#1D4ED8" : "transparent",
              color: activeTab === "sales" ? "#FFFFFF" : "#64748B",
              transition: "all 0.15s ease",
            }}
          >
            Journal de Caisse
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("kpi")}
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: activeTab === "kpi" ? "#1D4ED8" : "transparent",
              color: activeTab === "kpi" ? "#FFFFFF" : "#64748B",
              transition: "all 0.15s ease",
            }}
          >
            Bilan &amp; Marges
          </button>
        </div>

        <span style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669", display: "inline-block" }} />
          Calcul en temps réel
        </span>
      </div>

      {/* Contenu Interactif : Onglet 1 Simulateur */}
      {activeTab === "simulator" && (
        <div style={{ padding: "1rem 1.15rem" }}>
          {/* Curseur interactif */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              marginBottom: "0.85rem",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#334155" }}>
                Variation :
              </span>
              <strong style={{ fontSize: "0.875rem", color: "#1D4ED8" }}>
                {priceAdj > 0 ? `+${priceAdj}%` : `${priceAdj}%`}
              </strong>
            </div>

            <input
              type="range"
              min="-20"
              max="30"
              step="5"
              value={priceAdj}
              onChange={(e) => setPriceAdj(Number(e.target.value))}
              style={{ flex: 1, minWidth: 100, accentColor: "#1D4ED8", cursor: "pointer" }}
            />

            <div style={{ fontSize: "0.8125rem", color: "#0F172A", fontWeight: 700 }}>
              Gain estimé : <span style={{ color: "#059669" }}>+{formatAmount(totalSimProfit)}</span>
            </div>
          </div>

          {/* Tableau de calcul compact */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "0.8rem", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E2E8F0", color: "#64748B", fontWeight: 600 }}>
                  <th style={{ padding: "0.4rem 0.5rem" }}>Article</th>
                  <th style={{ padding: "0.4rem 0.5rem" }}>Achat</th>
                  <th style={{ padding: "0.4rem 0.5rem" }}>Prix Simulé</th>
                  <th style={{ padding: "0.4rem 0.5rem" }}>Marge / U</th>
                  <th style={{ padding: "0.4rem 0.5rem" }}>%</th>
                  <th style={{ padding: "0.4rem 0.5rem", textAlign: "right" }}>Bénéfice</th>
                </tr>
              </thead>
              <tbody>
                {simulatedProducts.map((p) => (
                  <tr key={p.name} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "0.45rem 0.5rem", fontWeight: 600, color: "#0F172A" }}>{p.name}</td>
                    <td style={{ padding: "0.45rem 0.5rem", color: "#64748B" }}>{fmtShort(p.cost)}</td>
                    <td style={{ padding: "0.45rem 0.5rem", fontWeight: 700, color: "#1D4ED8" }}>
                      {fmtShort(p.adjPrice)}
                    </td>
                    <td style={{ padding: "0.45rem 0.5rem", color: "#059669", fontWeight: 600 }}>
                      +{fmtShort(p.marginAmount)}
                    </td>
                    <td style={{ padding: "0.45rem 0.5rem" }}>
                      <span
                        style={{
                          background: p.marginPct >= 30 ? "#DCFCE7" : "#FEF3C7",
                          color: p.marginPct >= 30 ? "#166534" : "#92400E",
                          padding: "0.1rem 0.35rem",
                          borderRadius: "4px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}
                      >
                        {p.marginPct.toFixed(0)}%
                      </span>
                    </td>
                    <td style={{ padding: "0.45rem 0.5rem", textAlign: "right", fontWeight: 700, color: "#0F172A" }}>
                      {fmtShort(p.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              marginTop: "0.65rem",
              paddingTop: "0.65rem",
              borderTop: "1px solid #E2E8F0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.8125rem",
            }}
          >
            <span style={{ color: "#64748B" }}>Total CA : <strong>{formatAmount(totalSimRevenue)}</strong></span>
            <Link
              href="/simulateur"
              style={{ color: "#1D4ED8", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
            >
              Simulateur complet →
            </Link>
          </div>
        </div>
      )}

      {/* Contenu Interactif : Onglet 2 Journal de Caisse */}
      {activeTab === "sales" && (
        <div style={{ padding: "1rem 1.15rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0F172A" }}>Dernières Ventes Encaissées</div>
              <div style={{ fontSize: "0.72rem", color: "#64748B" }}>Déstockage automatique en direct</div>
            </div>
            <span style={{ background: "#EFF6FF", color: "#1D4ED8", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700 }}>
              4 Ventes
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {[
              { id: "V-901", item: "2x Montre Connectée", price: 40000, time: "Il y a 4 min", type: "Vocal / Caisse" },
              { id: "V-900", item: "1x Smartphone 4G", price: 65000, time: "Il y a 18 min", type: "Comptoir" },
              { id: "V-899", item: "3x Écouteurs Sans-Fil", price: 28500, time: "Il y a 1h", type: "Comptoir" },
            ].map((v) => (
              <div
                key={v.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.55rem 0.75rem",
                  background: "#F8FAFC",
                  borderRadius: "6px",
                  border: "1px solid #E2E8F0",
                  fontSize: "0.8rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "#0F172A" }}>{v.item}</div>
                  <div style={{ fontSize: "0.68rem", color: "#64748B" }}>{v.id} • {v.type} • {v.time}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, color: "#059669" }}>+{fmtShort(v.price)}</div>
                  <div style={{ fontSize: "0.68rem", color: "#64748B" }}>Ticket généré</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenu Interactif : Onglet 3 Bilan & Marges */}
      {activeTab === "kpi" && (
        <div style={{ padding: "1rem 1.15rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginBottom: "0.75rem" }}>
            <div style={{ background: "#F8FAFC", padding: "0.75rem", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Chiffre d&apos;Affaires</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0F172A", marginTop: "0.2rem" }}>1 845 000 FCFA</div>
              <div style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 700, marginTop: "0.2rem" }}>↑ +18% ce mois</div>
            </div>
            <div style={{ background: "#F8FAFC", padding: "0.75rem", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Marge Brute Réelle</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#059669", marginTop: "0.2rem" }}>784 200 FCFA</div>
              <div style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, marginTop: "0.2rem" }}>Taux moyen : 42.5%</div>
            </div>
          </div>

          <div style={{ background: "#F8FAFC", padding: "0.65rem 0.75rem", borderRadius: "6px", border: "1px solid #E2E8F0", fontSize: "0.75rem", color: "#475569" }}>
            <strong>Recommandation :</strong> Votre article <em>Calculatrice</em> génère 47% de marge avec une rotation élevée. Pensez à réapprovisionner avant rupture.
          </div>
        </div>
      )}
    </div>
  );
}
