import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs("test_data", exist_ok=True)

# Create a clean realistic white invoice image (800x1000)
img = Image.new("RGB", (800, 1050), "#FFFFFF")
draw = ImageDraw.Draw(img)

# Border
draw.rectangle([(20, 20), (780, 1030)], outline="#E2E8F0", width=2)

# Header Banner
draw.rectangle([(20, 20), (780, 130)], fill="#1D4ED8")
draw.text((40, 45), "ETS SODICOM GROSSISTE & MATERIAUX", fill="#FFFFFF")
draw.text((40, 75), "Vente en Gros & Demi-gros - Cotonou, Benin", fill="#DBEAFE")
draw.text((40, 95), "Tel : +229 97 00 11 22 / +229 95 33 44 55", fill="#DBEAFE")

# Invoice Meta
draw.text((550, 45), "BON DE LIVRAISON", fill="#FFFFFF")
draw.text((550, 75), "N° BL-2026-098", fill="#DBEAFE")
draw.text((550, 95), "Date : 25/09/2026", fill="#DBEAFE")

# Client Section
draw.rectangle([(40, 150), (760, 220)], fill="#F8FAFC", outline="#CBD5E1", width=1)
draw.text((55, 160), "CLIENT : ETS MON COMMERCE GENERAL (Farid)", fill="#111827")
draw.text((55, 185), "Adresse : Marche Dantokpa, Hall B3, Cotonou", fill="#4B5563")

# Table Header
draw.rectangle([(40, 250), (760, 290)], fill="#1E293B")
draw.text((55, 260), "DESIGNATION ARTICLE", fill="#FFFFFF")
draw.text((420, 260), "QTE", fill="#FFFFFF")
draw.text((500, 260), "P.U (FCFA)", fill="#FFFFFF")
draw.text((640, 260), "TOTAL (FCFA)", fill="#FFFFFF")

# Table Rows
items = [
    ("Sac de Ciment CPJ 35 (50kg)", "20", "4 100", "82 000"),
    ("Fer a Beton 10mm (Barre 12m)", "50", "2 800", "140 000"),
    ("Riz Parfume 25kg Royal", "15", "14 000", "210 000"),
    ("Huile Vegetale Dinor 5L", "24", "5 200", "124 800"),
    ("Lait Concentre Bonnet Rouge (Carton)", "10", "31 000", "310 000"),
    ("Sucre en Poudre 50kg", "8", "20 500", "164 000"),
]

y = 305
for name, qte, pu, total in items:
    draw.text((55, y), name, fill="#111827")
    draw.text((425, y), qte, fill="#111827")
    draw.text((505, y), pu, fill="#111827")
    draw.text((645, y), total, fill="#111827")
    draw.line([(40, y + 30), (760, y + 30)], fill="#E2E8F0", width=1)
    y += 45

# Total Section
draw.rectangle([(480, y + 20), (760, y + 100)], fill="#F1F5F9", outline="#CBD5E1", width=1)
draw.text((500, y + 35), "MONTANT BRUT :", fill="#475569")
draw.text((640, y + 35), "1 030 800 F", fill="#475569")
draw.text((500, y + 65), "TOTAL NET A PAYER :", fill="#1D4ED8")
draw.text((630, y + 65), "1 030 800 FCFA", fill="#1D4ED8")

# Stamp / Cachet
draw.rectangle([(80, y + 30), (280, y + 120)], outline="#2563EB", width=2)
draw.text((100, y + 45), "ETS SODICOM", fill="#2563EB")
draw.text((100, y + 70), "ACQUITTE / LIVRE", fill="#2563EB")
draw.text((100, y + 90), "Le 25/09/2026", fill="#2563EB")

# Save PNG and JPG
img.save("test_data/facture_test_fournisseur.png")
img.save("test_data/facture_test_fournisseur.jpg")
print("Invoice test image generated in test_data/facture_test_fournisseur.jpg & .png")
