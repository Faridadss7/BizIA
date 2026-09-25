from typing import Any
from fastapi import APIRouter, Depends, Header
from pydantic import BaseModel, Field

from app.schemas.common import LoginIn, RegisterIn
from app.services import auth as auth_service
from app.services import supabase_client
from app.utils.errors import ApiError

router = APIRouter()


class GoogleAuthIn(BaseModel):
    email: str = Field(min_length=3)
    first_name: str | None = None
    last_name: str | None = None


def _bearer(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise ApiError(401, "missing_token", "Jeton d'authentification manquant.")
    return authorization.removeprefix("Bearer ").strip()


def current_user(authorization: str | None = Header(default=None)) -> dict[str, str]:
    return auth_service.authenticate(_bearer(authorization))


def current_company(
    user: dict[str, Any] = Depends(current_user),
    x_company_id: str | None = Header(default=None, alias="X-Company-ID"),
) -> dict[str, Any]:
    """Dépendance FastAPI pour récupérer l'entreprise active avec isolation stricte et auto-guérison sur ID périmé."""
    user_id = str(user["id"])
    if x_company_id and x_company_id.strip():
        target_id = x_company_id.strip()
        comp = supabase_client.get_company(target_id, user_id)
        if comp:
            return comp
        # Si l'entreprise existe dans la base mais que l'utilisateur n'y a pas accès -> 403 strict
        if supabase_client.company_exists(target_id):
            raise ApiError(403, "company_access_denied", "Accès refusé à cette entreprise.")
        # Si l'ID n'existe nulle part (ancien ID localStorage périmé), repli sur la première entreprise de l'utilisateur

    companies = supabase_client.list_companies(user_id)
    if companies:
        return companies[0]

    # Auto-création d'une entreprise par défaut si aucune n'existe encore
    first_name = user.get("first_name", "") or ""
    last_name = user.get("last_name", "") or ""
    name = f"{first_name} {last_name}".strip()
    company_name = f"Entreprise {name}" if name else "Mon Entreprise"
    return supabase_client.create_company(
        user_id=user_id,
        name=company_name,
        category="Commerce Général",
        currency="FCFA",
    )


@router.post("/register", status_code=201)
def register(payload: RegisterIn) -> dict:
    return auth_service.register(
        payload.first_name, payload.last_name, payload.email, payload.password
    )


@router.post("/login")
def login(payload: LoginIn) -> dict:
    return auth_service.login(payload.email, payload.password)


@router.post("/google")
def google_auth(payload: GoogleAuthIn) -> dict:
    return auth_service.google_login(
        email=payload.email,
        first_name=payload.first_name or "",
        last_name=payload.last_name or "",
    )


@router.get("/me")
def me(authorization: str | None = Header(default=None)) -> dict:
    return {"user": current_user(authorization)}


@router.post("/logout", status_code=204)
def logout(authorization: str | None = Header(default=None)) -> None:
    auth_service.logout(_bearer(authorization))
