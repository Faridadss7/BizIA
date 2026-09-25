import os
import sys
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

# Palette officielle BizIA
C_BG_DARK = colors.HexColor("#090D16")
C_SURFACE_DARK = colors.HexColor("#0F172A")
C_CARD_BG = colors.HexColor("#131C31")
C_BORDER = colors.HexColor("#1E293B")
C_PRIMARY = colors.HexColor("#3B82F6") # Bleu BizIA
C_PRIMARY_LIGHT = colors.HexColor("#60A5FA")
C_ACCENT = colors.HexColor("#10B981") # Vert succès
C_TEXT_WHITE = colors.HexColor("#FFFFFF")
C_TEXT_MUTED = colors.HexColor("#94A3B8")
C_TEXT_DIM = colors.HexColor("#64748B")

class BizIACanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(BizIACanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_theme_background(num_pages)
            super(BizIACanvas, self).showPage()
        super(BizIACanvas, self).save()

    def draw_theme_background(self, page_count):
        self.saveState()
        # Fond sombre premium de la plateforme
        self.setFillColor(C_BG_DARK)
        self.rect(0, 0, 792, 612, fill=1, stroke=0)
        
        # Ligne d'accent supérieure bleu
        self.setFillColor(C_PRIMARY)
        self.rect(0, 608, 792, 4, fill=1, stroke=0)

        # Header bar épuré
        self.setFont("Helvetica-Bold", 9)
        self.setFillColor(C_TEXT_WHITE)
        self.drawString(36, 584, "BIZIA")
        self.setFont("Helvetica", 9)
        self.setFillColor(C_TEXT_MUTED)
        self.drawString(70, 584, "|   Intelligence Financière & Gestion Commerciale")

        # Footer bar épuré
        self.setStrokeColor(C_BORDER)
        self.setLineWidth(1)
        self.line(36, 30, 756, 30)

        self.setFont("Helvetica", 8)
        self.setFillColor(C_TEXT_DIM)
        self.drawString(36, 16, "bizia.vercel.app  •  Plateforme PWA & Intelligence Multimodale")
        self.drawRightString(756, 16, f"{self._pageNumber} / {page_count}")
        self.restoreState()

def build_presentation_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=landscape(letter),
        leftMargin=36,
        rightMargin=36,
        topMargin=46,
        bottomMargin=42
    )

    styles = getSampleStyleSheet()

    title_main = ParagraphStyle(
        'TitleMain',
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=C_TEXT_WHITE,
        spaceAfter=6
    )

    slide_title = ParagraphStyle(
        'SlideTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=C_TEXT_WHITE,
        spaceAfter=4
    )

    slide_subtitle = ParagraphStyle(
        'SlideSubtitle',
        fontName='Helvetica',
        fontSize=10.5,
        leading=15,
        textColor=C_PRIMARY_LIGHT,
        spaceAfter=14
    )

    card_h = ParagraphStyle(
        'CardH',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=C_TEXT_WHITE,
        spaceAfter=4
    )

    card_p = ParagraphStyle(
        'CardP',
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=C_TEXT_MUTED
    )

    metric_val = ParagraphStyle(
        'MetricVal',
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=C_PRIMARY_LIGHT,
        spaceAfter=2
    )

    metric_lbl = ParagraphStyle(
        'MetricLbl',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=C_TEXT_MUTED
    )

    badge_text = ParagraphStyle(
        'BadgeText',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=C_ACCENT
    )

    def ui_card(title, desc, width=230, tag=None, accent_border=False):
        content = []
        if tag:
            content.append(Paragraph(tag.upper(), badge_text))
            content.append(Spacer(1, 2))
        content.append(Paragraph(title, card_h))
        content.append(Spacer(1, 3))
        content.append(Paragraph(desc, card_p))

        b_color = C_PRIMARY if accent_border else C_BORDER
        t = Table([[content]], colWidths=[width])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), C_CARD_BG),
            ('BOX', (0,0), (-1,-1), 1, b_color),
            ('TOPPADDING', (0,0), (-1,-1), 12),
            ('BOTTOMPADDING', (0,0), (-1,-1), 12),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
            ('RIGHTPADDING', (0,0), (-1,-1), 12),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        return t

    def stat_card(value, label, width=170):
        content = [
            Paragraph(value, metric_val),
            Paragraph(label, metric_lbl)
        ]
        t = Table([[content]], colWidths=[width])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), C_CARD_BG),
            ('BOX', (0,0), (-1,-1), 1, C_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 10),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
            ('RIGHTPADDING', (0,0), (-1,-1), 12),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        return t

    def full_width_card(title, desc, width=720):
        content = [
            Paragraph(title, card_h),
            Spacer(1, 4),
            Paragraph(desc, card_p)
        ]
        t = Table([[content]], colWidths=[width])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), C_CARD_BG),
            ('BOX', (0,0), (-1,-1), 1, C_BORDER),
            ('TOPPADDING', (0,0), (-1,-1), 12),
            ('BOTTOMPADDING', (0,0), (-1,-1), 12),
            ('LEFTPADDING', (0,0), (-1,-1), 14),
            ('RIGHTPADDING', (0,0), (-1,-1), 14),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        return t

    story = []

    # =========================================================================
    # SLIDE 1 : COUVERTURE & POSITIONNEMENT
    # =========================================================================
    story.append(Spacer(1, 10))
    story.append(Paragraph("BIZIA", title_main))
    story.append(Paragraph("La solution intelligente de gestion commerciale, vision multimodale et calcul de rentabilité pour PME", slide_subtitle))
    story.append(Spacer(1, 12))

    m1 = stat_card("44M+", "PME cibles en Afrique de l'Ouest", 172)
    m2 = stat_card("2.4s", "Extraction OCR d'une facture papier", 172)
    m3 = stat_card("100%", "Opérationnel hors-ligne (PWA)", 172)
    m4 = stat_card("0 FCFA", "Saisie manuelle fastidieuse évitée", 172)

    t_metrics = Table([[m1, m2, m3, m4]], colWidths=[178, 178, 178, 178])
    story.append(t_metrics)
    story.append(Spacer(1, 18))

    cover_desc = (
        "BizIA unifie la gestion de stock, la saisie des ventes par photo (Gemini OCR) et par commande vocale, "
        "le calcul automatique de marge nette en FCFA et l'édition de bilans financiers certifiés."
    )
    story.append(full_width_card("Proposition de Valeur", cover_desc, 712))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 2 : LES 3 DEFIS DU TERRAIN & REPONSES BIZIA
    # =========================================================================
    story.append(Spacer(1, 5))
    story.append(Paragraph("Problématiques Terrain & Réponses", slide_title))
    story.append(Paragraph("Comment BizIA répond aux réalités quotidiennes des commerces et PME", slide_subtitle))
    story.append(Spacer(1, 10))

    d1 = ui_card(
        "1. Factures & Bons Papiers",
        "<b>Problème :</b> Reçus manuscrits perdus, erreurs de saisie.<br/><br/><b>Réponse BizIA :</b> Scan photo automatique via Gemini Vision. Les articles et prix d'achat entrent en stock en 1 clic.",
        230,
        "Vision OCR"
    )

    d2 = ui_card(
        "2. Coupures de Connexion",
        "<b>Problème :</b> Logiciels cloud inaccessibles sans réseau.<br/><br/><b>Réponse BizIA :</b> Architecture PWA Offline-First. Enregistrez vos ventes sans internet, synchronisation dès le retour du signal.",
        230,
        "Hors-Ligne"
    )

    d3 = ui_card(
        "3. Calcul Réel des Marges",
        "<b>Problème :</b> Confusion entre chiffre d'affaires et bénéfice.<br/><br/><b>Réponse BizIA :</b> Déduction automatique du coût d'achat et des charges pour afficher la marge nette exacte en FCFA.",
        230,
        "Rentabilité"
    )

    t_defis = Table([[d1, d2, d3]], colWidths=[237, 237, 237])
    t_defis.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    story.append(t_defis)

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 3 : MODULES & FONCTIONNALITES PRINCIPALES
    # =========================================================================
    story.append(Spacer(1, 5))
    story.append(Paragraph("Modules & Fonctionnalités de la Plateforme", slide_title))
    story.append(Paragraph("Une interface complète, fluide et adaptée au mobile comme au bureau", slide_subtitle))
    story.append(Spacer(1, 10))

    f1 = ui_card("Scanner de Reçus", "Extraction multimodale instantanée des produits, quantités et prix d'achat.", 230, "Gemini Vision")
    f2 = ui_card("Assistant Vocal", "Enregistrement rapide des ventes à la voix en français et dialectes locaux.", 230, "Voice AI")
    f3 = ui_card("Catalogue & Stocks", "Suivi en temps réel des stocks, seuils d'alerte et valorisation de l'inventaire.", 230, "Inventaire")

    f4 = ui_card("Simulateur Financier", "Audit des marges, seuil de rentabilité et simulations de croissance du CA.", 230, "Analytics")
    f5 = ui_card("Dashboard Direction", "Indicateurs clés : panier moyen, CA journalier, marge brute et bénéfice net.", 230, "KPIs")
    f6 = ui_card("Importation Tableurs", "Glisser-déposer de fichiers Excel/CSV avec normalisation automatique par IA.", 230, "Import")

    t_f1 = Table([[f1, f2, f3]], colWidths=[237, 237, 237])
    t_f2 = Table([[f4, f5, f6]], colWidths=[237, 237, 237])
    t_f1.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    t_f2.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))

    story.append(t_f1)
    story.append(Spacer(1, 8))
    story.append(t_f2)

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 4 : ARCHITECTURE & SECURITE
    # =========================================================================
    story.append(Spacer(1, 5))
    story.append(Paragraph("Architecture & Sécurité des Données", slide_title))
    story.append(Paragraph("Une infrastructure moderne, rapide et conforme aux standards professionnels", slide_subtitle))
    story.append(Spacer(1, 10))

    a1 = ui_card(
        "Interface Utilisateur (Frontend)",
        "&bull; Next.js 14 & TypeScript<br/>&bull; Design System Dark / FinTech épuré<br/>&bull; Mode PWA (Installation iOS / Android)<br/>&bull; Stockage local sécurisé IndexedDB",
        350
    )

    a2 = ui_card(
        "Serveur & Intelligence (Backend)",
        "&bull; FastAPI asynchrone ultra-performant<br/>&bull; Base PostgreSQL & Row Level Security (RLS)<br/>&bull; Pipeline Google Gemini 3.5 & 3.8 Flash<br/>&bull; Suite de 79 tests automatisés validés",
        350
    )

    t_arch = Table([[a1, a2]], colWidths=[356, 356])
    t_arch.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    story.append(t_arch)
    story.append(Spacer(1, 12))

    secu_desc = (
        "<b>Sécurité Multi-Entreprises :</b> Chaque compte dispose d'un cloisonnement strict de ses données via Row Level Security (RLS). "
        "Les communications sont chiffrées en HTTPS/TLS de bout en bout et les sauvegardes sont automatisées."
    )
    story.append(full_width_card("Isolation & Chiffrement", secu_desc, 712))

    story.append(PageBreak())

    # =========================================================================
    # SLIDE 5 : MODELE ECONOMIQUE & ACCESSIBILITE
    # =========================================================================
    story.append(Spacer(1, 5))
    story.append(Paragraph("Modèle Économique & Offres", slide_title))
    story.append(Paragraph("Une tarification transparente et adaptée à chaque niveau de maturité", slide_subtitle))
    story.append(Spacer(1, 10))

    p1 = ui_card(
        "Offre Découverte",
        "<b>Gratuit</b><br/><br/>&bull; Jusqu'à 50 scans OCR / mois<br/>&bull; Enregistrement ventes & voix<br/>&bull; Mode hors-ligne PWA inclus<br/>&bull; Gestion jusqu'à 200 produits",
        230
    )

    p2 = ui_card(
        "Offre Professionnelle",
        "<b>5 000 FCFA / mois</b><br/><br/>&bull; Scans OCR illimités<br/>&bull; Multi-caissiers & utilisateurs<br/>&bull; Bilan financier PDF exportable<br/>&bull; Alertes de marge et de stock par IA",
        230,
        "Recommandé",
        accent_border=True
    )

    p3 = ui_card(
        "Partenaires Bancaires",
        "<b>Sur Mesure</b><br/><br/>&bull; API de certification des flux financiers<br/>&bull; Évaluation du risque de crédit PME<br/>&bull; Intégration directe microfinance",
        230
    )

    t_pricing = Table([[p1, p2, p3]], colWidths=[237, 237, 237])
    t_pricing.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    story.append(t_pricing)
    story.append(Spacer(1, 14))

    conclusion_desc = (
        "<b>Application opérationnelle en direct :</b> Accessible sur ordinateur et mobile à l'adresse <b>https://bizia.vercel.app</b>"
    )
    story.append(full_width_card("Accès Plateforme", conclusion_desc, 712))

    # Génération du document
    doc.build(story, canvasmaker=BizIACanvas)
    print(f"PDF généré avec succès : {filename}")

if __name__ == "__main__":
    out_root = "BizIA_Presentation_Officielle_Harvard.pdf"
    out_public = os.path.join("frontend", "public", "BizIA_Presentation_Officielle_Harvard.pdf")
    build_presentation_pdf(out_root)
    build_presentation_pdf(out_public)
