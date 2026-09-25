"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import Link from "next/link";
import { BizIALogo } from "@/components/brand/BizIALogo";

interface Slide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  render: () => ReactNode;
}

export function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [activeTabDemo, setActiveTabDemo] = useState<"vision" | "voice" | "margin">("vision");

  const SLIDES: Slide[] = [
    // SLIDE 1: COVER & HOOK
    {
      id: "cover",
      tag: "VISION & INTRODUCTION",
      title: "L'Intelligence Artificielle au Cœur des 44M de PME Émergentes",
      subtitle: "BizIA — Le système d'exploitation financier et décisionnel autonome pour le commerce de détail et les entreprises en Afrique de l'Ouest.",
      render: () => (
        <div className="pitch-slide__hero">
          <div className="pitch-hero__badges">
            <span className="pitch-pill pitch-pill--primary">Hackathon 2026 • Innovation IA</span>
            <span className="pitch-pill pitch-pill--emerald">Multimodal Gemini Vision & Audio</span>
            <span className="pitch-pill pitch-pill--purple">Architecture Offline-First PWA</span>
          </div>

          <div className="pitch-metrics-grid">
            <div className="pitch-stat-card">
              <span className="pitch-stat-card__number">44M+</span>
              <span className="pitch-stat-card__label">PME en Afrique subsaharienne</span>
              <span className="pitch-stat-card__trend">85% sans outil de gestion</span>
            </div>
            <div className="pitch-stat-card">
              <span className="pitch-stat-card__number">330 Md$</span>
              <span className="pitch-stat-card__label">Volume de commerce informel</span>
              <span className="pitch-stat-card__trend">Enregistré sur carnets papier</span>
            </div>
            <div className="pitch-stat-card">
              <span className="pitch-stat-card__number">&lt; 1 sec</span>
              <span className="pitch-stat-card__label">Numérisation d'une facture par photo</span>
              <span className="pitch-stat-card__trend">OCR multimodal Gemini</span>
            </div>
            <div className="pitch-stat-card">
              <span className="pitch-stat-card__number">+35%</span>
              <span className="pitch-stat-card__label">Marge nette récupérée</span>
              <span className="pitch-stat-card__trend">Détection des pertes et ruptures</span>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 2: THE PROBLEM
    {
      id: "problem",
      tag: "LE PROBLÈME DU MARCHÉ",
      title: "L'Angle Mort à 330 Milliards de Dollars",
      subtitle: "Pourquoi 8 entreprises sur 10 meurent avant 3 ans faute de visibilité sur leurs marges réelles et leur trésorerie.",
      render: () => (
        <div className="pitch-grid-3">
          <div className="pitch-card pitch-card--danger">
            <div className="pitch-card__badge">01. La Saisie Manuelle Tue</div>
            <h3>Carnets Papier & Perte de Données</h3>
            <p>
              92% des commerçants écrivent leurs ventes sur des cahiers volants. Résultat : 15 à 25% de fuite de trésorerie non comptabilisée chaque mois.
            </p>
            <div className="pitch-tag-list">
              <span>Cahiers perdus</span>
              <span>Erreurs de calcul</span>
              <span>Inventaires impossibles</span>
            </div>
          </div>

          <div className="pitch-card pitch-card--danger">
            <div className="pitch-card__badge">02. L'Illusion du Chiffre d'Affaires</div>
            <h3>Marges Floues & Ruptures Fatales</h3>
            <p>
              Les commerçants confondent volume d'encaissement et rentabilité réelle. Les articles à marge négative continuent d'être vendus sans le savoir.
            </p>
            <div className="pitch-tag-list">
              <span>Coûts d'achat ignorés</span>
              <span>Stock dormant</span>
              <span>Décapitalisation</span>
            </div>
          </div>

          <div className="pitch-card pitch-card--danger">
            <div className="pitch-card__badge">03. Fracture Technologique</div>
            <h3>Les Logiciels Actuels Sont Inadaptés</h3>
            <p>
              SAP, Odoo ou QuickBooks sont trop complexes, coûteux, en devises étrangères ($/€) et inutilisables hors-ligne ou sur simple smartphone.
            </p>
            <div className="pitch-tag-list">
              <span>Trop chers</span>
              <span>Connexion internet instable</span>
              <span>Nécessitent formation</span>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 3: THE SOLUTION
    {
      id: "solution",
      tag: "LA SOLUTION BIZIA",
      title: "Le Copilote IA Autonome des PME d'Afrique",
      subtitle: "Zéro formation requise : une photo de reçu ou une commande vocale suffit pour piloter stocks, ventes et rentabilité.",
      render: () => (
        <div className="pitch-solution-showcase">
          <div className="pitch-solution-card">
            <div className="pitch-solution-card__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <h4>1. Vision IA Instantanée</h4>
            <p>Une photo du ticket ou bon de livraison manuscrit extrait instantanément articles, prix, coûts et met à jour le stock.</p>
          </div>

          <div className="pitch-solution-card">
            <div className="pitch-solution-card__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </div>
            <h4>2. Interaction Vocale 360°</h4>
            <p>Dictez vos ventes ou interrogez vos bénéfices oralement en français courant, avec synthèse vocale instantanée.</p>
          </div>

          <div className="pitch-solution-card">
            <div className="pitch-solution-card__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <h4>3. Mode PWA & Hors-Ligne</h4>
            <p>Enregistrez vos ventes même sans connexion internet. Synchronisation automatique et résiliente au retour du réseau.</p>
          </div>

          <div className="pitch-solution-card">
            <div className="pitch-solution-card__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            </div>
            <h4>4. Simulateur & Rentabilité Réelle</h4>
            <p>Indicateurs en FCFA, alertes prédictives de rupture et simulateur dynamique d'impact prix/marge avant toute décision.</p>
          </div>
        </div>
      ),
    },

    // SLIDE 4: CORE INNOVATION - OCR VISION & MULTIMODAL DEMO
    {
      id: "innovation",
      tag: "INNOVATION TECHNOLOGIQUE",
      title: "Vision Multimodale Gemini & Intelligence Terrain",
      subtitle: "Comment nous transformons n'importe quel papier froissé en données d'exploitation structurées en moins d'une seconde.",
      render: () => (
        <div className="pitch-interactive-demo">
          <div className="pitch-demo-nav">
            <button
              className={`btn btn--sm ${activeTabDemo === "vision" ? "btn--primary" : "btn--outline"}`}
              onClick={() => setActiveTabDemo("vision")}
            >
              OCR Vision Documentaire
            </button>
            <button
              className={`btn btn--sm ${activeTabDemo === "voice" ? "btn--primary" : "btn--outline"}`}
              onClick={() => setActiveTabDemo("voice")}
            >
              Commandes Vocales Multimodales
            </button>
            <button
              className={`btn btn--sm ${activeTabDemo === "margin" ? "btn--primary" : "btn--outline"}`}
              onClick={() => setActiveTabDemo("margin")}
            >
              Simulateur & Analyse Marges
            </button>
          </div>

          {activeTabDemo === "vision" && (
            <div className="pitch-demo-box">
              <div className="pitch-demo-col">
                <span className="pitch-demo-badge">Document Source (Photo Reçu)</span>
                <div className="pitch-mock-doc">
                  <div style={{ fontSize: "0.8rem", color: "#64748B", borderBottom: "1px dashed #CBD5E1", paddingBottom: 6 }}>
                    <strong>FACTURE #FAC-2026-089</strong> • 24/09/2026
                  </div>
                  <div style={{ fontSize: "0.85rem", marginTop: 8, lineHeight: 1.6 }}>
                    • 10x Cahier 200p @ 1 500 FCFA (Coût: 1 000)<br />
                    • 5x Stylos Bleus @ 2 500 FCFA (Coût: 1 800)<br />
                    • 2x Calculatrice @ 12 000 FCFA (Coût: 8 500)<br />
                  </div>
                  <div style={{ marginTop: 8, fontWeight: 700, color: "#0F172A", borderTop: "1px dashed #CBD5E1", paddingTop: 6 }}>
                    Total : 51 500 FCFA
                  </div>
                </div>
              </div>

              <div className="pitch-demo-arrow">→</div>

              <div className="pitch-demo-col">
                <span className="pitch-demo-badge pitch-demo-badge--success">Extraction Structurée Gemini Vision (JSON)</span>
                <div className="pitch-mock-json">
                  <code>
{`{
  "document_type": "sales",
  "items_extracted": 3,
  "total_revenue": "51 500 FCFA",
  "margin_estimated": "42.5%",
  "stock_updated": true,
  "catalog_synced": "3 articles"
}`}
                  </code>
                </div>
              </div>
            </div>
          )}

          {activeTabDemo === "voice" && (
            <div className="pitch-demo-box">
              <div className="pitch-voice-demo">
                <div className="pitch-voice-mic">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                </div>
                <div>
                  <div className="pitch-voice-transcript">« Vends 3 sacs de riz à 17 500 FCFA et dis-moi combien il me reste en réserve »</div>
                  <div className="pitch-voice-response">
                    <strong>Réponse IA :</strong> Vente de 3x Sac de riz enregistrée pour 52 500 FCFA. Il vous reste 14 sacs en stock. Votre marge moyenne sur cet article est de 38%.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTabDemo === "margin" && (
            <div className="pitch-demo-box">
              <div className="pitch-margin-demo">
                <div className="pitch-stat-pill">
                  <span>Chiffre d'Affaires</span>
                  <strong>1 845 000 FCFA</strong>
                </div>
                <div className="pitch-stat-pill pitch-stat-pill--emerald">
                  <span>Marge Brute Réelle</span>
                  <strong>784 200 FCFA (42.5%)</strong>
                </div>
                <div className="pitch-stat-pill pitch-stat-pill--amber">
                  <span>Articles en rupture imminente</span>
                  <strong>2 produits à réapprovisionner</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },

    // SLIDE 5: ARCHITECTURE & ENGINEERING EXCELLENCE
    {
      id: "architecture",
      tag: "ARCHITECTURE TECHNIQUE",
      title: "Ingénierie Robuste, Haute Disponibilité & Zéro-Dette",
      subtitle: "Stack moderne, isolation multi-tenant native, failover automatique et 100% de tests unitaires validés.",
      render: () => (
        <div className="pitch-arch-grid">
          <div className="pitch-arch-col">
            <h4>Frontend & Edge (Next.js 14+)</h4>
            <ul>
              <li><strong>App Router & React 18/19 :</strong> Rendu ultra-rapide côté client et serveur.</li>
              <li><strong>PWA & Service Worker :</strong> Mise en cache hors-ligne et fonctionnement autonome.</li>
              <li><strong>Offline Queue System :</strong> Stockage local des ventes et synchronisation intelligente.</li>
              <li><strong>Theme Engine :</strong> Mode sombre / clair avec micro-animations 60fps.</li>
            </ul>
          </div>

          <div className="pitch-arch-col">
            <h4>Backend & Intelligence (FastAPI)</h4>
            <ul>
              <li><strong>FastAPI Asynchrone :</strong> Latence &lt; 40ms par requête d'analyse.</li>
              <li><strong>Gemini Multi-Model Fallback :</strong> Cascade sur `flash-lite`, `flash` et `pro` sans 429.</li>
              <li><strong>Multi-Tenancy Strict (RLS) :</strong> Isolation totale des données par entreprise.</li>
              <li><strong>Qualité & Fiabilité :</strong> 79 tests pytest exécutés et validés à 100%.</li>
            </ul>
          </div>

          <div className="pitch-arch-col">
            <h4>Sécurité & Données (Supabase)</h4>
            <ul>
              <li><strong>PostgreSQL & Row Level Security :</strong> Chiffrement et politiques strictes.</li>
              <li><strong>Self-Healing Store :</strong> Création et rattachement automatique des nouveaux tenants.</li>
              <li><strong>Double Déploiement :</strong> Vercel (Front) + Render (API) avec CDN mondial.</li>
            </ul>
          </div>
        </div>
      ),
    },

    // SLIDE 6: BUSINESS MODEL & GO-TO-MARKET
    {
      id: "business",
      tag: "BUSINESS MODEL & MARCHÉ",
      title: "Une Opportunité Marché Massif à Faible CAC",
      subtitle: "Monétisation freemium SaaS + micro-commissions sur les paiements Mobile Money.",
      render: () => (
        <div className="pitch-grid-3">
          <div className="pitch-card pitch-card--accent">
            <div className="pitch-card__badge">Modèle Économique</div>
            <h3>SaaS B2B + FinTech Take-Rate</h3>
            <ul className="pitch-feature-list">
              <li><strong>Gratuit :</strong> Jusqu'à 50 produits et scan basique pour acquisition virale.</li>
              <li><strong>Pro (9 900 FCFA / mois ~ 15$) :</strong> IA vocale illimitée, export comptable et simulateur.</li>
              <li><strong>Enterprise (35 000 FCFA / mois) :</strong> Multi-boutiques, rôles caissiers et API.</li>
              <li><strong>Take-rate 0.8% :</strong> Sur les flux de paiements Mobile Money (Wave, MoMo).</li>
            </ul>
          </div>

          <div className="pitch-card pitch-card--accent">
            <div className="pitch-card__badge">Taille du Marché (Afrique de l'Ouest)</div>
            <h3>TAM / SAM / SOM</h3>
            <ul className="pitch-feature-list">
              <li><strong>TAM (Total Addressable) :</strong> 4.2 Milliards $ (44M de PME en Afrique).</li>
              <li><strong>SAM (Serviceable) :</strong> 850 Millions $ (Zone UEMOA / CEDEAO francophone).</li>
              <li><strong>SOM (Objectif 24 mois) :</strong> 50 000 commerces actifs = 9M$ ARR.</li>
            </ul>
          </div>

          <div className="pitch-card pitch-card--accent">
            <div className="pitch-card__badge">Stratégie d'Acquisition (Go-To-Market)</div>
            <h3>Canaux à Fort Effet Réseau</h3>
            <ul className="pitch-feature-list">
              <li><strong>Partenariats Marchés & Grossistes :</strong> Les grossistes imposent BizIA à leurs détaillants pour recevoir les commandes.</li>
              <li><strong>WhatsApp Viral Loop :</strong> Reçus de caisse PDF envoyés directement aux clients avec logo BizIA.</li>
              <li><strong>Ambassadeurs Terrain :</strong> Équipe terrain locale équipant les boutiques en 5 minutes.</li>
            </ul>
          </div>
        </div>
      ),
    },

    // SLIDE 7: COMPETITIVE ADVANTAGE (THE MOAT)
    {
      id: "moat",
      tag: "POURQUOI BIZIA GAGNE (LE MOAT)",
      title: "Barrières à l'Entrée & Avantages Inéquitables",
      subtitle: "Pourquoi aucun acteur traditionnel ne peut répliquer notre proposition de valeur sur ce segment.",
      render: () => (
        <div className="pitch-comparison-table-wrap">
          <table className="pitch-comparison-table">
            <thead>
              <tr>
                <th>Critères d'évaluation</th>
                <th className="pitch-highlight-col">BizIA (Notre Solution)</th>
                <th>QuickBooks / Odoo</th>
                <th>Cahier Papier / Excel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Saisie des documents</strong></td>
                <td className="pitch-highlight-col">Photo OCR IA instantanée (1 sec)</td>
                <td>Saisie manuelle fastidieuse</td>
                <td>Manuelle et illisible</td>
              </tr>
              <tr>
                <td><strong>Interaction Vocale</strong></td>
                <td className="pitch-highlight-col">100% natif en français courant</td>
                <td>Non disponible</td>
                <td>Inexistant</td>
              </tr>
              <tr>
                <td><strong>Fonctionnement Hors-Ligne</strong></td>
                <td className="pitch-highlight-col">PWA Offline avec auto-sync</td>
                <td>Connexion obligatoire</td>
                <td>Physique uniquement</td>
              </tr>
              <tr>
                <td><strong>Monnaie & Localisation</strong></td>
                <td className="pitch-highlight-col">FCFA natif & intégration locale</td>
                <td>Devises $/€ complexes</td>
                <td>Non structuré</td>
              </tr>
              <tr>
                <td><strong>Temps de prise en main</strong></td>
                <td className="pitch-highlight-col">0 minute (aussi simple que WhatsApp)</td>
                <td>Plusieurs semaines de formation</td>
                <td>Immédiat mais inefficace</td>
              </tr>
              <tr>
                <td><strong>Prix mensuel</strong></td>
                <td className="pitch-highlight-col">Dès 0 FCFA (Freemium accessible)</td>
                <td>50$ à 300$ / mois</td>
                <td>0 FCFA (mais 25% de pertes)</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },

    // SLIDE 8: THE ASK & VISION
    {
      id: "closing",
      tag: "CONCLUSION & DÉPLOIEMENT",
      title: "Digitaliser l'Économie Réelle dès Aujourd'hui",
      subtitle: "L'application est 100% fonctionnelle, testée, déployée et prête pour le déploiement à grande échelle.",
      render: () => (
        <div className="pitch-closing-box">
          <div className="pitch-closing-content">
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.75rem", color: "var(--color-primary, #3b82f6)" }}>
              BizIA est en ligne et opérationnel en temps réel
            </h3>
            <p style={{ maxWidth: 640, margin: "0 auto 1.5rem", color: "var(--color-text-muted, #94A3B8)", lineHeight: 1.6 }}>
              Nous ne présentons pas un simple concept ou une maquette Figma : l'infrastructure backend, la reconnaissance multimodale Gemini Vision, la commande vocale et le mode PWA hors-ligne sont déployés en production et utilisables immédiatement.
            </p>

            <div className="pitch-closing-actions">
              <Link href="/scanner" className="btn btn--primary btn--lg">
                Tester le Scanner Vision IA
              </Link>
              <Link href="/dashboard" className="btn btn--outline btn--lg">
                Voir le Tableau de Bord
              </Link>
              <Link href="/simulateur" className="btn btn--ghost btn--lg">
                Lancer le Simulateur
              </Link>
            </div>
          </div>

          <div className="pitch-jury-summary">
            <div className="pitch-jury-item">
              <span className="pitch-jury-check">✓</span>
              <span><strong>Impact Social & Économique :</strong> Inclusion financière des commerces informels.</span>
            </div>
            <div className="pitch-jury-item">
              <span className="pitch-jury-check">✓</span>
              <span><strong>Excellence Technique :</strong> 79 tests unitaires, PWA hors-ligne, zéro latence.</span>
            </div>
            <div className="pitch-jury-item">
              <span className="pitch-jury-check">✓</span>
              <span><strong>Exécution Immédiate :</strong> Production live sur Vercel & Render.</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((curr) => (curr + 1 < SLIDES.length ? curr + 1 : curr));
  }, [SLIDES.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((curr) => (curr > 0 ? curr - 1 : curr));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slide = SLIDES[currentSlide];

  return (
    <div className="pitch-container">
      {/* Top Bar */}
      <header className="pitch-header">
        <div className="pitch-header__left">
          <Link href="/" className="pitch-header__brand">
            <BizIALogo size="sm" showTagline={false} />
          </Link>
          <span className="pitch-header__divider">/</span>
          <span className="pitch-header__title">Executive Pitch Deck • Harvard Edition</span>
        </div>

        <div className="pitch-header__controls">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => setShowNotes((v) => !v)}
            title="Afficher/Masquer les notes de présentation"
          >
            Notes {showNotes ? "visibles" : ""}
          </button>
          <span className="pitch-counter">
            {currentSlide + 1} / {SLIDES.length}
          </span>
        </div>
      </header>

      {/* Main Slide Canvas */}
      <main className="pitch-canvas">
        <div className="pitch-slide">
          <div className="pitch-slide__header">
            <span className="pitch-slide__tag">{slide.tag}</span>
            <h1 className="pitch-slide__title">{slide.title}</h1>
            <p className="pitch-slide__subtitle">{slide.subtitle}</p>
          </div>

          <div className="pitch-slide__body">
            {slide.render()}
          </div>
        </div>
      </main>

      {/* Slide Navigation Footer */}
      <footer className="pitch-footer">
        <div className="pitch-footer__thumbnails">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              className={`pitch-thumb ${idx === currentSlide ? "pitch-thumb--active" : ""}`}
              onClick={() => setCurrentSlide(idx)}
              title={s.title}
            >
              <span className="pitch-thumb__num">{idx + 1}</span>
              <span className="pitch-thumb__label">{s.id}</span>
            </button>
          ))}
        </div>

        <div className="pitch-footer__nav-btns">
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            ← Précédent
          </button>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={nextSlide}
            disabled={currentSlide === SLIDES.length - 1}
          >
            Suivant →
          </button>
        </div>
      </footer>
    </div>
  );
}
