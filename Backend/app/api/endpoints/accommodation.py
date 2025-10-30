from fastapi import APIRouter, Query, HTTPException, Body
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from app.services.accommodation_recommender import AccommodationRecommender
from app.services.sparql_helpers import sparql_insert, sparql_update, sparql_delete, sparql_select

router = APIRouter()

# ============================================
# MODELES PYDANTIC
# ============================================

class AccommodationResponse(BaseModel):
    name: str
    accommodationId: Optional[str]
    description: Optional[str]
    pricePerNight: Optional[float]
    numberOfRooms: Optional[int]
    maxGuests: Optional[int]
    checkInTime: Optional[str]
    checkOutTime: Optional[str]
    wifiAvailable: Optional[bool]
    parkingAvailable: Optional[bool]
    accommodationRating: Optional[float]
    contactEmail: Optional[str]
    accommodationPhone: Optional[str]
    ecoCertified: Optional[bool]
    renewableEnergyPercent: Optional[float]
    wasteRecyclingRate: Optional[float]
    organicFoodOffered: Optional[bool]
    waterConservationSystem: Optional[bool]
    familyOwned: Optional[bool]
    traditionalArchitecture: Optional[bool]
    homeCookedMeals: Optional[bool]
    culturalExperiences: Optional[str]
    starRating: Optional[int]
    hasSwimmingPool: Optional[bool]
    hasSpa: Optional[bool]
    hasRestaurant: Optional[bool]
    roomService: Optional[bool]
    uri: str

class AccommodationCreateRequest(BaseModel):
    type: str  # EcoLodge, GuestHouse, Hotel
    accommodationId: str
    name: str
    description: Optional[str]
    pricePerNight: Optional[float]
    numberOfRooms: Optional[int]
    maxGuests: Optional[int]
    checkInTime: Optional[str]
    checkOutTime: Optional[str]
    wifiAvailable: Optional[bool]
    parkingAvailable: Optional[bool]
    accommodationRating: Optional[float]
    contactEmail: Optional[str]
    accommodationPhone: Optional[str]
    ecoCertified: Optional[bool]
    renewableEnergyPercent: Optional[float]
    wasteRecyclingRate: Optional[float]
    organicFoodOffered: Optional[bool]
    waterConservationSystem: Optional[bool]
    familyOwned: Optional[bool]
    traditionalArchitecture: Optional[bool]
    homeCookedMeals: Optional[bool]
    culturalExperiences: Optional[str]
    starRating: Optional[int]
    hasSwimmingPool: Optional[bool]
    hasSpa: Optional[bool]
    hasRestaurant: Optional[bool]
    roomService: Optional[bool]

class AccommodationUpdateRequest(BaseModel):
    # All fields optional; used to update any subset
    name: Optional[str] = None
    description: Optional[str] = None
    pricePerNight: Optional[float] = None
    numberOfRooms: Optional[int] = None
    maxGuests: Optional[int] = None
    checkInTime: Optional[str] = None
    checkOutTime: Optional[str] = None
    wifiAvailable: Optional[bool] = None
    parkingAvailable: Optional[bool] = None
    accommodationRating: Optional[float] = None
    contactEmail: Optional[str] = None
    accommodationPhone: Optional[str] = None
    ecoCertified: Optional[bool] = None
    renewableEnergyPercent: Optional[float] = None
    wasteRecyclingRate: Optional[float] = None
    organicFoodOffered: Optional[bool] = None
    waterConservationSystem: Optional[bool] = None
    familyOwned: Optional[bool] = None
    traditionalArchitecture: Optional[bool] = None
    homeCookedMeals: Optional[bool] = None
    culturalExperiences: Optional[str] = None
    starRating: Optional[int] = None
    hasSwimmingPool: Optional[bool] = None
    hasSpa: Optional[bool] = None
    hasRestaurant: Optional[bool] = None
    roomService: Optional[bool] = None

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

def _parse_accommodation(bind):
    return {
        "name": _extract_value(_safe_get(bind, 'accommodationName')),
        "accommodationId": _extract_value(_safe_get(bind, 'accommodationId')),
        "description": _extract_value(_safe_get(bind, 'accommodationDescription')),
        "pricePerNight": float(_extract_value(_safe_get(bind, 'pricePerNight')) or 0) if _safe_get(bind, 'pricePerNight') else None,
        "numberOfRooms": int(_extract_value(_safe_get(bind, 'numberOfRooms')) or 0) if _safe_get(bind, 'numberOfRooms') else None,
        "maxGuests": int(_extract_value(_safe_get(bind, 'maxGuests')) or 0) if _safe_get(bind, 'maxGuests') else None,
        "checkInTime": _extract_value(_safe_get(bind, 'checkInTime')),
        "checkOutTime": _extract_value(_safe_get(bind, 'checkOutTime')),
        "wifiAvailable": (_extract_value(_safe_get(bind, 'wifiAvailable')) == 'true') if _safe_get(bind, 'wifiAvailable') else None,
        "parkingAvailable": (_extract_value(_safe_get(bind, 'parkingAvailable')) == 'true') if _safe_get(bind, 'parkingAvailable') else None,
        "accommodationRating": float(_extract_value(_safe_get(bind, 'accommodationRating')) or 0) if _safe_get(bind, 'accommodationRating') else None,
        "contactEmail": _extract_value(_safe_get(bind, 'contactEmail')),
        "accommodationPhone": _extract_value(_safe_get(bind, 'accommodationPhone')),
        "ecoCertified": (_extract_value(_safe_get(bind, 'ecoCertified')) == 'true') if _safe_get(bind, 'ecoCertified') else None,
        "renewableEnergyPercent": float(_extract_value(_safe_get(bind, 'renewableEnergyPercent')) or 0) if _safe_get(bind, 'renewableEnergyPercent') else None,
        "wasteRecyclingRate": float(_extract_value(_safe_get(bind, 'wasteRecyclingRate')) or 0) if _safe_get(bind, 'wasteRecyclingRate') else None,
        "organicFoodOffered": (_extract_value(_safe_get(bind, 'organicFoodOffered')) == 'true') if _safe_get(bind, 'organicFoodOffered') else None,
        "waterConservationSystem": (_extract_value(_safe_get(bind, 'waterConservationSystem')) == 'true') if _safe_get(bind, 'waterConservationSystem') else None,
        "familyOwned": (_extract_value(_safe_get(bind, 'familyOwned')) == 'true') if _safe_get(bind, 'familyOwned') else None,
        "traditionalArchitecture": (_extract_value(_safe_get(bind, 'traditionalArchitecture')) == 'true') if _safe_get(bind, 'traditionalArchitecture') else None,
        "homeCookedMeals": (_extract_value(_safe_get(bind, 'homeCookedMeals')) == 'true') if _safe_get(bind, 'homeCookedMeals') else None,
        "culturalExperiences": _extract_value(_safe_get(bind, 'culturalExperiences')),
        "starRating": int(_extract_value(_safe_get(bind, 'starRating')) or 0) if _safe_get(bind, 'starRating') else None,
        "hasSwimmingPool": (_extract_value(_safe_get(bind, 'hasSwimmingPool')) == 'true') if _safe_get(bind, 'hasSwimmingPool') else None,
        "hasSpa": (_extract_value(_safe_get(bind, 'hasSpa')) == 'true') if _safe_get(bind, 'hasSpa') else None,
        "hasRestaurant": (_extract_value(_safe_get(bind, 'hasRestaurant')) == 'true') if _safe_get(bind, 'hasRestaurant') else None,
        "roomService": (_extract_value(_safe_get(bind, 'roomService')) == 'true') if _safe_get(bind, 'roomService') else None,
        "uri": _extract_value(_safe_get(bind, 'accommodation'))
    }

# ============================================
# ENDPOINTS
# ============================================

# GET /accommodations  (filtre par type via query param)
@router.get("/", summary="Rechercher des hébergements écotouristiques")
def search_accommodations(
    type: Optional[str] = Query(None, description="Type: EcoLodge, GuestHouse, Hotel (optionnel)"),
    limit: int = Query(20, ge=1, le=100)
):
    try:
        type_filter = f"a eco:{type} ;" if type else ""
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?accommodation ?accommodationId ?accommodationName ?accommodationDescription ?pricePerNight ?numberOfRooms 
               ?maxGuests ?checkInTime ?checkOutTime ?wifiAvailable ?parkingAvailable ?accommodationRating 
               ?contactEmail ?accommodationPhone ?ecoCertified ?renewableEnergyPercent ?wasteRecyclingRate 
               ?organicFoodOffered ?waterConservationSystem ?familyOwned ?traditionalArchitecture ?homeCookedMeals 
               ?culturalExperiences ?starRating ?hasSwimmingPool ?hasSpa ?hasRestaurant ?roomService
        WHERE {{
          ?accommodation {type_filter}
                         eco:accommodationId ?accommodationId ;
                         eco:accommodationName ?accommodationName .
          OPTIONAL {{ ?accommodation eco:accommodationDescription ?accommodationDescription }}
          OPTIONAL {{ ?accommodation eco:pricePerNight ?pricePerNight }}
          OPTIONAL {{ ?accommodation eco:numberOfRooms ?numberOfRooms }}
          OPTIONAL {{ ?accommodation eco:maxGuests ?maxGuests }}
          OPTIONAL {{ ?accommodation eco:checkInTime ?checkInTime }}
          OPTIONAL {{ ?accommodation eco:checkOutTime ?checkOutTime }}
          OPTIONAL {{ ?accommodation eco:wifiAvailable ?wifiAvailable }}
          OPTIONAL {{ ?accommodation eco:parkingAvailable ?parkingAvailable }}
          OPTIONAL {{ ?accommodation eco:accommodationRating ?accommodationRating }}
          OPTIONAL {{ ?accommodation eco:contactEmail ?contactEmail }}
          OPTIONAL {{ ?accommodation eco:accommodationPhone ?accommodationPhone }}
          OPTIONAL {{ ?accommodation eco:ecoCertified ?ecoCertified }}
          OPTIONAL {{ ?accommodation eco:renewableEnergyPercent ?renewableEnergyPercent }}
          OPTIONAL {{ ?accommodation eco:wasteRecyclingRate ?wasteRecyclingRate }}
          OPTIONAL {{ ?accommodation eco:organicFoodOffered ?organicFoodOffered }}
          OPTIONAL {{ ?accommodation eco:waterConservationSystem ?waterConservationSystem }}
          OPTIONAL {{ ?accommodation eco:familyOwned ?familyOwned }}
          OPTIONAL {{ ?accommodation eco:traditionalArchitecture ?traditionalArchitecture }}
          OPTIONAL {{ ?accommodation eco:homeCookedMeals ?homeCookedMeals }}
          OPTIONAL {{ ?accommodation eco:culturalExperiences ?culturalExperiences }}
          OPTIONAL {{ ?accommodation eco:starRating ?starRating }}
          OPTIONAL {{ ?accommodation eco:hasSwimmingPool ?hasSwimmingPool }}
          OPTIONAL {{ ?accommodation eco:hasSpa ?hasSpa }}
          OPTIONAL {{ ?accommodation eco:hasRestaurant ?hasRestaurant }}
          OPTIONAL {{ ?accommodation eco:roomService ?roomService }}
        }}
        LIMIT {limit}
        """
        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        accommodations = [_parse_accommodation(b) for b in binds]
        return {"status": "success", "count": len(accommodations), "accommodations": accommodations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /accommodations/{id} - CORRIGÉ
@router.get("/{accommodation_id}", summary="Obtenir un hébergement par ID")
def get_accommodation_by_id(accommodation_id: str):
    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?accommodation ?accommodationId ?accommodationName ?accommodationDescription ?pricePerNight ?numberOfRooms 
               ?maxGuests ?checkInTime ?checkOutTime ?wifiAvailable ?parkingAvailable ?accommodationRating 
               ?contactEmail ?accommodationPhone ?ecoCertified ?renewableEnergyPercent ?wasteRecyclingRate 
               ?organicFoodOffered ?waterConservationSystem ?familyOwned ?traditionalArchitecture ?homeCookedMeals 
               ?culturalExperiences ?starRating ?hasSwimmingPool ?hasSpa ?hasRestaurant ?roomService
        WHERE {{
          ?accommodation eco:accommodationId "{accommodation_id}" ;
                         eco:accommodationName ?accommodationName .
          BIND("{accommodation_id}" AS ?accommodationId)
          OPTIONAL {{ ?accommodation eco:accommodationDescription ?accommodationDescription }}
          OPTIONAL {{ ?accommodation eco:pricePerNight ?pricePerNight }}
          OPTIONAL {{ ?accommodation eco:numberOfRooms ?numberOfRooms }}
          OPTIONAL {{ ?accommodation eco:maxGuests ?maxGuests }}
          OPTIONAL {{ ?accommodation eco:checkInTime ?checkInTime }}
          OPTIONAL {{ ?accommodation eco:checkOutTime ?checkOutTime }}
          OPTIONAL {{ ?accommodation eco:wifiAvailable ?wifiAvailable }}
          OPTIONAL {{ ?accommodation eco:parkingAvailable ?parkingAvailable }}
          OPTIONAL {{ ?accommodation eco:accommodationRating ?accommodationRating }}
          OPTIONAL {{ ?accommodation eco:contactEmail ?contactEmail }}
          OPTIONAL {{ ?accommodation eco:accommodationPhone ?accommodationPhone }}
          OPTIONAL {{ ?accommodation eco:ecoCertified ?ecoCertified }}
          OPTIONAL {{ ?accommodation eco:renewableEnergyPercent ?renewableEnergyPercent }}
          OPTIONAL {{ ?accommodation eco:wasteRecyclingRate ?wasteRecyclingRate }}
          OPTIONAL {{ ?accommodation eco:organicFoodOffered ?organicFoodOffered }}
          OPTIONAL {{ ?accommodation eco:waterConservationSystem ?waterConservationSystem }}
          OPTIONAL {{ ?accommodation eco:familyOwned ?familyOwned }}
          OPTIONAL {{ ?accommodation eco:traditionalArchitecture ?traditionalArchitecture }}
          OPTIONAL {{ ?accommodation eco:homeCookedMeals ?homeCookedMeals }}
          OPTIONAL {{ ?accommodation eco:culturalExperiences ?culturalExperiences }}
          OPTIONAL {{ ?accommodation eco:starRating ?starRating }}
          OPTIONAL {{ ?accommodation eco:hasSwimmingPool ?hasSwimmingPool }}
          OPTIONAL {{ ?accommodation eco:hasSpa ?hasSpa }}
          OPTIONAL {{ ?accommodation eco:hasRestaurant ?hasRestaurant }}
          OPTIONAL {{ ?accommodation eco:roomService ?roomService }}
        }}
        """
        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        
        if not binds:
            raise HTTPException(status_code=404, detail=f"Accommodation with ID '{accommodation_id}' not found")
        
        accommodation = _parse_accommodation(binds[0])
        return {"status": "success", "accommodation": accommodation}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# POST /accommodations
@router.post("/", summary="Créer un nouvel hébergement")
def create_accommodation(data: AccommodationCreateRequest):
    uri = f"eco:{data.accommodationId}"
    type_triples = f"{uri} a eco:{data.type} ."
    triples = [type_triples]

    def add_triple(prop, val, is_bool=False, is_float=False, is_int=False):
        if val is not None:
            if is_bool:
                triples.append(f'{uri} eco:{prop} "{str(val).lower()}"^^<http://www.w3.org/2001/XMLSchema#boolean> .')
            elif is_float:
                triples.append(f'{uri} eco:{prop} "{val}"^^xsd:float .')
            elif is_int:
                triples.append(f'{uri} eco:{prop} "{val}"^^xsd:integer .')
            elif isinstance(val, str):
                triples.append(f'{uri} eco:{prop} "{val}" .')
            else:
                triples.append(f'{uri} eco:{prop} {val} .')

    add_triple("accommodationId", data.accommodationId)
    add_triple("accommodationName", data.name)
    add_triple("accommodationDescription", data.description)
    add_triple("pricePerNight", data.pricePerNight, is_float=True)
    add_triple("numberOfRooms", data.numberOfRooms, is_int=True)
    add_triple("maxGuests", data.maxGuests, is_int=True)
    add_triple("checkInTime", data.checkInTime)
    add_triple("checkOutTime", data.checkOutTime)
    add_triple("wifiAvailable", data.wifiAvailable, is_bool=True)
    add_triple("parkingAvailable", data.parkingAvailable, is_bool=True)
    add_triple("accommodationRating", data.accommodationRating, is_float=True)
    add_triple("contactEmail", data.contactEmail)
    add_triple("accommodationPhone", data.accommodationPhone)
    add_triple("ecoCertified", data.ecoCertified, is_bool=True)
    add_triple("renewableEnergyPercent", data.renewableEnergyPercent, is_float=True)
    add_triple("wasteRecyclingRate", data.wasteRecyclingRate, is_float=True)
    add_triple("organicFoodOffered", data.organicFoodOffered, is_bool=True)
    add_triple("waterConservationSystem", data.waterConservationSystem, is_bool=True)
    add_triple("familyOwned", data.familyOwned, is_bool=True)
    add_triple("traditionalArchitecture", data.traditionalArchitecture, is_bool=True)
    add_triple("homeCookedMeals", data.homeCookedMeals, is_bool=True)
    add_triple("culturalExperiences", data.culturalExperiences)
    add_triple("starRating", data.starRating, is_int=True)
    add_triple("hasSwimmingPool", data.hasSwimmingPool, is_bool=True)
    add_triple("hasSpa", data.hasSpa, is_bool=True)
    add_triple("hasRestaurant", data.hasRestaurant, is_bool=True)
    add_triple("roomService", data.roomService, is_bool=True)

    triples_str = "\n    ".join(triples)
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    INSERT DATA {{
        {triples_str}
    }}
    """
    try:
        result = sparql_insert(sparql)
        return {"status": "success", "message": f"Accommodation '{data.name}' created", "uri": uri}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# POST /accommodations/compare - CORRIGÉ
# @router.post("/compare", summary="Comparer deux hébergements")
# def compare_accommodations(accommodation_id1: str = Body(...), accommodation_id2: str = Body(...)):
#     try:
#         sparql = f"""
#         PREFIX eco: <http://www.ecotourism.org/ontology#>
#         SELECT ?accommodation ?accommodationId ?accommodationName ?pricePerNight ?accommodationRating
#                ?ecoCertified ?numberOfRooms ?maxGuests ?wifiAvailable ?parkingAvailable
#         WHERE {{
#           VALUES ?accommodationId {{ "{accommodation_id1}" "{accommodation_id2}" }}
#           ?accommodation eco:accommodationId ?accommodationId ;
#                          eco:accommodationName ?accommodationName .
#           OPTIONAL {{ ?accommodation eco:pricePerNight ?pricePerNight }}
#           OPTIONAL {{ ?accommodation eco:accommodationRating ?accommodationRating }}
#           OPTIONAL {{ ?accommodation eco:ecoCertified ?ecoCertified }}
#           OPTIONAL {{ ?accommodation eco:numberOfRooms ?numberOfRooms }}
#           OPTIONAL {{ ?accommodation eco:maxGuests ?maxGuests }}
#           OPTIONAL {{ ?accommodation eco:wifiAvailable ?wifiAvailable }}
#           OPTIONAL {{ ?accommodation eco:parkingAvailable ?parkingAvailable }}
#         }}
#         """
#         results = sparql_select(sparql)
#         binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
#
#         if len(binds) < 2:
#             raise HTTPException(
#                 status_code=404,
#                 detail=f"One or both accommodations not found. Found {len(binds)} accommodation(s)"
#             )
#
#         accommodations = []
#         for b in binds:
#             acc = {
#                 "accommodationId": _extract_value(_safe_get(b, 'accommodationId')),
#                 "name": _extract_value(_safe_get(b, 'accommodationName')),
#                 "pricePerNight": float(_extract_value(_safe_get(b, 'pricePerNight')) or 0) if _safe_get(b, 'pricePerNight') else None,
#                 "rating": float(_extract_value(_safe_get(b, 'accommodationRating')) or 0) if _safe_get(b, 'accommodationRating') else None,
#                 "ecoCertified": (_extract_value(_safe_get(b, 'ecoCertified')) == 'true') if _safe_get(b, 'ecoCertified') else None,
#                 "numberOfRooms": int(_extract_value(_safe_get(b, 'numberOfRooms')) or 0) if _safe_get(b, 'numberOfRooms') else None,
#                 "maxGuests": int(_extract_value(_safe_get(b, 'maxGuests')) or 0) if _safe_get(b, 'maxGuests') else None,
#                 "wifiAvailable": (_extract_value(_safe_get(b, 'wifiAvailable')) == 'true') if _safe_get(b, 'wifiAvailable') else None,
#                 "parkingAvailable": (_extract_value(_safe_get(b, 'parkingAvailable')) == 'true') if _safe_get(b, 'parkingAvailable') else None,
#                 "uri": _extract_value(_safe_get(b, 'accommodation'))
#             }
#             accommodations.append(acc)
#
#         # Créer une comparaison structurée
#         comparison = {
#             "accommodation1": accommodations[0],
#             "accommodation2": accommodations[1],
#             "differences": {}
#         }
#
#         # Comparer les prix
#         if accommodations[0].get("pricePerNight") and accommodations[1].get("pricePerNight"):
#             price_diff = accommodations[0]["pricePerNight"] - accommodations[1]["pricePerNight"]
#             comparison["differences"]["price"] = {
#                 "difference": round(price_diff, 2),
#                 "cheaper": accommodations[0]["accommodationId"] if price_diff < 0 else accommodations[1]["accommodationId"]
#             }
#
#         # Comparer les notes
#         if accommodations[0].get("rating") and accommodations[1].get("rating"):
#             rating_diff = accommodations[0]["rating"] - accommodations[1]["rating"]
#             comparison["differences"]["rating"] = {
#                 "difference": round(rating_diff, 2),
#                 "better_rated": accommodations[0]["accommodationId"] if rating_diff > 0 else accommodations[1]["accommodationId"]
#             }
#
#         return {
#             "status": "success",
#             "comparison": comparison
#         }
#
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# POST /accommodations/recommend
# @router.post("/recommend", summary="Recommandations basées sur les préférences")
# def recommend_accommodations(preferences: Dict[str, Any] = Body(...)):
#     try:
#         recommender = AccommodationRecommender()
#         recommendations = recommender.get_recommendations(preferences)
#         return {"status": "success", "count": len(recommendations), "recommendations": recommendations}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# GET /accommodations/filter
# @router.get("/filter", summary="Filtrer par critères multiples")
# def filter_accommodations(
#     min_price: Optional[float] = Query(None),
#     max_price: Optional[float] = Query(None),
#     min_rating: Optional[float] = Query(None),
#     eco_certified: Optional[bool] = Query(None)
# ):
#     filters = []
#     if min_price is not None:
#         filters.append(f"?pricePerNight >= {min_price}")
#     if max_price is not None:
#         filters.append(f"?pricePerNight <= {max_price}")
#     if min_rating is not None:
#         filters.append(f"?accommodationRating >= {min_rating}")
#     if eco_certified is not None:
#         filters.append(f'?ecoCertified = "{str(eco_certified).lower()}"^^<http://www.w3.org/2001/XMLSchema#boolean>')
#
#     filter_clause = " && ".join(filters) if filters else ""
#
#     sparql = f"""
#     PREFIX eco: <http://www.ecotourism.org/ontology#>
#     SELECT ?accommodation ?accommodationId ?accommodationName ?pricePerNight ?accommodationRating ?ecoCertified
#     WHERE {{
#       ?accommodation eco:accommodationId ?accommodationId ;
#                      eco:accommodationName ?accommodationName .
#       OPTIONAL {{ ?accommodation eco:pricePerNight ?pricePerNight }}
#       OPTIONAL {{ ?accommodation eco:accommodationRating ?accommodationRating }}
#       OPTIONAL {{ ?accommodation eco:ecoCertified ?ecoCertified }}
#       {"FILTER (" + filter_clause + ")" if filter_clause else ""}
#     }}
#     """
#     try:
#         return sparql_select(sparql)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# DELETE /accommodations/{id}
@router.delete("/{accommodation_id}", summary="Supprimer un hébergement")
def delete_accommodation(accommodation_id: str):
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    DELETE WHERE {{ eco:{accommodation_id} ?p ?o . }}
    """
    try:
        result = sparql_delete(sparql)
        return {
            "status": "success",
            "message": f"Accommodation '{accommodation_id}' deleted",
            "details": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /accommodations/stats/top-rated
@router.get("/stats/top-rated", summary="Top 10 hébergements les mieux notés")
def get_top_rated():
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?accommodation ?accommodationName ?accommodationRating
        WHERE {
          ?accommodation eco:accommodationName ?accommodationName .
          OPTIONAL { ?accommodation eco:accommodationRating ?accommodationRating }
        }
        """
        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        rows = []
        for b in binds:
            name = _extract_value(_safe_get(b, "accommodationName"))
            rating = float(_extract_value(_safe_get(b, "accommodationRating")) or 0) if _safe_get(b, "accommodationRating") else None
            uri = _extract_value(_safe_get(b, "accommodation"))
            if rating is not None:
                rows.append({"name": name, "rating": rating, "uri": uri})
        sorted_rows = sorted(rows, key=lambda x: x["rating"], reverse=True)[:10]
        return {"status": "success", "count": len(sorted_rows), "accommodations": sorted_rows, "ranking": "by_rating"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /accommodations/stats/cheapest
@router.get("/stats/cheapest", summary="Top 10 hébergements moins chers")
def get_cheapest():
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?accommodation ?accommodationName ?pricePerNight
        WHERE {
          ?accommodation eco:accommodationName ?accommodationName .
          OPTIONAL { ?accommodation eco:pricePerNight ?pricePerNight }
        }
        """
        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        rows = []
        for b in binds:
            name = _extract_value(_safe_get(b, "accommodationName"))
            price = float(_extract_value(_safe_get(b, "pricePerNight")) or 0) if _safe_get(b, "pricePerNight") else None
            uri = _extract_value(_safe_get(b, "accommodation"))
            if price is not None:
                rows.append({"name": name, "pricePerNight": price, "uri": uri})
        sorted_rows = sorted(rows, key=lambda x: x["pricePerNight"])[:10]
        return {"status": "success", "count": len(sorted_rows), "accommodations": sorted_rows, "ranking": "by_price"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /accommodations/search/{name}
@router.get("/search/{name}", summary="Rechercher un hébergement par nom")
def search_accommodation_by_name(name: str):
    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?accommodation ?accommodationId ?accommodationName ?pricePerNight ?accommodationRating ?ecoCertified
        WHERE {{
          ?accommodation eco:accommodationName ?accommodationName .
          FILTER(CONTAINS(LCASE(?accommodationName), LCASE("{name}")))
          OPTIONAL {{ ?accommodation eco:accommodationId ?accommodationId }}
          OPTIONAL {{ ?accommodation eco:pricePerNight ?pricePerNight }}
          OPTIONAL {{ ?accommodation eco:accommodationRating ?accommodationRating }}
          OPTIONAL {{ ?accommodation eco:ecoCertified ?ecoCertified }}
        }}
        """
        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        accommodations = [_parse_accommodation(b) for b in binds]
        return {"status": "success", "count": len(accommodations), "accommodations": accommodations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# PUT /accommodations/{id} - Mise à jour multiple (nouvel endpoint)
@router.put("/{accommodation_id}", summary="Mettre à jour les attributs d'un hébergement")
def update_accommodation(accommodation_id: str, updates: AccommodationUpdateRequest):
    try:
        # 1) Vérifier existence de l'hébergement
        check_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?accommodation
        WHERE {{
          ?accommodation eco:accommodationId "{accommodation_id}" .
        }}
        LIMIT 1
        """
        check_result = sparql_select(check_sparql)
        binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []
        if not binds:
            raise HTTPException(status_code=404, detail=f"Accommodation '{accommodation_id}' not found")

        # 2) Préparer les mises à jour
        def esc(val: str) -> str:
            return val.replace('\\', r'\\').replace('"', r'\\"') if isinstance(val, str) else val

        updates_dict = updates.model_dump(exclude_none=True)
        if not updates_dict:
            return {"status": "noop", "message": "No fields provided for update", "accommodationId": accommodation_id}

        # mapping des champs Pydantic -> propriétés eco:
        prop_map = {
            "name": "accommodationName",
            "description": "accommodationDescription",
            "pricePerNight": "pricePerNight",
            "numberOfRooms": "numberOfRooms",
            "maxGuests": "maxGuests",
            "checkInTime": "checkInTime",
            "checkOutTime": "checkOutTime",
            "wifiAvailable": "wifiAvailable",
            "parkingAvailable": "parkingAvailable",
            "accommodationRating": "accommodationRating",
            "contactEmail": "contactEmail",
            "accommodationPhone": "accommodationPhone",
            "ecoCertified": "ecoCertified",
            "renewableEnergyPercent": "renewableEnergyPercent",
            "wasteRecyclingRate": "wasteRecyclingRate",
            "organicFoodOffered": "organicFoodOffered",
            "waterConservationSystem": "waterConservationSystem",
            "familyOwned": "familyOwned",
            "traditionalArchitecture": "traditionalArchitecture",
            "homeCookedMeals": "homeCookedMeals",
            "culturalExperiences": "culturalExperiences",
            "starRating": "starRating",
            "hasSwimmingPool": "hasSwimmingPool",
            "hasSpa": "hasSpa",
            "hasRestaurant": "hasRestaurant",
            "roomService": "roomService"
        }
        bool_fields = {"wifiAvailable", "parkingAvailable", "ecoCertified", "organicFoodOffered", "waterConservationSystem", "familyOwned", "traditionalArchitecture", "homeCookedMeals", "hasSwimmingPool", "hasSpa", "hasRestaurant", "roomService"}
        float_fields = {"pricePerNight", "accommodationRating", "renewableEnergyPercent", "wasteRecyclingRate"}
        int_fields = {"numberOfRooms", "maxGuests", "starRating"}

        deletes = []
        inserts = []
        optionals = []
        for field, value in updates_dict.items():
            eco_prop = prop_map.get(field)
            if not eco_prop:
                continue
            var_old = f"?old_{eco_prop}"
            deletes.append(f"?accommodation eco:{eco_prop} {var_old} .")

            # Build insertion with appropriate datatype
            if field in bool_fields:
                bool_value = "true" if bool(value) else "false"
                inserts.append(f"?accommodation eco:{eco_prop} \"{bool_value}\"^^xsd:boolean .")
            elif field in float_fields:
                inserts.append(f"?accommodation eco:{eco_prop} \"{value}\"^^xsd:float .")
            elif field in int_fields:
                inserts.append(f"?accommodation eco:{eco_prop} \"{value}\"^^xsd:integer .")
            else:
                inserts.append(f"?accommodation eco:{eco_prop} \"{esc(value)}\" .")

            optionals.append(f"OPTIONAL {{ ?accommodation eco:{eco_prop} {var_old} . }}")

        # 3) Construire la requête SPARQL UPDATE
        delete_str = "\n          ".join(deletes) if deletes else ""
        insert_str = "\n          ".join(inserts) if inserts else ""
        optional_str = "\n          ".join(optionals) if optionals else ""

        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        DELETE {{
          {delete_str}
        }}
        INSERT {{
          {insert_str}
        }}
        WHERE {{
          ?accommodation eco:accommodationId \"{accommodation_id}\" .
          {optional_str}
        }}
        """
        result = sparql_update(sparql)
        return {
            "status": "success",
            "message": "Accommodation updated",
            "accommodationId": accommodation_id,
            "updatedFields": list(updates_dict.keys()),
            "details": result
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PUT /accommodations/{id}/name - CORRIGÉ
# @router.put("/{accommodation_id}/name", summary="Modifier le nom de l'hébergement")
# def update_accommodation_name(accommodation_id: str, new_name: str = Body(..., embed=True)):
#     try:
#         # Vérifier si l'hébergement existe en cherchant son accommodationId
#         check_sparql = f"""
#         PREFIX eco: <http://www.ecotourism.org/ontology#>
#         SELECT ?accommodation
#         WHERE {{
#           ?accommodation eco:accommodationId "{accommodation_id}" .
#         }}
#         LIMIT 1
#         """
#
#         check_result = sparql_select(check_sparql)
#         binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []
#
#         if not binds:
#             raise HTTPException(status_code=404, detail=f"Accommodation '{accommodation_id}' not found")
#
#         # Supprimer l'ancien nom et insérer le nouveau
#         sparql = f"""
#         PREFIX eco: <http://www.ecotourism.org/ontology#>
#         DELETE {{ ?accommodation eco:accommodationName ?oldName . }}
#         INSERT {{ ?accommodation eco:accommodationName \"{new_name}\" . }}
#         WHERE {{
#           ?accommodation eco:accommodationId \"{accommodation_id}\" .
#           OPTIONAL {{ ?accommodation eco:accommodationName ?oldName . }}
#         }}
#         """
#         result = sparql_update(sparql)
#         return {
#             "status": "success",
#             "message": f"Name updated to '{new_name}' for accommodation '{accommodation_id}'",
#             "accommodationId": accommodation_id,
#             "newName": new_name,
#             "details": result
#         }
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#
#
# # PUT /accommodations/{id}/price - CORRIGÉ
# @router.put("/{accommodation_id}/price", summary="Modifier le prix par nuit")
# def update_accommodation_price(accommodation_id: str, new_price: float = Body(..., embed=True)):
#     try:
#         # Vérifier si l'hébergement existe en cherchant son accommodationId
#         check_sparql = f"""
#         PREFIX eco: <http://www.ecotourism.org/ontology#>
#         SELECT ?accommodation
#         WHERE {{
#           ?accommodation eco:accommodationId "{accommodation_id}" .
#         }}
#         LIMIT 1
#         """
#
#         check_result = sparql_select(check_sparql)
#         binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []
#
#         if not binds:
#             raise HTTPException(status_code=404, detail=f"Accommodation '{accommodation_id}' not found")
#
#         # Supprimer l'ancien prix et insérer le nouveau
#         sparql = f"""
#         PREFIX eco: <http://www.ecotourism.org/ontology#>
#         PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
#         DELETE {{ ?accommodation eco:pricePerNight ?oldPrice . }}
#         INSERT {{ ?accommodation eco:pricePerNight \"{new_price}\"^^xsd:float . }}
#         WHERE {{
#           ?accommodation eco:accommodationId \"{accommodation_id}\" .
#           OPTIONAL {{ ?accommodation eco:pricePerNight ?oldPrice . }}
#         }}
#         """
#         result = sparql_update(sparql)
#         return {
#             "status": "success",
#             "message": f"Price updated to {new_price} for accommodation '{accommodation_id}'",
#             "accommodationId": accommodation_id,
#             "newPrice": new_price,
#             "details": result
#         }
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#
#
# # PUT /accommodations/{id}/rating - CORRIGÉ
# @router.put("/{accommodation_id}/rating", summary="Modifier la note")
# def update_accommodation_rating(accommodation_id: str, new_rating: float = Body(..., embed=True)):
#     try:
#         # Vérifier si l'hébergement existe en cherchant son accommodationId
#         check_sparql = f"""
#         PREFIX eco: <http://www.ecotourism.org/ontology#>
#         SELECT ?accommodation
#         WHERE {{
#           ?accommodation eco:accommodationId "{accommodation_id}" .
#         }}
#         LIMIT 1
#         """
#
#         check_result = sparql_select(check_sparql)
#         binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []
#
#         if not binds:
#             raise HTTPException(status_code=404, detail=f"Accommodation '{accommodation_id}' not found")
#
#         # Supprimer l'ancienne note et insérer la nouvelle
#         sparql = f"""
#         PREFIX eco: <http://www.ecotourism.org/ontology#>
#         PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
#         DELETE {{ ?accommodation eco:accommodationRating ?oldRating . }}
#         INSERT {{ ?accommodation eco:accommodationRating \"{new_rating}\"^^xsd:float . }}
#         WHERE {{
#           ?accommodation eco:accommodationId \"{accommodation_id}\" .
#           OPTIONAL {{ ?accommodation eco:accommodationRating ?oldRating . }}
#         }}
#         """
#         result = sparql_update(sparql)
#         return {
#             "status": "success",
#             "message": f"Rating updated to {new_rating} for accommodation '{accommodation_id}'",
#             "accommodationId": accommodation_id,
#             "newRating": new_rating,
#             "details": result
#         }
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#
#
# # PUT /accommodations/{id}/certified - CORRIGÉ (FIX ERREUR 500)
# @router.put("/{accommodation_id}/certified", summary="Modifier la certification")
# def update_accommodation_certified(accommodation_id: str, certified: bool = Body(..., embed=True)):
#     try:
#         # Vérifier si l'hébergement existe en cherchant son accommodationId
#         check_sparql = f"""
#         PREFIX eco: <http://www.ecotourism.org/ontology#>
#         SELECT ?accommodation
#         WHERE {{
#           ?accommodation eco:accommodationId "{accommodation_id}" .
#         }}
#         LIMIT 1
#         """
#
#         check_result = sparql_select(check_sparql)
#         binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []
#
#         if not binds:
#             raise HTTPException(status_code=404, detail=f"Accommodation '{accommodation_id}' not found")
#
#         # Supprimer l'ancienne certification et insérer la nouvelle
#         bool_value = "true" if certified else "false"
#         sparql = f"""
#         PREFIX eco: <http://www.ecotourism.org/ontology#>
#         PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
#         DELETE {{ ?accommodation eco:ecoCertified ?oldCertified . }}
#         INSERT {{ ?accommodation eco:ecoCertified \"{bool_value}\"^^xsd:boolean . }}
#         WHERE {{
#           ?accommodation eco:accommodationId \"{accommodation_id}\" .
#           OPTIONAL {{ ?accommodation eco:ecoCertified ?oldCertified . }}
#         }}
#         """
#         result = sparql_update(sparql)
#         return {
#             "status": "success",
#             "message": f"Certification updated to {certified} for accommodation '{accommodation_id}'",
#             "accommodationId": accommodation_id,
#             "ecoCertified": certified,
#             "details": result
#         }
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))