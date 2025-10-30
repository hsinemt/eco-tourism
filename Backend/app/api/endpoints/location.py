from fastapi import APIRouter, Query, HTTPException, Body, Path
from fastapi.responses import JSONResponse
from typing import Optional, List
from pydantic import BaseModel
from math import radians, cos, sin, asin, sqrt
from app.services.sparql_helpers import sparql_insert, sparql_update, sparql_delete, sparql_select

router = APIRouter()


# ============================================
# PYDANTIC MODELS FOR EACH LOCATION TYPE
# ============================================

class CityCreate(BaseModel):
    location_id: str
    locationId: str
    locationName: str
    latitude: float
    longitude: float
    address: str
    locationDescription: str
    population: int
    postalCode: str
    touristAttractions: str


class NaturalSiteCreate(BaseModel):
    location_id: str
    locationId: str
    locationName: str
    latitude: float
    longitude: float
    address: str
    locationDescription: str
    protectedStatus: bool
    biodiversityIndex: float
    areaSizeHectares: float
    entryFee: float


class RegionCreate(BaseModel):
    location_id: str
    locationId: str
    locationName: str
    latitude: float
    longitude: float
    address: str
    locationDescription: str
    climateType: str
    regionArea: float
    mainAttractions: str


class CityUpdate(BaseModel):
    locationName: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    locationDescription: Optional[str] = None
    population: Optional[int] = None
    postalCode: Optional[str] = None
    touristAttractions: Optional[str] = None


class NaturalSiteUpdate(BaseModel):
    locationName: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    locationDescription: Optional[str] = None
    protectedStatus: Optional[bool] = None
    biodiversityIndex: Optional[float] = None
    areaSizeHectares: Optional[float] = None
    entryFee: Optional[float] = None


class RegionUpdate(BaseModel):
    locationName: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    locationDescription: Optional[str] = None
    climateType: Optional[str] = None
    regionArea: Optional[float] = None
    mainAttractions: Optional[str] = None


# ============================================
# CITY ENDPOINTS
# ============================================

@router.post("/city", summary="Create a new city")
def create_city(city: CityCreate):
    """Add a new city location"""
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    INSERT DATA {{
        eco:{city.location_id} a eco:City ;
            eco:locationId "{city.locationId}" ;
            eco:locationName "{city.locationName}" ;
            eco:latitude "{city.latitude}"^^<http://www.w3.org/2001/XMLSchema#float> ;
            eco:longitude "{city.longitude}"^^<http://www.w3.org/2001/XMLSchema#float> ;
            eco:address "{city.address}" ;
            eco:locationDescription "{city.locationDescription}" ;
            eco:population "{city.population}"^^<http://www.w3.org/2001/XMLSchema#integer> ;
            eco:postalCode "{city.postalCode}" ;
            eco:touristAttractions "{city.touristAttractions}" .
    }}
    """
    try:
        result = sparql_insert(sparql)
        return {"status": "created", "city_id": city.location_id, "message": "City created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/natural-site", summary="Create a new natural site")
def create_natural_site(site: NaturalSiteCreate):
    """Add a new natural site location"""
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    INSERT DATA {{
        eco:{site.location_id} a eco:NaturalSite ;
            eco:locationId "{site.locationId}" ;
            eco:locationName "{site.locationName}" ;
            eco:latitude "{site.latitude}"^^<http://www.w3.org/2001/XMLSchema#float> ;
            eco:longitude "{site.longitude}"^^<http://www.w3.org/2001/XMLSchema#float> ;
            eco:address "{site.address}" ;
            eco:locationDescription "{site.locationDescription}" ;
            eco:protectedStatus "{str(site.protectedStatus).lower()}"^^<http://www.w3.org/2001/XMLSchema#boolean> ;
            eco:biodiversityIndex "{site.biodiversityIndex}"^^<http://www.w3.org/2001/XMLSchema#float> ;
            eco:areaSizeHectares "{site.areaSizeHectares}"^^<http://www.w3.org/2001/XMLSchema#float> ;
            eco:entryFee "{site.entryFee}"^^<http://www.w3.org/2001/XMLSchema#float> .
    }}
    """
    try:
        result = sparql_insert(sparql)
        return {"status": "created", "site_id": site.location_id, "message": "Natural site created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/region", summary="Create a new region")
def create_region(region: RegionCreate):
    """Add a new region location"""
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

    INSERT DATA {{
        eco:{region.location_id} a eco:Region ;
            eco:locationId "{region.locationId}" ;
            eco:locationName "{region.locationName}" ;
            eco:latitude "{region.latitude}"^^<http://www.w3.org/2001/XMLSchema#float> ;
            eco:longitude "{region.longitude}"^^<http://www.w3.org/2001/XMLSchema#float> ;
            eco:address "{region.address}" ;
            eco:locationDescription "{region.locationDescription}" ;
            eco:climateType "{region.climateType}" ;
            eco:regionArea "{region.regionArea}"^^<http://www.w3.org/2001/XMLSchema#float> ;
            eco:mainAttractions "{region.mainAttractions}" .
    }}
    """
    try:
        result = sparql_insert(sparql)
        return {"status": "created", "region_id": region.location_id, "message": "Region created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# GET ALL LOCATIONS
# ============================================

@router.get("/", summary="Get all locations")
def get_all_locations(
        location_type: Optional[str] = Query(None, description="Type: City, Region, NaturalSite"),
        limit: int = Query(100, ge=1, le=500)
):
    """Retrieve all locations, optionally filtered by type"""
    try:
        if location_type:
            sparql = f"""
            PREFIX eco: <http://www.ecotourism.org/ontology#>
            SELECT * WHERE {{
                ?location a eco:{location_type} .
                OPTIONAL {{ ?location eco:locationId ?locationId . }}
                OPTIONAL {{ ?location eco:locationName ?locationName . }}
                OPTIONAL {{ ?location eco:latitude ?latitude . }}
                OPTIONAL {{ ?location eco:longitude ?longitude . }}
                OPTIONAL {{ ?location eco:address ?address . }}
                OPTIONAL {{ ?location eco:locationDescription ?locationDescription . }}
                OPTIONAL {{ ?location eco:population ?population . }}
                OPTIONAL {{ ?location eco:postalCode ?postalCode . }}
                OPTIONAL {{ ?location eco:touristAttractions ?touristAttractions . }}
                OPTIONAL {{ ?location eco:protectedStatus ?protectedStatus . }}
                OPTIONAL {{ ?location eco:biodiversityIndex ?biodiversityIndex . }}
                OPTIONAL {{ ?location eco:areaSizeHectares ?areaSizeHectares . }}
                OPTIONAL {{ ?location eco:entryFee ?entryFee . }}
                OPTIONAL {{ ?location eco:climateType ?climateType . }}
                OPTIONAL {{ ?location eco:regionArea ?regionArea . }}
                OPTIONAL {{ ?location eco:mainAttractions ?mainAttractions . }}
            }}
            LIMIT {limit}
            """
        else:
            sparql = f"""
            PREFIX eco: <http://www.ecotourism.org/ontology#>
            SELECT * WHERE {{
                {{ ?location a eco:City . }}
                UNION
                {{ ?location a eco:NaturalSite . }}
                UNION
                {{ ?location a eco:Region . }}

                OPTIONAL {{ ?location eco:locationId ?locationId . }}
                OPTIONAL {{ ?location eco:locationName ?locationName . }}
                OPTIONAL {{ ?location eco:latitude ?latitude . }}
                OPTIONAL {{ ?location eco:longitude ?longitude . }}
                OPTIONAL {{ ?location eco:address ?address . }}
                OPTIONAL {{ ?location eco:locationDescription ?locationDescription . }}
            }}
            LIMIT {limit}
            """

        results = sparql_select(sparql)
        locations = []

        if isinstance(results, dict) and "results" in results:
            for binding in results["results"].get("bindings", []):
                location = {k: v.get('value') for k, v in binding.items()}
                locations.append(location)

        return {"locations": locations, "count": len(locations)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# GET LOCATIONS BY TYPE
# ============================================

@router.get("/cities", summary="Get all cities")
def get_cities(limit: int = Query(100, ge=1, le=500)):
    """Retrieve all city locations"""
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    SELECT ?location ?locationId ?locationName ?latitude ?longitude ?address 
           ?locationDescription ?population ?postalCode ?touristAttractions
    WHERE {{
        ?location a eco:City .
        OPTIONAL {{ ?location eco:locationId ?locationId . }}
        OPTIONAL {{ ?location eco:locationName ?locationName . }}
        OPTIONAL {{ ?location eco:latitude ?latitude . }}
        OPTIONAL {{ ?location eco:longitude ?longitude . }}
        OPTIONAL {{ ?location eco:address ?address . }}
        OPTIONAL {{ ?location eco:locationDescription ?locationDescription . }}
        OPTIONAL {{ ?location eco:population ?population . }}
        OPTIONAL {{ ?location eco:postalCode ?postalCode . }}
        OPTIONAL {{ ?location eco:touristAttractions ?touristAttractions . }}
    }}
    LIMIT {limit}
    """
    try:
        results = sparql_select(sparql)
        cities = []
        if isinstance(results, dict) and "results" in results:
            for binding in results["results"].get("bindings", []):
                city = {k: v.get('value') for k, v in binding.items()}
                cities.append(city)
        return {"cities": cities, "count": len(cities)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/natural-sites", summary="Get all natural sites")
def get_natural_sites(limit: int = Query(100, ge=1, le=500)):
    """Retrieve all natural site locations"""
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    SELECT ?location ?locationId ?locationName ?latitude ?longitude ?address 
           ?locationDescription ?protectedStatus ?biodiversityIndex ?areaSizeHectares ?entryFee
    WHERE {{
        ?location a eco:NaturalSite .
        OPTIONAL {{ ?location eco:locationId ?locationId . }}
        OPTIONAL {{ ?location eco:locationName ?locationName . }}
        OPTIONAL {{ ?location eco:latitude ?latitude . }}
        OPTIONAL {{ ?location eco:longitude ?longitude . }}
        OPTIONAL {{ ?location eco:address ?address . }}
        OPTIONAL {{ ?location eco:locationDescription ?locationDescription . }}
        OPTIONAL {{ ?location eco:protectedStatus ?protectedStatus . }}
        OPTIONAL {{ ?location eco:biodiversityIndex ?biodiversityIndex . }}
        OPTIONAL {{ ?location eco:areaSizeHectares ?areaSizeHectares . }}
        OPTIONAL {{ ?location eco:entryFee ?entryFee . }}
    }}
    LIMIT {limit}
    """
    try:
        results = sparql_select(sparql)
        sites = []
        if isinstance(results, dict) and "results" in results:
            for binding in results["results"].get("bindings", []):
                site = {k: v.get('value') for k, v in binding.items()}
                sites.append(site)
        return {"natural_sites": sites, "count": len(sites)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/regions", summary="Get all regions")
def get_regions(limit: int = Query(100, ge=1, le=500)):
    """Retrieve all region locations"""
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    SELECT ?location ?locationId ?locationName ?latitude ?longitude ?address 
           ?locationDescription ?climateType ?regionArea ?mainAttractions
    WHERE {{
        ?location a eco:Region .
        OPTIONAL {{ ?location eco:locationId ?locationId . }}
        OPTIONAL {{ ?location eco:locationName ?locationName . }}
        OPTIONAL {{ ?location eco:latitude ?latitude . }}
        OPTIONAL {{ ?location eco:longitude ?longitude . }}
        OPTIONAL {{ ?location eco:address ?address . }}
        OPTIONAL {{ ?location eco:locationDescription ?locationDescription . }}
        OPTIONAL {{ ?location eco:climateType ?climateType . }}
        OPTIONAL {{ ?location eco:regionArea ?regionArea . }}
        OPTIONAL {{ ?location eco:mainAttractions ?mainAttractions . }}
    }}
    LIMIT {limit}
    """
    try:
        results = sparql_select(sparql)
        regions = []
        if isinstance(results, dict) and "results" in results:
            for binding in results["results"].get("bindings", []):
                region = {k: v.get('value') for k, v in binding.items()}
                regions.append(region)
        return {"regions": regions, "count": len(regions)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# UPDATE BY TYPE
# ============================================

@router.put("/city/{location_id}", summary="Update a city")
def update_city(location_id: str, city: CityUpdate):
    """Update city-specific fields"""
    try:
        updated_fields = []

        for field, value in city.dict(exclude_none=True).items():
            if value is not None:
                datatype = ""
                if field in ["latitude", "longitude"]:
                    datatype = "^^<http://www.w3.org/2001/XMLSchema#float>"
                elif field == "population":
                    datatype = "^^<http://www.w3.org/2001/XMLSchema#integer>"

                sparql = f"""
                PREFIX eco: <http://www.ecotourism.org/ontology#>
                DELETE {{ eco:{location_id} eco:{field} ?old . }}
                INSERT {{ eco:{location_id} eco:{field} "{value}"{datatype} . }}
                WHERE {{ OPTIONAL {{ eco:{location_id} eco:{field} ?old . }} }}
                """
                sparql_update(sparql)
                updated_fields.append(field)

        if not updated_fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        return {"status": "updated", "location_id": location_id, "updated_fields": updated_fields}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/natural-site/{location_id}", summary="Update a natural site")
def update_natural_site(location_id: str, site: NaturalSiteUpdate):
    """Update natural site-specific fields"""
    try:
        updated_fields = []

        for field, value in site.dict(exclude_none=True).items():
            if value is not None:
                datatype = ""
                if field in ["latitude", "longitude", "biodiversityIndex", "areaSizeHectares", "entryFee"]:
                    datatype = "^^<http://www.w3.org/2001/XMLSchema#float>"
                elif field == "protectedStatus":
                    value = str(value).lower()
                    datatype = "^^<http://www.w3.org/2001/XMLSchema#boolean>"

                sparql = f"""
                PREFIX eco: <http://www.ecotourism.org/ontology#>
                DELETE {{ eco:{location_id} eco:{field} ?old . }}
                INSERT {{ eco:{location_id} eco:{field} "{value}"{datatype} . }}
                WHERE {{ OPTIONAL {{ eco:{location_id} eco:{field} ?old . }} }}
                """
                sparql_update(sparql)
                updated_fields.append(field)

        if not updated_fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        return {"status": "updated", "location_id": location_id, "updated_fields": updated_fields}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/region/{location_id}", summary="Update a region")
def update_region(location_id: str, region: RegionUpdate):
    """Update region-specific fields"""
    try:
        updated_fields = []

        for field, value in region.dict(exclude_none=True).items():
            if value is not None:
                datatype = ""
                if field in ["latitude", "longitude", "regionArea"]:
                    datatype = "^^<http://www.w3.org/2001/XMLSchema#float>"

                sparql = f"""
                PREFIX eco: <http://www.ecotourism.org/ontology#>
                DELETE {{ eco:{location_id} eco:{field} ?old . }}
                INSERT {{ eco:{location_id} eco:{field} "{value}"{datatype} . }}
                WHERE {{ OPTIONAL {{ eco:{location_id} eco:{field} ?old . }} }}
                """
                sparql_update(sparql)
                updated_fields.append(field)

        if not updated_fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        return {"status": "updated", "location_id": location_id, "updated_fields": updated_fields}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# DELETE BY ID (works for all types)
# ============================================

@router.delete("/{location_id}", summary="Delete a location by ID")
def delete_location(location_id: str):
    """Delete any location (City, NaturalSite, or Region) by its ID"""
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    DELETE WHERE {{ eco:{location_id} ?p ?o . }}
    """
    try:
        result = sparql_delete(sparql)
        return {"status": "deleted", "location_id": location_id, "message": "Location deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/city/{location_id}", summary="Get a specific city by ID")
def get_city_by_id(location_id: str = Path(..., description="City URI identifier, e.g., City_Tunis")):
    """Retrieve a single city by its URI identifier (not locationId property)"""
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    SELECT ?locationId ?locationName ?latitude ?longitude ?address 
           ?locationDescription ?population ?postalCode ?touristAttractions
    WHERE {{
        eco:{location_id} a eco:City .
        OPTIONAL {{ eco:{location_id} eco:locationId ?locationId . }}
        OPTIONAL {{ eco:{location_id} eco:locationName ?locationName . }}
        OPTIONAL {{ eco:{location_id} eco:latitude ?latitude . }}
        OPTIONAL {{ eco:{location_id} eco:longitude ?longitude . }}
        OPTIONAL {{ eco:{location_id} eco:address ?address . }}
        OPTIONAL {{ eco:{location_id} eco:locationDescription ?locationDescription . }}
        OPTIONAL {{ eco:{location_id} eco:population ?population . }}
        OPTIONAL {{ eco:{location_id} eco:postalCode ?postalCode . }}
        OPTIONAL {{ eco:{location_id} eco:touristAttractions ?touristAttractions . }}
    }}
    """
    try:
        results = sparql_select(sparql)

        if isinstance(results, dict) and "results" in results:
            bindings = results["results"].get("bindings", [])
            if len(bindings) > 0:
                city = {k: v.get('value') for k, v in bindings[0].items()}
                return JSONResponse(content={"city": city, "uri_id": location_id}, status_code=200)

        return JSONResponse(
            content={"error": f"City with URI identifier '{location_id}' not found"},
            status_code=404
        )

    except Exception as e:
        return JSONResponse(
            content={"error": f"Error retrieving city: {str(e)}"},
            status_code=500
        )


@router.get("/natural-site/{location_id}", summary="Get a specific natural site by ID")
def get_natural_site_by_id(location_id: str = Path(..., description="Natural site URI identifier")):
    """Retrieve a single natural site by its URI identifier"""
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    SELECT ?locationId ?locationName ?latitude ?longitude ?address 
           ?locationDescription ?protectedStatus ?biodiversityIndex ?areaSizeHectares ?entryFee
    WHERE {{
        eco:{location_id} a eco:NaturalSite .
        OPTIONAL {{ eco:{location_id} eco:locationId ?locationId . }}
        OPTIONAL {{ eco:{location_id} eco:locationName ?locationName . }}
        OPTIONAL {{ eco:{location_id} eco:latitude ?latitude . }}
        OPTIONAL {{ eco:{location_id} eco:longitude ?longitude . }}
        OPTIONAL {{ eco:{location_id} eco:address ?address . }}
        OPTIONAL {{ eco:{location_id} eco:locationDescription ?locationDescription . }}
        OPTIONAL {{ eco:{location_id} eco:protectedStatus ?protectedStatus . }}
        OPTIONAL {{ eco:{location_id} eco:biodiversityIndex ?biodiversityIndex . }}
        OPTIONAL {{ eco:{location_id} eco:areaSizeHectares ?areaSizeHectares . }}
        OPTIONAL {{ eco:{location_id} eco:entryFee ?entryFee . }}
    }}
    """
    try:
        results = sparql_select(sparql)

        if isinstance(results, dict) and "results" in results:
            bindings = results["results"].get("bindings", [])
            if len(bindings) > 0:
                site = {k: v.get('value') for k, v in bindings[0].items()}
                return JSONResponse(content={"natural_site": site, "uri_id": location_id}, status_code=200)

        return JSONResponse(
            content={"error": f"Natural site with URI identifier '{location_id}' not found"},
            status_code=404
        )

    except Exception as e:
        return JSONResponse(
            content={"error": f"Error retrieving natural site: {str(e)}"},
            status_code=500
        )


@router.get("/region/{location_id}", summary="Get a specific region by ID")
def get_region_by_id(location_id: str = Path(..., description="Region URI identifier")):
    """Retrieve a single region by its URI identifier"""
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    SELECT ?locationId ?locationName ?latitude ?longitude ?address 
           ?locationDescription ?climateType ?regionArea ?mainAttractions
    WHERE {{
        eco:{location_id} a eco:Region .
        OPTIONAL {{ eco:{location_id} eco:locationId ?locationId . }}
        OPTIONAL {{ eco:{location_id} eco:locationName ?locationName . }}
        OPTIONAL {{ eco:{location_id} eco:latitude ?latitude . }}
        OPTIONAL {{ eco:{location_id} eco:longitude ?longitude . }}
        OPTIONAL {{ eco:{location_id} eco:address ?address . }}
        OPTIONAL {{ eco:{location_id} eco:locationDescription ?locationDescription . }}
        OPTIONAL {{ eco:{location_id} eco:climateType ?climateType . }}
        OPTIONAL {{ eco:{location_id} eco:regionArea ?regionArea . }}
        OPTIONAL {{ eco:{location_id} eco:mainAttractions ?mainAttractions . }}
    }}
    """
    try:
        results = sparql_select(sparql)

        if isinstance(results, dict) and "results" in results:
            bindings = results["results"].get("bindings", [])
            if len(bindings) > 0:
                region = {k: v.get('value') for k, v in bindings[0].items()}
                return JSONResponse(content={"region": region, "uri_id": location_id}, status_code=200)

        return JSONResponse(
            content={"error": f"Region with URI identifier '{location_id}' not found"},
            status_code=404
        )

    except Exception as e:
        return JSONResponse(
            content={"error": f"Error retrieving region: {str(e)}"},
            status_code=500
        )




@router.get("/nearby", summary="Find locations within radius")
def find_nearby_locations(
        latitude: float = Query(..., description="Center latitude"),
        longitude: float = Query(..., description="Center longitude"),
        radius_km: float = Query(50, description="Search radius in kilometers"),
        location_type: Optional[str] = Query(None, description="Type: City, Region, NaturalSite")
):
    """Find all locations within specified radius using Haversine formula"""
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    SELECT ?location ?locationName ?latitude ?longitude ?distance
    WHERE {{
        {'{ ?location a eco:' + location_type + ' . }' if location_type else '{ { ?location a eco:City . } UNION { ?location a eco:NaturalSite . } UNION { ?location a eco:Region . } }'}
        ?location eco:locationName ?locationName .
        ?location eco:latitude ?latitude .
        ?location eco:longitude ?longitude .
    }}
    """

    try:
        results = sparql_select(sparql)
        nearby_locations = []

        if isinstance(results, dict) and "results" in results:
            for binding in results["results"].get("bindings", []):
                loc_lat = float(binding['latitude']['value'])
                loc_lon = float(binding['longitude']['value'])

                # Haversine formula
                distance = calculate_distance(latitude, longitude, loc_lat, loc_lon)

                if distance <= radius_km:
                    location = {k: v.get('value') for k, v in binding.items()}
                    location['distance_km'] = round(distance, 2)
                    nearby_locations.append(location)

        # Sort by distance
        nearby_locations.sort(key=lambda x: x['distance_km'])

        return {
            "center": {"lat": latitude, "lon": longitude},
            "radius_km": radius_km,
            "locations": nearby_locations,
            "count": len(nearby_locations)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points using Haversine formula"""
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    km = 6371 * c
    return km
