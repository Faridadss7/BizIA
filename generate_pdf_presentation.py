import os
import sys
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_header_footer(self, page_count):
        self.saveState()
        # Top banner accent
        self.setFillColor(colors.HexColor("#4338CA"))
        self.rect(0, 595, 792, 17, fill=1, stroke=0)
        
        # Bottom footer bar
        self.setFillColor(colors.HexColor("#0B0F19"))
        self.rect(0, 0, 792, 28, fill=1, stroke=0)
        
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#FFFFFF"))
        self.drawString(36, 10, "BIZIA - INTELLIGENCE FINANCIERE & AUTOMATISATION DES PME AFRICAINES")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#94A3B8"))
        self.drawString(460, 10, "Harvard Hackathon Pitch Deck")
        page_text = f"Page {self._pageNumber} / {page_count}"
        self.drawRightString(756, 10, page_text)
        self.restoreState()

def build_pdf(filename):
    # Landscape letter is 792 x 612 pt
    doc = SimpleDocTemplate(
        filename,
        pagesize=landscape(letter),
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DeckTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DeckSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#4338CA'),
        spaceAfter=14
    )
    
    section_h2 = ParagraphStyle(
        'DeckH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'DeckBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#334155')
    )

    body_bold = ParagraphStyle(
        'DeckBodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#0F172A')
    )

    badge_style = ParagraphStyle(
        'DeckBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#4338CA')
    )

    card_title = ParagraphStyle(
        'CardTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )

    card_text = ParagraphStyle(
        'CardText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#475569')
    )

    story = []

    def make_card(title, text, bg_color="#F8FAFC", border_color="#E2E8F0"):
        content = [
            Paragraph(f"<b>{title}</b>", card_title),
            Spacer(1, 2),
            Paragraph(text, card_text)
        ]
        t = Table([[content]], colWidths=[230])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor(bg_color)),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor(border_color)),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        return t

    def make_wide_card(title, text, width=720, bg_color="#F8FAFC", border_color="#CBD5E1"):
        content = [
            Paragraph(f"<b>{title}</b>", card_title),
            Spacer(1, 2),
            Paragraph(text, card_text)
        ]
        t = Table([[content]], colWidths=[width])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor(bg_color)),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor(border_color)),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
            ('RIGHTPADDING', (0,0), (-1,-1), 12),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        return t

    # -------------------------------------------------------------
    # SLIDE 1 : COVER & EXECUTIVE SUMMARY
    # -------------------------------------------------------------
    story.append(Paragraph("BIZIA - INTELLIGENCE FINANCIERE PME", title_style))
    story.append(Paragraph("Dossier de Présentation Officiel & Architecture Technologique | Harvard Pitch & Hackathon", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#4338CA"), spaceAfter=14))
    
    s1_left = [
        Paragraph("<b>Vision & Proposition de Valeur</b>", section_h2),
        Paragraph("BizIA est la première plateforme tout-en-un d'intelligence financière, de vision multimodale et de gestion de stock conçue sur mesure pour les <b>44 millions de PME et commerces d'Afrique subsaharienne</b>.", body_style),
        Spacer(1, 8),
        Paragraph("En combinant <b>Gemini Vision OCR</b>, la <b>commande vocale en dialectes et français</b>, un <b>moteur hors-ligne PWA synchrone</b> et le calcul de <b>marge nette réelle en FCFA</b>, BizIA élimine les fuites de trésorerie et structure la transition vers l'inclusion bancaire.", body_style),
        Spacer(1, 10),
        Paragraph("<b>Deployments & Statuts de Production :</b>", body_bold),
        Paragraph("&bull; Application Web & Mobile PWA : <b>https://bizia.vercel.app</b><br/>&bull; Mode Pitch Interactif : <b>https://bizia.vercel.app/pitch</b><br/>&bull; Moteur IA Backend : <b>FastAPI + Supabase PostgreSQL + Google Gemini 3.5/3.8</b>", body_style),
    ]

    c1 = make_card("44M PME Cibles", "90% du tissu économique en Afrique de l'Ouest opérant sur carnet papier ou Excel non structuré.", "#EEF2FF", "#C7D2FE")
    c2 = make_card("0 Saisie Manuelle", "Scan instantané des factures et bons de livraison manuscrits via vision multimodale OCR.", "#F0FDF4", "#BBF7D0")
    c3 = make_card("100% Résilient Offline", "PWA avec IndexedDB et synchronisation bidirectionnelle lors du rétablissement réseau.", "#FEFCE8", "#FEF08A")

    t_metrics = Table([[c1], [Spacer(1, 6)], [c2], [Spacer(1, 6)], [c3]], colWidths=[240])
    
    t_layout1 = Table([[Table([[p] for p in s1_left], colWidths=[460]), t_metrics]], colWidths=[470, 250])
    t_layout1.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    story.append(t_layout1)

    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 2 : LE PROBLEME CRITIQUE EN AFRIQUE
    # -------------------------------------------------------------
    story.append(Paragraph("1. LE PROBLEME : L'ANGLE MORT FINANCIER DES PME", title_style))
    story.append(Paragraph("Pourquoi les solutions occidentales (SAP, QuickBooks) échouent sur le terrain africain", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#4338CA"), spaceAfter=14))

    p1 = make_card("1. Le Carnet Papier & Factures Volantes", "Factures manuscrites, reçus thermiques effacés, bons de livraison perdus. Erreurs de report manuelles quotidiennes et aucune traçabilité réelle.", "#FEF2F2", "#FECACA")
    p2 = make_card("2. Calcul de Marge Illusoire", "Confusion courante entre chiffre d'affaires et bénéfice net. L'oubli des frais de transport, pertes et crédit client masque la non-rentabilité réelle.", "#FFFBEB", "#FDE68A")
    p3 = make_card("3. Déconnexions & Réseau Instable", "Coupures récurrentes d'électricité et d'internet mobile. Les applications SaaS Cloud traditionnelles se bloquent en pleine vente.", "#F8FAFC", "#E2E8F0")

    t_prob = Table([[p1, p2, p3]], colWidths=[235, 235, 235])
    t_prob.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    story.append(t_prob)
    story.append(Spacer(1, 14))

    constat_text = (
        "<b>Impact Macro-Economique :</b><br/>"
        "&bull; <b>Pertes directes de trésorerie :</b> 18% à 24% du résultat d'exploitation envolé dans les écarts d'inventaire et les créances oubliées.<br/>"
        "&bull; <b>Rejet Bancaire à 85% :</b> Incapacité de produire des états financiers certifiés pour accéder aux crédits de campagne et financements bancaires.<br/>"
        "&bull; <b>Fracture Technologique :</b> Les logiciels ERP traditionnels exigent une formation comptable lourde et des forfaits prohibitifs en USD."
    )
    story.append(make_wide_card("Constat Chiffré & Déficit d'Inclusion", constat_text, 720, "#F1F5F9", "#CBD5E1"))

    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 3 : LA SOLUTION BIZIA & INNOVATIONS
    # -------------------------------------------------------------
    story.append(Paragraph("2. LA SOLUTION BIZIA : IA MULTIMODALE & TERRAIN", title_style))
    story.append(Paragraph("Une suite financière pensée pour le marchand de Dantokpa comme pour la PME d'Abidjan", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#4338CA"), spaceAfter=14))

    s_card1 = make_card("Scan Vision OCR Multimodal", "Prise de photo d'une facture ou reçu manuscrit : Gemini extrait articles, prix d'achat, quantités et met à jour le stock en 2.4s.", "#EEF2FF", "#C7D2FE")
    s_card2 = make_card("Assistant Vocal & Dialectes", "Enregistrement d'une vente en parlant naturellement au téléphone. Prise en charge du français, fon, yoruba, baoulé et wolof.", "#F0FDF4", "#BBF7D0")
    s_card3 = make_card("Moteur PWA Offline-First", "Enregistrement des ventes hors-ligne. File d'attente locale synchronisée automatiquement dès le retour du signal 4G/WiFi.", "#FEFCE8", "#FEF08A")

    t_sol1 = Table([[s_card1, s_card2, s_card3]], colWidths=[235, 235, 235])
    t_sol1.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    story.append(t_sol1)
    story.append(Spacer(1, 10))

    s_card4 = make_card("Calcul de Marge Réelle FCFA", "Ventilation instantanée : CA brut, Coût des marchandises (COGS), Frais variables, Marge nette réelle et Seuil de rentabilité.", "#F8FAFC", "#CBD5E1")
    s_card5 = make_card("Simulateur Excel & Prédictions", "Importation directe de tableurs existants, audit de cohérence par IA et simulations de croissance prédictives.", "#F8FAFC", "#CBD5E1")
    s_card6 = make_card("Export Conforme & Scoring", "Génération de bilans de trésorerie PDF et données structurées pour débloquer les crédits bancaires.", "#F8FAFC", "#CBD5E1")

    t_sol2 = Table([[s_card4, s_card5, s_card6]], colWidths=[235, 235, 235])
    t_sol2.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    story.append(t_sol2)

    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 4 : ARCHITECTURE TECHNIQUE & PIPELINE IA
    # -------------------------------------------------------------
    story.append(Paragraph("3. ARCHITECTURE TECHNIQUE DE CLASSE INDUSTRIELLE", title_style))
    story.append(Paragraph("Pipeline moderne, sécurisé, à haute disponibilité et zéro dépendance fragile", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#4338CA"), spaceAfter=14))

    arch_left = [
        Paragraph("<b>Stack Technologique Frontend & Edge</b>", section_h2),
        Paragraph("&bull; <b>Next.js 14 App Router & TypeScript :</b> Rendu hybride ultra-rapide, typage strict de bout en bout.<br/>&bull; <b>Tailwind CSS & Lucide Icons :</b> Design System Swiss FinTech sans stickers, contraste élevé et lisibilité plein soleil.<br/>&bull; <b>PWA Service Worker & IndexedDB :</b> Stockage des ventes et catalogue en local avec synchronisation par lot.", body_style),
        Spacer(1, 10),
        Paragraph("<b>Stack Backend & Base de Données</b>", section_h2),
        Paragraph("&bull; <b>FastAPI (Python 3.12) :</b> Moteur asynchrone ultra-performant sous Render.<br/>&bull; <b>Supabase PostgreSQL :</b> Row Level Security (RLS) par entreprise, triggers d'audit, chiffrement au repos.<br/>&bull; <b>Suite de Tests :</b> 79 tests unitaires et d'intégration validés en continu.", body_style),
    ]

    arch_right = [
        Paragraph("<b>Pipeline IA Multimodal & Failover</b>", section_h2),
        Paragraph("&bull; <b>Primary :</b> Google Gemini 3.5 Flash Lite (OCR haute vitesse, 1.2s latence)<br/>&bull; <b>Secondary :</b> Google Gemini 3.8 Flash (Fallback automatique en cas de surcharge)<br/>&bull; <b>Speech-to-Intent :</b> Web Speech API + Gemini Audio Parsing pour détection des entités (produit, quantité, montant).", body_style),
        Spacer(1, 10),
        Paragraph("<b>Sécurité & Conformité RGPD / OHADA</b>", section_h2),
        Paragraph("&bull; Authentification Supabase Auth JWT avec tokens rotatifs.<br/>&bull; Isolation étanche des données multi-tenants.<br/>&bull; Données financières hébergées avec sauvegardes automatisées quotidiennes.", body_style),
    ]

    t_arch = Table([[
        Table([[p] for p in arch_left], colWidths=[345]),
        Table([[p] for p in arch_right], colWidths=[345])
    ]], colWidths=[355, 355])
    t_arch.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,0), (0,0), colors.HexColor("#F8FAFC")),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#EEF2FF")),
        ('BOX', (0,0), (0,0), 1, colors.HexColor("#E2E8F0")),
        ('BOX', (1,0), (1,0), 1, colors.HexColor("#C7D2FE")),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_arch)

    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 5 : DEMONSTRATION FONCTIONNELLE & PARCOURS
    # -------------------------------------------------------------
    story.append(Paragraph("4. PARCOURS UTILISATEUR & VALIDATION TERRAIN", title_style))
    story.append(Paragraph("De la réception de marchandise au reporting bancaire : 4 étapes clés", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#4338CA"), spaceAfter=14))

    step1 = make_card("Etape 1 : Réception & OCR", "Le commerçant photographie le bon de livraison du fournisseur. Les articles, prix d'achat et stocks sont intégrés sans aucune frappe clavier.", "#F8FAFC", "#CBD5E1")
    step2 = make_card("Etape 2 : Ventes Rapides & Voix", "Au comptoir, l'enregistrement se fait en 1 clic ou vocalement ('Vendu 3 sacs de ciment à 14 500 F'). Même hors-ligne.", "#F8FAFC", "#CBD5E1")
    step3 = make_card("Etape 3 : Pilotage en Temps Réel", "Le tableau de bord calcule en direct le chiffre d'affaires, la marge brute et nette, et alerte sur les ruptures de stock imminentes.", "#F8FAFC", "#CBD5E1")
    step4 = make_card("Etape 4 : Export & Financement", "En fin de mois, génération d'un rapport PDF certifié prêt à soumettre à l'institution de microfinance ou à la banque partenaire.", "#F8FAFC", "#CBD5E1")

    t_steps = Table([[step1, step2], [Spacer(1, 8), Spacer(1, 8)], [step3, step4]], colWidths=[355, 355])
    t_steps.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    story.append(t_steps)

    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 6 : MODELE ECONOMIQUE & MARCHE (TAM/SAM/SOM)
    # -------------------------------------------------------------
    story.append(Paragraph("5. MODELE ECONOMIQUE & STRATEGIE GO-TO-MARKET", title_style))
    story.append(Paragraph("Monétisation SaaS Freemium, Partenariats Bancaires et Marché Adressable", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#4338CA"), spaceAfter=14))

    m1 = make_card("Plan Gratuit (Freemium)", "50 scans OCR / mois<br/>Jusqu'à 200 produits<br/>Ventes vocales & PWA offline<br/><b>Objectif :</b> Acquisition massive et adoption terrain virale.", "#F8FAFC", "#CBD5E1")
    m2 = make_card("Plan Pro (5 000 FCFA / mois)", "Scans OCR illimités<br/>Multi-utilisateurs & Caissiers<br/>Rapports financiers PDF & Alertes IA<br/><b>Cible :</b> Boutiques, grossistes, pharmacies, restaurants.", "#EEF2FF", "#C7D2FE")
    m3 = make_card("B2B Banques & Microfinances", "API de scoring de crédit<br/>Accès certifié aux flux financiers PME<br/>Modèle d'affiliation sur les prêts débloqués.", "#F0FDF4", "#BBF7D0")

    t_plans = Table([[m1, m2, m3]], colWidths=[235, 235, 235])
    t_plans.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    story.append(t_plans)
    story.append(Spacer(1, 12))

    tam_text = (
        "<b>Dimensionnement du Marché en Afrique Sub-Saharienne :</b><br/>"
        "&bull; <b>TAM (Total Addressable Market) :</b> 44 Millions de PME et micro-entreprises formelles et informelles (~$2.2 Mds / an).<br/>"
        "&bull; <b>SAM (Serviceable Addressable Market) :</b> 6.8 Millions de PME connectées en zone UEMOA et CEMAC (~$340M / an).<br/>"
        "&bull; <b>SOM (Serviceable Obtainable Market à 3 ans) :</b> 85 000 PME souscrites au plan Pro ($5.1M ARR)."
    )
    story.append(make_wide_card("Opportunité de Marché & Projection Financière", tam_text, 720, "#F1F5F9", "#CBD5E1"))

    story.append(PageBreak())

    # -------------------------------------------------------------
    # SLIDE 7 : ROADMAP & RECOMMANDATIONS JURY HARVARD
    # -------------------------------------------------------------
    story.append(Paragraph("6. FEUILLE DE ROUTE 2026-2027 & CONCLUSION", title_style))
    story.append(Paragraph("Pourquoi BizIA est le projet à fort impact économique et technologique à récompenser", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#4338CA"), spaceAfter=14))

    r1 = make_card("Q3-Q4 2026 : Déploiement UEMOA", "Intégration native Mobile Money (MTN MoMo, Moov Money, Orange Money, Wave) pour lettrage automatique des règlements.", "#F8FAFC", "#CBD5E1")
    r2 = make_card("Q1-Q2 2027 : Scoring Crédit IA", "Lancement du module d'évaluation du risque de crédit pour connecter directement les commerçants vertueux aux institutions bancaires.", "#EEF2FF", "#C7D2FE")
    r3 = make_card("Q3-Q4 2027 : Expansion Panafricaine", "Support multilingue étendu (Anglais, Swahili, Portugais) et couverture de l'Afrique de l'Est (Kenya, Rwanda, Tanzanie).", "#F0FDF4", "#BBF7D0")

    t_road = Table([[r1, r2, r3]], colWidths=[235, 235, 235])
    t_road.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    story.append(t_road)
    story.append(Spacer(1, 12))

    summary_text = (
        "<b>Conclusion & Atouts Majeurs pour le Jury :</b><br/>"
        "1. <b>Solution 100% Fonctionnelle & Déployée :</b> Testable immédiatement en live sur smartphone ou ordinateur à <b>https://bizia.vercel.app</b><br/>"
        "2. <b>Alignement Parfait avec la Réalité Terrain :</b> Vision multimodale (factures manuscrites) et mode PWA hors-ligne résolvent les deux blocages historiques.<br/>"
        "3. <b>Impact Economique Inclusif :</b> Transformer les commerces informels en entreprises bancarisables et génératrices de valeur durable."
    )
    story.append(make_wide_card("Message au Jury & Liens Utiles", summary_text, 720, "#EEF2FF", "#818CF8"))

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Presentation PDF generated successfully: {filename}")

if __name__ == "__main__":
    out_root = "BizIA_Presentation_Officielle_Harvard.pdf"
    out_public = os.path.join("frontend", "public", "BizIA_Presentation_Officielle_Harvard.pdf")
    build_pdf(out_root)
    build_pdf(out_public)
