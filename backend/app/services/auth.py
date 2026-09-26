import base64
import hashlib
import hmac
import json
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from pwdlib import PasswordHash

from app.services.store import get_store
from app.utils.errors import ApiError
from app.utils.settings import settings

password_hash = PasswordHash.recommended()
SESSION_TTL = timedelta(days=30)


def _public_user(user: dict[str, Any]) -> dict[str, str]:
    return {
        "id": str(user["id"]),
        "first_name": str(user.get("first_name", "")),
        "last_name": str(user.get("last_name", "")),
        "email": str(user["email"]),
    }


def _token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _sign(payload_b64: str) -> str:
    key = settings.secret_key.encode("utf-8")
    return hmac.new(key, payload_b64.encode("utf-8"), hashlib.sha256).hexdigest()


def _new_session(user: dict[str, Any]) -> dict[str, Any]:
    expires_at = datetime.now(timezone.utc) + SESSION_TTL
    payload_obj = {
        "id": str(user["id"]),
        "email": str(user["email"]),
        "first_name": str(user.get("first_name", "")),
        "last_name": str(user.get("last_name", "")),
        "exp": int(expires_at.timestamp()),
        "salt": secrets.token_hex(8),
    }
    payload_bytes = json.dumps(payload_obj, separators=(",", ":")).encode("utf-8")
    payload_b64 = base64.urlsafe_b64encode(payload_bytes).decode("utf-8").rstrip("=")
    sig = _sign(payload_b64)
    token = f"biz_{payload_b64}.{sig}"

    # Sauvegarde locale pour compatibilité
    try:
        get_store().save_session(
            {
                "user_id": user["id"],
                "token_hash": _token_hash(token),
                "expires_at": expires_at.isoformat(),
            }
        )
    except Exception:
        pass

    return {"user": _public_user(user), "token": token, "expires_at": expires_at.isoformat()}


def register(first_name: str, last_name: str, email: str, password: str) -> dict[str, Any]:
    normalized_email = email.strip().lower()
    store = get_store()
    if store.find_user_by_email(normalized_email):
        raise ApiError(409, "email_already_used", "Cette adresse e-mail est déjà utilisée.")
    user = store.add_user(
        {
            "id": str(uuid.uuid4()),
            "first_name": first_name.strip(),
            "last_name": last_name.strip(),
            "email": normalized_email,
            "password_hash": password_hash.hash(password),
        }
    )
    store.ensure_default_company(user["id"], f"Entreprise {first_name} {last_name}".strip())
    return _new_session(user)


def login(email: str, password: str) -> dict[str, Any]:
    store = get_store()
    normalized = email.strip().lower()
    user = store.find_user_by_email(normalized)
    stored_hash = str(user.get("password_hash") or "") if user else ""
    if not user or not stored_hash or not password_hash.verify(password, stored_hash):
        raise ApiError(401, "invalid_credentials", "E-mail ou mot de passe incorrect.")
    return _new_session(user)


def google_login(email: str, first_name: str = "", last_name: str = "") -> dict[str, Any]:
    store = get_store()
    normalized = email.strip().lower()
    user = store.find_user_by_email(normalized)
    if not user:
        f_name = first_name.strip() or normalized.split("@")[0].capitalize()
        l_name = last_name.strip() or "Google"
        user = store.add_user(
            {
                "id": str(uuid.uuid4()),
                "first_name": f_name,
                "last_name": l_name,
                "email": normalized,
                "password_hash": password_hash.hash(secrets.token_urlsafe(32)),
            }
        )
        comp_name = f"Entreprise {f_name} {l_name}".strip()
        store.ensure_default_company(user["id"], comp_name)
    return _new_session(user)


_revoked_hashes: set[str] = set()


def authenticate(token: str) -> dict[str, str]:
    if not token or not isinstance(token, str):
        raise ApiError(401, "invalid_token", "Session invalide ou expirée.")

    clean_token = token.strip()
    th = _token_hash(clean_token)
    if th in _revoked_hashes:
        raise ApiError(401, "invalid_token", "Session invalidée.")

    # 1. Vérification par jeton cryptographique signé stateless
    if clean_token.startswith("biz_") and "." in clean_token:
        try:
            parts = clean_token.removeprefix("biz_").split(".", 1)
            payload_b64, sig = parts[0], parts[1]
            if hmac.compare_digest(_sign(payload_b64), sig):
                # Ajouter le padding Base64 manquant
                padded = payload_b64 + "=" * (-len(payload_b64) % 4)
                data = json.loads(base64.urlsafe_b64decode(padded.encode("utf-8")).decode("utf-8"))
                exp = int(data.get("exp", 0))
                if exp > int(datetime.now(timezone.utc).timestamp()):
                    # Garantir que l'utilisateur existe dans le store local actif
                    user_id = str(data["id"])
                    store = get_store()
                    if not store.find_user_by_id(user_id):
                        store.add_user({
                            "id": user_id,
                            "email": data["email"],
                            "first_name": data.get("first_name", ""),
                            "last_name": data.get("last_name", ""),
                        })
                        store.ensure_default_company(user_id, f"Entreprise {data.get('first_name', '')} {data.get('last_name', '')}".strip())
                    return {
                        "id": user_id,
                        "email": data["email"],
                        "first_name": data.get("first_name", ""),
                        "last_name": data.get("last_name", ""),
                    }
        except Exception:
            pass

    # 2. Repli sur le store de session classique
    store = get_store()
    session = store.find_session(th)
    if not session:
        raise ApiError(401, "invalid_token", "Session invalide ou expirée.")
    expires_at = datetime.fromisoformat(str(session["expires_at"]))
    if expires_at <= datetime.now(timezone.utc):
        store.revoke_session(th)
        raise ApiError(401, "invalid_token", "Session invalide ou expirée.")
    user = store.find_user_by_id(str(session.get("user_id") or ""))
    if not user:
        raise ApiError(401, "invalid_token", "Utilisateur introuvable.")
    return _public_user(user)


def logout(token: str) -> None:
    th = _token_hash(token)
    _revoked_hashes.add(th)
    try:
        get_store().revoke_session(th)
    except Exception:
        pass
