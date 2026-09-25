"use client";

import { useState } from "react";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT 1 : LE B MONOGRAMME GÉOMÉTRIQUE ASCENDANT (Momentum FinTech)
// ─────────────────────────────────────────────────────────────────────────────
export function LogoConcept1({ size = 48, monochrome = false }: { size?: number; monochrome?: boolean }) {
  const gradId = `c1_grad_${size}`;
  const accentGradId = `c1_acc_${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gradId} x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={monochrome ? "#000000" : "#1D4ED8"} />
          <stop offset="50%" stopColor={monochrome ? "#111111" : "#2563EB"} />
          <stop offset="100%" stopColor={monochrome ? "#333333" : "#3B82F6"} />
        </linearGradient>
        <linearGradient id={accentGradId} x1="30" y1="20" x2="85" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={monochrome ? "#FFFFFF" : "#38BDF8"} />
          <stop offset="100%" stopColor={monochrome ? "#EEEEEE" : "#06B6D4"} />
        </linearGradient>
      </defs>

      {/* Fond conteneur élégant aux coins polis */}
      <rect width="100" height="100" rx="24" fill={monochrome ? "#000000" : "url(#" + gradId + ")"} />

      {/* Tracé principal du B géométrique avec dynamique ascendante à 45° */}
      {/* Colonne dorsale gauche */}
      <path
        d="M24 22C24 19.7909 25.7909 18 28 18H38C40.2091 18 42 19.7909 42 22V78C42 80.2091 40.2091 82 38 82H28C25.7909 82 24 80.2091 24 78V22Z"
        fill="white"
      />

      {/* Boucle supérieure du B avec biseau d'ascension */}
      <path
        d="M38 18H58C67.9411 18 76 26.0589 76 36C76 45.9411 67.9411 54 58 54H38V18Z"
        fill="white"
        fillOpacity="0.96"
      />
      {/* Trou boucle supérieure */}
      <path
        d="M48 28H56C60.4183 28 64 31.5817 64 36C64 40.4183 60.4183 44 56 44H48V28Z"
        fill={monochrome ? "#000000" : "url(#" + gradId + ")"}
      />

      {/* Boucle inférieure du B projetée vers l'avant (croissance du CA) */}
      <path
        d="M38 46H62C72.4934 46 81 54.5066 81 65C81 74.3888 74.1911 82 64.8023 82H38V46Z"
        fill={monochrome ? "#FFFFFF" : "url(#" + accentGradId + ")"}
      />
      {/* Trou boucle inférieure */}
      <path
        d="M48 56H61C65.9706 56 70 60.0294 70 65C70 69.9706 65.9706 74 61 74H48V56Z"
        fill={monochrome ? "#000000" : "url(#" + gradId + ")"}
      />

      {/* Flèche d'ascension intégrée en contre-forme */}
      <path
        d="M74 24L82 16M82 16H74M82 16V24"
        stroke={monochrome ? "#FFFFFF" : "#38BDF8"}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT 2 : LE PRISME DÉCISIONNEL ISOMÉTRIQUE (Hexagone de Données & IA)
// ─────────────────────────────────────────────────────────────────────────────
export function LogoConcept2({ size = 48, monochrome = false }: { size?: number; monochrome?: boolean }) {
  const gTop = `c2_top_${size}`;
  const gLeft = `c2_left_${size}`;
  const gRight = `c2_right_${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        {/* Facette Supérieure (Intelligence / Synthèse) */}
        <linearGradient id={gTop} x1="50" y1="12" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={monochrome ? "#333333" : "#6366F1"} />
          <stop offset="100%" stopColor={monochrome ? "#111111" : "#4F46E5"} />
        </linearGradient>
        {/* Facette Gauche (Données Brutes & Stocks) */}
        <linearGradient id={gLeft} x1="16" y1="30" x2="50" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={monochrome ? "#222222" : "#312E81"} />
          <stop offset="100%" stopColor={monochrome ? "#000000" : "#1E1B4B"} />
        </linearGradient>
        {/* Facette Droite (Décision Financière & Rentabilité) */}
        <linearGradient id={gRight} x1="84" y1="30" x2="50" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={monochrome ? "#444444" : "#10B981"} />
          <stop offset="100%" stopColor={monochrome ? "#222222" : "#047857"} />
        </linearGradient>
      </defs>

      {/* Hexagone Isométrique à 3 facettes reliées */}
      {/* Facette Haut */}
      <path
        d="M50 12L82 30.5L50 49L18 30.5L50 12Z"
        fill={"url(#" + gTop + ")"}
      />
      {/* Facette Bas-Gauche */}
      <path
        d="M18 30.5L50 49V86L18 67.5V30.5Z"
        fill={"url(#" + gLeft + ")"}
      />
      {/* Facette Bas-Droite */}
      <path
        d="M50 49L82 30.5V67.5L50 86V49Z"
        fill={"url(#" + gRight + ")"}
      />

      {/* Monogramme B stylisé en lumière blanche au cœur du prisme */}
      <path
        d="M36 34V66H50C54.4183 66 58 62.4183 58 58C58 54.5 55.5 51.5 52 50.5C54.5 49.5 56 47 56 44C56 39.5817 52.4183 36 48 36H36"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 50H49"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      
      {/* Étoile de précision décisionnelle au sommet */}
      <circle cx="50" cy="12" r="3" fill="#38BDF8" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONCEPT 3 : LE B FLUX CONTINU & TABLEUR DÉCISIONNEL (Infinite Ledger)
// ─────────────────────────────────────────────────────────────────────────────
export function LogoConcept3({ size = 48, monochrome = false }: { size?: number; monochrome?: boolean }) {
  const gStroke = `c3_stroke_${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gStroke} x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={monochrome ? "#000000" : "#2563EB"} />
          <stop offset="50%" stopColor={monochrome ? "#222222" : "#3B82F6"} />
          <stop offset="100%" stopColor={monochrome ? "#444444" : "#0EA5E9"} />
        </linearGradient>
      </defs>

      {/* Cadre épuré dark mode ou blanc */}
      <rect width="100" height="100" rx="24" fill={monochrome ? "#000000" : "#0B1120"} />

      {/* 3 Barres d'activité intégrées en harmonie */}
      {/* Barre 1 (Ventes) */}
      <rect x="25" y="44" width="9" height="32" rx="4.5" fill={monochrome ? "#666666" : "#38BDF8"} fillOpacity="0.5" />
      {/* Barre 2 (Stocks) */}
      <rect x="38" y="32" width="9" height="44" rx="4.5" fill={monochrome ? "#AAAAAA" : "#60A5FA"} fillOpacity="0.8" />
      
      {/* Ligne maîtresse continue formant le B et courbant vers le haut */}
      <path
        d="M26 76V24C26 21.7909 27.7909 20 30 20H55C66.0457 20 75 28.9543 75 40C75 46.8523 71.5542 52.8996 66.2731 56.4422C72.6393 59.9882 77 66.8643 77 74.75C77 86.486 67.486 96 55.75 96H30C27.7909 96 26 94.2091 26 92V76Z"
        fill="none"
        stroke={"url(#" + gStroke + ")"}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Boucle centrale de liaison */}
      <path
        d="M30 50H54C60.0751 50 65 45.0751 65 39C65 32.9249 60.0751 28 54 28H30"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M30 76H56C62.6274 76 68 70.6274 68 64C68 57.3726 62.6274 52 56 52H30"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPARATIVE & SHOWCASE DE DÉCISION
// ─────────────────────────────────────────────────────────────────────────────
export function LogoShowcase() {
  const [selectedConcept, setSelectedConcept] = useState<1 | 2 | 3>(1);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span
          style={{
            display: "inline-block",
            padding: "0.35rem 0.85rem",
            background: "rgba(37, 99, 235, 0.1)",
            color: "#2563EB",
            borderRadius: 999,
            fontSize: "0.8125rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            marginBottom: "0.75rem",
          }}
        >
          STUDIO DE MARQUE BIZIA • ÉTUDE D'IDENTITÉ VISUELLE
        </span>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--color-text, #0f172a)", margin: "0 0 0.75rem" }}>
          3 Concepts de Logo Haute Couture pour BizIA
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--color-text-muted, #64748b)", maxWidth: 700, margin: "0 auto" }}>
          Des tracés vectoriels mathématiques (SVG pur), sans aucun défaut d'IA, calibrés pour être nets du favicon 16px jusqu'à l'affiche géante.
        </p>
      </div>

      {/* Grille des 3 concepts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", marginBottom: "3.5rem" }}>
        
        {/* CARTE 1 */}
        <div
          onClick={() => setSelectedConcept(1)}
          style={{
            background: "var(--color-surface, #ffffff)",
            border: selectedConcept === 1 ? "2.5px solid #2563EB" : "1px solid var(--color-border, #e2e8f0)",
            borderRadius: 16,
            padding: "2rem",
            cursor: "pointer",
            boxShadow: selectedConcept === 1 ? "0 12px 30px rgba(37, 99, 235, 0.15)" : "0 4px 12px rgba(0,0,0,0.03)",
            transition: "all 0.2s ease",
            position: "relative",
          }}
        >
          {selectedConcept === 1 && (
            <span style={{ position: "absolute", top: 16, right: 16, background: "#2563EB", color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 999 }}>
              SÉLECTIONNÉ
            </span>
          )}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 160, background: "#F8FAFC", borderRadius: 12, marginBottom: "1.5rem" }}>
            <LogoConcept1 size={96} />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--color-text, #0f172a)" }}>
            Concept 1 : Le B Monogramme Ascendant
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted, #64748b)", lineHeight: 1.5, marginBottom: "1rem" }}>
            <strong>Style FinTech Internationale (Stripe, Brex, Ramp).</strong><br />
            Un « B » puissant composé de chevrons géométriques ascendants à 45°, symbolisant le chiffre d'affaires qui grimpe et la prospérité des PME.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", background: "#EFF6FF", color: "#1D4ED8", padding: "0.25rem 0.5rem", borderRadius: 6, fontWeight: 600 }}>Moderne</span>
            <span style={{ fontSize: "0.75rem", background: "#EFF6FF", color: "#1D4ED8", padding: "0.25rem 0.5rem", borderRadius: 6, fontWeight: 600 }}>Croissance</span>
            <span style={{ fontSize: "0.75rem", background: "#EFF6FF", color: "#1D4ED8", padding: "0.25rem 0.5rem", borderRadius: 6, fontWeight: 600 }}>Ultra-lisible</span>
          </div>
        </div>

        {/* CARTE 2 */}
        <div
          onClick={() => setSelectedConcept(2)}
          style={{
            background: "var(--color-surface, #ffffff)",
            border: selectedConcept === 2 ? "2.5px solid #4F46E5" : "1px solid var(--color-border, #e2e8f0)",
            borderRadius: 16,
            padding: "2rem",
            cursor: "pointer",
            boxShadow: selectedConcept === 2 ? "0 12px 30px rgba(79, 70, 229, 0.15)" : "0 4px 12px rgba(0,0,0,0.03)",
            transition: "all 0.2s ease",
            position: "relative",
          }}
        >
          {selectedConcept === 2 && (
            <span style={{ position: "absolute", top: 16, right: 16, background: "#4F46E5", color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 999 }}>
              SÉLECTIONNÉ
            </span>
          )}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 160, background: "#F8FAFC", borderRadius: 12, marginBottom: "1.5rem" }}>
            <LogoConcept2 size={96} />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--color-text, #0f172a)" }}>
            Concept 2 : Le Prisme Décisionnel
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted, #64748b)", lineHeight: 1.5, marginBottom: "1rem" }}>
            <strong>Style Haute Technologie & Décision (Linear, Datadog).</strong><br />
            Hexagone isométrique à 3 facettes : Données Brutes (Indigo) → Intelligence IA (Violet) → Rentabilité & Action (Émeraude).
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", background: "#EEF2FF", color: "#4338CA", padding: "0.25rem 0.5rem", borderRadius: 6, fontWeight: 600 }}>Intelligence IA</span>
            <span style={{ fontSize: "0.75rem", background: "#ECFDF5", color: "#047857", padding: "0.25rem 0.5rem", borderRadius: 6, fontWeight: 600 }}>Rentabilité</span>
          </div>
        </div>

        {/* CARTE 3 */}
        <div
          onClick={() => setSelectedConcept(3)}
          style={{
            background: "var(--color-surface, #ffffff)",
            border: selectedConcept === 3 ? "2.5px solid #0EA5E9" : "1px solid var(--color-border, #e2e8f0)",
            borderRadius: 16,
            padding: "2rem",
            cursor: "pointer",
            boxShadow: selectedConcept === 3 ? "0 12px 30px rgba(14, 165, 233, 0.15)" : "0 4px 12px rgba(0,0,0,0.03)",
            transition: "all 0.2s ease",
            position: "relative",
          }}
        >
          {selectedConcept === 3 && (
            <span style={{ position: "absolute", top: 16, right: 16, background: "#0EA5E9", color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 999 }}>
              SÉLECTIONNÉ
            </span>
          )}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 160, background: "#0B1120", borderRadius: 12, marginBottom: "1.5rem" }}>
            <LogoConcept3 size={96} />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--color-text, #0f172a)" }}>
            Concept 3 : Le B Tableur & Flux Continu
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted, #64748b)", lineHeight: 1.5, marginBottom: "1rem" }}>
            <strong>Style Tableur & Opérations PME (Odoo, Square).</strong><br />
            Les colonnes du stock et des ventes reliées d'un seul trait continu formant le « B » avec un contraste saisissant sur fond sombre.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", background: "#F0F9FF", color: "#0369A1", padding: "0.25rem 0.5rem", borderRadius: 6, fontWeight: 600 }}>Tableur Excel</span>
            <span style={{ fontSize: "0.75rem", background: "#F0F9FF", color: "#0369A1", padding: "0.25rem 0.5rem", borderRadius: 6, fontWeight: 600 }}>Gestion Fluide</span>
          </div>
        </div>
      </div>

      {/* ── Déclinaisons en Contexte Réel (Header, Facture, Favicon) ── */}
      <div style={{ background: "var(--color-surface, #ffffff)", border: "1px solid var(--color-border, #e2e8f0)", borderRadius: 16, padding: "2.5rem" }}>
        <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "1.5rem", color: "var(--color-text, #0f172a)" }}>
          Simulations d'utilisation en situation réelle (Concept {selectedConcept})
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          
          {/* 1. Dans la barre de navigation (Topbar) */}
          <div style={{ background: "#F8FAFC", padding: "1.25rem", borderRadius: 12, border: "1px solid #E2E8F0" }}>
            <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.75rem" }}>
              1. En-tête d'application (Navigation)
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#FFFFFF", padding: "0.75rem 1rem", borderRadius: 8, border: "1px solid #E2E8F0" }}>
              {selectedConcept === 1 && <LogoConcept1 size={36} />}
              {selectedConcept === 2 && <LogoConcept2 size={36} />}
              {selectedConcept === 3 && <LogoConcept3 size={36} />}
              <div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
                  Biz<span style={{ color: "#2563EB" }}>IA</span>
                </div>
                <div style={{ fontSize: "0.65rem", color: "#64748B", fontWeight: 600, letterSpacing: "0.05em" }}>
                  INTELLIGENCE DÉCISIONNELLE
                </div>
              </div>
            </div>
          </div>

          {/* 2. Sur Ticket de Caisse & Bilan Noir & Blanc (Monochrome) */}
          <div style={{ background: "#F8FAFC", padding: "1.25rem", borderRadius: 12, border: "1px solid #E2E8F0" }}>
            <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.75rem" }}>
              2. Ticket thermique 80mm & Facture (N&amp;B)
            </p>
            <div style={{ background: "#FFFFFF", padding: "0.75rem 1rem", borderRadius: 8, border: "1px dashed #94A3B8", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem" }}>
                {selectedConcept === 1 && <LogoConcept1 size={36} monochrome />}
                {selectedConcept === 2 && <LogoConcept2 size={36} monochrome />}
                {selectedConcept === 3 && <LogoConcept3 size={36} monochrome />}
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#000" }}>BIZIA REÇU DE VENTE</div>
              <div style={{ fontSize: "0.7rem", color: "#555" }}>Ticket #2026-0892 • 14:30</div>
            </div>
          </div>

          {/* 3. Favicon d'onglet de navigateur (16px / 32px) */}
          <div style={{ background: "#F8FAFC", padding: "1.25rem", borderRadius: 12, border: "1px solid #E2E8F0" }}>
            <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.75rem" }}>
              3. Onglet Navigateur (Favicon)
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#E2E8F0", padding: "0.5rem 1rem", borderRadius: "8px 8px 0 0", width: "fit-content" }}>
              {selectedConcept === 1 && <LogoConcept1 size={20} />}
              {selectedConcept === 2 && <LogoConcept2 size={20} />}
              {selectedConcept === 3 && <LogoConcept3 size={20} />}
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155" }}>BizIA — Dashboard</span>
            </div>
          </div>

        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
        <Link href="/" className="btn btn--outline">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
