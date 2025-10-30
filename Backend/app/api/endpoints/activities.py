from fastapi import APIRouter, Query, HTTPException, Body
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
import re
from app.services.advanced_recommender import EnhancedEcoRecommender
from app.services.activity_comparateur import ActivityComparator
from app.services.sparql_helpers import sparql_insert, sparql_update, sparql_delete, sparql_select

router = APIRouter()


# ============================================
# MODÈLES PYDANTIC
# ============================================

class ActivityResponse(BaseModel):
    activityId: str
    activityName: str
    activityDescription: Optional[str]
    durationHours: Optional[int]
    pricePerPerson: Optional[float]
    difficultyLevel: Optional[str]
    maxParticipants: Optional[int]
    minAge: Optional[int]
    activityRating: Optional[float]
    schedule: Optional[str]
    activityLanguages: Optional[str]
    activityType: str  # AdventureActivity, CulturalActivity, NatureActivity
    # Adventure-specific
    riskLevel: Optional[int]
    requiredEquipment: Optional[str]
    physicalFitnessRequired: Optional[str]
    safetyBriefingRequired: Optional[bool]
    # Cultural-specific
    culturalTheme: Optional[str]
    historicalPeriod: Optional[str]
    audioGuideAvailable: Optional[bool]
    photographyAllowed: Optional[bool]
    # Nature-specific
    ecosystemType: Optional[str]
    wildlifeSpotting: Optional[str]
    bestTimeToVisit: Optional[str]
    binocularsProvided: Optional[bool]
    uri: str


class ActivityCreateRequest(BaseModel):
    # OBLIGATOIRES pour tous les types
    type: str  # AdventureActivity, CulturalActivity, NatureActivity
    activityId: str
    activityName: str

    # OPTIONNELS communs
    activityDescription: Optional[str] = None
    durationHours: Optional[int] = None
    pricePerPerson: Optional[float] = None
    difficultyLevel: Optional[str] = None
    maxParticipants: Optional[int] = None
    minAge: Optional[int] = None
    activityRating: Optional[float] = None
    schedule: Optional[str] = None
    activityLanguages: Optional[str] = None

    # OPTIONNELS - Adventure-specific
    riskLevel: Optional[int] = None
    requiredEquipment: Optional[str] = None
    physicalFitnessRequired: Optional[str] = None
    safetyBriefingRequired: Optional[bool] = None

    # OPTIONNELS - Cultural-specific
    culturalTheme: Optional[str] = None
    historicalPeriod: Optional[str] = None
    audioGuideAvailable: Optional[bool] = None
    photographyAllowed: Optional[bool] = None

    # OPTIONNELS - Nature-specific
    ecosystemType: Optional[str] = None
    wildlifeSpotting: Optional[str] = None
    bestTimeToVisit: Optional[str] = None
    binocularsProvided: Optional[bool] = None


class ActivityUpdateRequest(BaseModel):
    activityName: Optional[str] = None
    activityDescription: Optional[str] = None
    durationHours: Optional[int] = None
    pricePerPerson: Optional[float] = None
    difficultyLevel: Optional[str] = None
    maxParticipants: Optional[int] = None
    minAge: Optional[int] = None
    activityRating: Optional[float] = None
    schedule: Optional[str] = None
    activityLanguages: Optional[str] = None
    # Adventure-specific
    riskLevel: Optional[int] = None
    requiredEquipment: Optional[str] = None
    physicalFitnessRequired: Optional[str] = None
    safetyBriefingRequired: Optional[bool] = None
    # Cultural-specific
    culturalTheme: Optional[str] = None
    historicalPeriod: Optional[str] = None
    audioGuideAvailable: Optional[bool] = None
    photographyAllowed: Optional[bool] = None
    # Nature-specific
    ecosystemType: Optional[str] = None
    wildlifeSpotting: Optional[str] = None
    bestTimeToVisit: Optional[str] = None
    binocularsProvided: Optional[bool] = None


class ActivityComparisonResponse(BaseModel):
    name: str
    uri: str
    pricePerPerson: float
    difficulty: str
    duration: int
    rating: float
    eco_score: float


class ActivityNamesModel(BaseModel):
    activity_names: List[str]


# ============================================
# HELPERS
# ============================================

def _safe_get(obj: Dict[str, Any], key: str, default=None):
    try:
        if isinstance(obj, dict):
            return obj.get(key, default)
        return default
    except:
        return default


def _extract_value(val):
    if val is None:
        return None
    if isinstance(val, dict) and 'value' in val:
        return val['value']
    return val


def _parse_activity(bind):
    """Parse un binding SPARQL en activité complète"""
    return {
        "activityId": _extract_value(_safe_get(bind, 'activityId')),
        "activityName": _extract_value(_safe_get(bind, 'activityName')),
        "activityDescription": _extract_value(_safe_get(bind, 'activityDescription')),
        "durationHours": int(_extract_value(_safe_get(bind, 'durationHours')) or 0) if _safe_get(bind,
                                                                                                 'durationHours') else None,
        "pricePerPerson": float(_extract_value(_safe_get(bind, 'pricePerPerson')) or 0) if _safe_get(bind,
                                                                                                     'pricePerPerson') else None,
        "difficultyLevel": _extract_value(_safe_get(bind, 'difficultyLevel')),
        "maxParticipants": int(_extract_value(_safe_get(bind, 'maxParticipants')) or 0) if _safe_get(bind,
                                                                                                     'maxParticipants') else None,
        "minAge": int(_extract_value(_safe_get(bind, 'minAge')) or 0) if _safe_get(bind, 'minAge') else None,
        "activityRating": float(_extract_value(_safe_get(bind, 'activityRating')) or 0) if _safe_get(bind,
                                                                                                     'activityRating') else None,
        "schedule": _extract_value(_safe_get(bind, 'schedule')),
        "activityLanguages": _extract_value(_safe_get(bind, 'activityLanguages')),
        "activityType": _extract_value(_safe_get(bind, 'activityType', 'Unknown')),
        # Adventure fields
        "riskLevel": int(_extract_value(_safe_get(bind, 'riskLevel')) or 0) if _safe_get(bind, 'riskLevel') else None,
        "requiredEquipment": _extract_value(_safe_get(bind, 'requiredEquipment')),
        "physicalFitnessRequired": _extract_value(_safe_get(bind, 'physicalFitnessRequired')),
        "safetyBriefingRequired": (_extract_value(_safe_get(bind, 'safetyBriefingRequired')) == 'true') if _safe_get(
            bind, 'safetyBriefingRequired') else None,
        # Cultural fields
        "culturalTheme": _extract_value(_safe_get(bind, 'culturalTheme')),
        "historicalPeriod": _extract_value(_safe_get(bind, 'historicalPeriod')),
        "audioGuideAvailable": (_extract_value(_safe_get(bind, 'audioGuideAvailable')) == 'true') if _safe_get(bind,
                                                                                                               'audioGuideAvailable') else None,
        "photographyAllowed": (_extract_value(_safe_get(bind, 'photographyAllowed')) == 'true') if _safe_get(bind,
                                                                                                             'photographyAllowed') else None,
        # Nature fields
        "ecosystemType": _extract_value(_safe_get(bind, 'ecosystemType')),
        "wildlifeSpotting": _extract_value(_safe_get(bind, 'wildlifeSpotting')),
        "bestTimeToVisit": _extract_value(_safe_get(bind, 'bestTimeToVisit')),
        "binocularsProvided": (_extract_value(_safe_get(bind, 'binocularsProvided')) == 'true') if _safe_get(bind,
                                                                                                             'binocularsProvided') else None,
        "uri": _extract_value(_safe_get(bind, 'activity'))
    }


def calculate_eco_score(price: float, difficulty: str, duration: int, rating: float) -> float:
    """Calcule un score écologique basé sur prix, difficulté, durée et note"""
    # Prix (plus c'est cher, plus le score est bas)
    price_score = max(0, 100 - (price / 10))

    # Difficulté
    difficulty_scores = {
        "Easy": 100,
        "Beginner": 100,
        "Moderate": 70,
        "Intermediate": 70,
        "Easy-Moderate": 85,
        "Beginner-Intermediate": 85,
        "Difficult": 40,
        "Hard": 40
    }
    difficulty_score = difficulty_scores.get(difficulty, 50)

    # Durée (activités plus longues = meilleur score)
    duration_score = min(100, duration * 10)

    # Note
    rating_score = (rating / 5.0) * 100 if rating else 50

    total = (price_score * 0.2) + (difficulty_score * 0.2) + (duration_score * 0.3) + (rating_score * 0.3)
    return round(total, 1)


# ============================================
# ENDPOINTS
# ============================================

# GET /activities (filtre par type)
@router.get("/", summary="Rechercher des activités écotouristiques")
def search_activities(
        type: Optional[str] = Query(None,
                                    description="Type: AdventureActivity, CulturalActivity, NatureActivity (optionnel)"),
        limit: int = Query(20, ge=1, le=100)
):
    try:
        # Construction du filtre de type
        if type:
            type_filter = f"?activity a eco:{type} ."
            type_select = f"BIND(eco:{type} AS ?activityType)"
        else:
            type_filter = """
            {
                ?activity a eco:AdventureActivity .
                BIND(eco:AdventureActivity AS ?activityType)
            } UNION {
                ?activity a eco:CulturalActivity .
                BIND(eco:CulturalActivity AS ?activityType)
            } UNION {
                ?activity a eco:NatureActivity .
                BIND(eco:NatureActivity AS ?activityType)
            }
            """
            type_select = ""

        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT DISTINCT ?activity ?activityId ?activityName ?activityDescription ?durationHours ?pricePerPerson
               ?difficultyLevel ?maxParticipants ?minAge ?activityRating ?schedule ?activityLanguages
               ?riskLevel ?requiredEquipment ?physicalFitnessRequired ?safetyBriefingRequired
               ?culturalTheme ?historicalPeriod ?audioGuideAvailable ?photographyAllowed
               ?ecosystemType ?wildlifeSpotting ?bestTimeToVisit ?binocularsProvided ?activityType
        WHERE {{
            {type_filter}
            ?activity eco:activityId ?activityId ;
                      eco:activityName ?activityName .
            {type_select}
            OPTIONAL {{ ?activity eco:activityDescription ?activityDescription }}
            OPTIONAL {{ ?activity eco:durationHours ?durationHours }}
            OPTIONAL {{ ?activity eco:pricePerPerson ?pricePerPerson }}
            OPTIONAL {{ ?activity eco:difficultyLevel ?difficultyLevel }}
            OPTIONAL {{ ?activity eco:maxParticipants ?maxParticipants }}
            OPTIONAL {{ ?activity eco:minAge ?minAge }}
            OPTIONAL {{ ?activity eco:activityRating ?activityRating }}
            OPTIONAL {{ ?activity eco:schedule ?schedule }}
            OPTIONAL {{ ?activity eco:activityLanguages ?activityLanguages }}
            OPTIONAL {{ ?activity eco:riskLevel ?riskLevel }}
            OPTIONAL {{ ?activity eco:requiredEquipment ?requiredEquipment }}
            OPTIONAL {{ ?activity eco:physicalFitnessRequired ?physicalFitnessRequired }}
            OPTIONAL {{ ?activity eco:safetyBriefingRequired ?safetyBriefingRequired }}
            OPTIONAL {{ ?activity eco:culturalTheme ?culturalTheme }}
            OPTIONAL {{ ?activity eco:historicalPeriod ?historicalPeriod }}
            OPTIONAL {{ ?activity eco:audioGuideAvailable ?audioGuideAvailable }}
            OPTIONAL {{ ?activity eco:photographyAllowed ?photographyAllowed }}
            OPTIONAL {{ ?activity eco:ecosystemType ?ecosystemType }}
            OPTIONAL {{ ?activity eco:wildlifeSpotting ?wildlifeSpotting }}
            OPTIONAL {{ ?activity eco:bestTimeToVisit ?bestTimeToVisit }}
            OPTIONAL {{ ?activity eco:binocularsProvided ?binocularsProvided }}
        }}
        LIMIT {limit}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        activities = [_parse_activity(b) for b in binds]

        return {"status": "success", "count": len(activities), "activities": activities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /activities/{activity_id}
@router.get("/{activity_id}", summary="Obtenir une activité par ID")
def get_activity_by_id(activity_id: str):
    try:
        # Vérifier si l'activité existe
        check_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?activity
        WHERE {{
            ?activity eco:activityId "{activity_id}" .
        }}
        LIMIT 1
        """

        check_result = sparql_select(check_sparql)
        binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Activity with ID '{activity_id}' not found")

        # Récupérer tous les détails
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?activity ?activityId ?activityName ?activityDescription ?durationHours ?pricePerPerson
               ?difficultyLevel ?maxParticipants ?minAge ?activityRating ?schedule ?activityLanguages
               ?riskLevel ?requiredEquipment ?physicalFitnessRequired ?safetyBriefingRequired
               ?culturalTheme ?historicalPeriod ?audioGuideAvailable ?photographyAllowed
               ?ecosystemType ?wildlifeSpotting ?bestTimeToVisit ?binocularsProvided ?activityType
        WHERE {{
            ?activity eco:activityId "{activity_id}" ;
                      eco:activityName ?activityName .
            BIND("{activity_id}" AS ?activityId)
            OPTIONAL {{ ?activity a ?activityType }}
            OPTIONAL {{ ?activity eco:activityDescription ?activityDescription }}
            OPTIONAL {{ ?activity eco:durationHours ?durationHours }}
            OPTIONAL {{ ?activity eco:pricePerPerson ?pricePerPerson }}
            OPTIONAL {{ ?activity eco:difficultyLevel ?difficultyLevel }}
            OPTIONAL {{ ?activity eco:maxParticipants ?maxParticipants }}
            OPTIONAL {{ ?activity eco:minAge ?minAge }}
            OPTIONAL {{ ?activity eco:activityRating ?activityRating }}
            OPTIONAL {{ ?activity eco:schedule ?schedule }}
            OPTIONAL {{ ?activity eco:activityLanguages ?activityLanguages }}
            OPTIONAL {{ ?activity eco:riskLevel ?riskLevel }}
            OPTIONAL {{ ?activity eco:requiredEquipment ?requiredEquipment }}
            OPTIONAL {{ ?activity eco:physicalFitnessRequired ?physicalFitnessRequired }}
            OPTIONAL {{ ?activity eco:safetyBriefingRequired ?safetyBriefingRequired }}
            OPTIONAL {{ ?activity eco:culturalTheme ?culturalTheme }}
            OPTIONAL {{ ?activity eco:historicalPeriod ?historicalPeriod }}
            OPTIONAL {{ ?activity eco:audioGuideAvailable ?audioGuideAvailable }}
            OPTIONAL {{ ?activity eco:photographyAllowed ?photographyAllowed }}
            OPTIONAL {{ ?activity eco:ecosystemType ?ecosystemType }}
            OPTIONAL {{ ?activity eco:wildlifeSpotting ?wildlifeSpotting }}
            OPTIONAL {{ ?activity eco:bestTimeToVisit ?bestTimeToVisit }}
            OPTIONAL {{ ?activity eco:binocularsProvided ?binocularsProvided }}
        }}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Activity with ID '{activity_id}' not found")

        activity = _parse_activity(binds[0])
        return {"status": "success", "activity": activity}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# POST /activities
# POST - Vérification avant ajout
@router.post("/", summary="Créer une nouvelle activité")
def create_activity(data: ActivityCreateRequest):
    try:
        # CORRECTION 1: Vérifier si l'activité existe déjà
        check_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?activity
        WHERE {{
          ?activity eco:activityId "{data.activityId}" .
        }}
        LIMIT 1
        """

        check_result = sparql_select(check_sparql)
        binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []

        if binds:
            raise HTTPException(
                status_code=409,
                detail=f"Activity with ID '{data.activityId}' already exists"
            )

        # CORRECTION 2: Créer l'activité
        uri = f"eco:{data.activityId}"
        type_triples = f"{uri} a eco:{data.type} ."
        triples = [type_triples]

        def add_triple(prop, val, is_bool=False, is_float=False, is_int=False):
            if val is not None:
                if is_bool:
                    triples.append(
                        f'{uri} eco:{prop} "{str(val).lower()}"^^<http://www.w3.org/2001/XMLSchema#boolean> .')
                elif is_float:
                    triples.append(f'{uri} eco:{prop} "{val}"^^xsd:float .')
                elif is_int:
                    triples.append(f'{uri} eco:{prop} "{val}"^^xsd:integer .')
                elif isinstance(val, str):
                    triples.append(f'{uri} eco:{prop} "{val}" .')
                else:
                    triples.append(f'{uri} eco:{prop} {val} .')

        add_triple("activityId", data.activityId)
        add_triple("activityName", data.activityName)
        add_triple("activityDescription", data.activityDescription)
        add_triple("durationHours", data.durationHours, is_int=True)
        add_triple("pricePerPerson", data.pricePerPerson, is_float=True)
        add_triple("difficultyLevel", data.difficultyLevel)
        add_triple("maxParticipants", data.maxParticipants, is_int=True)
        add_triple("minAge", data.minAge, is_int=True)
        add_triple("activityRating", data.activityRating, is_float=True)
        add_triple("schedule", data.schedule)
        add_triple("activityLanguages", data.activityLanguages)

        # Adventure-specific
        add_triple("riskLevel", data.riskLevel, is_int=True)
        add_triple("requiredEquipment", data.requiredEquipment)
        add_triple("physicalFitnessRequired", data.physicalFitnessRequired)
        add_triple("safetyBriefingRequired", data.safetyBriefingRequired, is_bool=True)

        # Cultural-specific
        add_triple("culturalTheme", data.culturalTheme)
        add_triple("historicalPeriod", data.historicalPeriod)
        add_triple("audioGuideAvailable", data.audioGuideAvailable, is_bool=True)
        add_triple("photographyAllowed", data.photographyAllowed, is_bool=True)

        # Nature-specific
        add_triple("ecosystemType", data.ecosystemType)
        add_triple("wildlifeSpotting", data.wildlifeSpotting)
        add_triple("bestTimeToVisit", data.bestTimeToVisit)
        add_triple("binocularsProvided", data.binocularsProvided, is_bool=True)

        triples_str = "\n    ".join(triples)

        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

        INSERT DATA {{
            {triples_str}
        }}
        """

        result = sparql_insert(sparql)
        return {
            "status": "created",
            "message": f"Activity '{data.activityName}' created successfully",
            "uri": uri,
            "activityId": data.activityId
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# POST /activities/compare
@router.post("/compare", summary="Comparer deux activités")
def compare_activities(activity_id1: str = Body(...), activity_id2: str = Body(...)):
    """
    Compare deux activités selon plusieurs critères :
    - Prix
    - Note
    - Durée
    - Niveau de difficulté
    - Capacité
    """
    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?activity ?activityId ?activityName ?pricePerPerson ?activityRating
               ?difficultyLevel ?durationHours ?maxParticipants
        WHERE {{
            VALUES ?activityId {{ "{activity_id1}" "{activity_id2}" }}
            ?activity eco:activityId ?activityId ;
                      eco:activityName ?activityName .
            OPTIONAL {{ ?activity eco:pricePerPerson ?pricePerPerson }}
            OPTIONAL {{ ?activity eco:activityRating ?activityRating }}
            OPTIONAL {{ ?activity eco:difficultyLevel ?difficultyLevel }}
            OPTIONAL {{ ?activity eco:durationHours ?durationHours }}
            OPTIONAL {{ ?activity eco:maxParticipants ?maxParticipants }}
        }}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        # Vérifier qu'on a bien 2 activités
        if len(binds) == 0:
            raise HTTPException(
                status_code=404,
                detail=f"❌ Aucune des deux activités n'a été trouvée. IDs recherchés: {activity_id1}, {activity_id2}"
            )

        if len(binds) == 1:
            found_id = _extract_value(_safe_get(binds[0], 'activityId'))
            missing_id = activity_id2 if found_id == activity_id1 else activity_id1
            raise HTTPException(
                status_code=404,
                detail=f"❌ Une activité n'existe pas. Trouvée: {found_id}, Manquante: {missing_id}"
            )

        # Parser les activités
        activities = []
        for b in binds:
            act = {
                "activityId": _extract_value(_safe_get(b, 'activityId')),
                "name": _extract_value(_safe_get(b, 'activityName')),
                "pricePerPerson": float(_extract_value(_safe_get(b, 'pricePerPerson')) or 0) if _safe_get(b,
                                                                                                          'pricePerPerson') else None,
                "rating": float(_extract_value(_safe_get(b, 'activityRating')) or 0) if _safe_get(b,
                                                                                                  'activityRating') else None,
                "difficultyLevel": _extract_value(_safe_get(b, 'difficultyLevel')),
                "durationHours": int(_extract_value(_safe_get(b, 'durationHours')) or 0) if _safe_get(b,
                                                                                                      'durationHours') else None,
                "maxParticipants": int(_extract_value(_safe_get(b, 'maxParticipants')) or 0) if _safe_get(b,
                                                                                                          'maxParticipants') else None,
                "uri": _extract_value(_safe_get(b, 'activity'))
            }
            activities.append(act)

        # Créer une comparaison structurée
        comparison = {
            "activity1": activities[0],
            "activity2": activities[1],
            "differences": {},
            "winner": {}
        }

        # Comparer les prix
        if activities[0].get("pricePerPerson") is not None and activities[1].get("pricePerPerson") is not None:
            price_diff = activities[0]["pricePerPerson"] - activities[1]["pricePerPerson"]
            comparison["differences"]["price"] = {
                "activity1_price": activities[0]["pricePerPerson"],
                "activity2_price": activities[1]["pricePerPerson"],
                "difference": round(abs(price_diff), 2),
                "cheaper": activities[0]["activityId"] if price_diff < 0 else activities[1]["activityId"],
                "savings": f"{round(abs(price_diff), 2)}€"
            }

        # Comparer les notes
        if activities[0].get("rating") is not None and activities[1].get("rating") is not None:
            rating_diff = activities[0]["rating"] - activities[1]["rating"]
            comparison["differences"]["rating"] = {
                "activity1_rating": activities[0]["rating"],
                "activity2_rating": activities[1]["rating"],
                "difference": round(abs(rating_diff), 2),
                "better_rated": activities[0]["activityId"] if rating_diff > 0 else activities[1]["activityId"]
            }

        # Comparer la durée
        if activities[0].get("durationHours") is not None and activities[1].get("durationHours") is not None:
            duration_diff = activities[0]["durationHours"] - activities[1]["durationHours"]
            comparison["differences"]["duration"] = {
                "activity1_duration": activities[0]["durationHours"],
                "activity2_duration": activities[1]["durationHours"],
                "difference": abs(duration_diff),
                "longer": activities[0]["activityId"] if duration_diff > 0 else activities[1]["activityId"],
                "shorter": activities[1]["activityId"] if duration_diff > 0 else activities[0]["activityId"]
            }

        # Comparer la capacité
        if activities[0].get("maxParticipants") is not None and activities[1].get("maxParticipants") is not None:
            capacity_diff = activities[0]["maxParticipants"] - activities[1]["maxParticipants"]
            comparison["differences"]["capacity"] = {
                "activity1_capacity": activities[0]["maxParticipants"],
                "activity2_capacity": activities[1]["maxParticipants"],
                "difference": abs(capacity_diff),
                "larger_group": activities[0]["activityId"] if capacity_diff > 0 else activities[1]["activityId"]
            }

        # Déterminer le gagnant global
        scores = {activities[0]["activityId"]: 0, activities[1]["activityId"]: 0}

        if "price" in comparison["differences"]:
            scores[comparison["differences"]["price"]["cheaper"]] += 1

        if "rating" in comparison["differences"]:
            scores[comparison["differences"]["rating"]["better_rated"]] += 1

        # Le gagnant est celui avec le plus de points
        winner_id = max(scores, key=scores.get)
        comparison["winner"] = {
            "activity_id": winner_id,
            "name": next(a["name"] for a in activities if a["activityId"] == winner_id),
            "score": scores[winner_id],
            "reasoning": []
        }

        # Ajouter les raisons
        if "price" in comparison["differences"] and comparison["differences"]["price"]["cheaper"] == winner_id:
            comparison["winner"]["reasoning"].append(f"Moins cher de {comparison['differences']['price']['savings']}")

        if "rating" in comparison["differences"] and comparison["differences"]["rating"]["better_rated"] == winner_id:
            comparison["winner"]["reasoning"].append(f"Mieux noté")

        return {
            "status": "success",
            "comparison": comparison,
            "summary": f"🏆 Gagnant: {comparison['winner']['name']} ({comparison['winner']['score']}/2 critères)"
        }

    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur lors de la comparaison: {str(e)}")


# PUT /activities/{activity_id} - ENDPOINT UNIFIÉ
@router.put("/{activity_id}", summary="Modifier une activité (modification persistante)")
def update_activity(activity_id: str, update_data: ActivityUpdateRequest):
    try:
        # Vérifier si l'activité existe
        check_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?activity
        WHERE {{
            ?activity eco:activityId "{activity_id}" .
        }}
        LIMIT 1
        """

        check_result = sparql_select(check_sparql)
        binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Activity '{activity_id}' not found")

        activity_uri = _extract_value(_safe_get(binds[0], 'activity'))

        # Construire les clauses DELETE et INSERT
        delete_clauses = []
        insert_clauses = []

        def add_update(prop, val, is_bool=False, is_float=False, is_int=False):
            if val is not None:
                delete_clauses.append(f"?activity eco:{prop} ?old{prop} .")

                if is_bool:
                    insert_clauses.append(
                        f'?activity eco:{prop} "{str(val).lower()}"^^<http://www.w3.org/2001/XMLSchema#boolean> .')
                elif is_float:
                    insert_clauses.append(f'?activity eco:{prop} "{val}"^^<http://www.w3.org/2001/XMLSchema#float> .')
                elif is_int:
                    insert_clauses.append(f'?activity eco:{prop} "{val}"^^<http://www.w3.org/2001/XMLSchema#integer> .')
                elif isinstance(val, str):
                    insert_clauses.append(f'?activity eco:{prop} "{val}" .')

        # Ajouter toutes les modifications possibles
        add_update("activityName", update_data.activityName)
        add_update("activityDescription", update_data.activityDescription)
        add_update("durationHours", update_data.durationHours, is_int=True)
        add_update("pricePerPerson", update_data.pricePerPerson, is_float=True)
        add_update("difficultyLevel", update_data.difficultyLevel)
        add_update("maxParticipants", update_data.maxParticipants, is_int=True)
        add_update("minAge", update_data.minAge, is_int=True)
        add_update("activityRating", update_data.activityRating, is_float=True)
        add_update("schedule", update_data.schedule)
        add_update("activityLanguages", update_data.activityLanguages)
        add_update("riskLevel", update_data.riskLevel, is_int=True)
        add_update("requiredEquipment", update_data.requiredEquipment)
        add_update("physicalFitnessRequired", update_data.physicalFitnessRequired)
        add_update("safetyBriefingRequired", update_data.safetyBriefingRequired, is_bool=True)
        add_update("culturalTheme", update_data.culturalTheme)
        add_update("historicalPeriod", update_data.historicalPeriod)
        add_update("audioGuideAvailable", update_data.audioGuideAvailable, is_bool=True)
        add_update("photographyAllowed", update_data.photographyAllowed, is_bool=True)
        add_update("ecosystemType", update_data.ecosystemType)
        add_update("wildlifeSpotting", update_data.wildlifeSpotting)
        add_update("bestTimeToVisit", update_data.bestTimeToVisit)
        add_update("binocularsProvided", update_data.binocularsProvided, is_bool=True)

        if not delete_clauses:
            raise HTTPException(status_code=400, detail="No fields to update")

        delete_str = "\n        ".join(delete_clauses)
        insert_str = "\n        ".join(insert_clauses)

        # Construire les clauses OPTIONAL pour le WHERE
        optional_clauses = []
        for clause in delete_clauses:
            optional_clauses.append(f"OPTIONAL {{ {clause} }}")
        optional_str = "\n        ".join(optional_clauses)

        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>

        DELETE {{
            {delete_str}
        }}
        INSERT {{
            {insert_str}
        }}
        WHERE {{
            ?activity eco:activityId "{activity_id}" .
            {optional_str}
        }}
        """

        result = sparql_update(sparql)

        # Récupérer les champs modifiés
        updated_fields = {k: v for k, v in update_data.dict().items() if v is not None}

        return {
            "status": "success",
            "message": f"Activity '{activity_id}' updated successfully",
            "activityId": activity_id,
            "updatedFields": updated_fields,
            "details": result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# DELETE /activities/{id}
@router.delete("/{activity_id}", summary="Supprimer une activité")
def delete_activity(activity_id: str):
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    DELETE WHERE {{ 
        ?activity eco:activityId "{activity_id}" .
        ?activity ?p ?o . 
    }}
    """

    try:
        result = sparql_delete(sparql)
        return {
            "status": "success",
            "message": f"Activity '{activity_id}' deleted",
            "details": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /activities/stats/top-rated
@router.get("/stats/top-rated", summary="Top 10 activités les mieux notées")
def get_top_rated():
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?activity ?activityName ?activityRating
        WHERE {
            ?activity eco:activityName ?activityName .
            OPTIONAL { ?activity eco:activityRating ?activityRating }
        }
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        rows = []
        for b in binds:
            name = _extract_value(_safe_get(b, "activityName"))
            rating = float(_extract_value(_safe_get(b, "activityRating")) or 0) if _safe_get(b,
                                                                                             "activityRating") else None
            uri = _extract_value(_safe_get(b, "activity"))
            if rating is not None:
                rows.append({"name": name, "rating": rating, "uri": uri})

        sorted_rows = sorted(rows, key=lambda x: x["rating"], reverse=True)[:10]

        return {"status": "success", "count": len(sorted_rows), "activities": sorted_rows, "ranking": "by_rating"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /activities/stats/cheapest
@router.get("/stats/cheapest", summary="Top 10 activités les moins chères")
def get_cheapest():
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?activity ?activityName ?pricePerPerson
        WHERE {
            ?activity eco:activityName ?activityName .
            OPTIONAL { ?activity eco:pricePerPerson ?pricePerPerson }
        }
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        rows = []
        for b in binds:
            name = _extract_value(_safe_get(b, "activityName"))
            price = float(_extract_value(_safe_get(b, "pricePerPerson")) or 0) if _safe_get(b,
                                                                                            "pricePerPerson") else None
            uri = _extract_value(_safe_get(b, "activity"))
            if price is not None:
                rows.append({"name": name, "pricePerPerson": price, "uri": uri})

        sorted_rows = sorted(rows, key=lambda x: x["pricePerPerson"])[:10]

        return {"status": "success", "count": len(sorted_rows), "activities": sorted_rows, "ranking": "by_price"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /activities/search/{name}
@router.get("/search/{name}", summary="Rechercher une activité par nom")
def search_activity_by_name(name: str):
    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?activity ?activityId ?activityName ?pricePerPerson ?activityRating ?difficultyLevel
        WHERE {{
            ?activity eco:activityName ?activityName .
            FILTER(CONTAINS(LCASE(?activityName), LCASE("{name}")))
            OPTIONAL {{ ?activity eco:activityId ?activityId }}
            OPTIONAL {{ ?activity eco:pricePerPerson ?pricePerPerson }}
            OPTIONAL {{ ?activity eco:activityRating ?activityRating }}
            OPTIONAL {{ ?activity eco:difficultyLevel ?difficultyLevel }}
        }}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        activities = [_parse_activity(b) for b in binds]

        return {"status": "success", "count": len(activities), "activities": activities}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
