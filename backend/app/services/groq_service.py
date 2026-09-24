"""Service d'intégration Groq pour le traitement LLM (Llama 3.3) et la transcription audio (Whisper)."""

from __future__ import annotations

import json
import logging
from typing import Any

from app.utils.settings import settings

logger = logging.getLogger(__name__)


def groq_enabled() -> bool:
    return bool(settings.groq_api_key)


def generate_with_groq(prompt: str, system_prompt: str | None = None, json_mode: bool = False) -> str | None:
    """Génère du texte ou du JSON avec le modèle Groq configuré."""
    if not groq_enabled():
        return None

    try:
        import httpx

        headers = {
            "Authorization": f"Bearer {settings.groq_api_key}",
            "Content-Type": "application/json",
        }
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload: dict[str, Any] = {
            "model": settings.groq_model or "llama-3.3-70b-versatile",
            "messages": messages,
            "temperature": 0.2,
        }
        if json_mode:
            payload["response_format"] = {"type": "json_object"}

        with httpx.Client(timeout=5.0) as client:
            resp = client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=payload,
            )
            if resp.status_code != 200:
                logger.error("Groq API error (%s): %s", resp.status_code, resp.text)
                return None
            data = resp.json()
            return data["choices"][0]["message"]["content"]
    except Exception as exc:
        logger.exception("Échec de l'appel Groq: %s", exc)
        return None


def transcribe_audio_with_groq(audio_bytes: bytes, filename: str = "voice.webm") -> str | None:
    """Transcrit un fichier audio en texte via l'API Groq Whisper."""
    if not groq_enabled():
        return None

    try:
        import httpx

        headers = {
            "Authorization": f"Bearer {settings.groq_api_key}",
        }
        files = {
            "file": (filename, audio_bytes, "audio/webm"),
        }
        data = {
            "model": settings.groq_whisper_model or "whisper-large-v3-turbo",
            "language": "fr",
            "response_format": "json",
        }

        with httpx.Client(timeout=45.0) as client:
            resp = client.post(
                "https://api.groq.com/openai/v1/audio/transcriptions",
                headers=headers,
                files=files,
                data=data,
            )
            if resp.status_code != 200:
                logger.error("Groq Whisper API error (%s): %s", resp.status_code, resp.text)
                return None
            result = resp.json()
            return result.get("text", "").strip()
    except Exception as exc:
        logger.exception("Échec de la transcription audio Groq Whisper: %s", exc)
        return None
