"""Moteur d'actions et d'orchestration IA (Gemini & Groq) connecté à la base de données de l'entreprise.

Gère l'analyse d'intention, les opérations CRUD (produits, ventes, stocks)
et la communication bidirectionnelle texte / voix.
"""

from __future__ import annotations

import json
import logging
import re
from datetime import datetime, timezone
from typing import Any

from app.services.gemini import gemini_enabled
from app.services.groq_service import generate_with_groq, groq_enabled
from app.services.store import JsonStore, get_company_store
from app.utils.settings import settings

logger = logging.getLogger(__name__)


def _clean_sku(name: str) -> str:
    """Génère un SKU propre et court à partir du nom."""
    cleaned = re.sub(r"[^A-Za-z0-9]+", "-", name.strip().upper()).strip("-")
    return cleaned[:16] or "ART-001"


def execute_ai_intent_and_crud(
    message: str,
    company_id: str,
    analysis: dict[str, Any] | None = None,
    history: list[dict[str, str]] | None = None,
) -> dict[str, Any]:
    """Analyse le message de l'utilisateur, interroge l'IA ou les règles locales,

    exécute les modifications en base de données et renvoie la réponse enrichie.
    """
    store = get_company_store(company_id)
    products = store.list_products()
    sales = store.list_sales()

    # 1. Tentative d'analyse intelligente avec Gemini Pro
    llm_result = _parse_with_llm(message, products, sales, analysis, history=history)

    # 2. Si pas de LLM ou échec, analyse heuristique locale
    if not llm_result:
        llm_result = _parse_with_heuristics(message, products, sales, analysis)

    # 3. Exécution des actions sur le store
    actions_taken = []
    database_updated = False

    raw_actions = llm_result.get("actions", [])
    for act in raw_actions:
        action_type = str(act.get("type") or "").strip().lower()

        if action_type in ("add_product", "create_product"):
            name = str(act.get("name") or "").strip()
            if name:
                sku = str(act.get("sku") or "").strip() or _clean_sku(name)
                # Vérification unicité SKU
                existing = store.get_product(sku)
                price = float(act.get("unit_price") or act.get("price") or 0.0)
                cost = float(act.get("unit_cost") or act.get("cost") or 0.0)
                stock = float(act.get("stock_quantity") or act.get("stock") or 0.0)
                category = act.get("category") or (existing.get("category") if existing else "Divers")

                payload = {
                    "sku": sku,
                    "name": name,
                    "unit_price": price,
                    "unit_cost": cost,
                    "stock_quantity": stock,
                    "category": category,
                }
                created = store.add_product(payload)
                database_updated = True
                actions_taken.append({
                    "type": "product_created",
                    "label": f"Produit enregistré : {name} (Prix: {price:,.0f} FCFA, Stock: {stock:.0f})".replace(",", " "),
                    "details": created,
                })

        elif action_type in ("delete_product", "remove_product"):
            target = str(act.get("target") or act.get("name") or act.get("sku") or "").strip()
            if target:
                matching_product = None
                for p in products:
                    if target.lower() in str(p.get("name", "")).lower() or target.upper() == str(p.get("sku", "")).upper() or target == str(p.get("id", "")):
                        matching_product = p
                        break

                if matching_product:
                    store.delete_product(matching_product.get("sku") or matching_product.get("id"))
                else:
                    store.delete_product(target)
                
                database_updated = True
                actions_taken.append({
                    "type": "product_deleted",
                    "label": f"Produit supprimé : {target}",
                    "details": {"target": target},
                })

        elif action_type in ("add_sale", "record_sale"):
            target_prod = str(act.get("product") or act.get("name") or act.get("sku") or "").strip()
            qty = float(act.get("quantity") or act.get("qty") or 1.0)
            custom_price = act.get("unit_price") or act.get("price")

            # Trouver le produit associé (support pluriel/singulier et inclusion mutuelle)
            target_norm = target_prod.lower().rstrip("s")
            matched = None
            for p in products:
                p_name = str(p.get("name", "")).lower()
                p_sku = str(p.get("sku", "")).upper()
                if (
                    target_prod.upper() == p_sku
                    or target_prod.lower() in p_name
                    or p_name in target_prod.lower()
                    or (target_norm and target_norm in p_name)
                    or (p_name and p_name.rstrip("s") in target_norm)
                ):
                    matched = p
                    break

            if not matched:
                # Création automatique du produit au catalogue pour permettre la vente
                default_price = float(custom_price) if custom_price is not None else 10000.0
                matched = store.add_product({
                    "sku": _clean_sku(target_prod),
                    "name": target_prod.title(),
                    "unit_price": default_price,
                    "unit_cost": round(default_price * 0.7, 2),
                    "stock_quantity": max(10.0, qty),
                    "category": "Général",
                })

            unit_price = float(custom_price) if custom_price is not None else float(matched.get("unit_price", 0.0))
            unit_cost = float(matched.get("unit_cost", 0.0))
            total_amount = qty * unit_price
            total_cost = qty * unit_cost
            net_margin = total_amount - total_cost
            margin_pct = (net_margin / total_amount * 100) if total_amount > 0 else 0.0

            sale_payload = {
                "product_sku": matched["sku"],
                "quantity": qty,
                "unit_price": unit_price,
                "unit_cost": unit_cost,
                "channel": str(act.get("channel") or "chat_ia"),
                "sold_at": datetime.now(timezone.utc).isoformat(),
            }
            sale_item = store.add_sale(sale_payload)

            # Déstockage automatique géré par store.add_sale
            curr_stock = float(matched.get("stock_quantity", 0.0))
            new_stock = max(0.0, curr_stock - qty)

            database_updated = True
            margin_sign = "+" if net_margin >= 0 else ""
            sale_summary = (
                f"✅ Vente enregistrée avec succès :\n"
                f"• Produit : {matched['name']}\n"
                f"• Quantité : {qty:.0f} unité(s)\n"
                f"• Prix unitaire : {unit_price:,.0f} FCFA\n"
                f"• Total encaissé : {total_amount:,.0f} FCFA\n"
                f"• Marge nette estimée : {margin_sign}{net_margin:,.0f} FCFA ({margin_pct:.1f}%)\n"
                f"• Déstockage : {curr_stock:.0f} → {new_stock:.0f} restant(s)"
            ).replace(",", " ")

            actions_taken.append({
                "type": "sale_recorded",
                "label": f"Vente enregistrée : {qty:.0f}x {matched['name']} pour un total de {total_amount:,.0f} FCFA (Marge: {margin_sign}{net_margin:,.0f} FCFA, Stock: {new_stock:.0f})".replace(",", " "),
                "details": sale_item,
                "summary": sale_summary,
            })

    # Si aucune action CRUD n'a été déclenchée et qu'une analyse existe
    if not actions_taken and not database_updated and analysis:
        from app.services.chat import answer_from_analysis
        ans = answer_from_analysis(message, analysis)
        return {
            "reply": ans["reply"],
            "actions_taken": [],
            "database_updated": False,
            "grounded": ans.get("grounded", True),
        }

    # Si des ventes ont été enregistrées, enrichir la réponse avec les calculs financiers détaillés
    sales_summaries = [a.get("summary") for a in actions_taken if a.get("type") == "sale_recorded" and a.get("summary")]
    if sales_summaries:
        combined_summaries = "\n\n".join(sales_summaries)
        reply = f"{combined_summaries}\n\nVos indicateurs de caisse et de marge ont été immédiatement recalculés."
    else:
        reply = llm_result.get("reply") or "Opération effectuée avec succès."

    return {
        "reply": reply,
        "actions_taken": actions_taken,
        "database_updated": database_updated,
        "grounded": bool(analysis or actions_taken or products),
    }


def _parse_with_llm(
    message: str,
    products: list[dict[str, Any]],
    sales: list[dict[str, Any]],
    analysis: dict[str, Any] | None,
    history: list[dict[str, str]] | None = None,
) -> dict[str, Any] | None:
    """Utilise Gemini ou Groq pour extraire intentions et actions en JSON."""
    system_instruction = (
        "Tu es l'assistant d'exploitation BizIA. Tu aides les dirigeants de PME à gérer leur entreprise.\n"
        "Tu as accès aux produits en stock et aux ventes actuelles.\n"
        "Tu dois répondre en français de façon chaleureuse, naturelle, précise et concise avec les montants au format FCFA.\n"
        "DIRECTIVES POUR L'AJOUT DE PRODUITS :\n"
        "1. Si l'utilisateur demande d'ajouter un produit avec son prix (ex: 'ajoute une calculatrice à 5000 francs', 'téléphone 45000 fcfa', 'sac de riz prix 15000'), "
        "extrait le NOM PUR du produit (ex: 'Calculatrice' sans 'une', sans le prix, sans point) et mets son prix exact dans unit_price (ex: 5000) et unit_cost estimé à 70% du prix.\n"
        "2. Si l'utilisateur demande d'ajouter un produit sans préciser de prix ni stock (ex: 'ajoute calculatrice, téléphone'), "
        "mets impérativement unit_price: 0, unit_cost: 0, stock_quantity: 0 (ne JAMAIS inventer de prix fictif).\n"
        "Format JSON attendu strictement :\n"
        "{\n"
        '  "reply": "Ta réponse conversationnelle complète, naturelle et conviviale",\n'
        '  "actions": [\n'
        '    {"type": "add_product", "name": "Nom", "unit_price": 5000, "unit_cost": 3500, "stock_quantity": 0, "category": "Général"},\n'
        '    {"type": "delete_product", "target": "Nom ou SKU"},\n'
        '    {"type": "add_sale", "product": "Nom ou SKU", "quantity": 1, "unit_price": 5000}\n'
        "  ]\n"
        "}"
    )

    catalog_summary = [
        {"sku": p.get("sku"), "name": p.get("name"), "price": p.get("unit_price"), "stock": p.get("stock_quantity")}
        for p in products[:30]
    ]

    history_str = ""
    if history:
        recent = history[-6:]
        lines = []
        for h in recent:
            role = "Utilisateur" if h.get("role") == "user" else "Assistant"
            lines.append(f"{role}: {h.get('content', '')}")
        if lines:
            history_str = f"HISTORIQUE DE LA CONVERSATION RÉCENTE :\n" + "\n".join(lines) + "\n\n"

    prompt = (
        f"CATALOGUE ACTUEL ({len(products)} articles) :\n{json.dumps(catalog_summary, ensure_ascii=False)}\n\n"
        f"VENTES ENREGISTRÉES : {len(sales)} transactions.\n\n"
        f"{history_str}"
        f"NOUVEAU MESSAGE UTILISATEUR : {message}"
    )

    has_explicit_prices = bool(
        re.search(
            r"(?:prix|co[uû]t|tarif|montant)\s*[:=]?\s*\d+"
            r"|[aà]\s*\d+[\d\s]*(?:fcfa|cfa|francs?|f|€|\$)?"
            r"|\d+[\d\s]*(?:fcfa|cfa|francs?|f|€|\$)"
            r"|pour\s*\d+[\d\s]*(?:fcfa|cfa|francs?|f|€|\$)?",
            message,
            re.IGNORECASE,
        )
    )

    # Essai Groq si disponible
    if groq_enabled():
        res_text = generate_with_groq(prompt, system_prompt=system_instruction, json_mode=True)
        if res_text:
            try:
                res_dict = json.loads(res_text)
                if not has_explicit_prices and res_dict and isinstance(res_dict.get("actions"), list):
                    for act in res_dict["actions"]:
                        if str(act.get("type", "")).lower() in ("add_product", "create_product"):
                            act["unit_price"] = 0.0
                            act["unit_cost"] = 0.0
                            act["stock_quantity"] = 0.0
                return res_dict
            except Exception:
                pass

    # Essai Gemini si disponible
    if gemini_enabled():
        try:
            from app.services.gemini import _generate_json
            schema = {
                "type": "object",
                "properties": {
                    "reply": {"type": "string"},
                    "actions": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "type": {"type": "string"},
                                "name": {"type": "string"},
                                "target": {"type": "string"},
                                "product": {"type": "string"},
                                "sku": {"type": "string"},
                                "unit_price": {"type": "number"},
                                "unit_cost": {"type": "number"},
                                "stock_quantity": {"type": "number"},
                                "quantity": {"type": "number"},
                                "category": {"type": "string"},
                            },
                            "required": ["type"],
                        },
                    },
                },
                "required": ["reply"],
            }
            res_dict = _generate_json(f"{system_instruction}\n\n{prompt}", schema)
            if res_dict:
                if not has_explicit_prices and isinstance(res_dict.get("actions"), list):
                    for act in res_dict["actions"]:
                        if str(act.get("type", "")).lower() in ("add_product", "create_product"):
                            act["unit_price"] = 0.0
                            act["unit_cost"] = 0.0
                            act["stock_quantity"] = 0.0
                return res_dict
        except Exception as exc:
            logger.warning("Gemini JSON parse failed: %s", exc)

    return None


def _parse_with_heuristics(
    message: str,
    products: list[dict[str, Any]],
    sales: list[dict[str, Any]],
    analysis: dict[str, Any] | None,
) -> dict[str, Any]:
    """Moteur de règles NLP local ultra-robuste (fonctionne même hors-ligne)."""
    text = message.strip()
    lower = text.lower()
    actions = []

    # 1. Détection Ajout Produit(s)
    # Support de plusieurs produits (ex: "enregistre 5 produits : calculatrice, téléphone portable, bracelet, montre")
    multi_match = re.search(r"(?:ajoute?r?|cr[eé][eé]r?|enregistre?r?)\s+(?:(?:les|des|\d+)\s+)?(?:produits?|articles?)\s*[:=]?\s*(.+)", text, re.IGNORECASE)
    if multi_match and not ("vente" in lower or "vendu" in lower):
        content = multi_match.group(1).strip()
        # Séparation par virgule, point-virgule ou " et "
        items = [item.strip() for item in re.split(r"[,;]|\s+et\s+", content) if item.strip()]
        if items:
            for item in items:
                # Extraction du prix et stock
                price_m = re.search(
                    r"(?:(?:au\s+)?prix(?:\s+de)?|vendu\s+[aà]|[aà]|co[uû]te?|tarif(?:\s+de)?)\s*[:=]?\s*(\d+[\d\s]*)\s*(?:fcfa|cfa|francs?|f|€|\$)?"
                    r"|(\d+[\d\s]*)\s*(?:fcfa|cfa|francs?|f|€|\$)",
                    item,
                    re.IGNORECASE,
                )
                stock_m = re.search(
                    r"(?:stock(?:\s+de)?|quantit[eé](?:\s+de)?)\s*[:=]?\s*(\d+)|(\d+)\s*(?:unit[eé]s?|pi[èe]ces?|ex|exemplaires?)",
                    item,
                    re.IGNORECASE,
                )
                price = 0.0
                if price_m:
                    raw_p = price_m.group(1) or price_m.group(2) or ""
                    try:
                        price = float(re.sub(r"\s+", "", raw_p))
                    except ValueError:
                        price = 0.0

                stock = 0.0
                if stock_m:
                    raw_s = stock_m.group(1) or stock_m.group(2) or ""
                    try:
                        stock = float(re.sub(r"\s+", "", raw_s))
                    except ValueError:
                        stock = 0.0

                name = item
                if price_m:
                    name = name[:price_m.start()]
                if stock_m and stock_m.start() < len(name):
                    name = name[:stock_m.start()]
                name = re.sub(r"(?:au prix de|prix|stock|quantit[eé]|co[uû]te?|[aà]\s*\d+).*", "", name, flags=re.IGNORECASE).strip()
                name = re.sub(r"^(?:le|la|les|un|une|l['’]|du|de la|des|le produit|un produit|l'article|les produits)\s+", "", name, flags=re.IGNORECASE).strip()
                name = re.sub(r"[.,;:!?]+$", "", name).strip()

                if len(name) >= 2:
                    cost = round(price * 0.7, 2) if price > 0 else 0.0
                    actions.append({
                        "type": "add_product",
                        "name": name.title(),
                        "unit_price": price,
                        "unit_cost": cost,
                        "stock_quantity": stock,
                        "category": "Général",
                    })

            if actions:
                names_str = ", ".join(f"« {a['name']} »" for a in actions)
                return {
                    "reply": f"J'ai bien enregistré {len(actions)} article(s) dans votre catalogue ({names_str}).",
                    "actions": actions,
                }

    # Détection Produit Unique (ex: "Ajoute une calculatrice à 5000 francs", "Crée le produit Téléphone 65000 FCFA")
    add_match = re.search(
        r"(?:ajoute?r?|cr[eé][eé]r?|nouveau\s+produit|nouvel\s+article|enregistre?r?)\s+(?:(?:un|une|le|la|les|l['’])\s+)?(?:produits?\s+|articles?\s+)?([A-Za-z0-9\s\-_À-ÿ\.\'\,]+)",
        text,
        re.IGNORECASE,
    )
    if add_match and not ("vente" in lower or "vendu" in lower):
        raw_part = add_match.group(1).strip()

        # 1. Extraction du prix (ex: "à 5000 francs", "au prix de 5000", "5000 fcfa", "prix: 5000")
        price_m = re.search(
            r"(?:(?:au\s+)?prix(?:\s+de)?|vendu\s+[aà]|[aà]|co[uû]te?|tarif(?:\s+de)?)\s*[:=]?\s*(\d+[\d\s]*)\s*(?:fcfa|cfa|francs?|f|€|\$)?"
            r"|(\d+[\d\s]*)\s*(?:fcfa|cfa|francs?|f|€|\$)",
            raw_part,
            re.IGNORECASE,
        )
        price = 0.0
        if price_m:
            raw_p = price_m.group(1) or price_m.group(2) or ""
            try:
                price = float(re.sub(r"\s+", "", raw_p))
            except ValueError:
                price = 0.0

        # 2. Extraction du stock (ex: "stock 10", "quantité: 5", "10 unités")
        stock_m = re.search(
            r"(?:stock(?:\s+de)?|quantit[eé](?:\s+de)?)\s*[:=]?\s*(\d+)|(\d+)\s*(?:unit[eé]s?|pi[èe]ces?|ex|exemplaires?)",
            raw_part,
            re.IGNORECASE,
        )
        stock = 0.0
        if stock_m:
            raw_s = stock_m.group(1) or stock_m.group(2) or ""
            try:
                stock = float(re.sub(r"\s+", "", raw_s))
            except ValueError:
                stock = 0.0

        # 3. Extraction et nettoyage du nom
        name = raw_part
        if price_m:
            name = name[:price_m.start()]
        if stock_m and stock_m.start() < len(name):
            name = name[:stock_m.start()]

        name = re.sub(r"(?:au prix de|prix|stock|quantit[eé]|co[uû]te?|[aà]\s*\d+).*", "", name, flags=re.IGNORECASE).strip()
        name = re.sub(r"^(?:le|la|les|un|une|l['’]|du|de la|des|produit|article)\s+", "", name, flags=re.IGNORECASE).strip()
        name = re.sub(r"[.,;:!?]+$", "", name).strip()

        if len(name) >= 2:
            cost = round(price * 0.7, 2) if price > 0 else 0.0
            actions.append({
                "type": "add_product",
                "name": name.title(),
                "unit_price": price,
                "unit_cost": cost,
                "stock_quantity": stock,
                "category": "Général",
            })
            if price > 0:
                reply_txt = f"J'ai bien ajouté le produit « {name.title()} » au prix de {price:,.0f} FCFA (coût estimé : {cost:,.0f} FCFA, stock : {stock:.0f}).".replace(",", " ")
            else:
                reply_txt = f"J'ai bien préparé l'ajout du produit « {name.title()} » (Prix et stock initialisés à 0 afin que vous puissiez définir vos tarifs)."
            return {
                "reply": reply_txt,
                "actions": actions,
            }

    # 2. Détection Suppression Produit
    # Ex: "Supprime le produit Clavier" ou "Efface l'article ART-001"
    del_match = re.search(r"(?:supprime?r?|efface?r?|retire?r?)\s+(?:le produit\s+|l'article\s+)?([A-Za-z0-9\s\-_À-ÿ]+)", lower)
    if del_match:
        target_name = del_match.group(1).strip()
        actions.append({
            "type": "delete_product",
            "target": target_name,
        })
        return {
            "reply": f"J'ai supprimé l'élément correspondant à « {target_name} » de votre catalogue.",
            "actions": actions,
        }

    # 3. Détection Vente
    # Ex: "J'ai vendu 5 ordinateurs à 200000 FCFA", "Vends 2 Samsung", "Enregistre la vente de 3 Claviers à 15000"
    sale_match = re.search(r"(?:vendu|vends?|vente(?:\s+de)?|encaiss[eé]r?)\s+(?:de\s+)?(\d+)\s+([A-Za-z0-9\s\-_À-ÿ]+)", lower)
    if sale_match:
        qty = float(sale_match.group(1))
        prod_part = sale_match.group(2).strip()
        # Nettoyage prix éventuel
        price_m = re.search(r"(?:[aà]|au prix de|prix)\s*[:=]?\s*(\d+[\d\s]*)(?:fcfa|f)?", prod_part, re.IGNORECASE)
        unit_price = float(re.sub(r"\s+", "", price_m.group(1))) if price_m else None
        prod_name = prod_part[:price_m.start()].strip() if price_m else prod_part
        prod_name = re.sub(r"(?:au prix de|[aà]\s+\d+|prix\s*[:=]?\s*\d+).*", "", prod_name, flags=re.IGNORECASE).strip()
        prod_name = re.sub(r"^(?:le produit|un produit|l'article|les)\s+", "", prod_name, flags=re.IGNORECASE).strip()

        actions.append({
            "type": "add_sale",
            "product": prod_name,
            "quantity": qty,
            "unit_price": unit_price,
        })
        return {
            "reply": f"C'est noté ! J'enregistre la vente de {qty:.0f} « {prod_name} » et je mets à jour le stock disponible.",
            "actions": actions,
        }

    # 4. Requête d'information générale / Stock / Chiffres / Produits
    if any(w in lower for w in ("combien", "stock", "produit", "catalogue", "chiffre", "marge", "activite", "activit", "resume", "résum")):
        total_prods = len(products)
        total_sales_count = len(sales)
        if total_prods == 0 and total_sales_count == 0:
            return {
                "reply": (
                    "Votre espace d'activité est actuellement vierge (aucun produit ni vente enregistrée).\n\n"
                    "**Pour démarrer :**\n"
                    "• Vous pouvez me dicter ou écrire l'enregistrement de vos premiers articles (nom, prix unitaire, coût d'achat et stock initial).\n"
                    "• Vous pouvez également saisir vos premières ventes ou importer vos fichiers Excel / CSV depuis l'onglet **Import**."
                ),
                "actions": [],
            }

        low_stock = sum(1 for p in products if float(p.get("stock_quantity", 0)) <= float(p.get("low_stock_threshold", 5)))
        total_ca = sum(float(s.get("quantity", 0)) * float(s.get("unit_price", 0)) for s in sales)
        sample_names = ", ".join(p.get("name", "") for p in products[:5])
        return {
            "reply": (
                f"Votre entreprise compte actuellement **{total_prods} produit(s)** en catalogue ({sample_names}{'...' if total_prods > 5 else ''}) "
                f"et **{total_sales_count} vente(s)** enregistrée(s) pour un Chiffre d'Affaires total de **{total_ca:,.0f} FCFA**.\n\n"
                f"{f'Alerte stock : **{low_stock} produit(s)** nécessitent un réapprovisionnement.' if low_stock > 0 else 'Vos stocks enregistrés sont sous contrôle.'}"
            ).replace(",", " "),
            "actions": [],
        }

    return {
        "reply": (
            "Je suis l'assistant d'exploitation de votre entreprise. Je suis à votre écoute pour enregistrer vos articles, "
            "comptabiliser vos ventes, analyser vos marges ou vérifier l'état de vos stocks."
        ),
        "actions": [],
    }
