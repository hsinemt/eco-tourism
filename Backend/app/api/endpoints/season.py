from fastapi import APIRouter, Query, HTTPException, Body
from typing import Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


# ============================================
# MODÈLES PYDANTIC
# ============================================

class SeasonCreateRequest(BaseModel):
    seasonName: str
    startDate: str  # Format: "2025-03-01T00:00:00"
    endDate: str  # Format: "2025-05-31T23:59:59"
    averageTemperature: float
    peakTourismSeason: bool


class SeasonUpdateRequest(BaseModel):
    seasonName: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    averageTemperature: Optional[float] = None
    peakTourismSeason: Optional[bool] = None


class SeasonResponse(BaseModel):
    uri: str
    seasonName: str
    startDate: Optional[str]
    endDate: Optional[str]
    averageTemperature: Optional[float]
    peakTourismSeason: Optional[bool]


# ============================================
# HELPERS
# ============================================

def _safe_get(obj, key, default=None):
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


def _parse_season(binding):
    """Parse un binding SPARQL en saison"""
    return {
        "uri": _extract_value(_safe_get(binding, 'season')),
        "seasonName": _extract_value(_safe_get(binding, 'seasonName')),
        "startDate": _extract_value(_safe_get(binding, 'startDate')),
        "endDate": _extract_value(_safe_get(binding, 'endDate')),
        "averageTemperature": float(_extract_value(_safe_get(binding, 'averageTemperature')) or 0) if _safe_get(binding,
                                                                                                                'averageTemperature') else None,
        "peakTourismSeason": (_extract_value(_safe_get(binding, 'peakTourismSeason')) == 'true') if _safe_get(binding,
                                                                                                              'peakTourismSeason') else None
    }


# ============================================
# ENDPOINTS
# ============================================

@router.get("/", summary="Rechercher toutes les saisons")
def search_seasons(limit: int = Query(10, ge=1, le=100)):
    """Retourne toutes les saisons disponibles"""
    from app.services.sparql_helpers import sparql_select

    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT ?season ?seasonName ?startDate ?endDate ?averageTemperature ?peakTourismSeason
        WHERE {{
            ?season rdf:type eco:Season ;
                    eco:seasonName ?seasonName .
            OPTIONAL {{ ?season eco:startDate ?startDate . }}
            OPTIONAL {{ ?season eco:endDate ?endDate . }}
            OPTIONAL {{ ?season eco:averageTemperature ?averageTemperature . }}
            OPTIONAL {{ ?season eco:peakTourismSeason ?peakTourismSeason . }}
        }}
        LIMIT {limit}
        """

        results = sparql_select(sparql)
        bindings = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        seasons = [_parse_season(b) for b in bindings]

        return {
            "status": "success",
            "count": len(seasons),
            "seasons": seasons
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{season_id}", summary="Afficher une saison par identifiant")
def get_season(season_id: str):
    """Récupère les détails d'une saison spécifique"""
    from app.services.sparql_helpers import sparql_select

    try:
        # Vérifier si la saison existe
        check_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?season
        WHERE {{
            ?season eco:seasonName "{season_id}" .
        }}
        LIMIT 1
        """

        check_result = sparql_select(check_sparql)
        binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Season '{season_id}' not found")

        # Récupérer tous les détails
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT ?season ?seasonName ?startDate ?endDate ?averageTemperature ?peakTourismSeason
        WHERE {{
            ?season eco:seasonName "{season_id}" ;
                    eco:seasonName ?seasonName .
            OPTIONAL {{ ?season eco:startDate ?startDate . }}
            OPTIONAL {{ ?season eco:endDate ?endDate . }}
            OPTIONAL {{ ?season eco:averageTemperature ?averageTemperature . }}
            OPTIONAL {{ ?season eco:peakTourismSeason ?peakTourismSeason . }}
        }}
        """

        results = sparql_select(sparql)
        bindings = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        if not bindings:
            raise HTTPException(status_code=404, detail=f"Season '{season_id}' not found")

        season = _parse_season(bindings[0])

        return {
            "status": "success",
            "season": season
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", summary="Créer une nouvelle saison")
def create_season(data: SeasonCreateRequest):
    """Crée une nouvelle saison touristique"""
    from app.services.sparql_helpers import sparql_insert

    # Générer l'URI (ex: Season_Spring)
    season_uri = f"Season_{data.seasonName.replace(' ', '_')}"

    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

    INSERT DATA {{
        eco:{season_uri} rdf:type eco:Season ;
            eco:seasonName "{data.seasonName}" ;
            eco:startDate "{data.startDate}"^^xsd:dateTime ;
            eco:endDate "{data.endDate}"^^xsd:dateTime ;
            eco:averageTemperature "{data.averageTemperature}"^^xsd:float ;
            eco:peakTourismSeason "{str(data.peakTourismSeason).lower()}"^^xsd:boolean .
    }}
    """

    try:
        result = sparql_insert(sparql)
        return {
            "status": "success",
            "message": f"Season '{data.seasonName}' created successfully",
            "uri": f"http://www.ecotourism.org/ontology#{season_uri}",
            "seasonName": data.seasonName
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{season_id}", summary="Modifier une saison (modification persistante)")
def update_season(season_id: str, update_data: SeasonUpdateRequest):
    """Met à jour une saison avec modification persistante"""
    from app.services.sparql_helpers import sparql_update, sparql_select

    try:
        # Vérifier si la saison existe
        check_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?season
        WHERE {{
            ?season eco:seasonName "{season_id}" .
        }}
        LIMIT 1
        """

        check_result = sparql_select(check_sparql)
        binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Season '{season_id}' not found")

        season_uri = _extract_value(_safe_get(binds[0], 'season'))

        # Construire les clauses DELETE et INSERT
        delete_clauses = []
        insert_clauses = []
        optional_clauses = []

        def add_update(prop, val, is_bool=False, is_float=False, is_datetime=False):
            if val is not None:
                delete_clauses.append(f"?season eco:{prop} ?old{prop} .")
                optional_clauses.append(f"OPTIONAL {{ ?season eco:{prop} ?old{prop} . }}")

                if is_bool:
                    insert_clauses.append(
                        f'?season eco:{prop} "{str(val).lower()}"^^<http://www.w3.org/2001/XMLSchema#boolean> .')
                elif is_float:
                    insert_clauses.append(f'?season eco:{prop} "{val}"^^<http://www.w3.org/2001/XMLSchema#float> .')
                elif is_datetime:
                    insert_clauses.append(f'?season eco:{prop} "{val}"^^<http://www.w3.org/2001/XMLSchema#dateTime> .')
                elif isinstance(val, str):
                    insert_clauses.append(f'?season eco:{prop} "{val}" .')

        # Ajouter toutes les modifications possibles
        add_update("seasonName", update_data.seasonName)
        add_update("startDate", update_data.startDate, is_datetime=True)
        add_update("endDate", update_data.endDate, is_datetime=True)
        add_update("averageTemperature", update_data.averageTemperature, is_float=True)
        add_update("peakTourismSeason", update_data.peakTourismSeason, is_bool=True)

        if not delete_clauses:
            raise HTTPException(status_code=400, detail="No fields to update")

        delete_str = "\n        ".join(delete_clauses)
        insert_str = "\n        ".join(insert_clauses)
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
            ?season eco:seasonName "{season_id}" .
            {optional_str}
        }}
        """

        result = sparql_update(sparql)

        # Récupérer les champs modifiés
        updated_fields = {k: v for k, v in update_data.dict().items() if v is not None}

        return {
            "status": "success",
            "message": f"Season '{season_id}' updated successfully",
            "seasonId": season_id,
            "updatedFields": updated_fields
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{season_id}", summary="Supprimer une saison")
def delete_season(season_id: str):
    """Supprime une saison"""
    from app.services.sparql_helpers import sparql_delete

    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>

        DELETE WHERE {{ 
            ?season eco:seasonName "{season_id}" .
            ?season ?p ?o . 
        }}
        """

        result = sparql_delete(sparql)

        return {
            "status": "success",
            "message": f"Season '{season_id}' deleted successfully",
            "seasonId": season_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/current/activities", summary="Activités disponibles cette saison")
def get_activities_by_season(
        season_id: str = Query(..., description="Nom de la saison"),
        limit: int = Query(10, ge=1, le=100)
):
    """Récupère toutes les activités disponibles pendant une saison"""
    from app.services.sparql_helpers import sparql_select

    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT ?activity ?activityName ?difficultyLevel ?durationHours ?pricePerPerson
        WHERE {{
            ?activity rdf:type ?type ;
                      eco:activityName ?activityName .
            OPTIONAL {{ ?activity eco:difficultyLevel ?difficultyLevel . }}
            OPTIONAL {{ ?activity eco:durationHours ?durationHours . }}
            OPTIONAL {{ ?activity eco:pricePerPerson ?pricePerPerson . }}
            FILTER(?type IN (eco:AdventureActivity, eco:CulturalActivity, eco:NatureActivity))

            # Pour les activités Nature, filtrer par bestTimeToVisit
            OPTIONAL {{ 
                ?activity eco:bestTimeToVisit ?bestTime .
                FILTER(CONTAINS(LCASE(?bestTime), LCASE("{season_id}")))
            }}
        }}
        LIMIT {limit}
        """

        results = sparql_select(sparql)
        bindings = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        activities = []
        for b in bindings:
            activities.append({
                "uri": _extract_value(_safe_get(b, 'activity')),
                "activityName": _extract_value(_safe_get(b, 'activityName')),
                "difficultyLevel": _extract_value(_safe_get(b, 'difficultyLevel')),
                "durationHours": _extract_value(_safe_get(b, 'durationHours')),
                "pricePerPerson": _extract_value(_safe_get(b, 'pricePerPerson'))
            })

        return {
            "status": "success",
            "season": season_id,
            "count": len(activities),
            "activities": activities
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats/peak-seasons", summary="Saisons de haute affluence")
def get_peak_seasons():
    """Récupère les saisons de haute affluence touristique"""
    from app.services.sparql_helpers import sparql_select

    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT ?season ?seasonName ?startDate ?endDate ?averageTemperature
        WHERE {
            ?season rdf:type eco:Season ;
                    eco:seasonName ?seasonName ;
                    eco:peakTourismSeason "true"^^<http://www.w3.org/2001/XMLSchema#boolean> .
            OPTIONAL { ?season eco:startDate ?startDate . }
            OPTIONAL { ?season eco:endDate ?endDate . }
            OPTIONAL { ?season eco:averageTemperature ?averageTemperature . }
        }
        """

        results = sparql_select(sparql)
        bindings = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        seasons = [_parse_season(b) for b in bindings]

        return {
            "status": "success",
            "count": len(seasons),
            "peakSeasons": seasons
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats/warmest", summary="Saisons les plus chaudes")
def get_warmest_seasons(limit: int = Query(5, ge=1, le=10)):
    """Récupère les saisons les plus chaudes"""
    from app.services.sparql_helpers import sparql_select

    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT ?season ?seasonName ?averageTemperature ?startDate ?endDate
        WHERE {{
            ?season rdf:type eco:Season ;
                    eco:seasonName ?seasonName ;
                    eco:averageTemperature ?averageTemperature .
            OPTIONAL {{ ?season eco:startDate ?startDate . }}
            OPTIONAL {{ ?season eco:endDate ?endDate . }}
        }}
        ORDER BY DESC(?averageTemperature)
        LIMIT {limit}
        """

        results = sparql_select(sparql)
        bindings = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        seasons = [_parse_season(b) for b in bindings]

        return {
            "status": "success",
            "count": len(seasons),
            "warmestSeasons": seasons,
            "ranking": "by_temperature"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
