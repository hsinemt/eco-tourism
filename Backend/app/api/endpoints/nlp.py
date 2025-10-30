# app/api/endpoints/nlp.py - VERSION CORRIGÉE

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from app.services.nlp_query_processor import NLPQueryProcessor, AdvancedNLPProcessor
from app.services.ecotourism_client import EcotourismClient
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


class QuestionInput(BaseModel):
    question: str = Field(..., example="Trouvez-moi des activités faciles pour l'été")
    use_advanced_nlp: bool = Field(False, example=False)


@router.post("/query", summary="Requête en langage naturel")
def nlp_query(input_data: QuestionInput):
    """✅ CORRIGÉ - Convertit question naturelle en résultats SPARQL"""
    try:
        # 1. Traiter la question
        processor = AdvancedNLPProcessor() if input_data.use_advanced_nlp else NLPQueryProcessor()
        nlp_result = processor.process_question(input_data.question)

        # 2. Exécuter la requête SPARQL générée
        client = EcotourismClient()
        results = client.execute_query(nlp_result["sparql_query"])

        return {
            "question": input_data.question,
            "query_type": nlp_result["query_type"],
            "filters": nlp_result["filters"],
            "entities": nlp_result["entities"],
            "confidence": nlp_result["confidence"],
            "sparql_query": nlp_result["sparql_query"],  # Ajout pour debug
            "results": results,
            "count": len(results)
        }
    except Exception as e:
        logger.error(f"Erreur NLP: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analyze", summary="Analyser une question")
def analyze_question(question: str = Query(..., example="Quels hébergements écologiques?")):
    """Analyse la question SANS exécuter la requête"""
    try:
        processor = NLPQueryProcessor()
        analysis = processor.process_question(question)

        return {
            "question": question,
            "query_type": analysis["query_type"],
            "entities": analysis["entities"],
            "filters": analysis["filters"],
            "confidence": analysis["confidence"],
            "sparql_query": analysis["sparql_query"]  # Requête complète pour debug
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/examples", summary="Exemples de questions")
def get_examples():
    """Retourne des exemples de questions que le système comprend"""
    return {
        "activities": [
            "Trouvez-moi des activités faciles",
            "Quelles sont les randonnées disponibles?",
            "Montrez-moi les activités d'été",
            "Activités difficiles en automne",
            "Activités à moins de 100 euros"
        ],
        "accommodations": [
            "Quels hébergements écologiques avez-vous?",
            "Hébergements moins de 200 euros",
            "Où dormir à proximité?",
            "Gites certifiés écologiques"
        ],
        "seasons": [
            "Quelle est la meilleure saison?",
            "Quand visiter en été?",
            "Températures en hiver"
        ],
        "mixed": [
            "Recommandez-moi une activité facile pour l'été",
            "Je cherche un hébergement écologique avec activités",
            "Que faire en été avec un budget limité?"
        ]
    }
