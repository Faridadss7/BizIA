import os
import base64
import subprocess
import shutil
import pypdfium2 as pdfium

def get_base64_img(path):
    if os.path.exists(path):
        with open(path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
            return f"data:image/png;base64,{encoded}"
    return ""

img_sim = get_base64_img("presentation_assets/screen_simulator.png")
img_scan = get_base64_img("presentation_assets/screen_scanner.png")
img_import = get_base64_img("presentation_assets/screen_import.png")
img_chat = get_base64_img("presentation_assets/screen_chat.png")

# Exact official SVG logo from BizIALogo.tsx (Concept 1)
logo_svg_brand = """<div style="display: flex; align-items: center; gap: 14px;">
  <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bizia-c1-base" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#1D4ED8" />
        <stop offset="50%" stop-color="#2563EB" />
        <stop offset="100%" stop-color="#3B82F6" />
      </linearGradient>
      <linearGradient id="bizia-c1-accent" x1="30" y1="20" x2="85" y2="75" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#38BDF8" />
        <stop offset="100%" stop-color="#06B6D4" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="url(#bizia-c1-base)" />
    <path d="M24 22C24 19.7909 25.7909 18 28 18H38C40.2091 18 42 19.7909 42 22V78C42 80.2091 40.2091 82 38 82H28C25.7909 82 24 80.2091 24 78V22Z" fill="white" />
    <path d="M38 18H58C67.9411 18 76 26.0589 76 36C76 45.9411 67.9411 54 58 54H38V18Z" fill="white" fill-opacity="0.96" />
    <path d="M48 28H56C60.4183 28 64 31.5817 64 36C64 40.4183 60.4183 44 56 44H48V28Z" fill="url(#bizia-c1-base)" />
    <path d="M38 46H62C72.4934 46 81 54.5066 81 65C81 74.3888 74.1911 82 64.8023 82H38V46Z" fill="url(#bizia-c1-accent)" />
    <path d="M48 56H61C65.9706 56 70 60.0294 70 65C70 69.9706 65.9706 74 61 74H48V56Z" fill="url(#bizia-c1-base)" />
    <path d="M74 24L82 16M82 16H74M82 16V24" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <div style="display: flex; flex-direction: column; justify-content: center;">
    <div style="font-size: 26px; font-weight: 800; letter-spacing: -0.03em; color: #0F172A; line-height: 1;">
      Biz<span style="color: #2563EB; font-weight: 900;">IA</span>
    </div>
    <div style="font-size: 12px; letter-spacing: 0.04em; font-weight: 600; color: #64748B; margin-top: 3px;">
      PME &amp; entreprises
    </div>
  </div>
</div>"""

html_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>BizIA - Présentation Officielle Projet | Fata Nexus</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    @page {{
      size: 1920px 1080px;
      margin: 0;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}

    body {{
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #F8FAFC;
      color: #111827;
      margin: 0;
      padding: 0;
    }}

    .slide {{
      width: 1920px;
      height: 1080px;
      page-break-after: always;
      background: #FFFFFF;
      padding: 42px 70px 32px 70px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }}

    /* Bande supérieure bleue */
    .top-bar {{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #1D4ED8, #2563EB, #3B82F6);
    }}

    /* Header officiel */
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 1px solid #E2E8F0;
    }}

    .live-tag {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #ECFDF5;
      border: 1px solid #A7F3D0;
      color: #065F46;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 9999px;
    }}

    .live-dot {{
      width: 8px;
      height: 8px;
      background: #10B981;
      border-radius: 50%;
    }}

    /* Contenu Principal */
    .content {{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 14px 0;
    }}

    .section-pill {{
      display: inline-block;
      align-self: flex-start;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #1D4ED8;
      background: #EFF6FF;
      border: 1px solid #DBEAFE;
      padding: 5px 12px;
      border-radius: 6px;
      margin-bottom: 8px;
    }}

    .section-pill.green {{
      color: #065F46;
      background: #ECFDF5;
      border-color: #A7F3D0;
    }}

    .slide-heading {{
      font-size: 34px;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin-bottom: 6px;
    }}

    .slide-description {{
      font-size: 16px;
      color: #4B5563;
      line-height: 1.5;
      margin-bottom: 18px;
      max-width: 1400px;
    }}

    /* Grilles et Cartes */
    .grid-4 {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }}

    .grid-3 {{
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }}

    .grid-2 {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 22px;
      align-items: center;
    }}

    .card {{
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
      display: flex;
      flex-direction: column;
    }}

    .member-card {{
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }}

    .member-name {{
      font-size: 14px;
      font-weight: 800;
      color: #111827;
      margin-bottom: 4px;
      line-height: 1.3;
    }}

    .member-role {{
      font-size: 12px;
      font-weight: 700;
      color: #1D4ED8;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 6px;
    }}

    .member-desc {{
      font-size: 12.5px;
      color: #4B5563;
      line-height: 1.45;
    }}

    .card-title {{
      font-size: 17.5px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 6px;
    }}

    .card-body {{
      font-size: 14px;
      color: #4B5563;
      line-height: 1.5;
    }}

    .stat-val {{
      font-size: 38px;
      font-weight: 800;
      color: #1D4ED8;
      line-height: 1;
      margin-bottom: 4px;
    }}

    .stat-lbl {{
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      line-height: 1.35;
    }}

    /* Cadre de capture d'écran UI */
    .screenshot-frame {{
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
    }}

    .screenshot-header {{
      background: #F8FAFC;
      border-bottom: 1px solid #E2E8F0;
      padding: 8px 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12.5px;
      font-weight: 600;
      color: #475569;
    }}

    .dot {{
      width: 9px;
      height: 9px;
      border-radius: 50%;
      display: inline-block;
    }}
    .dot-r {{ background: #EF4444; }}
    .dot-y {{ background: #F59E0B; }}
    .dot-g {{ background: #10B981; }}

    .screenshot-img {{
      width: 100%;
      height: 335px;
      object-fit: cover;
      object-position: top;
      display: block;
      background: #FFFFFF;
    }}

    /* Footer */
    .footer {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #E2E8F0;
      font-size: 13px;
      color: #64748B;
      font-weight: 500;
    }}

    /* Slide Démo Spéciale */
    .demo-slide-content {{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      flex: 1;
      padding: 30px;
    }}

    .demo-badge {{
      background: #1D4ED8;
      color: #FFFFFF;
      font-size: 20px;
      font-weight: 800;
      padding: 10px 30px;
      border-radius: 9999px;
      letter-spacing: 0.1em;
      margin-bottom: 20px;
      box-shadow: 0 10px 20px rgba(29, 78, 216, 0.25);
    }}

    .demo-title {{
      font-size: 48px;
      font-weight: 800;
      color: #111827;
      margin-bottom: 14px;
    }}

    .demo-subtitle {{
      font-size: 21px;
      color: #4B5563;
      max-width: 900px;
      line-height: 1.5;
      margin-bottom: 32px;
    }}

    .demo-box {{
      background: #F8FAFC;
      border: 1px solid #DBEAFE;
      border-radius: 16px;
      padding: 20px 40px;
      display: flex;
      align-items: center;
      gap: 24px;
    }}

    .demo-step {{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }}

    .demo-step-num {{
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #1D4ED8;
      color: #FFF;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
    }}

    .demo-step-text {{
      font-size: 14.5px;
      font-weight: 600;
      color: #1E293B;
    }}
  </style>
</head>
<body>

  <!-- ========================================================================= -->
  <!-- SLIDE 1 : COUVERTURE & PRESENTATION DU PROJET (EQUIPE FATA NEXUS)          -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      {logo_svg_brand}
      <div class="live-tag">
        <div class="live-dot"></div>
        APPLICATION EN PRODUCTION : BIZIA.VERCEL.APP
      </div>
    </div>

    <div class="content">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px;">
        <div>
          <div class="section-pill">Groupe Fata Nexus &bull; Présentation Officielle</div>
          <h1 class="slide-heading">Intelligence Financière & Gestion Commerciale pour PME</h1>
        </div>
        <div style="font-size: 13px; color: #64748B; font-weight: 600;">
          Plateforme : <b>Next.js &bull; FastAPI &bull; Supabase &bull; Gemini</b>
        </div>
      </div>
      
      <p class="slide-description" style="margin-bottom: 16px;">
        Une suite unifiée combinant vision multimodale (Gemini OCR), importation intelligente Excel/CSV, 
        caisse vocale, mode PWA hors-ligne et pilotage précis des marges nettes réelles en FCFA.
      </p>

      <!-- Grille des 4 membres de Fata Nexus -->
      <div class="grid-4">
        <div class="member-card">
          <div class="member-role">Lead IA, Data & Backend</div>
          <div class="member-name">ADISSO Y. B. Farid</div>
          <div class="member-desc">Scan OCR Gemini Vision, simulateur What-If, modélisation ML et pipelines data backend.</div>
        </div>

        <div class="member-card">
          <div class="member-role">Lead Frontend & UI/UX</div>
          <div class="member-name">AHOLOU H. I. Christelle</div>
          <div class="member-desc">Développement de l'interface utilisateur, design system, ergonomie et intégration PWA.</div>
        </div>

        <div class="member-card">
          <div class="member-role">Lead QA, Tests & Coord.</div>
          <div class="member-name">ESSEGNON K. O. Bienvenu</div>
          <div class="member-desc">Validation continue, suite de tests automatisés, gestion de versions Git et coordination.</div>
        </div>

        <div class="member-card">
          <div class="member-role">Database & Backend</div>
          <div class="member-name">HOUEGBE Uriel</div>
          <div class="member-desc">Modélisation de la base PostgreSQL/Supabase, sécurité RLS et endpoints API backend.</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Groupe Fata Nexus &bull; Présentation Jury</div>
      <div>1 / 8</div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- SLIDE 2 : PROBLEMATIQUE & BLOCAGES DU TERRAIN                              -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      {logo_svg_brand}
      <div class="live-tag">
        <div class="live-dot"></div>
        DIAGNOSTIC SECTORIEL
      </div>
    </div>

    <div class="content">
      <div class="section-pill">Pourquoi BizIA ?</div>
      <h1 class="slide-heading">Les 4 défis majeurs du commerce de proximité</h1>
      <p class="slide-description">Les solutions logicielles classiques échouent face aux contraintes réelles du terrain africain.</p>

      <div class="grid-4">
        <div class="card">
          <div class="card-title">1. Factures & Bons Papiers</div>
          <div class="card-body">
            Reçus thermiques effacés, carnets manuscrits égarés et erreurs manuelles quotidiennes de recopiage.
          </div>
        </div>

        <div class="card">
          <div class="card-title">2. Tableurs Excel Dispersés</div>
          <div class="card-body">
            Catalogues stockés sur des fichiers disparates sans calcul automatique de stock ni déstockage synchronisé.
          </div>
        </div>

        <div class="card">
          <div class="card-title">3. Coupures d'Internet</div>
          <div class="card-body">
            Blocage immédiat des logiciels 100% Cloud lors des coupures d'électricité et d'internet mobile au comptoir.
          </div>
        </div>

        <div class="card">
          <div class="card-title">4. Marge Nette Ignorée</div>
          <div class="card-body">
            Confusion entre chiffre d'affaires et bénéfice net réel, masquant les produits à perte et les fuites de trésorerie.
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>bizia.vercel.app &bull; Problématiques & Diagnostic</div>
      <div>2 / 8</div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- SLIDE 3 : LA SUITE COMPLETE DES SOLUTIONS BIZIA                           -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      {logo_svg_brand}
      <div class="live-tag">
        <div class="live-dot"></div>
        SUITE COMPLETE
      </div>
    </div>

    <div class="content">
      <div class="section-pill">Solutions Développées</div>
      <h1 class="slide-heading">Une suite logicielle complète, fluide et unifiée</h1>
      <p class="slide-description">Toutes les opérations quotidiennes du commerçant automatisées sur une seule interface.</p>

      <div class="grid-3">
        <div class="card">
          <div class="card-title">Scanner OCR Gemini Vision</div>
          <div class="card-body">Photo d'une facture ou bon de livraison manuscrit : extraction des articles, prix d'achat et mise à jour immédiate du stock.</div>
        </div>

        <div class="card">
          <div class="card-title">Importation Excel & CSV</div>
          <div class="card-body">Glisser-déposer de tableurs existants, détection intelligente des colonnes, réconciliation avec le catalogue et calcul de rentabilité.</div>
        </div>

        <div class="card">
          <div class="card-title">Simulateur What-If en FCFA</div>
          <div class="card-body">Tableur interactif pour tester l'impact direct des variations de prix de vente sur la marge nette globale et le seuil de rentabilité.</div>
        </div>

        <div class="card">
          <div class="card-title">Caisse & Commande Vocale</div>
          <div class="card-body">Enregistrement rapide des ventes à la voix (français et dialectes locaux) ou au clic, avec impression de reçus.</div>
        </div>

        <div class="card">
          <div class="card-title">Mode PWA Hors-Ligne</div>
          <div class="card-body">Fonctionnement complet sans connexion internet (IndexedDB) avec réplication automatique dès retour du réseau.</div>
        </div>

        <div class="card">
          <div class="card-title">Bilans Financiers PDF</div>
          <div class="card-body">Génération en un clic de rapports certifiés prêts à soumettre aux banques et institutions de microfinance partenaires.</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>bizia.vercel.app &bull; Fonctionnalités Implémentées</div>
      <div>3 / 8</div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- SLIDE 4 : ARCHITECTURE TECHNIQUE & SECURITE                               -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      {logo_svg_brand}
      <div class="live-tag">
        <div class="live-dot"></div>
        STANDARDS INDUSTRIELS
      </div>
    </div>

    <div class="content">
      <div class="section-pill">Architecture & Pipeline</div>
      <h1 class="slide-heading">Une infrastructure moderne, réactive et sécurisée</h1>
      <p class="slide-description">Architecture découplée garantissant haute disponibilité, sécurité des données et temps de réponse ultra-courts.</p>

      <div class="grid-3">
        <div class="card">
          <div class="card-title">Frontend & PWA</div>
          <div class="card-body">
            &bull; <b>Next.js 14 App Router :</b> Rendu hybride ultra-rapide.<br>
            &bull; <b>TypeScript strict :</b> Zéro erreur de typage.<br>
            &bull; <b>Tailwind CSS :</b> Design system clair et haute lisibilité.<br>
            &bull; <b>Service Worker :</b> Cache local et synchronisation asynchrone.
          </div>
        </div>

        <div class="card">
          <div class="card-title">Backend & Base de Données</div>
          <div class="card-body">
            &bull; <b>FastAPI (Python 3.12) :</b> Moteur asynchrone sous Cloud.<br>
            &bull; <b>Supabase PostgreSQL :</b> Cloisonnement strict Row Level Security (RLS) par entreprise.<br>
            &bull; <b>Authentification JWT :</b> Tokens sécurisés et session rotative.<br>
            &bull; <b>Fiabilité :</b> 79 tests automatisés passés en continu.
          </div>
        </div>

        <div class="card">
          <div class="card-title">Pipeline IA Multimodal</div>
          <div class="card-body">
            &bull; <b>Google Gemini 3.5 Flash Lite :</b> OCR ultra-rapide.<br>
            &bull; <b>Google Gemini 3.8 Flash :</b> Failover automatique en cas de pic.<br>
            &bull; <b>Speech Recognition :</b> Parsing vocal des transactions de vente.<br>
            &bull; <b>Moteur What-If :</b> Calcul vectoriel des marges en direct.
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>bizia.vercel.app &bull; Infrastructure & Sécurité</div>
      <div>4 / 8</div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- SLIDE 5 : DEMONSTRATION : SCAN OCR & IMPORT TABLEUR (CAPTURES REELLES)    -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      {logo_svg_brand}
      <div class="live-tag">
        <div class="live-dot"></div>
        CAPTURES REELLES DE L'APPLICATION
      </div>
    </div>

    <div class="content">
      <div class="section-pill">Interface Utilisateur</div>
      <h1 class="slide-heading">Scanner OCR de Factures & Importation de Tableurs</h1>
      <p class="slide-description">Numérisation instantanée des bons fournisseurs et intégration directe des fichiers Excel de stock.</p>

      <div class="grid-2">
        <div class="screenshot-frame">
          <div class="screenshot-header">
            <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
            <span>Module Scanner OCR de Factures & Reçus Manuscrits</span>
          </div>
          <img src="{img_scan}" class="screenshot-img" alt="Scanner OCR">
        </div>

        <div class="screenshot-frame">
          <div class="screenshot-header">
            <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
            <span>Module d'Importation Intelligente CSV / Excel</span>
          </div>
          <img src="{img_import}" class="screenshot-img" alt="Importation Tableur">
        </div>
      </div>
    </div>

    <div class="footer">
      <div>bizia.vercel.app/scanner &bull; bizia.vercel.app/import</div>
      <div>5 / 8</div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- SLIDE 6 : DEMONSTRATION : SIMULATEUR & ASSISTANT VOCAL (CAPTURES REELLES)  -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      {logo_svg_brand}
      <div class="live-tag">
        <div class="live-dot"></div>
        CAPTURES REELLES DE L'APPLICATION
      </div>
    </div>

    <div class="content">
      <div class="section-pill">Interface Utilisateur</div>
      <h1 class="slide-heading">Simulateur What-If des Marges & Caisse Vocale</h1>
      <p class="slide-description">Calcul de rentabilité en direct en FCFA et enregistrement fluide des ventes à la voix.</p>

      <div class="grid-2">
        <div class="screenshot-frame">
          <div class="screenshot-header">
            <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
            <span>Simulateur What-If & Marges Réelles en FCFA</span>
          </div>
          <img src="{img_sim}" class="screenshot-img" alt="Simulateur What-If">
        </div>

        <div class="screenshot-frame">
          <div class="screenshot-header">
            <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
            <span>Assistant Financier & Caisse à Dictée Vocale</span>
          </div>
          <img src="{img_chat}" class="screenshot-img" alt="Caisse Vocale">
        </div>
      </div>
    </div>

    <div class="footer">
      <div>bizia.vercel.app/simulateur &bull; bizia.vercel.app/chat</div>
      <div>6 / 8</div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- SLIDE 7 : MODELE ECONOMIQUE FUTUR & STRATEGIE GO-TO-MARKET                -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      {logo_svg_brand}
      <div class="live-tag">
        <div class="live-dot"></div>
        MODELE ECONOMIQUE
      </div>
    </div>

    <div class="content">
      <div class="section-pill green">Plan de Déploiement & Monétisation</div>
      <h1 class="slide-heading">Stratégie en 2 Phases & Modèle Économique</h1>
      <p class="slide-description">Un lancement progressif pensé pour l'adoption massive sur le terrain puis la conversion SaaS rentable.</p>

      <div class="grid-3">
        <div class="card">
          <div class="card-title">Phase 1 : Test Immersif (1 Mois)</div>
          <div class="card-body">
            &bull; <b>100% Gratuit & Ouvert :</b> Déploiement auprès de marchands pilotes.<br><br>
            &bull; <b>Assistance & Support Dédié :</b> Accompagnement terrain des commerçants.<br><br>
            &bull; <b>Campagnes & Retours :</b> Collecte des retours utilisateurs en conditions réelles pour parfaire l'expérience.
          </div>
        </div>

        <div class="card">
          <div class="card-title">Phase 2 : Lancement Commercial</div>
          <div class="card-body">
            &bull; <b>Paiements Locaux :</b> Intégration Mobile Money (MTN, Moov, Orange, Wave), FedaPay et Stripe.<br><br>
            &bull; <b>Offre Découverte (Gratuit) :</b> Plafonnée à 50 produits, Assistant IA à 30%, Simulateur à 30%.<br><br>
            &bull; <b>Offre Pro (5 000 FCFA / mois) :</b> Accès 100% illimité à tous les modules, scans OCR, bilans PDF et nouveautés.
          </div>
        </div>

        <div class="card">
          <div class="card-title">B2B Banques & Microfinance</div>
          <div class="card-body">
            &bull; <b>API de Scoring Crédit :</b> Évaluation objective de la solvabilité des marchands.<br><br>
            &bull; <b>Certification des Flux :</b> Rapports financiers vérifiés pour débloquer les crédits de campagne.<br><br>
            &bull; <b>Monétisation B2B :</b> Commission sur les dossiers de financement qualifiés.
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>bizia.vercel.app &bull; Modèle Économique & Lancement</div>
      <div>7 / 8</div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- SLIDE 8 : DEMONSTRATION EN DIRECT (SPECIALE JURY)                         -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      {logo_svg_brand}
      <div class="live-tag">
        <div class="live-dot"></div>
        SERVEUR ACTIF & DISPONIBLE
      </div>
    </div>

    <div class="demo-slide-content">
      <div class="demo-badge">DÉMO EN DIRECT</div>
      <h1 class="demo-title">Passage à la Démonstration Interactive</h1>
      <p class="demo-subtitle">
        Lancement du serveur en direct et manipulation des fonctionnalités clés avec le Jury.
      </p>

      <div class="demo-box">
        <div class="demo-step">
          <div class="demo-step-num">1</div>
          <div class="demo-step-text">Scan OCR d'une Facture Papier</div>
        </div>
        <div style="color: #CBD5E1; font-size: 24px;">&rarr;</div>
        <div class="demo-step">
          <div class="demo-step-num">2</div>
          <div class="demo-step-text">Importation d'un Tableur CSV</div>
        </div>
        <div style="color: #CBD5E1; font-size: 24px;">&rarr;</div>
        <div class="demo-step">
          <div class="demo-step-num">3</div>
          <div class="demo-step-text">Simulation de Marge What-If</div>
        </div>
        <div style="color: #CBD5E1; font-size: 24px;">&rarr;</div>
        <div class="demo-step">
          <div class="demo-step-num">4</div>
          <div class="demo-step-text">Vente Vocale & Bilan PDF</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Plateforme en ligne : <b>https://bizia.vercel.app</b></div>
      <div>8 / 8</div>
    </div>
  </div>

</body>
</html>
"""

html_file = "presentation_deck.html"
with open(html_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML master deck generated successfully with Fata Nexus team cards!")

# Render to PDF using Edge headless
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

html_abs = os.path.abspath(html_file)
pdf_temp = os.path.abspath("deck_master.pdf")

cmd = [
    edge_path,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_temp}",
    html_abs
]

print(f"Rendering PDF with Edge: {pdf_temp}...")
subprocess.run(cmd, check=True)

# Copy to final files
target_files = [
    "BizIA_Presentation_Officielle.pdf",
    "BizIA_Presentation_Projet.pdf",
    "frontend/public/BizIA_Presentation_Officielle.pdf",
    "frontend/public/BizIA_Presentation_Projet.pdf"
]

for t in target_files:
    os.makedirs(os.path.dirname(t) if os.path.dirname(t) else ".", exist_ok=True)
    shutil.copyfile(pdf_temp, t)
    print(f"Saved: {t} ({os.path.getsize(t)} bytes)")

# Verify with pypdfium2
pdf = pdfium.PdfDocument("BizIA_Presentation_Officielle.pdf")
print(f"Total verified pages in PDF: {len(pdf)}")
os.makedirs("presentation_slides_img", exist_ok=True)
for i, page in enumerate(pdf):
    image = page.render(scale=1.5).to_pil()
    image.save(f"presentation_slides_img/slide_{i+1}.png")
    txt = page.get_textpage().get_text_range()
    first_line = txt.strip().split("\n")[0] if txt else ""
    print(f"Slide {i+1}: {first_line[:80]}")
