from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime, timedelta
from enum import Enum
from app.services.sparql_helpers import sparql_select

router = APIRouter()


# ============================================
# MODÈLES PYDANTIC
# ============================================

class DayItinerary(BaseModel):
    """Modèle pour un jour d'itinéraire"""
    day: int
    date: str
    activities: List[Dict[str, Any]]
    accommodation: Dict[str, Any]
    eco_score: float
    total_price: float
    description: str


class ThreeDayItineraryResponse(BaseModel):
    """Modèle pour la réponse complète d'itinéraire"""
    status: str
    start_date: str
    end_date: str
    total_eco_score: float
    total_price: float
    days: List[DayItinerary]
    recommendations: Dict[str, Any]
    generation_date: str


class DifficultyLevel(str, Enum):
    """Niveaux de difficulté d'activité"""
    Easy = "Easy"
    Moderate = "Moderate"
    Difficult = "Difficult"
    Intermediate = "Intermediate"


# ============================================
# HELPERS
# ============================================

def _safe_get(obj: Dict[str, Any], key: str, default: Any = None) -> Any:
    try:
        if isinstance(obj, dict):
            return obj.get(key, default)
        return default
    except:
        return default


def _extract_value(value: Any) -> Any:
    if value is None:
        return None
    if isinstance(value, dict) and 'value' in value:
        return value['value']
    return value


def calculate_eco_score(price: float, rating: float, eco_certified: bool) -> float:
    """Calcule un score écologique (0-100) pour un hébergement"""
    score = 0

    # Prix (40 points)
    if price < 50:
        score += 40
    elif price < 100:
        score += 25
    elif price < 150:
        score += 15

    # Rating (30 points)
    if rating >= 4.5:
        score += 30
    elif rating >= 4.0:
        score += 20
    elif rating >= 3.5:
        score += 10

    # Certification (30 points)
    if eco_certified:
        score += 30

    return round(score, 1)


def calculate_activity_score(price: float, rating: float, duration: int) -> float:
    """Calcule un score écologique pour une activité"""
    score = 0

    # Prix (40 points)
    if price < 50:
        score += 40
    elif price < 100:
        score += 25
    elif price < 200:
        score += 15

    # Rating (40 points)
    if rating >= 4.5:
        score += 40
    elif rating >= 4.0:
        score += 25
    elif rating >= 3.5:
        score += 15

    # Durée (20 points)
    if duration >= 4:
        score += 20
    elif duration >= 2:
        score += 10

    return round(score, 1)


def select_accommodation(budget_per_night: Optional[float] = None) -> Dict[str, Any]:
    """Sélectionne le meilleur hébergement écologique avec tous les attributs"""
    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?accommodation ?accommodationId ?accommodationName ?pricePerNight 
               ?accommodationRating ?ecoCertified ?numberOfRooms ?maxGuests
               ?wifiAvailable ?parkingAvailable ?description
        WHERE {{
          ?accommodation eco:accommodationId ?accommodationId ;
                        eco:accommodationName ?accommodationName .
          OPTIONAL {{ ?accommodation eco:pricePerNight ?pricePerNight . }}
          OPTIONAL {{ ?accommodation eco:accommodationRating ?accommodationRating . }}
          OPTIONAL {{ ?accommodation eco:ecoCertified ?ecoCertified . }}
          OPTIONAL {{ ?accommodation eco:numberOfRooms ?numberOfRooms . }}
          OPTIONAL {{ ?accommodation eco:maxGuests ?maxGuests . }}
          OPTIONAL {{ ?accommodation eco:wifiAvailable ?wifiAvailable . }}
          OPTIONAL {{ ?accommodation eco:parkingAvailable ?parkingAvailable . }}
          OPTIONAL {{ ?accommodation eco:accommodationDescription ?description . }}
          {f'FILTER(?pricePerNight <= {budget_per_night})' if budget_per_night else ''}
        }}
        ORDER BY DESC(?accommodationRating)
        LIMIT 1
        """

        results = sparql_select(sparql)
        bindings = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        if bindings:
            b = bindings[0]
            price = float(_extract_value(_safe_get(b, 'pricePerNight')) or 100)
            rating = float(_extract_value(_safe_get(b, 'accommodationRating')) or 4.0)
            eco_certified = _extract_value(_safe_get(b, 'ecoCertified')) == 'true'

            return {
                "accommodationId": _extract_value(_safe_get(b, 'accommodationId')),
                "name": _extract_value(_safe_get(b, 'accommodationName')),
                "description": _extract_value(_safe_get(b, 'description')),
                "pricePerNight": price,
                "rating": rating,
                "ecoCertified": eco_certified,
                "numberOfRooms": int(_extract_value(_safe_get(b, 'numberOfRooms')) or 10),
                "maxGuests": int(_extract_value(_safe_get(b, 'maxGuests')) or 20),
                "wifiAvailable": _extract_value(_safe_get(b, 'wifiAvailable')) == 'true',
                "parkingAvailable": _extract_value(_safe_get(b, 'parkingAvailable')) == 'true',
                "uri": _extract_value(_safe_get(b, 'accommodation')),
                "eco_score": calculate_eco_score(price, rating, eco_certified)
            }

        # Fallback
        return {
            "accommodationId": "ECO-001",
            "name": "Eco Resort Default",
            "description": "Hébergement écologique par défaut",
            "pricePerNight": 100.0,
            "rating": 4.5,
            "ecoCertified": True,
            "numberOfRooms": 10,
            "maxGuests": 20,
            "wifiAvailable": True,
            "parkingAvailable": True,
            "uri": "eco:EcoResort",
            "eco_score": 90.0
        }
    except Exception as e:
        print(f"ERROR selecting accommodation: {str(e)}")
        return {
            "accommodationId": "ECO-001",
            "name": "Eco Resort Default",
            "description": "Hébergement écologique par défaut",
            "pricePerNight": 100.0,
            "rating": 4.5,
            "ecoCertified": True,
            "numberOfRooms": 10,
            "maxGuests": 20,
            "wifiAvailable": True,
            "parkingAvailable": True,
            "uri": "eco:EcoResort",
            "eco_score": 90.0
        }


def select_activities_for_day(
        day_index: int,
        difficulty: str,
        season: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Sélectionne des activités DIFFÉRENTES pour chaque jour avec tous les attributs"""
    try:
        # Construire le filtre de difficulté
        difficulty_filter = f'FILTER(CONTAINS(LCASE(?difficultyLevel), LCASE("{difficulty}")))' if difficulty else ''

        # Construire le filtre de saison
        season_filter = f'FILTER(CONTAINS(LCASE(?bestTimeToVisit), LCASE("{season}")))' if season else ''

        # CORRECTION: Utiliser DISTINCT et filtrer les types corrects uniquement
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT DISTINCT ?activity ?activityId ?activityName ?activityDescription 
               ?pricePerPerson ?activityRating ?difficultyLevel ?durationHours
               ?schedule ?activityLanguages ?activityType ?bestTimeToVisit
        WHERE {{
            {{
                ?activity a eco:AdventureActivity .
                BIND(eco:AdventureActivity AS ?activityType)
            }} UNION {{
                ?activity a eco:CulturalActivity .
                BIND(eco:CulturalActivity AS ?activityType)
            }} UNION {{
                ?activity a eco:NatureActivity .
                BIND(eco:NatureActivity AS ?activityType)
            }}

            ?activity eco:activityId ?activityId ;
                     eco:activityName ?activityName .
            OPTIONAL {{ ?activity eco:activityDescription ?activityDescription . }}
            OPTIONAL {{ ?activity eco:pricePerPerson ?pricePerPerson . }}
            OPTIONAL {{ ?activity eco:activityRating ?activityRating . }}
            OPTIONAL {{ ?activity eco:difficultyLevel ?difficultyLevel . }}
            OPTIONAL {{ ?activity eco:durationHours ?durationHours . }}
            OPTIONAL {{ ?activity eco:schedule ?schedule . }}
            OPTIONAL {{ ?activity eco:activityLanguages ?activityLanguages . }}
            OPTIONAL {{ ?activity eco:bestTimeToVisit ?bestTimeToVisit . }}
            {difficulty_filter}
            {season_filter}
        }}
        ORDER BY ?activityId
        LIMIT 50
        """

        results = sparql_select(sparql)
        bindings = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        print(f"DEBUG: Day {day_index} - Total activities found: {len(bindings)}")

        # IMPORTANT: Utiliser un ensemble pour éviter les doublons par activityId
        seen_ids = set()
        unique_bindings = []
        for b in bindings:
            activity_id = _extract_value(_safe_get(b, 'activityId'))
            if activity_id and activity_id not in seen_ids:
                seen_ids.add(activity_id)
                unique_bindings.append(b)

        print(f"DEBUG: Day {day_index} - Unique activities after dedup: {len(unique_bindings)}")

        # Sélectionner des activités différentes pour chaque jour
        start_idx = day_index * 3
        end_idx = start_idx + 3
        day_bindings = unique_bindings[start_idx:end_idx]

        print(f"DEBUG: Day {day_index} - Selected activities (indices {start_idx} to {end_idx}): {len(day_bindings)}")

        activities = []
        time_slots = {
            0: ["09:00 - 11:00", "11:30 - 13:30", "14:00 - 16:00"],  # Jour 1
            1: ["08:00 - 10:00", "10:30 - 12:30", "15:00 - 17:00"],  # Jour 2
            2: ["09:30 - 11:30", "13:00 - 15:00", "16:00 - 18:00"]  # Jour 3
        }

        for idx, b in enumerate(day_bindings):
            if not isinstance(b, dict):
                continue

            price = float(_extract_value(_safe_get(b, 'pricePerPerson')) or 50)
            rating = float(_extract_value(_safe_get(b, 'activityRating')) or 4.0)
            duration = int(_extract_value(_safe_get(b, 'durationHours')) or 2)

            activity_type = _extract_value(_safe_get(b, 'activityType'))
            if activity_type and '#' in str(activity_type):
                activity_type = str(activity_type).split('#')[-1]

            activity_data = {
                "activityId": _extract_value(_safe_get(b, 'activityId')),
                "name": _extract_value(_safe_get(b, 'activityName')),
                "description": _extract_value(_safe_get(b, 'activityDescription')),
                "pricePerPerson": price,
                "rating": rating,
                "difficultyLevel": _extract_value(_safe_get(b, 'difficultyLevel')),
                "durationHours": duration,
                "schedule": _extract_value(_safe_get(b, 'schedule')),
                "activityLanguages": _extract_value(_safe_get(b, 'activityLanguages')),
                "activityType": activity_type,
                "bestTimeToVisit": _extract_value(_safe_get(b, 'bestTimeToVisit')),
                "uri": _extract_value(_safe_get(b, 'activity')),
                "time_slot": time_slots.get(day_index, ["09:00 - 11:00"])[idx % 3],
                "eco_score": calculate_activity_score(price, rating, duration)
            }

            activities.append(activity_data)
            print(f"DEBUG: Day {day_index} - Added activity: {activity_data['activityId']} - {activity_data['name']}")

        return activities
    except Exception as e:
        print(f"ERROR selecting activities for day {day_index}: {str(e)}")
        import traceback
        traceback.print_exc()
        return []


# ============================================
# ENDPOINT PRINCIPAL
# ============================================

@router.post(
    "/generate-3day-itinerary",
    summary="Générer un itinéraire écologique de 3 jours",
    response_model=ThreeDayItineraryResponse
)
def generate_three_day_itinerary(
        start_date: str = Query("2025-01-20", description="Date de début (YYYY-MM-DD)"),
        difficulty: DifficultyLevel = Query(DifficultyLevel.Moderate, description="Niveau de difficulté"),
        budget_per_night: Optional[float] = Query(None, description="Budget max par nuit"),
        preferred_season: Optional[str] = Query(None, description="Saison préférée")
):
    """
    Génère un itinéraire écologique personnalisé de 3 jours avec:
    - Activités DIFFÉRENTES pour chaque jour
    - Hébergement écologique avec tous les attributs
    - Score écologique calculé
    - Prix total du séjour
    """
    try:
        # Parse date
        try:
            start = datetime.strptime(start_date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(status_code=400, detail="Format date invalide: YYYY-MM-DD")

        # Sélection hébergement
        accommodation = select_accommodation(budget_per_night)

        # Génération des 3 jours
        days = []
        total_eco_score = 0
        total_price = 0

        for day_index in range(3):
            current_date = start + timedelta(days=day_index)

            # Activités DIFFÉRENTES pour ce jour
            activities = select_activities_for_day(
                day_index=day_index,
                difficulty=difficulty.value,
                season=preferred_season
            )

            # Calculs
            day_activity_price = sum(a.get('pricePerPerson', 0) for a in activities)
            day_accommodation_price = accommodation['pricePerNight']
            day_total_price = day_activity_price + day_accommodation_price

            day_eco_scores = [a.get('eco_score', 0) for a in activities] + [accommodation['eco_score']]
            day_eco_score = sum(day_eco_scores) / len(day_eco_scores) if day_eco_scores else 0

            descriptions = {
                0: "🌍 Jour 1: Découverte - Activités d'introduction à l'écotourisme",
                1: "🌿 Jour 2: Immersion - Exploration approfondie de la nature locale",
                2: "🏡 Jour 3: Connexion - Activités culturelles et retour aux sources"
            }

            day_itinerary = {
                "day": day_index + 1,
                "date": current_date.strftime("%Y-%m-%d"),
                "activities": activities,
                "accommodation": accommodation,
                "eco_score": round(day_eco_score, 1),
                "total_price": round(day_total_price, 2),
                "description": descriptions.get(day_index, "Jour d'exploration")
            }

            days.append(day_itinerary)
            total_eco_score += day_eco_score
            total_price += day_total_price

        # Résultats finaux
        final_eco_score = round(total_eco_score / 3, 1)

        recommendations = {
            "overall_eco_score": final_eco_score,
            "total_budget": round(total_price, 2),
            "certification_status": "✅ Hébergement certifié" if accommodation['ecoCertified'] else "⚠️ À certifier",
            "best_day": max(days, key=lambda x: x["eco_score"])["day"] if days else 1,
            "tips": [
                "🚴 Privilégiez les transports écologiques",
                "💧 Économisez l'eau",
                "🌱 Respectez la biodiversité locale",
                "♻️ Réduisez vos déchets",
                "🤝 Soutenez les artisans locaux"
            ],
            "activities_per_day": sum(len(d["activities"]) for d in days) / 3
        }

        end_date = (start + timedelta(days=2)).strftime("%Y-%m-%d")

        return {
            "status": "success",
            "start_date": start_date,
            "end_date": end_date,
            "total_eco_score": final_eco_score,
            "total_price": round(total_price, 2),
            "days": days,
            "recommendations": recommendations,
            "generation_date": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")


# ============================================
# ENDPOINTS SUPPLÉMENTAIRES
# ============================================


