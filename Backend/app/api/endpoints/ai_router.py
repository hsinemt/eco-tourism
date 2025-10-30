from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_query_agent import GeminiQueryAgent
from app.services.sparql_helpers import execute_select_query

router = APIRouter()

class AIQueryRequest(BaseModel):
    question: str

@router.post("/ai-query", summary="Recherche intelligente avec Gemini")
def ai_query(request: AIQueryRequest):
    """
    Question naturelle → Requête SPARQL → Exécution → Résultat JSON.
    """
    question = request.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="❌ La question est obligatoire.")

    # Étape 1 : Génération IA
    ai = GeminiQueryAgent()
    sparql_query = ai.generate_sparql(question)
    if not sparql_query:
        raise HTTPException(status_code=500, detail="Erreur lors de la génération SPARQL.")

    # Étape 2 : Exécution Fuseki
    try:
        result_json = execute_select_query(sparql_query)
        rows = result_json.get("results", {}).get("bindings", [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur SPARQL : {e}")

    # Étape 3 : Retour client
    return {
        "question": question,
        "sparql_query": sparql_query,
        "results": rows,
        "count": len(rows)
    }
