from fastapi import APIRouter, Query, HTTPException, Body, Path
from fastapi.responses import JSONResponse
from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

router = APIRouter()

# ============================================
# TOURIST MODELS
# ============================================
class TouristBase(BaseModel):
    tourist_id: Optional[str] = Field(None, description="Identifiant unique du touriste (auto-généré si non fourni)")
    name: str = Field(..., min_length=2, max_length=100, description="Nom complet")
    email: Optional[str] = Field(None, description="Adresse email")
    nationality: Optional[str] = Field(None, description="Nationalité")
    preferences: Optional[str] = Field(None, description="Préférences de voyage")

class TouristCreate(TouristBase):
    pass

class TouristUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[str] = Field(None)
    nationality: Optional[str] = Field(None)
    preferences: Optional[str] = Field(None)

# ============================================
# GUIDE MODELS
# ============================================
class GuideBase(BaseModel):
    guide_id: Optional[str] = Field(None, description="Identifiant unique du guide (auto-généré si non fourni)")
    name: str = Field(..., min_length=2, max_length=100, description="Nom du guide")
    language: str = Field(..., description="Langue parlée")
    certification: Optional[str] = Field(None, description="Certification")
    experience_years: Optional[int] = Field(None, ge=0, description="Années d'expérience")

class GuideCreate(GuideBase):
    pass

class GuideUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    language: Optional[str] = Field(None)
    certification: Optional[str] = Field(None)
    experience_years: Optional[int] = Field(None, ge=0)

# Helper function to escape SPARQL strings
def escape_sparql_string(s):
    if s is None:
        return None
    return s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n').replace('\r', '\\r')

# ============================================
# TOURIST ENDPOINTS
# ============================================

@router.get("/", summary="Rechercher tous les touristes")
def search_tourists(limit: int = Query(100, ge=1, le=100)):
    """Retourne tous les touristes enregistrés"""
    from app.services.sparql_helpers import sparql_select
    try:
        sparql = f"""
        PREFIX eco: <http://www.example.org/ecotourism#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT ?tourist ?name ?email ?nationality ?preferences ?registrationDate WHERE {{
            ?tourist a eco:Tourist ;
                     rdfs:label ?name .
            OPTIONAL {{ ?tourist eco:email ?email . }}
            OPTIONAL {{ ?tourist eco:nationality ?nationality . }}
            OPTIONAL {{ ?tourist eco:preferences ?preferences . }}
            OPTIONAL {{ ?tourist eco:registrationDate ?registrationDate . }}
        }}
        LIMIT {limit}
        """

        results = sparql_select(sparql)
        tourists = []

        if isinstance(results, dict) and "results" in results:
            for binding in results["results"].get("bindings", []):
                tourist = {
                    "uri": binding.get('tourist', {}).get('value'),
                    "tourist_id": binding.get('tourist', {}).get('value', '').split('/')[-1].split('#')[-1],
                    "name": binding.get('name', {}).get('value'),
                    "email": binding.get('email', {}).get('value'),
                    "nationality": binding.get('nationality', {}).get('value'),
                    "preferences": binding.get('preferences', {}).get('value'),
                    "registrationDate": binding.get('registrationDate', {}).get('value'),
                }
                tourists.append(tourist)

        return JSONResponse(status_code=200, content={"tourists": tourists, "count": len(tourists)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{tourist_id}", summary="Afficher un touriste par identifiant")
def get_tourist(tourist_id: str):
    """Récupère les détails d'un touriste spécifique"""
    from app.services.sparql_helpers import sparql_select

    sparql = f"""
    PREFIX eco: <http://www.example.org/ecotourism#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT ?name ?email ?nationality ?preferences ?registrationDate WHERE {{
        eco:{tourist_id} a eco:Tourist ;
                        rdfs:label ?name .
        OPTIONAL {{ eco:{tourist_id} eco:email ?email . }}
        OPTIONAL {{ eco:{tourist_id} eco:nationality ?nationality . }}
        OPTIONAL {{ eco:{tourist_id} eco:preferences ?preferences . }}
        OPTIONAL {{ eco:{tourist_id} eco:registrationDate ?registrationDate . }}
    }}
    """

    try:
        results = sparql_select(sparql)
        if isinstance(results, dict) and "results" in results:
            bindings = results["results"].get("bindings", [])
            if bindings:
                binding = bindings[0]
                tourist = {
                    "tourist_id": tourist_id,
                    "name": binding.get('name', {}).get('value'),
                    "email": binding.get('email', {}).get('value'),
                    "nationality": binding.get('nationality', {}).get('value'),
                    "preferences": binding.get('preferences', {}).get('value'),
                    "registrationDate": binding.get('registrationDate', {}).get('value'),
                }
                return JSONResponse(status_code=200, content={"tourist": tourist})

        raise HTTPException(status_code=404, detail=f"Tourist {tourist_id} not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", summary="Créer un nouveau profil touriste")
def create_tourist(tourist: TouristCreate):
    """Crée un nouveau profil touriste"""
    from app.services.sparql_helpers import sparql_insert

    # Generate ID if not provided
    tourist_id = tourist.tourist_id or f"tourist_{uuid.uuid4().hex[:8]}"

    # Build optional fields
    optional_triples = []
    if tourist.email:
        optional_triples.append(f'eco:{tourist_id} eco:email "{escape_sparql_string(tourist.email)}" .')
    if tourist.nationality:
        optional_triples.append(f'eco:{tourist_id} eco:nationality "{escape_sparql_string(tourist.nationality)}" .')
    if tourist.preferences:
        optional_triples.append(f'eco:{tourist_id} eco:preferences "{escape_sparql_string(tourist.preferences)}" .')

    optional_data = "\n        ".join(optional_triples) if optional_triples else ""

    sparql = f"""
    PREFIX eco: <http://www.example.org/ecotourism#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    
    INSERT DATA {{
        eco:{tourist_id} a eco:Tourist ;
                        rdfs:label "{escape_sparql_string(tourist.name)}" ;
                        eco:registrationDate "{datetime.now().isoformat()}"^^xsd:dateTime .
        {optional_data}
    }}
    """

    try:
        result = sparql_insert(sparql)
        return JSONResponse(
            status_code=201,
            content={
                "status": "created",
                "tourist_id": tourist_id,
                "message": "Profil touriste créé avec succès",
                "timestamp": datetime.now().isoformat()
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{tourist_id}", summary="Mettre à jour un profil touriste")
def update_tourist(tourist_id: str, update_data: TouristUpdate):
    """Met à jour les informations d'un touriste"""
    from app.services.sparql_helpers import sparql_update

    updates = []

    if update_data.name:
        updates.append(f'''
        PREFIX eco: <http://www.example.org/ecotourism#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        DELETE {{ eco:{tourist_id} rdfs:label ?old . }}
        INSERT {{ eco:{tourist_id} rdfs:label "{escape_sparql_string(update_data.name)}" . }}
        WHERE {{ eco:{tourist_id} rdfs:label ?old . }}
        ''')

    if update_data.email is not None:
        updates.append(f'''
        PREFIX eco: <http://www.example.org/ecotourism#>
        DELETE {{ eco:{tourist_id} eco:email ?old . }}
        INSERT {{ eco:{tourist_id} eco:email "{escape_sparql_string(update_data.email)}" . }}
        WHERE {{ OPTIONAL {{ eco:{tourist_id} eco:email ?old . }} }}
        ''')

    if update_data.nationality is not None:
        updates.append(f'''
        PREFIX eco: <http://www.example.org/ecotourism#>
        DELETE {{ eco:{tourist_id} eco:nationality ?old . }}
        INSERT {{ eco:{tourist_id} eco:nationality "{escape_sparql_string(update_data.nationality)}" . }}
        WHERE {{ OPTIONAL {{ eco:{tourist_id} eco:nationality ?old . }} }}
        ''')

    if update_data.preferences is not None:
        updates.append(f'''
        PREFIX eco: <http://www.example.org/ecotourism#>
        DELETE {{ eco:{tourist_id} eco:preferences ?old . }}
        INSERT {{ eco:{tourist_id} eco:preferences "{escape_sparql_string(update_data.preferences)}" . }}
        WHERE {{ OPTIONAL {{ eco:{tourist_id} eco:preferences ?old . }} }}
        ''')

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    try:
        for sparql in updates:
            sparql_update(sparql)

        return JSONResponse(
            status_code=200,
            content={
                "status": "updated",
                "tourist_id": tourist_id,
                "message": "Profil mis à jour avec succès"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{tourist_id}", summary="Supprimer un profil touriste")
def delete_tourist(tourist_id: str):
    """Supprime un profil touriste"""
    from app.services.sparql_helpers import sparql_update

    sparql = f'''
    PREFIX eco: <http://www.example.org/ecotourism#>
    DELETE WHERE {{ eco:{tourist_id} ?p ?o . }}
    '''

    try:
        result = sparql_update(sparql)
        return JSONResponse(
            status_code=200,
            content={
                "status": "deleted",
                "tourist_id": tourist_id,
                "message": "Profil touriste supprimé avec succès"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# GUIDE ENDPOINTS
# ============================================

@router.get("/guides/", summary="Rechercher tous les guides")
def search_guides(
        language: Optional[str] = Query(None, description="Filtrer par langue"),
        limit: int = Query(100, ge=1, le=100)
):
    """Retourne tous les guides touristiques"""
    from app.services.sparql_helpers import sparql_select

    try:
        if language:
            sparql = f"""
            PREFIX eco: <http://www.example.org/ecotourism#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            
            SELECT ?guide ?name ?language ?certification ?experience WHERE {{
                ?guide a eco:Guide ;
                       rdfs:label ?name ;
                       eco:language "{escape_sparql_string(language)}" ;
                       eco:experienceYears ?experience .
                OPTIONAL {{ ?guide eco:certification ?certification . }}
            }}
            LIMIT {limit}
            """
        else:
            sparql = f"""
            PREFIX eco: <http://www.example.org/ecotourism#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            
            SELECT ?guide ?name ?language ?certification ?experience WHERE {{
                ?guide a eco:Guide ;
                       rdfs:label ?name ;
                       eco:language ?language ;
                       eco:experienceYears ?experience .
                OPTIONAL {{ ?guide eco:certification ?certification . }}
            }}
            LIMIT {limit}
            """

        results = sparql_select(sparql)
        guides = []

        if isinstance(results, dict) and "results" in results:
            for binding in results["results"].get("bindings", []):
                guide = {
                    "uri": binding.get('guide', {}).get('value'),
                    "guide_id": binding.get('guide', {}).get('value', '').split('/')[-1].split('#')[-1],
                    "name": binding.get('name', {}).get('value'),
                    "language": binding.get('language', {}).get('value'),
                    "certification": binding.get('certification', {}).get('value'),
                    "experienceYears": int(binding.get('experience', {}).get('value', 0)) if binding.get('experience') else 0,
                }
                guides.append(guide)

        return JSONResponse(status_code=200, content={"guides": guides, "count": len(guides)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/guides/{guide_id}", summary="Afficher un guide par identifiant")
def get_guide(guide_id: str):
    """Récupère les détails d'un guide spécifique"""
    from app.services.sparql_helpers import sparql_select

    sparql = f"""
    PREFIX eco: <http://www.example.org/ecotourism#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT ?name ?language ?certification ?experience WHERE {{
        eco:{guide_id} a eco:Guide ;
                      rdfs:label ?name ;
                      eco:language ?language ;
                      eco:experienceYears ?experience .
        OPTIONAL {{ eco:{guide_id} eco:certification ?certification . }}
    }}
    """

    try:
        results = sparql_select(sparql)
        if isinstance(results, dict) and "results" in results:
            bindings = results["results"].get("bindings", [])
            if bindings:
                binding = bindings[0]
                guide = {
                    "guide_id": guide_id,
                    "name": binding.get('name', {}).get('value'),
                    "language": binding.get('language', {}).get('value'),
                    "certification": binding.get('certification', {}).get('value'),
                    "experienceYears": int(binding.get('experience', {}).get('value', 0)) if binding.get('experience') else 0,
                }
                return JSONResponse(status_code=200, content={"guide": guide})

        raise HTTPException(status_code=404, detail=f"Guide {guide_id} not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/guides/", summary="Créer un nouveau profil guide")
def create_guide(guide: GuideCreate):
    """Crée un nouveau profil guide touristique"""
    from app.services.sparql_helpers import sparql_insert

    # Generate ID if not provided
    guide_id = guide.guide_id or f"guide_{uuid.uuid4().hex[:8]}"
    experience = guide.experience_years if guide.experience_years is not None else 0

    # Build optional fields
    optional_triples = []
    if guide.certification:
        optional_triples.append(f'eco:{guide_id} eco:certification "{escape_sparql_string(guide.certification)}" .')

    optional_data = "\n        ".join(optional_triples) if optional_triples else ""

    sparql = f"""
    PREFIX eco: <http://www.example.org/ecotourism#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    
    INSERT DATA {{
        eco:{guide_id} a eco:Guide ;
                      rdfs:label "{escape_sparql_string(guide.name)}" ;
                      eco:language "{escape_sparql_string(guide.language)}" ;
                      eco:experienceYears "{experience}"^^xsd:integer .
        {optional_data}
    }}
    """

    try:
        result = sparql_insert(sparql)
        return JSONResponse(
            status_code=201,
            content={
                "status": "created",
                "guide_id": guide_id,
                "message": "Profil guide créé avec succès",
                "timestamp": datetime.now().isoformat()
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/guides/{guide_id}", summary="Mettre à jour un profil guide")
def update_guide(guide_id: str, update_data: GuideUpdate):
    """Met à jour les informations d'un guide"""
    from app.services.sparql_helpers import sparql_update

    updates = []

    if update_data.name:
        updates.append(f'''
        PREFIX eco: <http://www.example.org/ecotourism#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        DELETE {{ eco:{guide_id} rdfs:label ?old . }}
        INSERT {{ eco:{guide_id} rdfs:label "{escape_sparql_string(update_data.name)}" . }}
        WHERE {{ eco:{guide_id} rdfs:label ?old . }}
        ''')

    if update_data.language:
        updates.append(f'''
        PREFIX eco: <http://www.example.org/ecotourism#>
        DELETE {{ eco:{guide_id} eco:language ?old . }}
        INSERT {{ eco:{guide_id} eco:language "{escape_sparql_string(update_data.language)}" . }}
        WHERE {{ eco:{guide_id} eco:language ?old . }}
        ''')

    if update_data.experience_years is not None:
        updates.append(f'''
        PREFIX eco: <http://www.example.org/ecotourism#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        DELETE {{ eco:{guide_id} eco:experienceYears ?old . }}
        INSERT {{ eco:{guide_id} eco:experienceYears "{update_data.experience_years}"^^xsd:integer . }}
        WHERE {{ eco:{guide_id} eco:experienceYears ?old . }}
        ''')

    if update_data.certification is not None:
        updates.append(f'''
        PREFIX eco: <http://www.example.org/ecotourism#>
        DELETE {{ eco:{guide_id} eco:certification ?old . }}
        INSERT {{ eco:{guide_id} eco:certification "{escape_sparql_string(update_data.certification)}" . }}
        WHERE {{ OPTIONAL {{ eco:{guide_id} eco:certification ?old . }} }}
        ''')

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    try:
        for sparql in updates:
            sparql_update(sparql)

        return JSONResponse(
            status_code=200,
            content={
                "status": "updated",
                "guide_id": guide_id,
                "message": "Profil guide mis à jour avec succès"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/guides/{guide_id}", summary="Supprimer un profil guide")
def delete_guide(guide_id: str):
    """Supprime un profil guide"""
    from app.services.sparql_helpers import sparql_update

    sparql = f'''
    PREFIX eco: <http://www.example.org/ecotourism#>
    DELETE WHERE {{ eco:{guide_id} ?p ?o . }}
    '''

    try:
        result = sparql_update(sparql)
        return JSONResponse(
            status_code=200,
            content={
                "status": "deleted",
                "guide_id": guide_id,
                "message": "Profil guide supprimé avec succès"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
