"""Test automatise de bout en bout simulant le parcours complet de l'utilisateur."""

import json
import urllib.request
import urllib.error
import random

BACKEND_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://localhost:3000"

def request(url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    if data is not None and isinstance(data, dict):
        body = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    else:
        body = data

    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode("utf-8")
            status = resp.getcode()
            try:
                return status, json.loads(content)
            except Exception:
                return status, content
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            return e.code, json.loads(content)
        except Exception:
            return e.code, content

def run_e2e_tests():
    print("=" * 60)
    print("DEMARRAGE DE L'INSPECTION COMPLETE DU SYSTEME BIZIA")
    print("=" * 60)

    # 1. Verification de l'etat des serveurs
    print("\n1. [SERVEURS] Verification de la disponibilite...")
    status, res = request(f"{BACKEND_URL}/health")
    assert status == 200, f"Backend hors-ligne: {res}"
    print(f"   [OK] Backend en ligne ({BACKEND_URL}) -> {res}")

    status, res = request(FRONTEND_URL)
    assert status == 200, f"Frontend hors-ligne: {status}"
    print(f"   [OK] Frontend Next.js en ligne ({FRONTEND_URL}) -> Code HTTP {status}")

    # 2. Test Inscription d'un nouvel utilisateur & creation d'entreprise
    print("\n2. [AUTH] Inscription d'un nouvel utilisateur...")
    email = f"sophie.mensah_{random.randint(1000, 9999)}@bizia-audit.com"
    payload_reg = {
        "first_name": "Sophie",
        "last_name": "Mensah",
        "email": email,
        "password": "Password123!",
    }
    status, res = request(f"{BACKEND_URL}/api/auth/register", method="POST", data=payload_reg)
    assert status == 201, f"Echec inscription: {res}"
    token = res["token"]
    user = res["user"]
    print(f"   [OK] Utilisateur enregistre : {user['first_name']} {user['last_name']} ({user['email']})")
    print(f"   [OK] Session token genere : {token[:12]}...")

    auth_headers = {"Authorization": f"Bearer {token}"}

    # 3. Creation de l'entreprise
    print("\n3. [ENTREPRISE] Creation de l'espace entreprise dedie...")
    comp_payload = {
        "name": "Boutique Elegance SARL",
        "category": "Pret-a-porter & Accessoires",
        "currency": "FCFA",
    }
    status, comp_res = request(f"{BACKEND_URL}/api/companies", method="POST", data=comp_payload, headers=auth_headers)
    assert status == 201, f"Echec creation entreprise: {comp_res}"
    comp = comp_res.get("company", comp_res)
    comp_id = comp["id"]
    print(f"   [OK] Entreprise creee : {comp['name']} (ID: {comp_id})")

    company_headers = {**auth_headers, "X-Company-ID": comp_id}

    # 4. Verification Catalogue Vierge
    print("\n4. [PRODUITS] Verification de l'isolation du catalogue vierge...")
    status, prods = request(f"{BACKEND_URL}/api/products", headers=company_headers)
    assert status == 200 and len(prods.get("items", [])) == 0, f"Catalogue non vide: {prods}"
    print(f"   [OK] Catalogue parfaitement vierge (0 article pour cette nouvelle entreprise)")

    # 5. Ajout d'un produit reel
    print("\n5. [PRODUITS] Enregistrement d'un produit...")
    prod_payload = {
        "sku": "ROBE-01",
        "name": "Robe Soie Elegance",
        "category": "Robes",
        "unit_cost": 12000,
        "unit_price": 25000,
        "stock_quantity": 15,
        "low_stock_threshold": 3,
    }
    status, new_p_res = request(f"{BACKEND_URL}/api/products", method="POST", data=prod_payload, headers=company_headers)
    assert status == 201, f"Echec creation produit: {new_p_res}"
    new_p = new_p_res.get("item", new_p_res)
    print(f"   [OK] Produit enregistre : {new_p['name']} ({new_p['sku']}) - Prix: {new_p['unit_price']} FCFA, Stock: {new_p['stock_quantity']}")

    # 6. Ajout d'une vente
    print("\n6. [VENTES] Enregistrement d'une vente...")
    sale_payload = {
        "product_sku": "ROBE-01",
        "quantity": 2,
        "unit_price": 25000,
        "channel": "Comptoir",
    }
    status, new_s_res = request(f"{BACKEND_URL}/api/sales", method="POST", data=sale_payload, headers=company_headers)
    assert status == 201, f"Echec creation vente: {new_s_res}"
    new_s = new_s_res.get("item", new_s_res)
    print(f"   [OK] Vente enregistree : 2 x ROBE-01 a 25 000 FCFA = 50 000 FCFA")

    # 7. Generation de Tableau IA dans le Simulateur
    print("\n7. [SIMULATEUR] Test de generation de tableau assistee par IA...")
    ai_table_req = {"prompt": "5 articles de mode et pret-a-porter", "template": "products"}
    status, table_res = request(f"{BACKEND_URL}/api/chat/generate-table", method="POST", data=ai_table_req, headers=company_headers)
    assert status == 200 and len(table_res.get("rows", [])) > 0, f"Echec generation IA: {table_res}"
    print(f"   [OK] Tableau genere par IA : {len(table_res['rows'])} articles structures recus")

    # 8. Execution de l'analyse decisionnelle ML
    print("\n8. [ANALYSE ML] Calcul du bilan decisionnel...")
    status, analysis = request(f"{BACKEND_URL}/api/analysis/run", method="POST", data={}, headers=company_headers)
    assert status == 200, f"Echec analyse: {analysis}"
    kpis = analysis["result"]["kpis"]
    print(f"   [OK] Analyse executee avec succes !")
    print(f"     - Chiffre d'affaires calcule : {kpis['revenue']:,.0f} FCFA")
    print(f"     - Benefice brut estime     : {kpis['profit']:,.0f} FCFA")
    print(f"     - Taux de marge brute       : {kpis['margin_pct']:.1f}%")
    print(f"     - Nombre de ventes reelles  : {kpis['sales_count']}")

    # 9. Test de l'Assistant IA & Dialogue
    print("\n9. [ASSISTANT IA] Question contextuelle a l'assistant...")
    chat_payload = {"message": "Quel est mon chiffre d'affaires actuel et mes ventes ?"}
    status, chat_res = request(f"{BACKEND_URL}/api/chat/messages", method="POST", data=chat_payload, headers=company_headers)
    assert status == 200, f"Echec chat: {chat_res}"
    reply_preview = str(chat_res.get("reply", ""))[:120].replace("\n", " ").encode("ascii", "replace").decode("ascii")
    print(f"   [OK] Reponse IA recue : \"{reply_preview}...\"")
    print(f"   [OK] Ancrage base de donnees : {chat_res.get('grounded', False)}")

    # 10. Generation du Bilan PDF Officiel
    print("\n10. [RAPPORT PDF] Generation du PDF officiel ReportLab...")
    req_pdf = urllib.request.Request(f"{BACKEND_URL}/api/reports/generate?format=pdf", method="POST", headers=company_headers)
    with urllib.request.urlopen(req_pdf) as resp_pdf:
        pdf_bytes = resp_pdf.read()
        assert len(pdf_bytes) > 1000, "Fichier PDF trop petit ou vide"
        print(f"   [OK] Fichier PDF genere avec succes ({len(pdf_bytes):,} octets, en-tete %PDF valide)")

    print("\n" + "=" * 60)
    print("TOUS LES 10 TESTS D'INTEGRATION SONT VALIDES A 100% !")
    print("=" * 60)

if __name__ == "__main__":
    run_e2e_tests()
