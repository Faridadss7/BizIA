# PROTOCOLE DE TEST COMPLET & SCENARIO DE DEMONSTRATION BIZIA
**Groupe : Fata Nexus**  
*Membres : ADISSO Y. B. Farid | AHOLOU H. I. Christelle | ESSEGNON K. O. Bienvenu | HOUEGBE Uriel*

---

## 1. DONNEES & FICHIERS DE TEST DISPONIBLES DANS LE DOSSIER DU PROJET

Tous les fichiers prêts à l'emploi sont situés dans le dossier `test_data/` :
* **Fichier CSV de test pour l'Import :** `test_data/catalogue_import_test.csv` (8 produits réalistes, prix d'achat, prix de vente et quantités en stock en FCFA).
* **Photo de Facture Fournisseur pour l'OCR :** `test_data/facture_test_fournisseur.jpg` (Bon de livraison fournisseur SODICOM avec 6 articles chiffrés en FCFA).

---

## 2. SCENARIO DE TEST & DEMONSTRATION LIVE (PAS A PAS)

### ETAPE 1 : Accueil & Démonstration du Simulateur What-If (Sans Connexion)
* **URL :** `https://bizia.vercel.app/`
* **Action :** Faire défiler jusqu'à la section **Simulateur What-If**.
* **Test :**
  1. Cliquer sur l'onglet **"Simulateur What-If"**.
  2. Ajuster le curseur de prix de vente (+10%, +15%, etc.).
  3. **Résultat attendu :** Les colonnes "Marge Réelle", "Chiffre d'Affaires Simulé" et "Bénéfice Net" se recalculent instantanément en FCFA sans rechargement de page.

---

### ETAPE 2 : Connexion ou Création de Compte
* **URL :** `https://bizia.vercel.app/connexion`
* **Action :** Se connecter avec votre compte commerçant ou créer un nouvel espace en 15 secondes via `/inscription`.
* **Résultat attendu :** Redirection immédiate vers le Tableau de Bord ou le Journal des Ventes avec affichage de votre nom d'entreprise en haut à droite.

---

### ETAPE 3 : Scan OCR d'une Facture Fournisseur (Gemini Vision)
* **URL :** `https://bizia.vercel.app/scanner`
* **Action :** 
  1. Glisser-déposer le fichier image : `test_data/facture_test_fournisseur.jpg` (ou prendre une photo directe depuis votre smartphone).
  2. Cliquer sur **Analyser la facture**.
* **Résultat attendu en ~2.4s :**
  * Extraction automatique des articles (Ciment, Fer à béton, Riz, Huile, Lait, Sucre).
  * Affichage du tableau de prévisualisation avec les quantités et prix d'achat détectés.
  * Bouton de confirmation en 1 clic pour intégrer les stocks dans votre catalogue.

---

### ETAPE 4 : Importation d'un Tableur Excel / CSV
* **URL :** `https://bizia.vercel.app/import`
* **Action :**
  1. Glisser le fichier : `test_data/catalogue_import_test.csv`.
  2. Vérifier la détection automatique des colonnes (*Code SKU, Désignation, Prix d'achat, Prix de vente, Quantité*).
  3. Cliquer sur **Confirmer l'importation**.
* **Résultat attendu :** Les 8 produits sont intégrés dans le catalogue avec valorisation de l'inventaire en direct.

---

### ETAPE 5 : Caisse & Dictée Vocale d'une Vente
* **URL :** `https://bizia.vercel.app/chat`
* **Action :**
  1. Cliquer sur l'icône **Microphone**.
  2. Prononcer distinctement la phrase de test :
     > *"Vendu 3 cartons de lait Bonnet Rouge et 2 sacs de riz 25kg à M. Dossou"*
  3. Ou taper la phrase dans le champ texte.
* **Résultat attendu :** L'assistant calcule instantanément le total (71 000 FCFA), la marge nette (+15 000 FCFA) et propose l'enregistrement direct avec déstockage.

---

### ETAPE 6 : Tableau de Bord & Export du Bilan Financier PDF
* **URL :** `https://bizia.vercel.app/dashboard`
* **Action :**
  1. Consulter les indicateurs : Chiffre d'affaires global, Marge brute, Panier moyen, Top produits.
  2. Cliquer sur **Exporter le Bilan PDF**.
* **Résultat attendu :** Téléchargement instantané d'un rapport de gestion financier officiel et certifié.

---

### ETAPE 7 : Test du Mode PWA Hors-Ligne (Mobile / Tablette)
* **Action :**
  1. Ouvrir l'application sur smartphone (Safari sur iOS : *Partager > Sur l'écran d'accueil* ; Chrome sur Android : *Installer l'application*).
  2. Couper temporairement la connexion internet (Mode Avion).
  3. Enregistrer une vente en caisse.
  4. Réactiver la connexion internet.
* **Résultat attendu :** La vente est conservée dans IndexedDB et automatiquement synchronisée vers la base de données PostgreSQL dès le retour du réseau.

---

## 3. PRESENTATION OFFICIELLE TELECHARGEABLE
* **Fichier local :** `BizIA_Presentation_Officielle.pdf`
* **Lien direct de téléchargement :** `https://bizia.vercel.app/BizIA_Presentation_Officielle.pdf`
* **Mode plein écran interactif :** `https://bizia.vercel.app/pitch`
