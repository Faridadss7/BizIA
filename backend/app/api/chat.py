from fastapi import APIRouter, Depends, File, Form, UploadFile
from pydantic import BaseModel, Field

from app.api.auth import current_company
from app.services.ai_actions import execute_ai_intent_and_crud
from app.services.gemini import transcribe_audio_with_gemini
from app.services.groq_service import transcribe_audio_with_groq
from app.services.store import get_company_store

router = APIRouter()


import json

class ChatMessage(BaseModel):
    message: str = Field(min_length=1)
    history: list[dict[str, str]] | None = None


@router.post("/messages")
def chat_message(payload: ChatMessage, company: dict = Depends(current_company)) -> dict:
    store = get_company_store(company["id"])
    analysis = store.get_last_analysis()
    
    result = execute_ai_intent_and_crud(
        message=payload.message,
        company_id=company["id"],
        analysis=analysis,
        history=payload.history,
    )
    
    return {
        "reply": result["reply"],
        "grounded": result.get("grounded", True),
        "actions_taken": result.get("actions_taken", []),
        "database_updated": result.get("database_updated", False),
        "user_message": payload.message,
    }


@router.post("/voice")
async def chat_voice(
    audio_file: UploadFile | None = File(default=None),
    transcript: str | None = Form(default=None),
    history: str | None = Form(default=None),
    company: dict = Depends(current_company),
) -> dict:
    """Traite un message vocal soit via son audio brut (Whisper/Groq ou Gemini Multimodal), soit via transcription directe (Web Speech API)."""
    recognized_text = (transcript or "").strip()

    if not recognized_text and audio_file:
        audio_bytes = await audio_file.read()
        if audio_bytes:
            # 1. Essai Groq Whisper si configuré
            groq_trans = transcribe_audio_with_groq(audio_bytes, audio_file.filename or "voice.webm")
            if groq_trans and groq_trans.strip():
                recognized_text = groq_trans.strip()
            
            # 2. Repli Gemini Multimodal si Groq n'a pas répondu ou n'est pas activé
            if not recognized_text:
                gemini_trans = transcribe_audio_with_gemini(
                    audio_bytes, audio_file.content_type or "audio/webm"
                )
                if gemini_trans and gemini_trans.strip():
                    recognized_text = gemini_trans.strip()

    if not recognized_text or recognized_text == "Message vocal non reconnu ou vide.":
        return {
            "transcript": "",
            "reply": "Bonjour ! Comment allez-vous ? Je n'ai pas bien perçu votre message vocal. Que puis-je faire pour vous aujourd'hui : enregistrer un produit, saisir une vente ou analyser vos données ?",
            "grounded": True,
            "actions_taken": [],
            "database_updated": False,
        }

    store = get_company_store(company["id"])
    analysis = store.get_last_analysis()

    parsed_history = None
    if history:
        try:
            parsed_history = json.loads(history)
        except Exception:
            parsed_history = None

    result = execute_ai_intent_and_crud(
        message=recognized_text,
        company_id=company["id"],
        analysis=analysis,
        history=parsed_history,
    )

    return {
        "transcript": recognized_text,
        "reply": result["reply"],
        "grounded": result.get("grounded", True),
        "actions_taken": result.get("actions_taken", []),
        "database_updated": result.get("database_updated", False),
    }


class TableGenerationRequest(BaseModel):
    prompt: str = Field(min_length=1)
    template: str = Field(default="products")


@router.post("/generate-table")
def generate_table_endpoint(payload: TableGenerationRequest, company: dict = Depends(current_company)) -> dict:
    from app.services.gemini import generate_table_with_gemini
    result = generate_table_with_gemini(payload.prompt, payload.template)
    return result
