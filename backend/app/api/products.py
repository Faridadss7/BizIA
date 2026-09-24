from fastapi import APIRouter, Depends

from app.api.auth import current_company
from app.schemas.common import ProductIn
from app.services.store import get_company_store

router = APIRouter()


@router.get("")
def list_products(company: dict = Depends(current_company)) -> dict:
    return {"items": get_company_store(company["id"]).list_products()}


@router.post("", status_code=201)
def create_product(payload: ProductIn, company: dict = Depends(current_company)) -> dict:
    item = get_company_store(company["id"]).add_product(payload.model_dump())
    return {"item": item}


@router.delete("/{sku_or_id}")
def delete_product(sku_or_id: str, company: dict = Depends(current_company)) -> dict:
    deleted = get_company_store(company["id"]).delete_product(sku_or_id)
    return {"deleted": deleted, "sku_or_id": sku_or_id}

