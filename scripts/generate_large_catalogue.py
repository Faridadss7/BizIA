"""Générateur de grand catalogue PME réaliste (200+ articles) pour BizIA.

Produit un fichier CSV et Excel avec 200+ produits variés, des prix réalistes en FCFA,
des marges cohérentes et des stocks variés (dont quelques alertes de rupture).
"""

from __future__ import annotations

import csv
from pathlib import Path
import pandas as pd

PRODUCTS_DATA = [
    # --- 1. Alimentation Générale & Épicerie (35 articles) ---
    ("ALIM-001", "Riz Parfumé Jasmin 25kg Royal Aroma", "Alimentation", 14500, 17500, 48, 5),
    ("ALIM-002", "Riz Blanc Long Grain 50kg Maman", "Alimentation", 21000, 24500, 32, 5),
    ("ALIM-003", "Riz Brisé Cassé 2x 25kg Papillon", "Alimentation", 11500, 13800, 60, 10),
    ("ALIM-004", "Huile Végétale Raffinée 5L Dinor", "Alimentation", 5200, 6500, 75, 8),
    ("ALIM-005", "Huile de Palme Raffinée 20L Mayor", "Alimentation", 19500, 23000, 25, 4),
    ("ALIM-006", "Huile de Tournesol 1L Lesieur", "Alimentation", 1400, 1850, 120, 15),
    ("ALIM-007", "Sucre Blanc en Morceaux 1kg St Louis", "Alimentation", 850, 1100, 150, 20),
    ("ALIM-008", "Sucre Roux en Poudre 50kg SOSUCAM", "Alimentation", 22000, 26000, 18, 3),
    ("ALIM-009", "Farine de Blé Boulangère 50kg Grands Moulins", "Alimentation", 18500, 22000, 40, 5),
    ("ALIM-010", "Farine de Maïs Blanche 5kg Locale", "Alimentation", 1600, 2200, 55, 10),
    ("ALIM-011", "Pâtes Alimentaires Spaghetti 500g Panzani", "Alimentation", 450, 650, 240, 30),
    ("ALIM-012", "Pâtes Coquillettes 500g Madina (Carton 20)", "Alimentation", 7200, 9500, 35, 5),
    ("ALIM-013", "Lait Concentré Sucré Bonnet Rouge 397g", "Alimentation", 650, 850, 180, 24),
    ("ALIM-014", "Lait en Poudre Nido 2.5kg Boîte Métal", "Alimentation", 13500, 16500, 22, 4),
    ("ALIM-015", "Lait Concentré Non Sucré Gloria 410g", "Alimentation", 550, 750, 140, 20),
    ("ALIM-016", "Tomate Concentrée Gino 70g (Carton 50)", "Alimentation", 6800, 8500, 45, 6),
    ("ALIM-017", "Double Concentré de Tomate Salsa 400g", "Alimentation", 500, 700, 95, 12),
    ("ALIM-018", "Café Soluble Nescafé Classic 200g Bocal", "Alimentation", 2400, 3200, 65, 8),
    ("ALIM-019", "Thé Vert de Chine Spécial Gunpowder 250g", "Alimentation", 900, 1300, 80, 10),
    ("ALIM-020", "Chocolat en Poudre Nesquik 400g", "Alimentation", 1800, 2400, 50, 8),
    ("ALIM-021", "Sardines à l'Huile Végétale Titus 125g", "Alimentation", 450, 600, 210, 25),
    ("ALIM-022", "Thon Entier au Naturel Saupiquet 160g", "Alimentation", 850, 1200, 90, 12),
    ("ALIM-023", "Bouillon d'Assaisonnement Maggi Étoile (Paquet 60)", "Alimentation", 1100, 1500, 110, 15),
    ("ALIM-024", "Sel de Cuisine Fin Iodé 1kg Annadi", "Alimentation", 200, 300, 300, 40),
    ("ALIM-025", "Mayonnaise Calvé Bocal 450g", "Alimentation", 1400, 1900, 70, 10),
    ("ALIM-026", "Moutarde de Dijon Amora 265g", "Alimentation", 950, 1350, 60, 8),
    ("ALIM-027", "Vinaigre Blanc d'Alcool 1L Cristal", "Alimentation", 450, 650, 85, 10),
    ("ALIM-028", "Biscuits Sablés Petit Beurre Lu 200g", "Alimentation", 400, 600, 130, 20),
    ("ALIM-029", "Pâte à Tartiner Choco Noisette 400g ChocoPain", "Alimentation", 1200, 1700, 45, 6),
    ("ALIM-030", "Corned Beef Bœuf Salé 340g Exeter", "Alimentation", 1650, 2200, 55, 8),
    ("ALIM-031", "Champignons de Paris Émincés 400g Bonduelle", "Alimentation", 1100, 1600, 40, 5),
    ("ALIM-032", "Petits Pois Carottes Boîte 400g Cassegrain", "Alimentation", 900, 1350, 48, 6),
    ("ALIM-033", "Couscous Grain Moyen 1kg Dari", "Alimentation", 950, 1400, 65, 10),
    ("ALIM-034", "Flocons d'Avoine Quaker Oats 500g", "Alimentation", 1300, 1850, 38, 5),
    ("ALIM-035", "Levure Chimique Alsa Sachet (Lot de 8)", "Alimentation", 600, 900, 85, 10),

    # --- 2. Boissons & Rafraîchissements (25 articles) ---
    ("BOIS-001", "Eau Minérale Possotomé 1.5L (Pack de 6)", "Boissons", 1800, 2400, 110, 15),
    ("BOIS-002", "Eau Minérale Fifji 50cl (Pack de 12)", "Boissons", 1600, 2200, 85, 10),
    ("BOIS-003", "Coca-Cola Original Bouteille PET 1.5L", "Boissons", 750, 1000, 140, 20),
    ("BOIS-004", "Fanta Orange Bouteille PET 1.5L", "Boissons", 750, 1000, 95, 15),
    ("BOIS-005", "Sprite Citron Bouteille PET 1.5L", "Boissons", 750, 1000, 70, 10),
    ("BOIS-006", "Jus de Mangue Naturel 1L Ceres", "Boissons", 1150, 1600, 60, 8),
    ("BOIS-007", "Jus d'Ananas Pur 1L Pressea", "Boissons", 1050, 1500, 75, 10),
    ("BOIS-008", "Jus Pomme Kiwi 1L Don Simon", "Boissons", 950, 1400, 55, 8),
    ("BOIS-009", "Boisson Énergisante Red Bull Canette 250ml", "Boissons", 950, 1400, 160, 20),
    ("BOIS-010", "Boisson Énergisante XXL Energy 33cl", "Boissons", 400, 600, 200, 25),
    ("BOIS-011", "Bière La Béninoise 65cl (Casier 12)", "Boissons", 6000, 7800, 45, 6),
    ("BOIS-012", "Bière Castel Beer 65cl (Casier 12)", "Boissons", 6200, 8000, 40, 5),
    ("BOIS-013", "Bière Heineken Canette 33cl (Pack 24)", "Boissons", 14500, 18000, 30, 4),
    ("BOIS-014", "Bière Guinness Foreign Extra Stout 33cl", "Boissons", 650, 900, 120, 15),
    ("BOIS-015", "Maltina Boisson Maltée Sans Alcool 33cl", "Boissons", 450, 650, 100, 12),
    ("BOIS-016", "Panaché Rafraîchissant Chill 50cl", "Boissons", 550, 750, 65, 8),
    ("BOIS-017", "Vin Rouge Bordeaux Supérieur Baron 75cl", "Boissons", 3800, 5500, 35, 4),
    ("BOIS-018", "Vin Rosé d'Anjou Demi-Sec 75cl", "Boissons", 3200, 4800, 28, 4),
    ("BOIS-019", "Champagne Brut Nicolas Feuillatte 75cl", "Boissons", 24000, 32000, 12, 2),
    ("BOIS-020", "Whisky Écossais Johnnie Walker Red Label 75cl", "Boissons", 9500, 13500, 20, 3),
    ("BOIS-021", "Gin Gordon's Dry London 75cl", "Boissons", 7200, 10500, 18, 3),
    ("BOIS-022", "Liqueur de Menthe Pastille 70cl", "Boissons", 4500, 6800, 15, 2),
    ("BOIS-023", "Sirop de Grenadine Teisseire 70cl", "Boissons", 1850, 2600, 40, 5),
    ("BOIS-024", "Nectar de Goyave 1L Réa", "Boissons", 950, 1400, 45, 6),
    ("BOIS-025", "Bissap Artisanal Pasteurisé 50cl", "Boissons", 350, 500, 80, 10),

    # --- 3. High-Tech, Téléphonie & Accessoires (30 articles) ---
    ("TECH-001", "Smartphone Xiaomi Redmi 13C 128Go 4Go RAM", "High-Tech", 68000, 82000, 14, 2),
    ("TECH-002", "Smartphone Samsung Galaxy A15 128Go Noir", "High-Tech", 88000, 105000, 10, 2),
    ("TECH-003", "Smartphone Tecno Spark 20 256Go 8Go RAM", "High-Tech", 94000, 112000, 8, 2),
    ("TECH-004", "Téléphone Clavier Basique Itel 2160 Double SIM", "High-Tech", 7200, 9500, 45, 6),
    ("TECH-005", "Écouteurs Sans Fil Bluetooth TWS Pro 5", "High-Tech", 4500, 7500, 60, 8),
    ("TECH-006", "Casque Bluetooth Stéréo P9 Réduction Bruit", "High-Tech", 6200, 9800, 32, 5),
    ("TECH-007", "Câble USB vers USB Type-C Charge Rapide 2m", "High-Tech", 900, 2000, 120, 15),
    ("TECH-008", "Câble Lightning pour iPhone Tressé 1.5m", "High-Tech", 1100, 2500, 90, 12),
    ("TECH-009", "Câble Micro-USB Standard 1m Renforcé", "High-Tech", 600, 1500, 110, 15),
    ("TECH-010", "Chargeur Secteur Rapide 25W Type-C Samsung", "High-Tech", 3200, 5500, 48, 6),
    ("TECH-011", "Power Bank 20000mAh Double Sortie Oraimo", "High-Tech", 11000, 15500, 24, 4),
    ("TECH-012", "Power Bank Compact 10000mAh Fast Charge", "High-Tech", 6800, 9800, 35, 5),
    ("TECH-013", "Clé USB 64Go USB 3.0 SanDisk Ultra", "High-Tech", 3600, 5500, 55, 8),
    ("TECH-014", "Clé USB 32Go Kingston DataTraveler", "High-Tech", 2400, 4000, 75, 10),
    ("TECH-015", "Carte Mémoire MicroSD 128Go avec Adaptateur", "High-Tech", 5200, 8000, 40, 5),
    ("TECH-016", "Carte Mémoire MicroSD 32Go Classe 10", "High-Tech", 2100, 3500, 65, 8),
    ("TECH-017", "Support Téléphone Voiture Magnétique Grille", "High-Tech", 1400, 2800, 50, 6),
    ("TECH-018", "Trépied Ring Light LED 26cm avec Télécommande", "High-Tech", 4800, 8000, 22, 3),
    ("TECH-019", "Enceinte Portable Bluetooth Étanche JBL GO 3", "High-Tech", 19500, 26000, 12, 2),
    ("TECH-020", "Mini Enceinte Sans Fil Rechargeable RGB", "High-Tech", 3500, 6000, 40, 5),
    ("TECH-021", "Souris Optique Sans Fil 2.4GHz Logitech M185", "High-Tech", 5200, 8000, 30, 4),
    ("TECH-022", "Souris Filaire USB Ergonomique Noire", "High-Tech", 1800, 3200, 45, 6),
    ("TECH-023", "Clavier USB AZERTY Français Standard", "High-Tech", 3200, 5500, 28, 4),
    ("TECH-024", "Tapis de Souris Repose-Poignet Gel Confort", "High-Tech", 1200, 2500, 40, 5),
    ("TECH-025", "Rallonge Multiprise 6 Prises Parafoudre 3m", "High-Tech", 4500, 7500, 35, 5),
    ("TECH-026", "Routeur WiFi 4G LTE Mobile Huawei E5577", "High-Tech", 26000, 35000, 8, 2),
    ("TECH-027", "Adaptateur HDMI vers VGA avec Audio", "High-Tech", 2200, 4000, 30, 4),
    ("TECH-028", "Hub USB 4 Ports USB 3.0 Haute Vitesse", "High-Tech", 2800, 5000, 32, 4),
    ("TECH-029", "Pochette Housse Protection PC Portable 15.6", "High-Tech", 3500, 6500, 25, 4),
    ("TECH-030", "Verre Trempé Protection Écran Smartphone Universel", "High-Tech", 500, 1500, 150, 20),

    # --- 4. Cosmétique, Beauté & Parfumerie (30 articles) ---
    ("COSM-001", "Savon Noir d'Afrique Authentique 150g Dudu Osun", "Cosmétique", 450, 750, 180, 20),
    ("COSM-002", "Beurre de Karité Pur Bio Non Raffiné 500g", "Cosmétique", 1800, 2800, 65, 8),
    ("COSM-003", "Huile Vierge de Coco Pure Pressée à Froid 250ml", "Cosmétique", 1400, 2200, 75, 10),
    ("COSM-004", "Lait Corporel Hydratant Nivea Nourishing 400ml", "Cosmétique", 2800, 4200, 55, 8),
    ("COSM-005", "Lait Corps Éclaircissant Naturel Carotte 500ml", "Cosmétique", 2400, 3800, 45, 6),
    ("COSM-006", "Gel Douche Exfoliant Gommant Cottage 250ml", "Cosmétique", 1800, 2800, 60, 8),
    ("COSM-007", "Savon de Toilette Parfumé Lux 125g Rose", "Cosmétique", 350, 500, 220, 25),
    ("COSM-008", "Savon Antibactérien Dettol Original 110g", "Cosmétique", 450, 650, 190, 25),
    ("COSM-009", "Shampoing Antipelliculaire Head & Shoulders 400ml", "Cosmétique", 3100, 4600, 40, 5),
    ("COSM-010", "Après-Shampoing Démêlant Ultra Doux Garnier 300ml", "Cosmétique", 2200, 3400, 38, 5),
    ("COSM-011", "Crème Défrisante Sans Soude Dark and Lovely", "Cosmétique", 2400, 3600, 48, 6),
    ("COSM-012", "Huile Capillaire Fortifiante Ricin Pur 100ml", "Cosmétique", 1200, 2000, 70, 8),
    ("COSM-013", "Dentifrice Triple Action Colgate 125ml", "Cosmétique", 600, 950, 160, 20),
    ("COSM-014", "Dentifrice Protection Caries Signal 100ml", "Cosmétique", 450, 700, 140, 15),
    ("COSM-015", "Brosse à Dents Médium Oral-B (Lot de 3)", "Cosmétique", 1100, 1750, 85, 10),
    ("COSM-016", "Déodorant Spray Nivea Men Dry Impact 150ml", "Cosmétique", 1600, 2500, 60, 8),
    ("COSM-017", "Déodorant Bille Rexona Women Cotton Dry 50ml", "Cosmétique", 1100, 1800, 75, 10),
    ("COSM-018", "Eau de Parfum Homme Sauvage Tribute 100ml", "Cosmétique", 6500, 11000, 20, 3),
    ("COSM-019", "Eau de Parfum Femme La Vie Brillante 100ml", "Cosmétique", 6200, 10500, 22, 3),
    ("COSM-020", "Brume Corporelle Parfumée Victoria Shimmer 250ml", "Cosmétique", 3200, 5500, 40, 5),
    ("COSM-021", "Gel Coiffant Fixation Forte Eco Styler 473ml", "Cosmétique", 2100, 3500, 50, 6),
    ("COSM-022", "Mèche à Tresser Kanekalon X-Pression N°1 Noir", "Cosmétique", 900, 1400, 130, 15),
    ("COSM-023", "Crème Visage Jour Hydratante Vitamine C 50ml", "Cosmétique", 3200, 5200, 30, 4),
    ("COSM-024", "Sérum Anti-Tâches & Éclat Niacinamide 30ml", "Cosmétique", 4200, 6800, 25, 3),
    ("COSM-025", "Lingettes Démaquillantes Micellaires (Paquet 40)", "Cosmétique", 950, 1600, 70, 8),
    ("COSM-026", "Vernis à Ongles Longue Tenue Rouge Flamboyant", "Cosmétique", 600, 1200, 90, 10),
    ("COSM-027", "Coton Démaquillant Disques Doux (Sachet 80)", "Cosmétique", 650, 1100, 100, 12),
    ("COSM-028", "Baume à Lèvres Réparateur Vaseline Rosy 20g", "Cosmétique", 500, 900, 120, 15),
    ("COSM-029", "Coupe-Ongles Professionnel Acier Inoxydable", "Cosmétique", 450, 900, 110, 12),
    ("COSM-030", "Gant de Toilette Marocain Kessa Exfoliant", "Cosmétique", 550, 1100, 85, 10),

    # --- 5. Entretien, Hygiène & Maison (25 articles) ---
    ("ENTR-001", "Lessive en Poudre Omo Actif 1kg Sachet", "Entretien", 1150, 1600, 140, 15),
    ("ENTR-002", "Lessive Poudre Ariel 2.5kg Sac Éco", "Entretien", 3600, 4800, 55, 8),
    ("ENTR-003", "Liquide Vaisselle Citron Paic Puissant 750ml", "Entretien", 950, 1450, 90, 12),
    ("ENTR-004", "Eau de Javel Désinfectante La Croix 1L", "Entretien", 550, 850, 150, 20),
    ("ENTR-005", "Nettoyant Sols & Multi-surfaces Ajax Pin 1L", "Entretien", 1200, 1800, 75, 10),
    ("ENTR-006", "Assouplissant Textile Lenor Souffle d'Été 1.5L", "Entretien", 2200, 3200, 45, 6),
    ("ENTR-007", "Désodorisant d'Intérieur Aérosol Air Wick 300ml", "Entretien", 1100, 1750, 65, 8),
    ("ENTR-008", "Insecticide Anti-Moustiques Baygon Vert 400ml", "Entretien", 1450, 2100, 80, 10),
    ("ENTR-009", "Papier Hygiénique Doux 2 Plis (Pack de 12 Rouleaux)", "Entretien", 2200, 3200, 70, 10),
    ("ENTR-010", "Essuie-Tout Cuisine Ultra Absorbant (Lot de 3)", "Entretien", 1100, 1700, 85, 12),
    ("ENTR-011", "Éponges Vaisselle Double Face Abrasive (Lot de 5)", "Entretien", 450, 800, 160, 20),
    ("ENTR-012", "Serpillière Épaisse Coton Gaufré 50x60cm", "Entretien", 700, 1200, 95, 12),
    ("ENTR-013", "Balai Balayette avec Manche Bois Verni", "Entretien", 1800, 2800, 40, 5),
    ("ENTR-014", "Seau Plastique Résistant 12L avec Bec Verseur", "Entretien", 1200, 2000, 50, 6),
    ("ENTR-015", "Sacs Poubelle Renforcés 50 Litres (Rouleau 20)", "Entretien", 1100, 1750, 80, 10),
    ("ENTR-016", "Gants de Ménage Latex Réutilisables Taille M", "Entretien", 650, 1100, 100, 12),
    ("ENTR-017", "Bloc WC Nettoyant & Désodorisant Canard 50g", "Entretien", 600, 950, 110, 15),
    ("ENTR-018", "Crème à Récurer Anti-Calcaire Cif Blanc 750ml", "Entretien", 1400, 2100, 50, 6),
    ("ENTR-019", "Allumettes de Sécurité Boîte Famille (Pack 10)", "Entretien", 400, 650, 150, 20),
    ("ENTR-020", "Poudre à Récurer Vim Multi-Usage 500g", "Entretien", 550, 850, 90, 10),
    ("ENTR-021", "Papier Aluminium Alimentaire 30m Qualité Pro", "Entretien", 1300, 2000, 60, 8),
    ("ENTR-022", "Film Étirable Plastique Alimentaire 50m", "Entretien", 950, 1500, 75, 10),
    ("ENTR-023", "Pastilles Lave-Linge Anti-Calcaire (Boîte 15)", "Entretien", 1900, 2900, 30, 4),
    ("ENTR-024", "Savon de Marseille Authentique Cube 300g", "Entretien", 700, 1100, 100, 12),
    ("ENTR-025", "Raclette Sol Caoutchouc Professionnelle 45cm", "Entretien", 1900, 3000, 35, 5),

    # --- 6. Fournitures de Bureau, Scolaire & Papeterie (25 articles) ---
    ("PAP-001", "Rame de Papier A4 80g Double A (500 Feuilles)", "Papeterie", 2800, 3900, 140, 20),
    ("PAP-002", "Stylo à Bille BIC Cristal Bleu (Boîte de 50)", "Papeterie", 3800, 5500, 45, 6),
    ("PAP-003", "Stylo à Bille BIC Cristal Noir (Boîte de 50)", "Papeterie", 3800, 5500, 40, 5),
    ("PAP-004", "Cahier 200 Pages Grand Format Séyès 24x32cm", "Papeterie", 850, 1300, 180, 25),
    ("PAP-005", "Cahier 100 Pages Petit Format 17x22cm Ligné", "Papeterie", 350, 550, 240, 30),
    ("PAP-006", "Classeur à Levier Dos 75mm Polypropylène Noir", "Papeterie", 1400, 2200, 60, 8),
    ("PAP-007", "Chemises Carton Lustré 24x32cm (Paquet de 25)", "Papeterie", 2200, 3400, 50, 8),
    ("PAP-008", "Pochettes Plastiques Perforées A4 (Paquet de 100)", "Papeterie", 1100, 1800, 85, 12),
    ("PAP-009", "Calculatrice Scientifique Casio fx-82MS", "Papeterie", 5200, 7800, 35, 4),
    ("PAP-010", "Calculatrice de Bureau 12 Chiffres Grand Écran", "Papeterie", 3200, 5000, 40, 5),
    ("PAP-011", "Agrafeuse Métal Grande Capacité 24/6 26/6", "Papeterie", 2100, 3500, 45, 6),
    ("PAP-012", "Boîte de 1000 Agrafes Galvanisées 24/6", "Papeterie", 300, 600, 130, 20),
    ("PAP-013", "Perforateur de Bureau Métallique 2 Trous 20F", "Papeterie", 1800, 3000, 35, 5),
    ("PAP-014", "Ruban Adhésif Transparent Scotch 19mm x 33m", "Papeterie", 250, 500, 200, 25),
    ("PAP-015", "Dévidoir de Bureau Lourd pour Ruban Adhésif", "Papeterie", 1600, 2800, 30, 4),
    ("PAP-016", "Marqueurs Permanents Biseautés Noirs (Boîte 12)", "Papeterie", 2400, 3800, 50, 6),
    ("PAP-017", "Surligneurs Fluo Couleurs Assorties (Pochette 4)", "Papeterie", 1200, 2000, 75, 10),
    ("PAP-018", "Crayons de Papier HB avec Embout Gomme (Boîte 12)", "Papeterie", 900, 1500, 80, 10),
    ("PAP-019", "Taille-Crayon Métallique 2 Trous Résistant", "Papeterie", 250, 500, 110, 15),
    ("PAP-020", "Gomme Blanche Plastique Sans Poussière Maped", "Papeterie", 200, 400, 140, 20),
    ("PAP-021", "Ensemble Géométrie 4 Pièces (Règle, Équerre, Rapporteur)", "Papeterie", 550, 1000, 95, 12),
    ("PAP-022", "Bloc Notes Post-it Jaune 76x76mm (Pack de 3)", "Papeterie", 850, 1450, 90, 12),
    ("PAP-023", "Sous-Chemises 80g Assorties (Paquet de 100)", "Papeterie", 1900, 3000, 40, 5),
    ("PAP-024", "Enveloppes Blanches Autocollantes DL (Boîte 100)", "Papeterie", 1500, 2500, 55, 8),
    ("PAP-025", "Colle Blanche Liquide 120g UHU Twist & Glue", "Papeterie", 650, 1100, 85, 10),

    # --- 7. Quincaillerie & Équipements de Base (30 articles) ---
    ("QUIN-001", "Ampoule LED Éco 9W E27 Blanc Chaud Philips", "Quincaillerie", 950, 1600, 160, 20),
    ("QUIN-002", "Ampoule LED Éco 15W E27 Blanc Froid Puissant", "Quincaillerie", 1400, 2300, 110, 15),
    ("QUIN-003", "Projecteur LED Extérieur Étanche 50W IP65", "Quincaillerie", 6800, 10500, 25, 4),
    ("QUIN-004", "Cadenas Monobloc Laiton 50mm avec 3 Clés", "Quincaillerie", 2200, 3600, 50, 6),
    ("QUIN-005", "Cadenas Haute Sécurité Blindé 70mm Tri-Circle", "Quincaillerie", 4200, 6800, 30, 4),
    ("QUIN-006", "Jeu de 6 Tournevis Précision Électricien Isolé", "Quincaillerie", 3200, 5200, 35, 5),
    ("QUIN-007", "Pince Universelle Isolée 200mm Acier Trempé", "Quincaillerie", 2400, 4000, 40, 5),
    ("QUIN-008", "Mètre Ruban Enrouleur 5m Boîtier Résistant", "Quincaillerie", 1100, 2000, 75, 10),
    ("QUIN-009", "Niveau à Bulle Aluminium 40cm Magnétique", "Quincaillerie", 2100, 3500, 30, 4),
    ("QUIN-010", "Marteau Menuisier Manche Fibre de Verre 300g", "Quincaillerie", 2600, 4200, 35, 5),
    ("QUIN-011", "Scie à Métaux Poignée Ergonomique avec Lame", "Quincaillerie", 2800, 4600, 28, 4),
    ("QUIN-012", "Boîte de 10 Lames de Scie à Métaux HSS", "Quincaillerie", 1800, 3000, 45, 6),
    ("QUIN-013", "Clé à Molette Chromée 10 Pouces (250mm)", "Quincaillerie", 3400, 5500, 25, 4),
    ("QUIN-014", "Pince Multiprise Entrepassée 250mm", "Quincaillerie", 2900, 4800, 30, 4),
    ("QUIN-015", "Ruban Adhésif Isolant Électricien Noir 10m", "Quincaillerie", 300, 600, 180, 20),
    ("QUIN-016", "Ruban d'Étanchéité Téflon Plomberie 12mm x 12m", "Quincaillerie", 250, 500, 150, 20),
    ("QUIN-017", "Colle Forte Glue Universelle Instantanée 3g (Lot 2)", "Quincaillerie", 400, 800, 140, 15),
    ("QUIN-018", "Mastic Silicone Transparent Sanitaire 280ml", "Quincaillerie", 1900, 3100, 45, 6),
    ("QUIN-019", "Pistolet à Cartouche Mastic Silicone Renforcé", "Quincaillerie", 1800, 3000, 30, 4),
    ("QUIN-020", "Boîte de Vis Bois Aggloméré 4x40mm (Boîte 200)", "Quincaillerie", 1400, 2400, 60, 8),
    ("QUIN-021", "Chevilles Nylon Universelles 6mm (Sachet 100)", "Quincaillerie", 900, 1600, 80, 10),
    ("QUIN-022", "Piles Alcalines AA LR6 Duracell (Pack de 4)", "Quincaillerie", 1600, 2500, 95, 12),
    ("QUIN-023", "Piles Alcalines AAA LR03 Energizer (Pack de 4)", "Quincaillerie", 1500, 2400, 90, 12),
    ("QUIN-024", "Torche Lampe LED Rechargeable USB Puissante", "Quincaillerie", 3200, 5500, 35, 5),
    ("QUIN-025", "Disjoncteur Divisionnaire Unipolaire 16A Hager", "Quincaillerie", 2400, 3900, 40, 5),
    ("QUIN-026", "Interrupteur Mural Simple Allumage Blanc Legrand", "Quincaillerie", 1100, 1900, 70, 10),
    ("QUIN-027", "Prise Murale 2P+T 16A avec Éclipse de Sécurité", "Quincaillerie", 1200, 2000, 65, 10),
    ("QUIN-028", "Câble Électrique Rigide 3x1.5mm² (Couronne 50m)", "Quincaillerie", 14500, 19000, 15, 2),
    ("QUIN-029", "Tuyau d'Arrosage Renforcé 15m avec Raccords", "Quincaillerie", 5500, 8500, 20, 3),
    ("QUIN-030", "Gants de Protection Chantier Paume Enduite PU", "Quincaillerie", 750, 1400, 110, 15),

    # --- 8. Mode, Textile & Confection (30 articles) ---
    ("MODE-001", "Pagne Tissu Wax Véritable Super Hollandais (6 Yards)", "Mode & Textile", 16500, 22000, 25, 3),
    ("MODE-002", "Pagne Wax Imprimé Africain Fancy (6 Yards)", "Mode & Textile", 5800, 8500, 45, 6),
    ("MODE-003", "Bazin Riche Riche Autriche Teint Artisanal 5m", "Mode & Textile", 28000, 38000, 14, 2),
    ("MODE-004", "Dentelle Brodée Suisse Festonnée 5 Yards", "Mode & Textile", 22000, 31000, 16, 2),
    ("MODE-005", "Chemise Homme Coton Manches Longues Slim Blanc", "Mode & Textile", 6500, 10500, 30, 4),
    ("MODE-006", "Polo Homme Piqué 100% Coton Uni Bleu Marine", "Mode & Textile", 4200, 7000, 40, 5),
    ("MODE-007", "T-Shirt Col Rond Coton Peigné Uni Noir", "Mode & Textile", 2200, 4000, 75, 10),
    ("MODE-008", "Pantalon Chino Ajusté Beige Homme", "Mode & Textile", 7500, 12000, 24, 4),
    ("MODE-009", "Jean Denim Coupe Droite Délavé Homme", "Mode & Textile", 8200, 13500, 28, 4),
    ("MODE-010", "Robe Trapèze Évasée Imprimée Wax Femme", "Mode & Textile", 9500, 15000, 20, 3),
    ("MODE-011", "Ensemble Jupe et Top Wax Moderne Femme", "Mode & Textile", 12000, 18500, 18, 3),
    ("MODE-012", "Foulard Écharpe Soie Satinée Imprimée", "Mode & Textile", 2400, 4500, 50, 6),
    ("MODE-013", "Ceinture Homme Cuir Véritable Boucle Métal", "Mode & Textile", 3200, 6000, 45, 6),
    ("MODE-014", "Portefeuille Homme Cuir Multi-Compartiments", "Mode & Textile", 3800, 7000, 35, 5),
    ("MODE-015", "Sac à Main Élégant Femme Cuir PU Noir", "Mode & Textile", 8500, 14000, 22, 3),
    ("MODE-016", "Sac à Dos Ville Polyvalent Porte-PC 15 Pouces", "Mode & Textile", 7200, 12000, 25, 4),
    ("MODE-017", "Pochette Soirée Cérémonie Dorée avec Chaînette", "Mode & Textile", 4500, 8000, 20, 3),
    ("MODE-018", "Sandales Cuir Confort Homme Style Saharienne", "Mode & Textile", 6200, 10000, 30, 4),
    ("MODE-019", "Escarpins Talons Fins 8cm Noirs Femme", "Mode & Textile", 9500, 15500, 18, 3),
    ("MODE-020", "Baskets Sneaker Basses Blanches Unisexe", "Mode & Textile", 11000, 17500, 24, 4),
    ("MODE-021", "Mocassins Cuir Souple Marron Élégant", "Mode & Textile", 13500, 21000, 15, 2),
    ("MODE-022", "Chaussettes Coton Respirantes (Lot de 3 Paires)", "Mode & Textile", 1200, 2200, 80, 10),
    ("MODE-023", "Boxer Coton Stretch Homme (Lot de 2)", "Mode & Textile", 2200, 3800, 65, 8),
    ("MODE-024", "Soutien-Gorge Confort Dentelle Fine", "Mode & Textile", 2800, 4900, 40, 5),
    ("MODE-025", "Casquette Baseball Ajustable Coton Vintage", "Mode & Textile", 2100, 3900, 50, 6),
    ("MODE-026", "Chapeau de Paille Tressée Protection Solaire", "Mode & Textile", 1800, 3500, 35, 4),
    ("MODE-027", "Montre Bracelet Cuir Quartz Homme Cadran Bleu", "Mode & Textile", 8500, 14500, 20, 3),
    ("MODE-028", "Lunettes de Soleil UV400 Monture Métal Unisexe", "Mode & Textile", 3200, 6000, 45, 6),
    ("MODE-029", "Parapluie Pliant Automatique Coupe-Vent", "Mode & Textile", 2800, 4800, 40, 5),
    ("MODE-030", "Boubou Brodé Traditionnel Homme Coton Bazin", "Mode & Textile", 19500, 28000, 12, 2),
]


def main() -> None:
    output_dir = Path(__file__).resolve().parent.parent / "test_data"
    output_dir.mkdir(parents=True, exist_ok=True)

    csv_path = output_dir / "catalogue_200_produits.csv"
    xlsx_path = output_dir / "catalogue_200_produits.xlsx"

    headers = [
        "Code SKU",
        "Désignation Produit",
        "Prix d'Achat (FCFA)",
        "Prix de Vente (FCFA)",
        "Quantité en Stock",
        "Seuil d'Alerte",
        "Catégorie",
    ]

    rows = []
    for item in PRODUCTS_DATA:
        sku, name, cat, cost, price, stock, threshold = item
        rows.append({
            "Code SKU": sku,
            "Désignation Produit": name,
            "Prix d'Achat (FCFA)": cost,
            "Prix de Vente (FCFA)": price,
            "Quantité en Stock": stock,
            "Seuil d'Alerte": threshold,
            "Catégorie": cat,
        })

    # 1. Écriture CSV (UTF-8 avec BOM pour compatibilité Excel Windows)
    with open(csv_path, mode="w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)

    # 2. Écriture XLSX
    df = pd.DataFrame(rows)
    df.to_excel(xlsx_path, index=False, engine="openpyxl")

    total_prods = len(rows)
    total_val_stock = sum(r["Prix de Vente (FCFA)"] * r["Quantité en Stock"] for r in rows)
    print(f"OK : {total_prods} produits générés avec succès !")
    print(f"Fichier CSV généré : {csv_path} ({csv_path.stat().st_size} octets)")
    print(f"Fichier Excel généré : {xlsx_path} ({xlsx_path.stat().st_size} octets)")
    print(f"Valeur marchande totale du catalogue : {total_val_stock:,.0f} FCFA")


if __name__ == "__main__":
    main()
