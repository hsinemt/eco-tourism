from fastapi import APIRouter, Query, HTTPException, Body
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.services.sparql_helpers import sparql_insert, sparql_update, sparql_delete, sparql_select

router = APIRouter()


# ============================================
# MODÈLES PYDANTIC
# ============================================

class TransportResponse(BaseModel):
    transportId: str
    transportName: str
    transportType: str
    pricePerKm: Optional[float]
    carbonEmissionPerKm: Optional[float]
    capacity: Optional[int]
    availability: Optional[bool]
    operatingHours: Optional[str]
    averageSpeed: Optional[float]
    contactPhone: Optional[str]
    # Bike-specific
    bikeModel: Optional[str]
    isElectric: Optional[bool]
    batteryRange: Optional[float]
    rentalPricePerHour: Optional[float]
    frameSize: Optional[str]
    # ElectricVehicle-specific
    vehicleModel: Optional[str]
    vehicleBatteryRange: Optional[float]
    chargingTime: Optional[int]
    seatingCapacity: Optional[int]
    dailyRentalPrice: Optional[float]
    hasAirConditioning: Optional[bool]
    # PublicTransport-specific
    lineNumber: Optional[str]
    routeDescription: Optional[str]
    ticketPrice: Optional[float]
    frequencyMinutes: Optional[int]
    accessibleForDisabled: Optional[bool]
    uri: str


class BikeCreate(BaseModel):
    transportId: str = Field(..., description="ID unique (ex: BIKE-001)")
    transportName: str
    transportType: str = Field(..., description="Electric Bike, Mountain Bike, City Bike, etc.")
    bikeModel: str
    isElectric: bool
    batteryRange: Optional[float] = Field(0.0, description="Autonomie batterie en km (0 si non électrique)")
    rentalPricePerHour: float
    pricePerKm: Optional[float] = Field(0.0)
    carbonEmissionPerKm: Optional[float] = Field(0.0)
    capacity: int = Field(1, description="Nombre de places")
    availability: bool = Field(True)
    operatingHours: str
    averageSpeed: float
    frameSize: str
    contactPhone: str


class ElectricVehicleCreate(BaseModel):
    transportId: str = Field(..., description="ID unique (ex: EV-001)")
    transportName: str
    transportType: str = Field(..., description="Electric Car, Electric SUV, Electric Minivan, etc.")
    vehicleModel: str
    vehicleBatteryRange: float = Field(..., description="Autonomie batterie en km")
    chargingTime: int = Field(..., description="Temps de charge en heures")
    seatingCapacity: int
    dailyRentalPrice: float
    pricePerKm: float
    carbonEmissionPerKm: Optional[float] = Field(0.0)
    capacity: int
    availability: bool = Field(True)
    hasAirConditioning: bool = Field(True)
    operatingHours: str
    averageSpeed: float
    contactPhone: str


class PublicTransportCreate(BaseModel):
    transportId: str = Field(..., description="ID unique (ex: PT-001)")
    transportName: str
    transportType: str = Field(..., description="Metro, Bus, Tram, Train, etc.")
    lineNumber: str
    routeDescription: str
    ticketPrice: float
    pricePerKm: float
    carbonEmissionPerKm: float
    capacity: int
    availability: bool = Field(True)
    frequencyMinutes: int = Field(..., description="Fréquence en minutes")
    accessibleForDisabled: bool = Field(True)
    operatingHours: str
    averageSpeed: float
    contactPhone: str


class TransportUpdate(BaseModel):
    transportName: Optional[str] = None
    availability: Optional[bool] = None
    pricePerKm: Optional[float] = None
    operatingHours: Optional[str] = None


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


def _parse_transport(bind):
    """Parse un binding SPARQL en transport complet"""
    return {
        "transportId": _extract_value(_safe_get(bind, 'transportId')),
        "transportName": _extract_value(_safe_get(bind, 'transportName')),
        "transportType": _extract_value(_safe_get(bind, 'transportType')),
        "pricePerKm": float(_extract_value(_safe_get(bind, 'pricePerKm')) or 0) if _safe_get(bind,
                                                                                             'pricePerKm') else None,
        "carbonEmissionPerKm": float(_extract_value(_safe_get(bind, 'carbonEmissionPerKm')) or 0) if _safe_get(bind,
                                                                                                               'carbonEmissionPerKm') else None,
        "capacity": int(_extract_value(_safe_get(bind, 'capacity')) or 0) if _safe_get(bind, 'capacity') else None,
        "availability": (_extract_value(_safe_get(bind, 'availability')) == 'true') if _safe_get(bind,
                                                                                                 'availability') else None,
        "operatingHours": _extract_value(_safe_get(bind, 'operatingHours')),
        "averageSpeed": float(_extract_value(_safe_get(bind, 'averageSpeed')) or 0) if _safe_get(bind,
                                                                                                 'averageSpeed') else None,
        "contactPhone": _extract_value(_safe_get(bind, 'contactPhone')),
        # Bike fields
        "bikeModel": _extract_value(_safe_get(bind, 'bikeModel')),
        "isElectric": (_extract_value(_safe_get(bind, 'isElectric')) == 'true') if _safe_get(bind,
                                                                                             'isElectric') else None,
        "batteryRange": float(_extract_value(_safe_get(bind, 'batteryRange')) or 0) if _safe_get(bind,
                                                                                                 'batteryRange') else None,
        "rentalPricePerHour": float(_extract_value(_safe_get(bind, 'rentalPricePerHour')) or 0) if _safe_get(bind,
                                                                                                             'rentalPricePerHour') else None,
        "frameSize": _extract_value(_safe_get(bind, 'frameSize')),
        # EV fields
        "vehicleModel": _extract_value(_safe_get(bind, 'vehicleModel')),
        "vehicleBatteryRange": float(_extract_value(_safe_get(bind, 'vehicleBatteryRange')) or 0) if _safe_get(bind,
                                                                                                               'vehicleBatteryRange') else None,
        "chargingTime": int(_extract_value(_safe_get(bind, 'chargingTime')) or 0) if _safe_get(bind,
                                                                                               'chargingTime') else None,
        "seatingCapacity": int(_extract_value(_safe_get(bind, 'seatingCapacity')) or 0) if _safe_get(bind,
                                                                                                     'seatingCapacity') else None,
        "dailyRentalPrice": float(_extract_value(_safe_get(bind, 'dailyRentalPrice')) or 0) if _safe_get(bind,
                                                                                                         'dailyRentalPrice') else None,
        "hasAirConditioning": (_extract_value(_safe_get(bind, 'hasAirConditioning')) == 'true') if _safe_get(bind,
                                                                                                             'hasAirConditioning') else None,
        # PT fields
        "lineNumber": _extract_value(_safe_get(bind, 'lineNumber')),
        "routeDescription": _extract_value(_safe_get(bind, 'routeDescription')),
        "ticketPrice": float(_extract_value(_safe_get(bind, 'ticketPrice')) or 0) if _safe_get(bind,
                                                                                               'ticketPrice') else None,
        "frequencyMinutes": int(_extract_value(_safe_get(bind, 'frequencyMinutes')) or 0) if _safe_get(bind,
                                                                                                       'frequencyMinutes') else None,
        "accessibleForDisabled": (_extract_value(_safe_get(bind, 'accessibleForDisabled')) == 'true') if _safe_get(bind,
                                                                                                                   'accessibleForDisabled') else None,
        "uri": _extract_value(_safe_get(bind, 'transport'))
    }


# ============================================
# ENDPOINTS CRUD DE BASE
# ============================================

# GET /transports/ - Rechercher tous les transports
@router.get("/", summary="Rechercher tous les transports")
def search_transports(
        type: Optional[str] = Query(None, description="Type: Bike, ElectricVehicle, PublicTransport"),
        limit: int = Query(20, ge=1, le=100)
):
    """Retourne les transports filtrés par type"""
    try:
        # If a type is provided, filter by rdf:type eco:Type. Otherwise, no type triple.
        type_filter = f"a eco:{type} ;" if type else ""

        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?transport ?transportId ?transportName ?transportType ?pricePerKm ?carbonEmissionPerKm 
               ?capacity ?availability ?operatingHours ?averageSpeed ?contactPhone
               ?bikeModel ?isElectric ?batteryRange ?rentalPricePerHour ?frameSize
               ?vehicleModel ?vehicleBatteryRange ?chargingTime ?seatingCapacity ?dailyRentalPrice ?hasAirConditioning
               ?lineNumber ?routeDescription ?ticketPrice ?frequencyMinutes ?accessibleForDisabled
        WHERE {{
          ?transport {type_filter}
                     eco:transportId ?transportId ;
                     eco:transportName ?transportName .
          OPTIONAL {{ ?transport eco:transportType ?transportType }}
          OPTIONAL {{ ?transport eco:pricePerKm ?pricePerKm }}
          OPTIONAL {{ ?transport eco:carbonEmissionPerKm ?carbonEmissionPerKm }}
          OPTIONAL {{ ?transport eco:capacity ?capacity }}
          OPTIONAL {{ ?transport eco:availability ?availability }}
          OPTIONAL {{ ?transport eco:operatingHours ?operatingHours }}
          OPTIONAL {{ ?transport eco:averageSpeed ?averageSpeed }}
          OPTIONAL {{ ?transport eco:contactPhone ?contactPhone }}
          OPTIONAL {{ ?transport eco:bikeModel ?bikeModel }}
          OPTIONAL {{ ?transport eco:isElectric ?isElectric }}
          OPTIONAL {{ ?transport eco:batteryRange ?batteryRange }}
          OPTIONAL {{ ?transport eco:rentalPricePerHour ?rentalPricePerHour }}
          OPTIONAL {{ ?transport eco:frameSize ?frameSize }}
          OPTIONAL {{ ?transport eco:vehicleModel ?vehicleModel }}
          OPTIONAL {{ ?transport eco:vehicleBatteryRange ?vehicleBatteryRange }}
          OPTIONAL {{ ?transport eco:chargingTime ?chargingTime }}
          OPTIONAL {{ ?transport eco:seatingCapacity ?seatingCapacity }}
          OPTIONAL {{ ?transport eco:dailyRentalPrice ?dailyRentalPrice }}
          OPTIONAL {{ ?transport eco:hasAirConditioning ?hasAirConditioning }}
          OPTIONAL {{ ?transport eco:lineNumber ?lineNumber }}
          OPTIONAL {{ ?transport eco:routeDescription ?routeDescription }}
          OPTIONAL {{ ?transport eco:ticketPrice ?ticketPrice }}
          OPTIONAL {{ ?transport eco:frequencyMinutes ?frequencyMinutes }}
          OPTIONAL {{ ?transport eco:accessibleForDisabled ?accessibleForDisabled }}
        }}
        LIMIT {limit}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        transports = [_parse_transport(b) for b in binds]

        return {"status": "success", "count": len(transports), "transports": transports}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /transports/{transport_id} - Obtenir un transport par ID
@router.get("/{transport_id}", summary="Afficher un transport par identifiant")
def get_transport(transport_id: str):
    """Récupère les détails d'un transport spécifique"""
    try:
        # Vérifier si le transport existe
        check_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?transport
        WHERE {{
          ?transport eco:transportId "{transport_id}" .
        }}
        LIMIT 1
        """

        check_result = sparql_select(check_sparql)
        binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Transport '{transport_id}' not found")

        # Récupérer tous les détails
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?transport ?transportId ?transportName ?transportType ?pricePerKm ?carbonEmissionPerKm 
               ?capacity ?availability ?operatingHours ?averageSpeed ?contactPhone
               ?bikeModel ?isElectric ?batteryRange ?rentalPricePerHour ?frameSize
               ?vehicleModel ?vehicleBatteryRange ?chargingTime ?seatingCapacity ?dailyRentalPrice ?hasAirConditioning
               ?lineNumber ?routeDescription ?ticketPrice ?frequencyMinutes ?accessibleForDisabled
        WHERE {{
          ?transport eco:transportId "{transport_id}" ;
                     eco:transportName ?transportName .
          BIND("{transport_id}" AS ?transportId)
          OPTIONAL {{ ?transport eco:transportType ?transportType }}
          OPTIONAL {{ ?transport eco:pricePerKm ?pricePerKm }}
          OPTIONAL {{ ?transport eco:carbonEmissionPerKm ?carbonEmissionPerKm }}
          OPTIONAL {{ ?transport eco:capacity ?capacity }}
          OPTIONAL {{ ?transport eco:availability ?availability }}
          OPTIONAL {{ ?transport eco:operatingHours ?operatingHours }}
          OPTIONAL {{ ?transport eco:averageSpeed ?averageSpeed }}
          OPTIONAL {{ ?transport eco:contactPhone ?contactPhone }}
          OPTIONAL {{ ?transport eco:bikeModel ?bikeModel }}
          OPTIONAL {{ ?transport eco:isElectric ?isElectric }}
          OPTIONAL {{ ?transport eco:batteryRange ?batteryRange }}
          OPTIONAL {{ ?transport eco:rentalPricePerHour ?rentalPricePerHour }}
          OPTIONAL {{ ?transport eco:frameSize ?frameSize }}
          OPTIONAL {{ ?transport eco:vehicleModel ?vehicleModel }}
          OPTIONAL {{ ?transport eco:vehicleBatteryRange ?vehicleBatteryRange }}
          OPTIONAL {{ ?transport eco:chargingTime ?chargingTime }}
          OPTIONAL {{ ?transport eco:seatingCapacity ?seatingCapacity }}
          OPTIONAL {{ ?transport eco:dailyRentalPrice ?dailyRentalPrice }}
          OPTIONAL {{ ?transport eco:hasAirConditioning ?hasAirConditioning }}
          OPTIONAL {{ ?transport eco:lineNumber ?lineNumber }}
          OPTIONAL {{ ?transport eco:routeDescription ?routeDescription }}
          OPTIONAL {{ ?transport eco:ticketPrice ?ticketPrice }}
          OPTIONAL {{ ?transport eco:frequencyMinutes ?frequencyMinutes }}
          OPTIONAL {{ ?transport eco:accessibleForDisabled ?accessibleForDisabled }}
        }}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Transport '{transport_id}' not found")

        transport = _parse_transport(binds[0])
        return {"status": "success", "transport": transport}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# POST /transports/bike - Créer un vélo
@router.post("/bike", summary="Ajouter un vélo")
def create_bike(data: BikeCreate):
    """Ajoute un nouveau vélo"""
    uri = f"eco:{data.transportId}"
    triples = [f"{uri} a eco:Bike ."]

    def add_triple(prop, val, is_bool=False, is_float=False, is_int=False):
        if val is not None:
            if is_bool:
                triples.append(f'{uri} eco:{prop} "{str(val).lower()}"^^<http://www.w3.org/2001/XMLSchema#boolean> .')
            elif is_float:
                triples.append(f'{uri} eco:{prop} "{val}"^^xsd:float .')
            elif is_int:
                triples.append(f'{uri} eco:{prop} "{val}"^^xsd:integer .')
            else:
                triples.append(f'{uri} eco:{prop} "{val}" .')

    add_triple("transportId", data.transportId)
    add_triple("transportName", data.transportName)
    add_triple("transportType", data.transportType)
    add_triple("bikeModel", data.bikeModel)
    add_triple("isElectric", data.isElectric, is_bool=True)
    add_triple("batteryRange", data.batteryRange, is_float=True)
    add_triple("rentalPricePerHour", data.rentalPricePerHour, is_float=True)
    add_triple("pricePerKm", data.pricePerKm, is_float=True)
    add_triple("carbonEmissionPerKm", data.carbonEmissionPerKm, is_float=True)
    add_triple("capacity", data.capacity, is_int=True)
    add_triple("availability", data.availability, is_bool=True)
    add_triple("operatingHours", data.operatingHours)
    add_triple("averageSpeed", data.averageSpeed, is_float=True)
    add_triple("frameSize", data.frameSize)
    add_triple("contactPhone", data.contactPhone)

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
        return {"status": "success", "message": f"Bike '{data.transportName}' created", "uri": uri}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# POST /transports/electric-vehicle - Créer un véhicule électrique
@router.post("/electric-vehicle", summary="Ajouter un véhicule électrique")
def create_electric_vehicle(data: ElectricVehicleCreate):
    """Ajoute un nouveau véhicule électrique"""
    uri = f"eco:{data.transportId}"
    triples = [f"{uri} a eco:ElectricVehicle ."]

    def add_triple(prop, val, is_bool=False, is_float=False, is_int=False):
        if val is not None:
            if is_bool:
                triples.append(f'{uri} eco:{prop} "{str(val).lower()}"^^<http://www.w3.org/2001/XMLSchema#boolean> .')
            elif is_float:
                triples.append(f'{uri} eco:{prop} "{val}"^^xsd:float .')
            elif is_int:
                triples.append(f'{uri} eco:{prop} "{val}"^^xsd:integer .')
            else:
                triples.append(f'{uri} eco:{prop} "{val}" .')

    add_triple("transportId", data.transportId)
    add_triple("transportName", data.transportName)
    add_triple("transportType", data.transportType)
    add_triple("vehicleModel", data.vehicleModel)
    add_triple("vehicleBatteryRange", data.vehicleBatteryRange, is_float=True)
    add_triple("chargingTime", data.chargingTime, is_int=True)
    add_triple("seatingCapacity", data.seatingCapacity, is_int=True)
    add_triple("dailyRentalPrice", data.dailyRentalPrice, is_float=True)
    add_triple("pricePerKm", data.pricePerKm, is_float=True)
    add_triple("carbonEmissionPerKm", data.carbonEmissionPerKm, is_float=True)
    add_triple("capacity", data.capacity, is_int=True)
    add_triple("availability", data.availability, is_bool=True)
    add_triple("hasAirConditioning", data.hasAirConditioning, is_bool=True)
    add_triple("operatingHours", data.operatingHours)
    add_triple("averageSpeed", data.averageSpeed, is_float=True)
    add_triple("contactPhone", data.contactPhone)

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
        return {"status": "success", "message": f"Electric Vehicle '{data.transportName}' created", "uri": uri}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# POST /transports/public-transport - Créer un transport public
@router.post("/public-transport", summary="Ajouter un transport public")
def create_public_transport(data: PublicTransportCreate):
    """Ajoute un nouveau transport public"""
    uri = f"eco:{data.transportId}"
    triples = [f"{uri} a eco:PublicTransport ."]

    def add_triple(prop, val, is_bool=False, is_float=False, is_int=False):
        if val is not None:
            if is_bool:
                triples.append(f'{uri} eco:{prop} "{str(val).lower()}"^^<http://www.w3.org/2001/XMLSchema#boolean> .')
            elif is_float:
                triples.append(f'{uri} eco:{prop} "{val}"^^xsd:float .')
            elif is_int:
                triples.append(f'{uri} eco:{prop} "{val}"^^xsd:integer .')
            else:
                triples.append(f'{uri} eco:{prop} "{val}" .')

    add_triple("transportId", data.transportId)
    add_triple("transportName", data.transportName)
    add_triple("transportType", data.transportType)
    add_triple("lineNumber", data.lineNumber)
    add_triple("routeDescription", data.routeDescription)
    add_triple("ticketPrice", data.ticketPrice, is_float=True)
    add_triple("pricePerKm", data.pricePerKm, is_float=True)
    add_triple("carbonEmissionPerKm", data.carbonEmissionPerKm, is_float=True)
    add_triple("capacity", data.capacity, is_int=True)
    add_triple("availability", data.availability, is_bool=True)
    add_triple("frequencyMinutes", data.frequencyMinutes, is_int=True)
    add_triple("accessibleForDisabled", data.accessibleForDisabled, is_bool=True)
    add_triple("operatingHours", data.operatingHours)
    add_triple("averageSpeed", data.averageSpeed, is_float=True)
    add_triple("contactPhone", data.contactPhone)

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
        return {"status": "success", "message": f"Public Transport '{data.transportName}' created", "uri": uri}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# PUT /transports/{transport_id} - Mettre à jour un transport
@router.put("/{transport_id}", summary="Mettre à jour un transport")
def update_transport(transport_id: str, update: TransportUpdate):
    """Met à jour les informations d'un transport"""
    try:
        # Vérifier si le transport existe
        check_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?transport
        WHERE {{
          ?transport eco:transportId "{transport_id}" .
        }}
        LIMIT 1
        """

        check_result = sparql_select(check_sparql)
        binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Transport '{transport_id}' not found")

        # Vérifier qu'au moins un champ est fourni
        if all(v is None for v in update.dict().values()):
            raise HTTPException(status_code=400, detail="Au moins un champ doit être fourni")

        delete_clauses = []
        insert_clauses = []
        where_clauses = [f'?transport eco:transportId "{transport_id}" .']

        if update.transportName is not None:
            delete_clauses.append("?transport eco:transportName ?oldName .")
            insert_clauses.append(f'?transport eco:transportName "{update.transportName}" .')
            where_clauses.append("OPTIONAL { ?transport eco:transportName ?oldName . }")

        if update.availability is not None:
            delete_clauses.append("?transport eco:availability ?oldAvail .")
            insert_clauses.append(f'?transport eco:availability "{str(update.availability).lower()}"^^xsd:boolean .')
            where_clauses.append("OPTIONAL { ?transport eco:availability ?oldAvail . }")

        if update.pricePerKm is not None:
            delete_clauses.append("?transport eco:pricePerKm ?oldPrice .")
            insert_clauses.append(f'?transport eco:pricePerKm "{update.pricePerKm}"^^xsd:float .')
            where_clauses.append("OPTIONAL { ?transport eco:pricePerKm ?oldPrice . }")

        if update.operatingHours is not None:
            delete_clauses.append("?transport eco:operatingHours ?oldHours .")
            insert_clauses.append(f'?transport eco:operatingHours "{update.operatingHours}" .')
            where_clauses.append("OPTIONAL { ?transport eco:operatingHours ?oldHours . }")

        delete_str = "\n            ".join(delete_clauses)
        insert_str = "\n            ".join(insert_clauses)
        where_str = "\n            ".join(where_clauses)

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
            {where_str}
        }}
        """

        result = sparql_update(sparql)

        updated_fields = {k: v for k, v in update.dict().items() if v is not None}

        return {
            "status": "success",
            "message": f"Transport '{transport_id}' mis à jour avec succès",
            "transport_id": transport_id,
            "updated_fields": updated_fields
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# DELETE /transports/{transport_id} - Supprimer un transport
@router.delete("/{transport_id}", summary="Supprimer un transport")
def delete_transport(transport_id: str):
    """Supprime un transport de la base"""
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    DELETE WHERE {{ eco:{transport_id} ?p ?o . }}
    """
    try:
        result = sparql_delete(sparql)
        return {
            "status": "success",
            "message": f"Transport '{transport_id}' supprimé avec succès",
            "transport_id": transport_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# ENDPOINTS AVANCÉS
# ============================================


# GET /transports/filter/zero-emission - Transports zéro émission
@router.get("/filter/zero-emission", summary="Transports à zéro émission")
def get_zero_emission_transports(limit: int = Query(20, ge=1, le=100)):
    """Retourne tous les transports avec 0g CO2/km"""
    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?transport ?transportId ?transportName ?transportType ?carbonEmissionPerKm
        WHERE {{
          ?transport eco:transportId ?transportId ;
                     eco:transportName ?transportName ;
                     eco:carbonEmissionPerKm ?carbonEmissionPerKm .
          FILTER(?carbonEmissionPerKm = 0.0)
          OPTIONAL {{ ?transport eco:transportType ?transportType }}
        }}
        LIMIT {limit}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        transports = [_parse_transport(b) for b in binds]

        return {"status": "success", "count": len(transports), "transports": transports}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /transports/stats/cheapest - Top 10 moins chers
@router.get("/stats/cheapest", summary="Top 10 transports les moins chers")
def get_cheapest_transports():
    """Retourne les 10 transports les moins chers (par km)"""
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?transport ?transportId ?transportName ?pricePerKm
        WHERE {
          ?transport eco:transportId ?transportId ;
                     eco:transportName ?transportName ;
                     eco:pricePerKm ?pricePerKm .
          FILTER(?pricePerKm > 0)
        }
        ORDER BY ASC(?pricePerKm)
        LIMIT 10
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        transports = [_parse_transport(b) for b in binds]

        return {"status": "success", "count": len(transports), "transports": transports, "ranking": "by_price"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /transports/stats/fastest - Top 10 plus rapides
@router.get("/stats/fastest", summary="Top 10 transports les plus rapides")
def get_fastest_transports():
    """Retourne les 10 transports les plus rapides"""
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?transport ?transportId ?transportName ?averageSpeed ?transportType
        WHERE {
          ?transport eco:transportId ?transportId ;
                     eco:transportName ?transportName ;
                     eco:averageSpeed ?averageSpeed .
          OPTIONAL { ?transport eco:transportType ?transportType }
        }
        ORDER BY DESC(?averageSpeed)
        LIMIT 10
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        transports = [_parse_transport(b) for b in binds]

        return {"status": "success", "count": len(transports), "transports": transports, "ranking": "by_speed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /transports/stats/eco-score - Score écologique
@router.get("/stats/eco-score", summary="Classement par score écologique")
def get_eco_score_ranking():
    """Classe les transports par score écologique (bas carbone + prix abordable)"""
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?transport ?transportId ?transportName ?carbonEmissionPerKm ?pricePerKm ?transportType
        WHERE {
          ?transport eco:transportId ?transportId ;
                     eco:transportName ?transportName .
          OPTIONAL { ?transport eco:carbonEmissionPerKm ?carbonEmissionPerKm }
          OPTIONAL { ?transport eco:pricePerKm ?pricePerKm }
          OPTIONAL { ?transport eco:transportType ?transportType }
        }
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        transports = []
        for b in binds:
            carbon = float(_extract_value(_safe_get(b, 'carbonEmissionPerKm')) or 0)
            price = float(_extract_value(_safe_get(b, 'pricePerKm')) or 0)

            # Score écologique = moins de carbone + prix raisonnable
            # (0 carbone = 100 points, prix bas = points supplémentaires)
            eco_score = (100 - (carbon * 1000)) + (10 - min(price, 10))

            transports.append({
                "transportId": _extract_value(_safe_get(b, 'transportId')),
                "transportName": _extract_value(_safe_get(b, 'transportName')),
                "transportType": _extract_value(_safe_get(b, 'transportType')),
                "carbonEmissionPerKm": carbon,
                "pricePerKm": price,
                "eco_score": round(eco_score, 2)
            })

        sorted_transports = sorted(transports, key=lambda x: x['eco_score'], reverse=True)[:10]

        return {
            "status": "success",
            "count": len(sorted_transports),
            "transports": sorted_transports,
            "ranking": "by_eco_score"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /transports/search/{name} - Recherche par nom
@router.get("/search/{name}", summary="Rechercher un transport par nom")
def search_transport_by_name(name: str):
    """Recherche des transports dont le nom contient la chaîne fournie"""
    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?transport ?transportId ?transportName ?transportType ?pricePerKm ?carbonEmissionPerKm
        WHERE {{
          ?transport eco:transportId ?transportId ;
                     eco:transportName ?transportName .
          FILTER(CONTAINS(LCASE(?transportName), LCASE("{name}")))
          OPTIONAL {{ ?transport eco:transportType ?transportType }}
          OPTIONAL {{ ?transport eco:pricePerKm ?pricePerKm }}
          OPTIONAL {{ ?transport eco:carbonEmissionPerKm ?carbonEmissionPerKm }}
        }}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        transports = [_parse_transport(b) for b in binds]

        return {"status": "success", "count": len(transports), "transports": transports}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))