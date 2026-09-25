import subprocess
import os

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

os.makedirs("presentation_assets", exist_ok=True)

# 1. SCREENSHOT ACCUEIL & SIMULATEUR
html_home = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F8FAFC; margin: 0; padding: 24px; color: #111827; }
.card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.title { font-size: 20px; font-weight: 700; color: #111827; }
.badge { background: #EFF6FF; color: #1D4ED8; font-weight: 700; font-size: 13px; padding: 6px 12px; border-radius: 6px; }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
th { background: #F1F5F9; color: #475569; text-align: left; padding: 12px; border-bottom: 1px solid #CBD5E1; font-weight: 600; }
td { padding: 12px; border-bottom: 1px solid #E2E8F0; color: #1E293B; }
.pill-green { background: #ECFDF5; color: #065F46; padding: 4px 8px; border-radius: 9999px; font-weight: 700; font-size: 12px; }
.kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 20px; }
.kpi-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; }
.kpi-val { font-size: 22px; font-weight: 800; color: #1D4ED8; }
.kpi-lbl { font-size: 12px; color: #64748B; font-weight: 600; }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <div class="title">Simulateur What-If & Marges Réelles (FCFA)</div>
    <div class="badge">Données en direct</div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Produit</th>
        <th>Coût Achat</th>
        <th>Prix Vente</th>
        <th>Marge Réelle</th>
        <th>Ventes Sim.</th>
        <th>Bénéfice Net</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Smartphone 4G Pro</b></td>
        <td>45 000 F</td>
        <td><b>65 000 F</b></td>
        <td><span class="pill-green">+30.8% (20 000 F)</span></td>
        <td>18 unités</td>
        <td><b>360 000 FCFA</b></td>
      </tr>
      <tr>
        <td><b>Montre Connectée AMOLED V2</b></td>
        <td>12 000 F</td>
        <td><b>20 000 F</b></td>
        <td><span class="pill-green">+40.0% (8 000 F)</span></td>
        <td>34 unités</td>
        <td><b>272 000 FCFA</b></td>
      </tr>
      <tr>
        <td><b>Calculatrice Scientifique</b></td>
        <td>3 500 F</td>
        <td><b>6 000 F</b></td>
        <td><span class="pill-green">+41.7% (2 500 F)</span></td>
        <td>45 unités</td>
        <td><b>112 500 FCFA</b></td>
      </tr>
      <tr>
        <td><b>Écouteurs Sans-Fil TWS</b></td>
        <td>5 000 F</td>
        <td><b>9 500 F</b></td>
        <td><span class="pill-green">+47.4% (4 500 F)</span></td>
        <td>26 unités</td>
        <td><b>117 000 FCFA</b></td>
      </tr>
    </tbody>
  </table>
  <div class="kpi-row">
    <div class="kpi-box">
      <div class="kpi-val">2 372 000 FCFA</div>
      <div class="kpi-lbl">Chiffre d'Affaires Simulé</div>
    </div>
    <div class="kpi-box">
      <div class="kpi-val">+861 500 FCFA</div>
      <div class="kpi-lbl">Bénéfice Net d'Exploitation</div>
    </div>
    <div class="kpi-box">
      <div class="kpi-val">36.3%</div>
      <div class="kpi-lbl">Taux de Marge Moyenne</div>
    </div>
  </div>
</div>
</body>
</html>
"""

# 2. SCREENSHOT SCANNER OCR GEMINI VISION
html_scanner = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F8FAFC; margin: 0; padding: 24px; color: #111827; }
.card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.title { font-size: 20px; font-weight: 700; color: #111827; }
.badge { background: #ECFDF5; color: #065F46; font-weight: 700; font-size: 13px; padding: 6px 12px; border-radius: 6px; }
.scan-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 20px; align-items: start; }
.photo-box { border: 2px dashed #93C5FD; background: #EFF6FF; border-radius: 8px; padding: 20px; text-align: center; }
.photo-tag { font-size: 13px; font-weight: 700; color: #1D4ED8; margin-top: 8px; }
.ocr-result { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px; }
.ocr-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E2E8F0; font-size: 13.5px; }
.ocr-total { display: flex; justify-content: space-between; padding-top: 12px; font-weight: 800; font-size: 15px; color: #1D4ED8; }
.btn-val { background: #1D4ED8; color: #FFF; font-weight: 700; font-size: 13px; border: none; padding: 10px 16px; border-radius: 6px; margin-top: 12px; width: 100%; }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <div class="title">Scanner de Reçus & Factures (Gemini Vision OCR)</div>
    <div class="badge">Extraction Réussie (2.4s)</div>
  </div>
  <div class="scan-grid">
    <div class="photo-box">
      <div style="font-size: 32px; color: #2563EB;">[PHOTO FACTURE FOURNISSEUR]</div>
      <div class="photo-tag">Bon de Livraison N° 2026-098</div>
      <div style="font-size: 12px; color: #64748B; margin-top: 4px;">Fournisseur : Grossiste Cotonou</div>
    </div>
    <div class="ocr-result">
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #1E293B;">Articles Détectés & Mis en Stock :</div>
      <div class="ocr-item"><span>10x Sac de Ciment 50kg</span><b>48 000 FCFA</b></div>
      <div class="ocr-item"><span>25x Fer à Béton 10mm</span><b>75 000 FCFA</b></div>
      <div class="ocr-item"><span>5x Rouleau Grillage Galva</span><b>32 500 FCFA</b></div>
      <div class="ocr-total"><span>Total Facture :</span><span>155 500 FCFA</span></div>
      <button class="btn-val">Valider et Mettre à Jour le Stock</button>
    </div>
  </div>
</div>
</body>
</html>
"""

# 3. SCREENSHOT IMPORT CSV/EXCEL
html_import = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F8FAFC; margin: 0; padding: 24px; color: #111827; }
.card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.title { font-size: 20px; font-weight: 700; color: #111827; }
.badge { background: #EFF6FF; color: #1D4ED8; font-weight: 700; font-size: 13px; padding: 6px 12px; border-radius: 6px; }
.drop-zone { border: 2px dashed #CBD5E1; background: #F8FAFC; border-radius: 8px; padding: 18px; text-align: center; margin-bottom: 16px; }
table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
th { background: #F1F5F9; color: #475569; text-align: left; padding: 10px 12px; border-bottom: 1px solid #CBD5E1; font-weight: 600; }
td { padding: 10px 12px; border-bottom: 1px solid #E2E8F0; color: #1E293B; }
.pill-match { background: #ECFDF5; color: #065F46; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11.5px; }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <div class="title">Importation Intelligente CSV & Tableurs Excel</div>
    <div class="badge">Fichier : inventaire_septembre.xlsx</div>
  </div>
  <div class="drop-zone">
    <div style="font-weight: 700; color: #1E293B;">Fichier analysé : 148 articles reconnus</div>
    <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Mapping automatique : SKU, Désignation, Prix d'achat, Prix de vente, Quantité</div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Code SKU</th>
        <th>Désignation Produit</th>
        <th>Prix Vente</th>
        <th>Coût Achat</th>
        <th>Quantité</th>
        <th>Statut Mapping</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>SKU-8901</b></td>
        <td>Riz Parfumé 25kg Royal</td>
        <td>17 500 F</td>
        <td>14 200 F</td>
        <td>40 sacs</td>
        <td><span class="pill-match">Catalogue OK</span></td>
      </tr>
      <tr>
        <td><b>SKU-8902</b></td>
        <td>Huile Végétale 5L Dinor</td>
        <td>6 500 F</td>
        <td>5 100 F</td>
        <td>65 bidons</td>
        <td><span class="pill-match">Catalogue OK</span></td>
      </tr>
      <tr>
        <td><b>SKU-8903</b></td>
        <td>Sucre en Poudre 50kg</td>
        <td>24 000 F</td>
        <td>20 500 F</td>
        <td>20 sacs</td>
        <td><span class="pill-match">Catalogue OK</span></td>
      </tr>
    </tbody>
  </table>
</div>
</body>
</html>
"""

# 4. SCREENSHOT ASSISTANT VOCAL & CHAT IA
html_chat = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
body { font-family: 'Plus Jakarta Sans', sans-serif; background: #F8FAFC; margin: 0; padding: 24px; color: #111827; }
.card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.title { font-size: 20px; font-weight: 700; color: #111827; }
.badge { background: #EFF6FF; color: #1D4ED8; font-weight: 700; font-size: 13px; padding: 6px 12px; border-radius: 6px; }
.msg { margin-bottom: 12px; display: flex; flex-direction: column; }
.msg-user { align-self: flex-end; background: #1D4ED8; color: #FFF; padding: 10px 16px; border-radius: 12px 12px 0 12px; font-size: 13.5px; max-width: 80%; }
.msg-ai { align-self: flex-start; background: #F1F5F9; color: #1E293B; padding: 12px 16px; border-radius: 12px 12px 12px 0; font-size: 13.5px; max-width: 85%; border: 1px solid #E2E8F0; }
.voice-bar { display: flex; align-items: center; gap: 10px; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 10px 14px; margin-top: 12px; }
.voice-dot { width: 10px; height: 10px; background: #EF4444; border-radius: 50%; }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <div class="title">Assistant Financier & Caisse Vocale</div>
    <div class="badge">Micro Activé (Français / Dialectes)</div>
  </div>
  <div class="msg">
    <div class="msg-user">"Vendu 3 cartons de lait Bonnet Rouge et 2 sacs de riz 25kg à M. Dossou."</div>
  </div>
  <div class="msg">
    <div class="msg-ai">
      <b>Vente enregistrée en caisse :</b><br>
      &bull; 3x Carton Lait Bonnet Rouge (36 000 FCFA) &bull; Marge : +8 400 FCFA<br>
      &bull; 2x Sac Riz 25kg (35 000 FCFA) &bull; Marge : +6 600 FCFA<br>
      <b>Total Encaissé : 71 000 FCFA</b> | <b>Bénéfice Net : +15 000 FCFA</b><br>
      <span style="color: #059669; font-weight: 600; font-size: 12px;">Stock mis à jour automatiquement & Reçu prêt à imprimer</span>
    </div>
  </div>
  <div class="voice-bar">
    <div class="voice-dot"></div>
    <span style="font-size: 13px; font-weight: 600; color: #1E40AF;">Dictée vocale active &bull; Prêt pour la prochaine transaction au comptoir</span>
  </div>
</div>
</body>
</html>
"""

files = [
    ("mock_home.html", html_home, "screen_simulator.png"),
    ("mock_scanner.html", html_scanner, "screen_scanner.png"),
    ("mock_import.html", html_import, "screen_import.png"),
    ("mock_chat.html", html_chat, "screen_chat.png"),
]

for html_name, content, out_png in files:
    with open(html_name, "w", encoding="utf-8") as f:
        f.write(content)
    
    out_path = os.path.abspath(os.path.join("presentation_assets", out_png))
    html_abs = os.path.abspath(html_name)
    
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=960,540",
        f"--screenshot={out_path}",
        html_abs
    ]
    subprocess.run(cmd, check=True)
    print(f"Generated clean screenshot: {out_png} ({os.path.getsize(out_path)} bytes)")

print("All 4 clean UI screenshots generated successfully!")
