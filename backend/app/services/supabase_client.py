"""Client et adaptateur Supabase V2 pour BizIA.

Gère la communication avec PostgreSQL / Supabase Auth et propose un repli
local transparent conforme au schéma lorsque les clés d'API ne sont pas configurées.
"""

from __future__ import annotations

import logging
from typing import Any

from app.services.store import get_store
from app.utils.settings import settings

logger = logging.getLogger(__name__)

_supabase_client = None


def is_supabase_configured() -> bool:
    return bool(settings.supabase_url.strip() and settings.supabase_anon_key.strip())


def get_supabase_client():
    global _supabase_client
    if not is_supabase_configured():
        return None
    if _supabase_client is None:
        try:
            from supabase import create_client

            key = (
                settings.supabase_service_role_key.strip()
                if settings.supabase_service_role_key.strip()
                else settings.supabase_anon_key.strip()
            )
            _supabase_client = create_client(settings.supabase_url.strip(), key)
        except Exception as err:
            logger.warning("Impossible d'initialiser le client Supabase : %s", err)
            return None
    return _supabase_client


# ==============================================================================
# Méthodes Entreprises (Multi-entreprises V2)
# ==============================================================================


def list_companies(user_id: str) -> list[dict[str, Any]]:
    client = get_supabase_client()
    uid = _clean_uuid(user_id)
    if client is not None:
        try:
            res = (
                client.table("company_members")
                .select("role, companies(*)")
                .eq("user_id", uid)
                .execute()
            )
            companies = []
            for row in res.data or []:
                c = row.get("companies") or {}
                if c:
                    c["role"] = row.get("role", "member")
                    companies.append(c)
            if companies:
                return companies
        except Exception as err:
            logger.error("Erreur Supabase list_companies: %s", err)

    store = get_store()
    existing = store.list_companies_for_user(user_id)
    if not existing:
        user = store.find_user_by_id(user_id)
        name = f"{user.get('first_name', '')} {user.get('last_name', '')}".strip() if user else ""
        comp = store.ensure_default_company(user_id, name)
        return [comp]
    return existing


def _clean_uuid(val: Any) -> str:
    import uuid
    if not val:
        return str(uuid.uuid4())
    try:
        return str(uuid.UUID(str(val)))
    except Exception:
        return str(uuid.uuid5(uuid.NAMESPACE_DNS, str(val)))


def create_company(
    user_id: str,
    name: str,
    category: str = "Commerce Général",
    currency: str = "FCFA",
) -> dict[str, Any]:
    client = get_supabase_client()
    uid = _clean_uuid(user_id)
    if client is not None:
        try:
            comp_res = (
                client.table("companies")
                .insert(
                    {
                        "name": name.strip(),
                        "category": category.strip(),
                        "currency": currency.strip(),
                        "created_by": uid,
                    }
                )
                .execute()
            )
            if comp_res.data:
                comp = comp_res.data[0]
                client.table("company_members").insert(
                    {
                        "company_id": comp["id"],
                        "user_id": uid,
                        "role": "owner",
                    }
                ).execute()
                comp["role"] = "owner"
                return comp
        except Exception as err:
            logger.error("Erreur Supabase create_company: %s", err)

    return get_store().create_company_for_user(user_id, name, category, currency)


def get_company(company_id: str, user_id: str) -> dict[str, Any] | None:
    client = get_supabase_client()
    uid = _clean_uuid(user_id)
    cid = _clean_uuid(company_id)
    if client is not None:
        try:
            member_res = (
                client.table("company_members")
                .select("role")
                .eq("company_id", cid)
                .eq("user_id", uid)
                .execute()
            )
            role = member_res.data[0]["role"] if member_res.data else "owner"
            comp_res = client.table("companies").select("*").eq("id", cid).execute()
            if comp_res.data:
                comp = comp_res.data[0]
                comp["role"] = role
                return comp
        except Exception as err:
            logger.error("Erreur Supabase get_company: %s", err)

    return get_store().get_company_for_user(company_id, user_id)


def company_exists(company_id: str) -> bool:
    client = get_supabase_client()
    cid = _clean_uuid(company_id)
    if client is not None:
        try:
            res = client.table("companies").select("id").eq("id", cid).execute()
            if res.data:
                return True
        except Exception:
            pass
    return get_store().company_exists(company_id)


def update_company(
    company_id: str, user_id: str, updates: dict[str, Any]
) -> dict[str, Any] | None:
    client = get_supabase_client()
    cid = _clean_uuid(company_id)
    if client is not None:
        try:
            up_res = client.table("companies").update(updates).eq("id", cid).execute()
            if up_res.data:
                comp = up_res.data[0]
                comp["role"] = "owner"
                return comp
        except Exception as err:
            logger.error("Erreur Supabase update_company: %s", err)

    return get_store().update_company_for_user(company_id, user_id, updates)


# ==============================================================================
# Méthodes Produits & Ventes Supabase (Persistance PostgreSQL Haute Disponibilité)
# ==============================================================================


def list_products_db(company_id: str) -> list[dict[str, Any]] | None:
    client = get_supabase_client()
    if client is None:
        return None
    cid = _clean_uuid(company_id)
    try:
        res = client.table("products").select("*").eq("company_id", cid).order("name").execute()
        items = []
        for r in res.data or []:
            items.append({
                "id": str(r.get("id")),
                "sku": str(r.get("sku") or "").upper(),
                "name": str(r.get("name") or ""),
                "category": str(r.get("category") or "Général"),
                "unit_cost": float(r.get("unit_cost") or 0.0),
                "unit_price": float(r.get("unit_price") or 0.0),
                "stock_quantity": float(r.get("stock_quantity") or 0.0),
                "low_stock_threshold": float(r.get("low_stock_threshold") or settings.default_low_stock_threshold),
            })
        return items
    except Exception as err:
        logger.error("Erreur Supabase list_products: %s", err)
        return None


def upsert_product_db(company_id: str, product: dict[str, Any]) -> dict[str, Any] | None:
    client = get_supabase_client()
    if client is None:
        return None
    cid = _clean_uuid(company_id)
    sku = str(product.get("sku") or "").strip().upper()
    try:
        # Check if product exists by SKU
        existing = client.table("products").select("id").eq("company_id", cid).eq("sku", sku).execute()
        payload = {
            "company_id": cid,
            "sku": sku,
            "name": str(product.get("name") or sku),
            "category": str(product.get("category") or "Général"),
            "unit_cost": float(product.get("unit_cost") or 0.0),
            "unit_price": float(product.get("unit_price") or 0.0),
            "stock_quantity": float(product.get("stock_quantity") or 0.0),
            "low_stock_threshold": float(product.get("low_stock_threshold") or settings.default_low_stock_threshold),
        }
        if existing.data:
            pid = existing.data[0]["id"]
            res = client.table("products").update(payload).eq("id", pid).execute()
        else:
            res = client.table("products").insert(payload).execute()
        if res.data:
            r = res.data[0]
            return {
                "id": str(r.get("id")),
                "sku": str(r.get("sku")),
                "name": str(r.get("name")),
                "category": str(r.get("category")),
                "unit_cost": float(r.get("unit_cost") or 0.0),
                "unit_price": float(r.get("unit_price") or 0.0),
                "stock_quantity": float(r.get("stock_quantity") or 0.0),
                "low_stock_threshold": float(r.get("low_stock_threshold") or settings.default_low_stock_threshold),
            }
    except Exception as err:
        logger.error("Erreur Supabase upsert_product: %s", err)
    return None


def delete_product_db(company_id: str, sku_or_id: str) -> bool | None:
    client = get_supabase_client()
    if client is None:
        return None
    cid = _clean_uuid(company_id)
    target = str(sku_or_id or "").strip()
    try:
        # Try delete by ID or by SKU
        res = client.table("products").delete().eq("company_id", cid).eq("sku", target.upper()).execute()
        if res.data:
            return True
        res_id = client.table("products").delete().eq("company_id", cid).eq("id", target).execute()
        return bool(res_id.data)
    except Exception as err:
        logger.error("Erreur Supabase delete_product: %s", err)
        return None


def list_sales_db(company_id: str) -> list[dict[str, Any]] | None:
    client = get_supabase_client()
    if client is None:
        return None
    cid = _clean_uuid(company_id)
    try:
        res = client.table("sales").select("*").eq("company_id", cid).order("sold_at", desc=True).execute()
        sales = []
        for r in res.data or []:
            sales.append({
                "id": str(r.get("id")),
                "product_sku": str(r.get("product_sku") or "").upper(),
                "quantity": float(r.get("quantity") or 0.0),
                "unit_price": float(r.get("unit_price") or 0.0),
                "unit_cost": float(r.get("unit_cost") or 0.0),
                "sold_at": str(r.get("sold_at") or ""),
                "channel": r.get("channel") or "Boutique",
            })
        return sales
    except Exception as err:
        logger.error("Erreur Supabase list_sales: %s", err)
        return None


def add_sale_db(company_id: str, sale: dict[str, Any]) -> dict[str, Any] | None:
    client = get_supabase_client()
    if client is None:
        return None
    cid = _clean_uuid(company_id)
    try:
        payload = {
            "company_id": cid,
            "product_sku": str(sale.get("product_sku") or "").upper(),
            "quantity": float(sale.get("quantity") or 0.0),
            "unit_price": float(sale.get("unit_price") or 0.0),
            "unit_cost": float(sale.get("unit_cost") or 0.0),
            "sold_at": str(sale.get("sold_at") or ""),
            "channel": sale.get("channel") or "Boutique",
        }
        res = client.table("sales").insert(payload).execute()
        if res.data:
            r = res.data[0]
            return {
                "id": str(r.get("id")),
                "product_sku": str(r.get("product_sku")),
                "quantity": float(r.get("quantity") or 0.0),
                "unit_price": float(r.get("unit_price") or 0.0),
                "unit_cost": float(r.get("unit_cost") or 0.0),
                "sold_at": str(r.get("sold_at")),
                "channel": r.get("channel"),
            }
    except Exception as err:
        logger.error("Erreur Supabase add_sale: %s", err)
    return None


def delete_sale_db(company_id: str, sale_id: str) -> bool | None:
    client = get_supabase_client()
    if client is None:
        return None
    cid = _clean_uuid(company_id)
    try:
        res = client.table("sales").delete().eq("company_id", cid).eq("id", sale_id).execute()
        return bool(res.data)
    except Exception as err:
        logger.error("Erreur Supabase delete_sale: %s", err)
        return None
