# BizIA — Documentation Complète du Projet & Guide d'Architecture

> **Document de référence pour les développeurs et agents IA collaborateurs.**  
> Ce document synthétise l'architecture technique, toutes les fonctionnalités implémentées, les conventions de code, et les directives pour faire évoluer la plateforme sans créer de régression.

---

## 1. Vision & Positionnement du Produit
**BizIA** est une plateforme SaaS B2B conçue pour les PME, commerces et entreprises d'Afrique de l'Ouest (monnaie de référence : **FCFA**). Elle combine la gestion commerciale quotidienne (stocks, ventes, facturation) et la puissance de l'Intelligence Artificielle générative & multimodale (analyse de marges, assistant vocal, numérisation automatique de reçus/factures par vision).

* **Design System :** Esthétique Swiss / FinTech sobre, micro-animations inspirées d'Apple et Linear, zéro émoji/sticker amateur, support natif Mode Sombre & Mode Clair.
* **Production Live :**
  * **Frontend (Vercel) :** [https://bizia.vercel.app](https://bizia.vercel.app)
  * **Backend (Render) :** `https://bizia-backend.onrender.com`

---

## 2. Architecture Technique

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js 14+)                    │
│  - App Router (React 18+, TypeScript)                      │
│  - PWA Standalone (Service Worker, manifest.webmanifest)    │
│  - Offline Sales Queue (localStorage & auto-synchronisation)│
│  - Design System Vanilla CSS (Dark/Light Theme)             │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON / FormData
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI / Python)               │
│  - REST API & Endpoints Multi-tenant                        │
│  - Couche IA & Vision (Google Gemini SDK)                   │
│  - Moteur de Transcription Vocale Multimodale                │
│  - Moteur Ingestion & OCR Documentaire                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
   ┌─────────────────────────┐   ┌─────────────────────────┐
   │  Base de données        │   │  Moteur In-Memory       │
   │  Supabase (PostgreSQL)  │   │  Multi-Tenant de secours│
   │  (Isolation stricte RLS)│   │  (79 tests pytest 100%) │
   └─────────────────────────┘   └─────────────────────────┘
```

---

## 3. Répertoire des Fonctionnalités Implémentées

### A. Authentification & Multi-Tenancy (Isolation Stricte)
* **Comptes Utilisateurs & Sécurité :** Inscription, connexion par JWT sécurisé, récupération de mot de passe.
* **Multi-Entreprises :** Un utilisateur peut créer ou basculer entre plusieurs entreprises (ex: *Mon Entreprise*, *Commerce Général*).
* **Isolation Stricte des Données :** Chaque requête API valide l'appartenance de la ressource à l'entreprise courante (`company_id`). Auto-création et auto-rattachement sécurisé pour les nouveaux comptes.

### B. Gestion des Produits & Stocks
* **Catalogue complet :** SKU, Nom, Catégorie, Coût d'achat unitaire, Prix de vente unitaire, Quantité en stock, Seuil d'alerte stock bas.
* **Calcul automatique :** Marge brute unitaire et taux de marge en temps réel lors de la saisie.
* **Alertes de réapprovisionnement :** Détection automatique des ruptures imminentes.

### C. Enregistrement des Ventes & Facturation
* **Saisie rapide de transaction :** Sélection du produit avec suggestion du prix catalogue, quantité, canal de vente (*Boutique, Web, WhatsApp, B2B*).
* **Mise à jour automatique des stocks :** Décrémentation immédiate du stock disponible lors de la vente.
* **Support Hors-Ligne :** En cas d'indisponibilité du réseau, la vente est stockée localement dans la file d'attente et synchronisée dès reconnexion.

### D. Scanner Intelligent de Reçus & Factures (OCR Gemini Vision)
* **Capture Caméra Mobile & Import Fichiers :** Bouton direct de prise de vue photo (`capture="environment"`) et upload de photos / scans PDF.
* **Extraction Multimodale Gemini :** Détection instantanée des articles, quantités, prix et totaux via `gemini-3.5-flash-lite` avec fallback automatique.
* **Validation & Injection 1-Clic :** Aperçu côte à côte de la photo originale et du tableau extrait, correction interactive, et ajout direct dans les stocks ou ventes.
* **Accessible via :** `/scanner`, l'onglet dédié dans `/import`, et le raccourci dans `/ventes`.

### E. Mode PWA (Progressive Web App) & Résilience Hors-Ligne
* **Installabilité :** Compatible iOS et Android pour installation en application native autonome.
* **Service Worker (`sw.js`) :** Mise en cache des pages et des feuilles de style pour un chargement instantané.
* **Indicateur Réseau :** Badge dynamique affichant le statut de connexion et le nombre de ventes en attente de synchronisation.

### F. Simulateur Excel & Tableurs
* **Modélisation Financière Interactive :** Tableur intégré permettant de simuler des variations de prix, de coûts d'achat et d'impact sur la rentabilité globale en FCFA.

### G. Assistant IA & Interaction Vocale
* **Chat Multimodal :** Traitement des requêtes en langage naturel sur l'état des stocks, le chiffre d'affaires et les marges.
* **Commande Vocale :** Enregistrement audio en direct, transcription multimodale et exécution d'actions (*"Ajoute 10 sacs de riz à 15000 FCFA"*).
* **Synthèse vocale :** Réponse vocale interactive retournée à l'utilisateur.

### H. Tableau de Bord Décisionnel & KPIs
* **Indicateurs clés en FCFA :** Chiffre d'affaires cumulé, marge brute totale, taux de marge moyen, valeur du stock immobilisé.
* **Graphiques & Répartition :** Performances par produit, par canal de vente et alertes de rentabilité.

---

## 4. Configuration des Variables d'Environnement (`.env`)

```ini
# --- Fournisseur LLM & IA ---
LLM_PROVIDER=gemini
GEMINI_API_KEY=AIzaSy...           # Clé API Google AI Studio
GEMINI_MODEL=gemini-3.5-flash-lite  # Modèle recommandé (quota élevé & multimodal)
GEMINI_ENRICH_ANALYSIS=true

# --- Base de Données Supabase ---
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# --- Sécurité & JWT ---
JWT_SECRET=votre_cle_secrete_jwt
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200   # 30 jours

# --- Serveur & Environnement ---
ENVIRONMENT=production
ALLOWED_ORIGINS=https://bizia.vercel.app,http://localhost:3000
```

---

## 5. Directives pour les Agents IA Collaborateurs

1. **Intégrité de la Suite de Tests :**
   Avant toute modification, exécuter impérativement la suite de tests backend :
   ```bash
   python -m pytest backend/tests/
   ```
   Les 79 tests doivent systématiquement passer (100% de réussite).

2. **Vérification TypeScript :**
   Exécuter le contrôle de typage frontend avant tout commit :
   ```bash
   npx tsc --noEmit
   ```

3. **Synchronisation Double Remote GitHub :**
   Le projet possède deux dépôts synchronisés (le déploiement Vercel est lié au compte `Faridadss7`) :
   * `origin` : `https://github.com/bienvenuessegnon/BizIA.git`
   * `farid` : `https://github.com/Faridadss7/BizIA.git`
   
   Chaque push doit toujours être effectué sur les deux remotes :
   ```bash
   git push origin main
   git push farid main
   git push origin main:dev
   git push farid main:dev
   ```

4. **Règles de Design & UI :**
   * Ne jamais réintroduire d'émojis, de smileys ou de stickers décoratifs dans les boutons ou les titres.
   * Utiliser des icônes SVG vectorielles propres.
   * Préserver les transitions douces (Apple/Linear) et le support du Mode Sombre (`[data-theme="dark"]`).

---

*BizIA — Développé avec excellence.*
