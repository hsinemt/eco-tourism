from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_query_agent import GeminiQueryAgent

router = APIRouter()

class AIDebugRequest(BaseModel):
    question: str

@router.post("/debug", summary="Mode debug Gemini (affiche SPARQL brut)")
def ai_debug(request: AIDebugRequest):
    """
    Endpoint de débogage : renvoie directement la requête SPARQL générée par Gemini
    sans exécution sur Fuseki.
    """
    question = request.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="La question ne peut pas être vide")

    gemini = GeminiQueryAgent()
    sparql_query = gemini.generate_sparql(question)

    if not sparql_query:
        raise HTTPException(status_code=500, detail="Erreur lors de la génération SPARQL.")

    return {
        "question": question,
        "sparql_query": sparql_query
    }
