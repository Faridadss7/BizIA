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

img_home = get_base64_img("presentation_assets/screen_home.png")
img_sim = get_base64_img("presentation_assets/screen_simulator.png")
img_scan = get_base64_img("presentation_assets/screen_scanner.png")
img_import = get_base64_img("presentation_assets/screen_import.png")

logo_svg = """<svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bizia-c1-base" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#1D4ED8" />
      <stop offset="50%" stopColor="#2563EB" />
      <stop offset="100%" stopColor="#3B82F6" />
    </linearGradient>
    <linearGradient id="bizia-c1-accent" x1="30" y1="20" x2="85" y2="75" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#38BDF8" />
      <stop offset="100%" stopColor="#06B6D4" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="24" fill="url(#bizia-c1-base)" />
  <path d="M24 22C24 19.7909 25.7909 18 28 18H38C40.2091 18 42 19.7909 42 22V78C42 80.2091 40.2091 82 38 82H28C25.7909 82 24 80.2091 24 78V22Z" fill="white" />
  <path d="M38 18H58C67.9411 18 76 26.0589 76 36C76 45.9411 67.9411 54 58 54H38V18Z" fill="white" fillOpacity="0.96" />
  <path d="M48 28H56C60.4183 28 64 31.5817 64 36C64 40.4183 60.4183 44 56 44H48V28Z" fill="url(#bizia-c1-base)" />
  <path d="M38 46H62C72.4934 46 81 54.5066 81 65C81 74.3888 74.1911 82 64.8023 82H38V46Z" fill="url(#bizia-c1-accent)" />
  <path d="M48 56H61C65.9706 56 70 60.0294 70 65C70 69.9706 65.9706 74 61 74H48V56Z" fill="url(#bizia-c1-base)" />
  <path d="M74 24L82 16M82 16H74M82 16V24" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>"""

html_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>BizIA - Présentation Officielle Projet</title>
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
      padding: 45px 75px 35px 75px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }}

    /* Bande supérieure bleue officielle */
    .top-bar {{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: #1D4ED8;
    }}

    /* Header officiel BizIA */
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 18px;
      border-bottom: 1px solid #E2E8F0;
    }}

    .brand-wrap {{
      display: flex;
      align-items: center;
      gap: 14px;
    }}

    .brand-text {{
      display: flex;
      flex-direction: column;
    }}

    .brand-name {{
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #111827;
      line-height: 1.1;
    }}

    .brand-name span {{
      color: #2563EB;
      font-weight: 900;
    }}

    .brand-sub {{
      font-size: 12px;
      color: #64748B;
      font-weight: 600;
      letter-spacing: 0.04em;
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
      padding: 16px 0;
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
      margin-bottom: 10px;
    }}

    .section-pill.green {{
      color: #065F46;
      background: #ECFDF5;
      border-color: #A7F3D0;
    }}

    .slide-heading {{
      font-size: 36px;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin-bottom: 8px;
    }}

    .slide-description {{
      font-size: 17px;
      color: #4B5563;
      line-height: 1.5;
      margin-bottom: 22px;
      max-width: 1400px;
    }}

    /* Grilles et Cartes */
    .grid-4 {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
    }}

    .grid-3 {{
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }}

    .grid-2 {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      align-items: center;
    }}

    .card {{
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 22px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
      display: flex;
      flex-direction: column;
    }}

    .card.highlight {{
      border: 2px solid #1D4ED8;
      background: #F8FAFC;
    }}

    .card-title {{
      font-size: 18px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }}

    .card-body {{
      font-size: 14.5px;
      color: #4B5563;
      line-height: 1.55;
    }}

    .stat-val {{
      font-size: 40px;
      font-weight: 800;
      color: #1D4ED8;
      line-height: 1;
      margin-bottom: 6px;
    }}

    .stat-lbl {{
      font-size: 13.5px;
      font-weight: 600;
      color: #374151;
      line-height: 1.4;
    }}

    /* Cadre de capture d'écran UI */
    .screenshot-frame {{
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
    }}

    .screenshot-header {{
      background: #F1F5F9;
      border-bottom: 1px solid #E2E8F0;
      padding: 7px 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #64748B;
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
      height: 340px;
      object-fit: cover;
      object-position: top;
      display: block;
    }}

    /* Footer */
    .footer {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
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
      font-size: 50px;
      font-weight: 800;
      color: #111827;
      margin-bottom: 14px;
    }}

    .demo-subtitle {{
      font-size: 22px;
      color: #4B5563;
      max-width: 900px;
      line-height: 1.5;
      margin-bottom: 32px;
    }}

    .demo-box {{
      background: #F8FAFC;
      border: 2px solid #DBEAFE;
      border-radius: 16px;
      padding: 20px 40px;
      display: flex;
      align-items: center;
      gap: 28px;
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
  <!-- SLIDE 1 : COUVERTURE & PRESENTATION DU PROJET                             -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      <div class="brand-wrap">
        {logo_svg}
        <div class="brand-text">
          <div class="brand-name">Biz<span>IA</span></div>
          <div class="brand-sub">PME &amp; ENTREPRISES</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        APPLICATION EN PRODUCTION : BIZIA.VERCEL.APP
      </div>
    </div>

    <div class="content">
      <div class="section-pill">Présentation Officielle du Projet</div>
      <h1 class="slide-heading">Intelligence Financière & Gestion Commerciale pour PME</h1>
      <p class="slide-description">
        Une plateforme tout-en-un combinant vision multimodale (Gemini OCR), importation intelligente de tableurs Excel/CSV, 
        caisse vocale, mode hors-ligne PWA et calcul précis des marges nettes réelles en FCFA.
      </p>

      <div class="grid-4">
        <div class="card">
          <div class="stat-val">44M+</div>
          <div class="stat-lbl">PME & commerces cibles en Afrique de l'Ouest</div>
        </div>
        <div class="card">
          <div class="stat-val">2.4s</div>
          <div class="stat-lbl">Extraction instantanée d'un reçu manuscrit par photo</div>
        </div>
        <div class="card">
          <div class="stat-val">100%</div>
          <div class="stat-lbl">Opérationnel hors-ligne en boutique (PWA)</div>
        </div>
        <div class="card">
          <div class="stat-val">4</div>
          <div class="stat-lbl">Collaborateurs engagés dans l'équipe projet</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Équipe Projet BizIA &bull; Présentation Jury</div>
      <div>1 / 7</div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- SLIDE 2 : PROBLEMATIQUE & BLOCAGES DU TERRAIN                              -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      <div class="brand-wrap">
        {logo_svg}
        <div class="brand-text">
          <div class="brand-name">Biz<span>IA</span></div>
          <div class="brand-sub">DIAGNOSTIC DU TERRAIN</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        DIAGNOSTIC SECTORIEL
      </div>
    </div>

    <div class="content">
      <div class="section-pill">Pourquoi BizIA ?</div>
      <h1 class="slide-heading">Les 4 défis majeurs du commerce de proximité</h1>
      <p class="slide-description">Les solutions occidentales classiques (ERP/SaaS) échouent face aux contraintes du terrain local.</p>

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

        <div class="card highlight">
          <div class="card-title">3. Coupures d'Internet</div>
          <div class="card-body">
            Blocage immédiat des logiciels 100% Cloud lors des coupures d'électricité et d'internet mobile au comptoir.
          </div>
        </div>

        <div class="card">
          <div class="card-title">4. Marge Nette Ignorée</div>
          <div class="card-body">
            Confusion entre chiffre d'affaires et bénéfice net réel, masquant les produits à perte et les fuites de cash.
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>bizia.vercel.app &bull; Problématiques & Diagnostic</div>
      <div>2 / 7</div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- SLIDE 3 : LA SUITE COMPLETE DES SOLUTIONS BIZIA                           -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      <div class="brand-wrap">
        {logo_svg}
        <div class="brand-text">
          <div class="brand-name">Biz<span>IA</span></div>
          <div class="brand-sub">MODULES FONCTIONNELS</div>
        </div>
      </div>
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

        <div class="card highlight">
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

        <div class="card highlight">
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
      <div>3 / 7</div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- SLIDE 4 : ARCHITECTURE TECHNIQUE & SECURITE                               -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      <div class="brand-wrap">
        {logo_svg}
        <div class="brand-text">
          <div class="brand-name">Biz<span>IA</span></div>
          <div class="brand-sub">INFRASTRUCTURE & CODE</div>
        </div>
      </div>
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

        <div class="card highlight">
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
      <div>4 / 7</div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- SLIDE 5 : DEMONSTRATION VISUELLE (CAPTURES REELLES DU SITE)               -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      <div class="brand-wrap">
        {logo_svg}
        <div class="brand-text">
          <div class="brand-name">Biz<span>IA</span></div>
          <div class="brand-sub">INTERFACE EN ACTION</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        CAPTURES REELLES DU SITE
      </div>
    </div>

    <div class="content">
      <div class="section-pill">Démonstration Visuelle</div>
      <h1 class="slide-heading">Aperçu réel du Simulateur What-If et de l'Import Tableur</h1>
      <p class="slide-description">Visualisation directe des données en FCFA, calcul automatique des bénéfices et zone d'importation.</p>

      <div class="grid-2">
        <div class="screenshot-frame">
          <div class="screenshot-header">
            <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
            <span>Simulateur What-If & Marges Réelles en FCFA (bizia.vercel.app/simulateur)</span>
          </div>
          <img src="{img_sim}" class="screenshot-img" alt="Simulateur What-If">
        </div>

        <div class="screenshot-frame">
          <div class="screenshot-header">
            <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
            <span>Module d'Importation CSV & Tableurs Excel (bizia.vercel.app/import)</span>
          </div>
          <img src="{img_import}" class="screenshot-img" alt="Import CSV">
        </div>
      </div>
    </div>

    <div class="footer">
      <div>bizia.vercel.app/simulateur &bull; bizia.vercel.app/import</div>
      <div>5 / 7</div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- SLIDE 6 : MODELE ECONOMIQUE FUTUR & STRATEGIE GO-TO-MARKET                -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      <div class="brand-wrap">
        {logo_svg}
        <div class="brand-text">
          <div class="brand-name">Biz<span>IA</span></div>
          <div class="brand-sub">STRATEGIE & MONETISATION</div>
        </div>
      </div>
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

        <div class="card highlight">
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
      <div>6 / 7</div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- SLIDE 7 : DEMONSTRATION EN DIRECT (SPECIALE JURY)                         -->
  <!-- ========================================================================= -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      <div class="brand-wrap">
        {logo_svg}
        <div class="brand-text">
          <div class="brand-name">Biz<span>IA</span></div>
          <div class="brand-sub">DEMONSTRATION LIVE</div>
        </div>
      </div>
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
      <div>7 / 7</div>
    </div>
  </div>

</body>
</html>
"""

html_file = "presentation_deck.html"
with open(html_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML master deck generated successfully with SVG logo and real base64 screenshots!")

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
for i, page in enumerate(pdf):
    txt = page.get_textpage().get_text_range()
    first_line = txt.strip().split("\n")[0] if txt else ""
    print(f"Slide {i+1}: {first_line[:80]}")
