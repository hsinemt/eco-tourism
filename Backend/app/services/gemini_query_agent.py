# app/services/gemini_query_agent.py - VERSION CORRIGÉE AVEC GESTION D'ERREURS

import logging
import re
import os
import sys
import unicodedata
from typing import Optional, Dict, List
import google.generativeai as genai

_project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

from app.config import settings

logger = logging.getLogger(__name__)


class GeminiQueryAgent:
    """IA Gemini → convertit une question en requête SPARQL pour toutes les entités."""

    VALID_VALUES: Dict[str, List[str]] = {
        "difficultyLevel": ["Easy", "Moderate", "Difficult", "Intermediate"],
        "season": ["Spring", "Summer", "Autumn", "Winter"],
        "activityType": ["AdventureActivity", "CulturalActivity", "NatureActivity"],
        "accommodationType": ["EcoLodge", "GuestHouse", "Hotel"],
        "transportType": ["Bike", "ElectricVehicle", "PublicTransport"]
    }

    def __init__(self):
        api_key = settings.GEMINI_API_KEY
        if not api_key or api_key.strip() in ("", "VOTRE_CLE_API_ICI"):
            raise ValueError("❌ GEMINI_API_KEY absente ou invalide dans .env")

        try:
            genai.configure(api_key=api_key)
            # Utiliser gemini-1.5-flash (plus stable que 2.0-flash-exp)
            self.model = genai.GenerativeModel("gemini-1.5-flash")
            logger.info("✅ Modèle Gemini Flash 1.5 initialisé")
        except Exception as e:
            logger.error(f"❌ Erreur d'initialisation Gemini: {e}")
            raise

    def generate_sparql(self, question: str, ontology_uri: str = None, max_retries: int = 3) -> Optional[str]:
        """Transforme une question en requête SPARQL valide avec retry."""

        if ontology_uri is None:
            ontology_uri = settings.ONTOLOGY_NAMESPACE

        # Tentatives avec retry
        for attempt in range(max_retries):
            try:
                sparql = self._attempt_generation(question, ontology_uri)
                if sparql:
                    return sparql

                logger.warning(f"Tentative {attempt + 1}/{max_retries} échouée")

            except Exception as e:
                logger.error(f"Erreur tentative {attempt + 1}: {e}")

                # Si erreur 500 ou timeout, attendre avant retry
                if "500" in str(e) or "timeout" in str(e).lower():
                    import time
                    time.sleep(2 ** attempt)  # Backoff exponentiel: 1s, 2s, 4s
                    continue
                break

        # Si toutes les tentatives échouent, utiliser le fallback
        logger.warning("Toutes les tentatives Gemini ont échoué, utilisation de la requête par défaut")
        return self._generate_fallback_query(question, ontology_uri)

    def _attempt_generation(self, question: str, ontology_uri: str) -> Optional[str]:
        """Tente de générer une requête SPARQL."""

        prompt = f"""Tu es un assistant SPARQL expert en tourisme écologique.
L'ontologie principale utilise le namespace : <{ontology_uri}>

ENTITÉS ET ATTRIBUTS DISPONIBLES :

1. **Activities** (Types: AdventureActivity, CulturalActivity, NatureActivity)
   Attributs: activityName, activityDescription, difficultyLevel, pricePerPerson,
   durationHours, activityRating, bestTimeToVisit, maxParticipants, minAge

2. **Accommodations** (Types: EcoLodge, GuestHouse, Hotel)
   Attributs: accommodationName, accommodationDescription, pricePerNight, 
   accommodationRating, numberOfRooms, maxGuests, ecoCertified, wifiAvailable,
   parkingAvailable, hasSwimmingPool, hasSpa, hasRestaurant

3. **Transport** (Types: Bike, ElectricVehicle, PublicTransport)
   Attributs: transportName, transportType, pricePerKm, carbonEmissionPerKm,
   capacity, availability, averageSpeed, operatingHours

4. **Seasons**: seasonName, startDate, endDate, averageTemperature, peakTourismSeason

5. **Sustainability** (Types: CarbonFootprint, RenewableEnergyUsage, WaterConsumption)
   Attributs: indicatorName, indicatorValue, measurementUnit, targetValue

6. **LocalProduct**: productName, productPrice, productCategory, isOrganic, 
   isHandmade, producerName, fairTradeCertified

RÈGLES STRICTES :
1. Utiliser UNIQUEMENT les attributs listés ci-dessus
2. Toujours inclure les préfixes PREFIX eco: et PREFIX rdf:
3. Utiliser OPTIONAL pour les attributs non obligatoires
4. Ajouter FILTER pour les conditions (prix, rating, etc.)
5. Limiter les résultats avec LIMIT 20
6. Valeurs pour difficultyLevel: Easy, Moderate, Difficult
7. Valeurs pour season: Spring, Summer, Autumn, Winter

FORMAT DE SORTIE :
PREFIX eco: <{ontology_uri}>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?var1 ?var2 ?var3
WHERE {{
    ?entity a eco:EntityType .
    ?entity eco:property ?var1 .
    OPTIONAL {{ ?entity eco:optionalProperty ?var2 }}
    FILTER(?condition)
}}
ORDER BY ?var
LIMIT 20

Question utilisateur : "{question}"

Génère UNIQUEMENT la requête SPARQL, sans explication ni texte additionnel.
"""

        try:
            generation_config = {
                "temperature": 0.1,
                "top_p": 0.8,
                "top_k": 20,
                "max_output_tokens": 2048,
            }

            result = self.model.generate_content(
                prompt,
                generation_config=generation_config,
                safety_settings={
                    "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_NONE",
                    "HARM_CATEGORY_HATE_SPEECH": "BLOCK_NONE",
                    "HARM_CATEGORY_HARASSMENT": "BLOCK_NONE",
                    "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_NONE"
                }
            )

            if not hasattr(result, "text") or not result.text:
                logger.error("Réponse Gemini vide")
                return None

            sparql = self._clean_sparql_query(result.text.strip())

            if not sparql.upper().startswith("PREFIX"):
                prefixes = (
                    f"PREFIX eco: <{ontology_uri}>\n"
                    "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n\n"
                )
                sparql = prefixes + sparql

            if not self._validate_sparql_query(sparql):
                return None

            logger.info(f"✅ Requête SPARQL générée avec succès")
            return sparql

        except Exception as e:
            logger.error(f"Erreur lors de la génération Gemini: {type(e).__name__}: {e}")
            raise

    def _clean_sparql_query(self, query: str) -> str:
        """Nettoie et normalise une requête SPARQL."""
        query = unicodedata.normalize('NFC', query)
        query = re.sub(r"``````", r"\1", query, flags=re.DOTALL)
        query = re.sub(r'["''"]', '"', query)
        return query.strip()

    def _validate_sparql_query(self, query: str) -> bool:
        """Valide une requête SPARQL."""
        if not query:
            return False

        query_upper = query.upper()

        if not (query_upper.startswith("PREFIX") or query_upper.startswith("SELECT")):
            logger.error("Requête doit commencer par PREFIX ou SELECT")
            return False

        if "WHERE" not in query_upper:
            logger.error("Clause WHERE manquante")
            return False

        if query.count("{") != query.count("}"):
            logger.error("Accolades non équilibrées")
            return False

        return True

    def _generate_fallback_query(self, question: str, ontology_uri: str) -> str:
        """Génère une requête SPARQL de secours basée sur des mots-clés."""

        question_lower = question.lower()

        if any(word in question_lower for word in ["hébergement", "hotel", "lodge", "dormir", "accommodation"]):
            return self._fallback_accommodations_query(ontology_uri, question_lower)
        elif any(word in question_lower for word in ["activité", "activity", "randonnée", "faire", "visite"]):
            return self._fallback_activities_query(ontology_uri, question_lower)
        elif any(word in question_lower for word in ["transport", "vélo", "bike", "voiture", "bus"]):
            return self._fallback_transport_query(ontology_uri)
        elif any(word in question_lower for word in ["produit", "product", "local", "artisan"]):
            return self._fallback_products_query(ontology_uri)

        return self._fallback_activities_query(ontology_uri, question_lower)

    def _fallback_accommodations_query(self, ontology_uri: str, question: str) -> str:
        """Requête de secours pour hébergements."""
        filters = []

        if "piscine" in question or "pool" in question:
            filters.append('?hasSwimmingPool = "true"^^<http://www.w3.org/2001/XMLSchema#boolean>')

        if "écologique" in question or "eco" in question:
            filters.append('?ecoCertified = "true"^^<http://www.w3.org/2001/XMLSchema#boolean>')

        price_match = re.search(r'(\d+)\s*€', question)
        if price_match:
            max_price = int(price_match.group(1))
            filters.append(f'?pricePerNight <= {max_price}')

        filter_clause = f"FILTER({' && '.join(filters)})" if filters else ""

        return f"""PREFIX eco: <{ontology_uri}>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT DISTINCT ?accommodation ?accommodationName ?accommodationDescription
                ?pricePerNight ?accommodationRating ?ecoCertified 
                ?hasSwimmingPool ?hasSpa ?maxGuests
WHERE {{
    {{
        ?accommodation a eco:EcoLodge .
    }} UNION {{
        ?accommodation a eco:GuestHouse .
    }} UNION {{
        ?accommodation a eco:Hotel .
    }}

    ?accommodation eco:accommodationName ?accommodationName .

    OPTIONAL {{ ?accommodation eco:accommodationDescription ?accommodationDescription }}
    OPTIONAL {{ ?accommodation eco:pricePerNight ?pricePerNight }}
    OPTIONAL {{ ?accommodation eco:accommodationRating ?accommodationRating }}
    OPTIONAL {{ ?accommodation eco:ecoCertified ?ecoCertified }}
    OPTIONAL {{ ?accommodation eco:hasSwimmingPool ?hasSwimmingPool }}
    OPTIONAL {{ ?accommodation eco:hasSpa ?hasSpa }}
    OPTIONAL {{ ?accommodation eco:maxGuests ?maxGuests }}

    {filter_clause}
}}
ORDER BY ?pricePerNight
LIMIT 20
"""

    def _fallback_activities_query(self, ontology_uri: str, question: str) -> str:
        """Requête de secours pour activités."""
        filters = []

        if "facile" in question or "easy" in question:
            filters.append('CONTAINS(LCASE(?difficultyLevel), "easy")')
        elif "difficile" in question or "difficult" in question:
            filters.append('CONTAINS(LCASE(?difficultyLevel), "difficult")')

        filter_clause = f"FILTER({' && '.join(filters)})" if filters else ""

        return f"""PREFIX eco: <{ontology_uri}>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT DISTINCT ?activity ?activityName ?activityDescription 
                ?difficultyLevel ?pricePerPerson ?activityRating
WHERE {{
    {{
        ?activity a eco:AdventureActivity .
    }} UNION {{
        ?activity a eco:CulturalActivity .
    }} UNION {{
        ?activity a eco:NatureActivity .
    }}

    ?activity eco:activityName ?activityName .

    OPTIONAL {{ ?activity eco:activityDescription ?activityDescription }}
    OPTIONAL {{ ?activity eco:difficultyLevel ?difficultyLevel }}
    OPTIONAL {{ ?activity eco:pricePerPerson ?pricePerPerson }}
    OPTIONAL {{ ?activity eco:activityRating ?activityRating }}

    {filter_clause}
}}
ORDER BY DESC(?activityRating)
LIMIT 20
"""

    def _fallback_transport_query(self, ontology_uri: str) -> str:
        """Requête de secours pour transports."""
        return f"""PREFIX eco: <{ontology_uri}>

SELECT DISTINCT ?transport ?transportName ?transportType 
                ?carbonEmissionPerKm ?pricePerKm
WHERE {{
    {{
        ?transport a eco:Bike .
    }} UNION {{
        ?transport a eco:ElectricVehicle .
    }} UNION {{
        ?transport a eco:PublicTransport .
    }}

    ?transport eco:transportName ?transportName .

    OPTIONAL {{ ?transport eco:transportType ?transportType }}
    OPTIONAL {{ ?transport eco:carbonEmissionPerKm ?carbonEmissionPerKm }}
    OPTIONAL {{ ?transport eco:pricePerKm ?pricePerKm }}
}}
ORDER BY ?carbonEmissionPerKm
LIMIT 20
"""

    def _fallback_products_query(self, ontology_uri: str) -> str:
        """Requête de secours pour produits locaux."""
        return f"""PREFIX eco: <{ontology_uri}>

SELECT DISTINCT ?product ?productName ?productPrice 
                ?productCategory ?isOrganic ?isHandmade
WHERE {{
    ?product a eco:LocalProduct ;
             eco:productName ?productName ;
             eco:productPrice ?productPrice .

    OPTIONAL {{ ?product eco:productCategory ?productCategory }}
    OPTIONAL {{ ?product eco:isOrganic ?isOrganic }}
    OPTIONAL {{ ?product eco:isHandmade ?isHandmade }}
}}
ORDER BY ?productPrice
LIMIT 20
"""
