import pytest
from pathlib import Path
from app.services.store import JsonStore
from app.services.ai_actions import execute_ai_intent_and_crud


def test_ai_crud_actions(tmp_path: Path):
    store_file = tmp_path / "test_store.json"
    store = JsonStore(store_file)
    
    # 1. Test Ajout de Produit
    res_add = execute_ai_intent_and_crud(
        message="Ajoute le produit Ordinateur Portable au prix de 450000 FCFA avec un stock de 8",
        company_id="comp_123",
        analysis=None,
    )
    assert "Ordinateur Portable" in res_add["reply"] or len(res_add["actions_taken"]) > 0
    assert res_add["database_updated"] is True

    # 2. Test Vente
    res_sale = execute_ai_intent_and_crud(
        message="J'ai vendu 2 Ordinateurs Portables à 450000 FCFA",
        company_id="comp_123",
        analysis=None,
    )
    assert len(res_sale["actions_taken"]) > 0 or "vente" in res_sale["reply"].lower()
    assert res_sale["database_updated"] is True

    # 3. Test Suppression
    res_del = execute_ai_intent_and_crud(
        message="Supprime le produit Ordinateur Portable",
        company_id="comp_123",
        analysis=None,
    )
    assert "supprimé" in res_del["reply"].lower() or len(res_del["actions_taken"]) > 0
    assert res_del["database_updated"] is True
