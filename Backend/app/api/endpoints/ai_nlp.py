# app/api/endpoints/ai_nlp.py - VERSION CORRIGÉE

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.services.gemini_query_agent import GeminiQueryAgent
from app.services.ecotourism_client import EcotourismClient
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


class AIQueryInput(BaseModel):
    question: str = Field(
        ...,
        example="Quels hébergements écologiques avec piscine moins de 200€?",
        min_length=3,
        max_length=500
    )


@router.post("/ai-query", summary="Recherche intelligente avec Gemini")
def ai_query(input_data: AIQueryInput):
    """Utilise Gemini pour transformer une question en requête SPARQL."""

    question = input_data.question.strip()

    if not question:
        raise HTTPException(status_code=400, detail="❌ La question ne peut pas être vide")

    try:
        agent = GeminiQueryAgent()
    except ValueError as e:
        raise HTTPException(status_code=500,
                            detail="❌ Configuration Gemini incorrecte. Vérifiez GEMINI_API_KEY dans .env")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Erreur d'initialisation: {str(e)}")

    try:
        logger.info(f"Traitement de la question: {question}")
        sparql_query = agent.generate_sparql(question)

        if not sparql_query:
            raise HTTPException(status_code=500, detail="❌ Impossible de générer une requête SPARQL valide")

        client = EcotourismClient()
        results = client.execute_query(sparql_query)

        method = "fallback" if "# Fallback" in sparql_query else "gemini"

        return {
            "question": question,
            "sparql_query": sparql_query,
            "results": results,
            "count": len(results),
            "method": method,
            "status": "success"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=f"❌ Erreur: {str(e)}")


@router.get("/test", summary="Test de connexion Gemini")
def test_gemini():
    """Teste si l'API Gemini est correctement configurée."""
    try:
        agent = GeminiQueryAgent()
        return {
            "status": "success",
            "message": "✅ Gemini API configurée correctement",
            "model": "gemini-1.5-flash"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"❌ Erreur: {str(e)}"
        }
