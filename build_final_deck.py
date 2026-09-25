import os
import base64
import subprocess

def get_base64_img(path):
    if os.path.exists(path):
        with open(path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode("utf-8")
            return f"data:image/png;base64,{encoded}"
    return ""

img_home = get_base64_img("presentation_assets/screen_home.png")
img_sim = get_base64_img("presentation_assets/screen_simulator.png")
img_scan = get_base64_img("presentation_assets/screen_scanner.png")
img_prod = get_base64_img("presentation_assets/screen_products.png")
img_dash = get_base64_img("presentation_assets/screen_dashboard.png")

html_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>BizIA - Présentation Projet</title>
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
      padding: 50px 80px 40px 80px;
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
      padding-bottom: 20px;
      border-bottom: 1px solid #E2E8F0;
    }}

    .brand {{
      display: flex;
      align-items: center;
      gap: 16px;
    }}

    .logo-badge {{
      background: #1D4ED8;
      color: #FFFFFF;
      font-weight: 800;
      font-size: 22px;
      padding: 8px 18px;
      border-radius: 8px;
      letter-spacing: -0.5px;
    }}

    .brand-text {{
      display: flex;
      flex-direction: column;
    }}

    .brand-title {{
      font-size: 18px;
      font-weight: 700;
      color: #111827;
    }}

    .brand-sub {{
      font-size: 13px;
      color: #64748B;
      font-weight: 500;
    }}

    .live-tag {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #ECFDF5;
      border: 1px solid #A7F3D0;
      color: #065F46;
      font-size: 14px;
      font-weight: 700;
      padding: 8px 16px;
      border-radius: 9999px;
    }}

    .live-dot {{
      width: 10px;
      height: 10px;
      background: #10B981;
      border-radius: 50%;
    }}

    /* Contenu Principal */
    .content {{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 20px 0;
    }}

    .section-pill {{
      display: inline-block;
      align-self: flex-start;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #1D4ED8;
      background: #EFF6FF;
      border: 1px solid #DBEAFE;
      padding: 6px 14px;
      border-radius: 6px;
      margin-bottom: 12px;
    }}

    .slide-heading {{
      font-size: 38px;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin-bottom: 8px;
    }}

    .slide-description {{
      font-size: 18px;
      color: #4B5563;
      line-height: 1.5;
      margin-bottom: 24px;
      max-width: 1400px;
    }}

    /* Grilles et Cartes */
    .grid-4 {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }}

    .grid-3 {{
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }}

    .grid-2 {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
      align-items: center;
    }}

    .card {{
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
      display: flex;
      flex-direction: column;
    }}

    .card.highlight {{
      border: 2px solid #1D4ED8;
      background: #F8FAFC;
    }}

    .card-title {{
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }}

    .card-body {{
      font-size: 15px;
      color: #4B5563;
      line-height: 1.6;
    }}

    .stat-val {{
      font-size: 44px;
      font-weight: 800;
      color: #1D4ED8;
      line-height: 1;
      margin-bottom: 8px;
    }}

    .stat-lbl {{
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      line-height: 1.4;
    }}

    /* Cadre de capture d'écran UI */
    .screenshot-frame {{
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
    }}

    .screenshot-header {{
      background: #F1F5F9;
      border-bottom: 1px solid #E2E8F0;
      padding: 8px 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      color: #64748B;
    }}

    .dot {{
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }}
    .dot-r {{ background: #EF4444; }}
    .dot-y {{ background: #F59E0B; }}
    .dot-g {{ background: #10B981; }}

    .screenshot-img {{
      width: 100%;
      height: 380px;
      object-fit: cover;
      object-position: top;
      display: block;
    }}

    /* Footer */
    .footer {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
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
      padding: 40px;
    }}

    .demo-badge {{
      background: #1D4ED8;
      color: #FFFFFF;
      font-size: 20px;
      font-weight: 800;
      padding: 12px 32px;
      border-radius: 9999px;
      letter-spacing: 0.1em;
      margin-bottom: 24px;
      box-shadow: 0 10px 20px rgba(29, 78, 216, 0.25);
    }}

    .demo-title {{
      font-size: 56px;
      font-weight: 800;
      color: #111827;
      margin-bottom: 16px;
    }}

    .demo-subtitle {{
      font-size: 24px;
      color: #4B5563;
      max-width: 900px;
      line-height: 1.5;
      margin-bottom: 36px;
    }}

    .demo-box {{
      background: #F8FAFC;
      border: 2px solid #DBEAFE;
      border-radius: 16px;
      padding: 24px 48px;
      display: flex;
      align-items: center;
      gap: 32px;
    }}

    .demo-step {{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }}

    .demo-step-num {{
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #1D4ED8;
      color: #FFF;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }}

    .demo-step-text {{
      font-size: 15px;
      font-weight: 600;
      color: #1E293B;
    }}
  </style>
</head>
<body>

  <!-- SLIDE 1 : COUVERTURE & PRESENTATION DU PROJET -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      <div class="brand">
        <div class="logo-badge">BizIA</div>
        <div class="brand-text">
          <div class="brand-title">BizIA - Intelligence Financière & Gestion Commerciale</div>
          <div class="brand-sub">Présentation du Projet & Démonstration Technique</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        PLATEFORME EN LIGNE : BIZIA.VERCEL.APP
      </div>
    </div>

    <div class="content">
      <div class="section-pill">Présentation Officielle</div>
      <h1 class="slide-heading">Automatisation, Vision Multimodale et Pilotage des PME</h1>
      <p class="slide-description">
        Une plateforme moderne pour éliminer la saisie manuelle, fiabiliser la gestion de stock 
        et calculer la marge nette réelle en FCFA pour les commerces et PME.
      </p>

      <div class="grid-4">
        <div class="card">
          <div class="stat-val">44M+</div>
          <div class="stat-lbl">PME cibles en Afrique subsaharienne</div>
        </div>
        <div class="card">
          <div class="stat-val">2.4s</div>
          <div class="stat-lbl">Scan OCR d'un reçu ou bon de livraison manuscrit</div>
        </div>
        <div class="card">
          <div class="stat-val">100%</div>
          <div class="stat-lbl">Fonctionnement hors-ligne garanti (PWA)</div>
        </div>
        <div class="card">
          <div class="stat-val">4</div>
          <div class="stat-lbl">Collaborateurs engagés sur le projet</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Équipe Projet BizIA &bull; Présentation Jury</div>
      <div>1 / 6</div>
    </div>
  </div>

  <!-- SLIDE 2 : PROBLEMATIQUE DU TERRAIN -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      <div class="brand">
        <div class="logo-badge">BizIA</div>
        <div class="brand-text">
          <div class="brand-title">Diagnostic & Problématique Terrain</div>
          <div class="brand-sub">Comprendre les défis réels du commerce de proximité</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        DIAGNOSTIC TERRAIN
      </div>
    </div>

    <div class="content">
      <div class="section-pill">Pourquoi BizIA ?</div>
      <h1 class="slide-heading">Les 3 freins majeurs des PME et nos solutions</h1>
      <p class="slide-description">Les solutions ERP classiques sont inadaptées aux contraintes quotidiennes du terrain.</p>

      <div class="grid-3">
        <div class="card">
          <div class="card-title">1. Factures & Bons Papiers</div>
          <div class="card-body">
            <b>Le constat :</b> Reçus thermiques effacés, carnets manuscrits égarés, erreurs quotidiennes de saisie.<br><br>
            <b>La réponse BizIA :</b> Une simple photo avec le téléphone. Gemini OCR extrait automatiquement articles, prix d'achat et quantités.
          </div>
        </div>

        <div class="card highlight">
          <div class="card-title">2. Coupures d'Internet</div>
          <div class="card-body">
            <b>Le constat :</b> Les logiciels 100% Cloud se bloquent dès qu'une coupure 4G/WiFi survient au comptoir.<br><br>
            <b>La réponse BizIA :</b> Architecture PWA Offline-First. Enregistrement des ventes hors-ligne et synchronisation transparente au retour du réseau.
          </div>
        </div>

        <div class="card">
          <div class="card-title">3. Calcul Réel des Marges</div>
          <div class="card-body">
            <b>Le constat :</b> Confusion systématique entre chiffre d'affaires encaissé et bénéfice net d'exploitation.<br><br>
            <b>La réponse BizIA :</b> Déduction automatique du coût des marchandises pour afficher la marge nette exacte en FCFA.
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>bizia.vercel.app &bull; Résilience Opérationnelle</div>
      <div>2 / 6</div>
    </div>
  </div>

  <!-- SLIDE 3 : ARCHITECTURE TECHNIQUE & PIPELINE IA -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      <div class="brand">
        <div class="logo-badge">BizIA</div>
        <div class="brand-text">
          <div class="brand-title">Architecture Technique & Sécurité</div>
          <div class="brand-sub">Une infrastructure moderne, rapide et conforme aux standards professionnels</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        INFRASTRUCTURE PROD
      </div>
    </div>

    <div class="content">
      <div class="section-pill">Stack Technique</div>
      <h1 class="slide-heading">Une architecture modulaire, performante et sécurisée</h1>
      <p class="slide-description">Séparation étanche du frontend réactif, de l'API backend et des modèles d'intelligence artificielle.</p>

      <div class="grid-3">
        <div class="card">
          <div class="card-title">Frontend & PWA</div>
          <div class="card-body">
            &bull; <b>Next.js 14 App Router & TypeScript :</b> Rendu ultra-rapide et typage strict.<br>
            &bull; <b>Tailwind CSS :</b> Design system clair, épuré et contrasté.<br>
            &bull; <b>Service Worker & IndexedDB :</b> Stockage local des ventes hors-ligne.<br>
            &bull; <b>PWA Mobile :</b> Installable sur smartphone sans téléchargement lourd.
          </div>
        </div>

        <div class="card highlight">
          <div class="card-title">Backend & Base de Données</div>
          <div class="card-body">
            &bull; <b>FastAPI (Python 3.12) :</b> Serveur asynchrone haute performance hébergé sous Cloud.<br>
            &bull; <b>Supabase PostgreSQL :</b> Cloisonnement strict multi-entreprises via Row Level Security (RLS).<br>
            &bull; <b>Sécurité :</b> Authentification JWT chiffrée de bout en bout.<br>
            &bull; <b>Qualité :</b> 79 tests automatisés validés.
          </div>
        </div>

        <div class="card">
          <div class="card-title">Intelligence Multimodale</div>
          <div class="card-body">
            &bull; <b>Google Gemini 3.5 Flash Lite :</b> Extraction OCR ultra-rapide des reçus manuscrits.<br>
            &bull; <b>Google Gemini 3.8 Flash :</b> Basculement automatique en cas de charge.<br>
            &bull; <b>Voice AI :</b> Reconnaissance vocale des transactions de caisse.<br>
            &bull; <b>Export PDF :</b> Bilans certifiés pour banques et microfinances.
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>bizia.vercel.app &bull; Standards Industriels</div>
      <div>3 / 6</div>
    </div>
  </div>

  <!-- SLIDE 4 : SCANNER OCR & SIMULATEUR WHAT-IF (CAPTURES REELLES) -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      <div class="brand">
        <div class="logo-badge">BizIA</div>
        <div class="brand-text">
          <div class="brand-title">Interface en Action : Scanner OCR & Simulateur</div>
          <div class="brand-sub">Captures réelles de l'application déployée en ligne</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        CAPTURES DE L'APPLICATION
      </div>
    </div>

    <div class="content">
      <div class="section-pill">Modules Clés</div>
      <h1 class="slide-heading">Scan de Factures Manuscrits & Simulateur de Marge</h1>
      <p class="slide-description">De la saisie instantanée d'un bon fournisseur à la simulation prédictive des bénéfices.</p>

      <div class="grid-2">
        <div class="screenshot-frame">
          <div class="screenshot-header">
            <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
            <span>Module Scanner OCR (Gemini Vision)</span>
          </div>
          <img src="{img_scan}" class="screenshot-img" alt="Scanner OCR">
        </div>

        <div class="screenshot-frame">
          <div class="screenshot-header">
            <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
            <span>Module Simulateur What-If (Calcul de Marges)</span>
          </div>
          <img src="{img_sim}" class="screenshot-img" alt="Simulateur What-If">
        </div>
      </div>
    </div>

    <div class="footer">
      <div>bizia.vercel.app/scanner &bull; bizia.vercel.app/simulateur</div>
      <div>4 / 6</div>
    </div>
  </div>

  <!-- SLIDE 5 : DASHBOARD & CATALOGUE PRODUITS (CAPTURES REELLES) -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      <div class="brand">
        <div class="logo-badge">BizIA</div>
        <div class="brand-text">
          <div class="brand-title">Interface en Action : Pilotage Commercial & Stocks</div>
          <div class="brand-sub">Suivi en direct du chiffre d'affaires et valorisation des stocks</div>
        </div>
      </div>
      <div class="live-tag">
        <div class="live-dot"></div>
        PILOTAGE EN TEMPS REEL
      </div>
    </div>

    <div class="content">
      <div class="section-pill">Gestion & KPIs</div>
      <h1 class="slide-heading">Tableau de Bord & Gestion des Produits</h1>
      <p class="slide-description">Visibilité complète sur le stock restant, le panier moyen et les alertes de réapprovisionnement.</p>

      <div class="grid-2">
        <div class="screenshot-frame">
          <div class="screenshot-header">
            <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
            <span>Module Tableau de Bord (Dashboard)</span>
          </div>
          <img src="{img_dash}" class="screenshot-img" alt="Dashboard">
        </div>

        <div class="screenshot-frame">
          <div class="screenshot-header">
            <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
            <span>Module Catalogue & Gestion des Stocks</span>
          </div>
          <img src="{img_prod}" class="screenshot-img" alt="Catalogue Produits">
        </div>
      </div>
    </div>

    <div class="footer">
      <div>bizia.vercel.app/dashboard &bull; bizia.vercel.app/produits</div>
      <div>5 / 6</div>
    </div>
  </div>

  <!-- SLIDE 6 : DEMONSTRATION EN DIRECT (PAGE SPECIALE JURY) -->
  <div class="slide">
    <div class="top-bar"></div>
    <div class="header">
      <div class="brand">
        <div class="logo-badge">BizIA</div>
        <div class="brand-text">
          <div class="brand-title">BizIA - Démonstration en Direct</div>
          <div class="brand-sub">Présentation interactive devant le Jury</div>
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
          <div class="demo-step-text">Scan d'un Reçu Papier (OCR)</div>
        </div>
        <div style="color: #CBD5E1; font-size: 24px;">&rarr;</div>
        <div class="demo-step">
          <div class="demo-step-num">2</div>
          <div class="demo-step-text">Vente Vocale au Comptoir</div>
        </div>
        <div style="color: #CBD5E1; font-size: 24px;">&rarr;</div>
        <div class="demo-step">
          <div class="demo-step-num">3</div>
          <div class="demo-step-text">Simulation de Marges en FCFA</div>
        </div>
        <div style="color: #CBD5E1; font-size: 24px;">&rarr;</div>
        <div class="demo-step">
          <div class="demo-step-num">4</div>
          <div class="demo-step-text">Dashboard & Export de Bilan</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Plateforme en ligne : <b>https://bizia.vercel.app</b></div>
      <div>6 / 6</div>
    </div>
  </div>

</body>
</html>
"""

with open("presentation_deck.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML deck generated successfully with embedded base64 screenshots!")

# Render to PDF using Edge headless
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

html_abs = os.path.abspath("presentation_deck.html")
pdf_out = os.path.abspath("BizIA_Presentation.pdf")

cmd = [
    edge_path,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_out}",
    html_abs
]

print(f"Rendering PDF with Edge: {pdf_out}...")
subprocess.run(cmd, check=True)

# Copy to public folder
os.makedirs("frontend/public", exist_ok=True)
import shutil
shutil.copyfile("BizIA_Presentation.pdf", "frontend/public/BizIA_Presentation.pdf")
print("BizIA_Presentation.pdf built and copied to frontend/public/ successfully!")
