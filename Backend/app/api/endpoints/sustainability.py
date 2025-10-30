from fastapi import APIRouter, Query, HTTPException, Body
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, validator
from datetime import datetime
from enum import Enum
from app.services.sparql_helpers import sparql_insert, sparql_update, sparql_delete, sparql_select

router = APIRouter()


# ============================================
# ÉNUMÉRATIONS
# ============================================

class IndicatorType(str, Enum):
    CARBON_FOOTPRINT = "CarbonFootprint"
    RENEWABLE_ENERGY = "RenewableEnergyUsage"
    WATER_CONSUMPTION = "WaterConsumption"


# ============================================
# MODÈLES PYDANTIC - PRODUCTS
# ============================================

class LocalProductResponse(BaseModel):
    productId: str
    productName: str
    productDescription: Optional[str]
    productPrice: float
    productCategory: str
    isOrganic: bool
    isHandmade: bool
    producerName: str
    stockQuantity: int
    fairTradeCertified: bool
    uri: str


class LocalProductCreate(BaseModel):
    productId: str = Field(..., description="ID unique (ex: PRD-001)")
    productName: str
    productDescription: str
    productPrice: float
    productCategory: str = Field(..., description="Food and Beverages, Crafts and Textiles, etc.")
    isOrganic: bool = Field(False)
    isHandmade: bool = Field(False)
    producerName: str
    stockQuantity: int = Field(0, ge=0)
    fairTradeCertified: bool = Field(False)


class LocalProductUpdate(BaseModel):
    productPrice: Optional[float] = None
    stockQuantity: Optional[int] = None
    productDescription: Optional[str] = None


# ============================================
# MODÈLES PYDANTIC - SUSTAINABILITY
# ============================================

class SustainabilityIndicatorResponse(BaseModel):
    indicatorId: str
    indicatorName: str
    indicatorValue: float
    measurementUnit: str
    measurementDate: str
    targetValue: Optional[float]
    indicatorType: str
    uri: str


class SustainabilityIndicatorCreate(BaseModel):
    indicatorId: str = Field(..., description="ID unique (ex: IND-C-001, IND-R-001, IND-W-001)")
    indicatorName: str
    indicatorType: IndicatorType = Field(...,
                                         description="Type: CarbonFootprint, RenewableEnergyUsage, WaterConsumption")
    indicatorValue: float = Field(..., description="Valeur de l'indicateur")
    measurementUnit: str = Field(..., description="Unité de mesure")
    measurementDate: Optional[str] = Field(None, description="Date au format ISO (optionnel)")
    targetValue: Optional[float] = Field(None, description="Valeur cible (optionnel)")

    @validator('measurementUnit')
    def validate_measurement_unit(cls, v, values):
        """Valide que l'unité de mesure correspond au type d'indicateur"""
        indicator_type = values.get('indicatorType')

        recommended_units = {
            IndicatorType.CARBON_FOOTPRINT: ["kg CO2 per guest per night", "kg CO2", "tons CO2"],
            IndicatorType.RENEWABLE_ENERGY: ["Percentage", "%"],
            IndicatorType.WATER_CONSUMPTION: ["Liters per guest per day", "Liters", "m3", "cubic meters"]
        }

        if indicator_type and indicator_type in recommended_units:
            if v not in recommended_units[indicator_type]:
                import warnings
                warnings.warn(
                    f"Unit '{v}' might not be standard for {indicator_type.value}. "
                    f"Recommended: {', '.join(recommended_units[indicator_type])}"
                )

        return v

    @validator('indicatorValue')
    def validate_indicator_value(cls, v, values):
        """Valide que la valeur est cohérente avec le type"""
        indicator_type = values.get('indicatorType')

        if indicator_type == IndicatorType.RENEWABLE_ENERGY:
            if v < 0 or v > 100:
                raise ValueError("RenewableEnergyUsage value must be between 0 and 100 (percentage)")

        if v < 0:
            raise ValueError("Indicator value must be positive")

        return v


class IndicatorUpdate(BaseModel):
    indicatorValue: Optional[float] = None
    targetValue: Optional[float] = None


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


def _parse_product(bind):
    """Parse un binding SPARQL en produit"""
    return {
        "productId": _extract_value(_safe_get(bind, 'productId')),
        "productName": _extract_value(_safe_get(bind, 'productName')),
        "productDescription": _extract_value(_safe_get(bind, 'productDescription')),
        "productPrice": float(_extract_value(_safe_get(bind, 'productPrice')) or 0) if _safe_get(bind,
                                                                                                 'productPrice') else None,
        "productCategory": _extract_value(_safe_get(bind, 'productCategory')),
        "isOrganic": (_extract_value(_safe_get(bind, 'isOrganic')) == 'true') if _safe_get(bind,
                                                                                           'isOrganic') else False,
        "isHandmade": (_extract_value(_safe_get(bind, 'isHandmade')) == 'true') if _safe_get(bind,
                                                                                             'isHandmade') else False,
        "producerName": _extract_value(_safe_get(bind, 'producerName')),
        "stockQuantity": int(_extract_value(_safe_get(bind, 'stockQuantity')) or 0) if _safe_get(bind,
                                                                                                 'stockQuantity') else 0,
        "fairTradeCertified": (_extract_value(_safe_get(bind, 'fairTradeCertified')) == 'true') if _safe_get(bind,
                                                                                                             'fairTradeCertified') else False,
        "uri": _extract_value(_safe_get(bind, 'product'))
    }


def _parse_indicator(bind):
    """Parse un binding SPARQL en indicateur"""
    indicator_type = "Unknown"
    indicator_uri = _extract_value(_safe_get(bind, 'indicator'))
    if indicator_uri:
        if 'CarbonFootprint' in indicator_uri or 'Carbon' in indicator_uri:
            indicator_type = "CarbonFootprint"
        elif 'RenewableEnergy' in indicator_uri:
            indicator_type = "RenewableEnergyUsage"
        elif 'Water' in indicator_uri:
            indicator_type = "WaterConsumption"

    return {
        "indicatorId": _extract_value(_safe_get(bind, 'indicatorId')),
        "indicatorName": _extract_value(_safe_get(bind, 'indicatorName')),
        "indicatorValue": float(_extract_value(_safe_get(bind, 'indicatorValue')) or 0) if _safe_get(bind,
                                                                                                     'indicatorValue') else None,
        "measurementUnit": _extract_value(_safe_get(bind, 'measurementUnit')),
        "measurementDate": _extract_value(_safe_get(bind, 'measurementDate')),
        "targetValue": float(_extract_value(_safe_get(bind, 'targetValue')) or 0) if _safe_get(bind,
                                                                                               'targetValue') else None,
        "indicatorType": indicator_type,
        "uri": indicator_uri
    }


# ============================================
# LOCAL PRODUCTS - ENDPOINTS CRUD
# ============================================

@router.get("/products/", summary="Rechercher tous les produits locaux")
def search_local_products(
        category: Optional[str] = Query(None, description="Food and Beverages, Crafts and Textiles"),
        organic_only: bool = Query(False, description="Seulement les produits bio"),
        limit: int = Query(20, ge=1, le=100)
):
    """Retourne tous les produits locaux avec filtres optionnels"""
    try:
        filters = []
        if category:
            filters.append(f'FILTER(?productCategory = "{category}")')
        if organic_only:
            filters.append('FILTER(?isOrganic = "true"^^xsd:boolean)')

        filter_str = "\n          ".join(filters) if filters else ""

        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        SELECT ?product ?productId ?productName ?productDescription ?productPrice 
               ?productCategory ?isOrganic ?isHandmade ?producerName ?stockQuantity ?fairTradeCertified
        WHERE {{
          ?product a eco:LocalProduct ;
                   eco:productId ?productId ;
                   eco:productName ?productName ;
                   eco:productPrice ?productPrice ;
                   eco:productCategory ?productCategory ;
                   eco:isOrganic ?isOrganic ;
                   eco:isHandmade ?isHandmade ;
                   eco:producerName ?producerName ;
                   eco:stockQuantity ?stockQuantity ;
                   eco:fairTradeCertified ?fairTradeCertified .
          OPTIONAL {{ ?product eco:productDescription ?productDescription }}
          {filter_str}
        }}
        LIMIT {limit}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        products = [_parse_product(b) for b in binds]

        return {"status": "success", "count": len(products), "products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/products/filter/handmade", summary="Produits artisanaux uniquement")
def get_handmade_products(limit: int = Query(20, ge=1, le=100)):
    """Retourne tous les produits faits main"""
    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        SELECT ?product ?productId ?productName ?productPrice ?productCategory ?producerName
        WHERE {{
          ?product a eco:LocalProduct ;
                   eco:productId ?productId ;
                   eco:productName ?productName ;
                   eco:productPrice ?productPrice ;
                   eco:productCategory ?productCategory ;
                   eco:producerName ?producerName ;
                   eco:isHandmade "true"^^xsd:boolean .
        }}
        LIMIT {limit}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        products = [_parse_product(b) for b in binds]

        return {"status": "success", "count": len(products), "products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/products/filter/fair-trade", summary="Produits certifiés commerce équitable")
def get_fair_trade_products(limit: int = Query(20, ge=1, le=100)):
    """Retourne tous les produits certifiés commerce équitable"""
    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        SELECT ?product ?productId ?productName ?productPrice ?productCategory ?producerName
        WHERE {{
          ?product a eco:LocalProduct ;
                   eco:productId ?productId ;
                   eco:productName ?productName ;
                   eco:productPrice ?productPrice ;
                   eco:productCategory ?productCategory ;
                   eco:producerName ?producerName ;
                   eco:fairTradeCertified "true"^^xsd:boolean .
        }}
        LIMIT {limit}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        products = [_parse_product(b) for b in binds]

        return {"status": "success", "count": len(products), "products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/products/stats/cheapest", summary="Top 10 produits les moins chers")
def get_cheapest_products():
    """Retourne les 10 produits les moins chers"""
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?product ?productId ?productName ?productPrice ?productCategory
        WHERE {
          ?product a eco:LocalProduct ;
                   eco:productId ?productId ;
                   eco:productName ?productName ;
                   eco:productPrice ?productPrice ;
                   eco:productCategory ?productCategory .
        }
        ORDER BY ASC(?productPrice)
        LIMIT 10
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        products = [_parse_product(b) for b in binds]

        return {"status": "success", "count": len(products), "products": products, "ranking": "by_price"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/products/stats/low-stock", summary="Produits avec stock bas")
def get_low_stock_products(threshold: int = Query(50, description="Seuil de stock")):
    """Retourne les produits avec un stock inférieur au seuil"""
    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?product ?productId ?productName ?stockQuantity ?productPrice
        WHERE {{
          ?product a eco:LocalProduct ;
                   eco:productId ?productId ;
                   eco:productName ?productName ;
                   eco:stockQuantity ?stockQuantity ;
                   eco:productPrice ?productPrice .
          FILTER(?stockQuantity < {threshold})
        }}
        ORDER BY ASC(?stockQuantity)
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        products = [_parse_product(b) for b in binds]

        return {"status": "success", "count": len(products), "products": products, "threshold": threshold}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# ENDPOINTS AVANCÉS - SUSTAINABILITY
# ============================================

@router.get("/sustainability/stats/carbon-leaders", summary="Meilleurs indicateurs Carbon Footprint")
def get_carbon_leaders():
    """Retourne les indicateurs avec l'empreinte carbone la plus faible"""
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?indicator ?indicatorId ?indicatorName ?indicatorValue ?measurementUnit ?targetValue
        WHERE {
          ?indicator a eco:CarbonFootprint ;
                     eco:indicatorId ?indicatorId ;
                     eco:indicatorName ?indicatorName ;
                     eco:indicatorValue ?indicatorValue ;
                     eco:measurementUnit ?measurementUnit .
          OPTIONAL { ?indicator eco:targetValue ?targetValue }
        }
        ORDER BY ASC(?indicatorValue)
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        indicators = [_parse_indicator(b) for b in binds]

        return {"status": "success", "count": len(indicators), "indicators": indicators, "ranking": "by_carbon_value"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sustainability/stats/renewable-leaders", summary="Meilleurs indicateurs Renewable Energy")
def get_renewable_leaders():
    """Retourne les indicateurs avec le plus haut pourcentage d'énergie renouvelable"""
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?indicator ?indicatorId ?indicatorName ?indicatorValue ?measurementUnit ?targetValue
        WHERE {
          ?indicator a eco:RenewableEnergyUsage ;
                     eco:indicatorId ?indicatorId ;
                     eco:indicatorName ?indicatorName ;
                     eco:indicatorValue ?indicatorValue ;
                     eco:measurementUnit ?measurementUnit .
          OPTIONAL { ?indicator eco:targetValue ?targetValue }
        }
        ORDER BY DESC(?indicatorValue)
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        indicators = [_parse_indicator(b) for b in binds]

        return {"status": "success", "count": len(indicators), "indicators": indicators,
                "ranking": "by_renewable_percentage"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sustainability/stats/water-efficient", summary="Indicateurs Water Consumption les plus efficaces")
def get_water_efficient():
    """Retourne les indicateurs avec la consommation d'eau la plus faible"""
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?indicator ?indicatorId ?indicatorName ?indicatorValue ?measurementUnit ?targetValue
        WHERE {
          ?indicator a eco:WaterConsumption ;
                     eco:indicatorId ?indicatorId ;
                     eco:indicatorName ?indicatorName ;
                     eco:indicatorValue ?indicatorValue ;
                     eco:measurementUnit ?measurementUnit .
          OPTIONAL { ?indicator eco:targetValue ?targetValue }
        }
        ORDER BY ASC(?indicatorValue)
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        indicators = [_parse_indicator(b) for b in binds]

        return {"status": "success", "count": len(indicators), "indicators": indicators,
                "ranking": "by_water_consumption"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/products/all", summary="Lister tous les produits")
def get_all_products():
    """Retourne tous les produits locaux"""
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?product ?productId ?productName ?price ?category
        WHERE {
          ?product a eco:LocalProduct ;
                   eco:productId ?productId ;
                   eco:productName ?productName .
          OPTIONAL { ?product eco:price ?price }
          OPTIONAL { ?product eco:category ?category }
        }
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        products = [_parse_product(b) for b in binds]

        return {"status": "success", "count": len(products), "products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/products/{product_id}", summary="Afficher un produit local par ID")
def get_local_product(product_id: str):
    """Récupère les détails d'un produit local"""
    try:
        check_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?product
        WHERE {{
          ?product eco:productId "{product_id}" .
        }}
        LIMIT 1
        """

        check_result = sparql_select(check_sparql)
        binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")

        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?product ?productId ?productName ?productDescription ?productPrice 
               ?productCategory ?isOrganic ?isHandmade ?producerName ?stockQuantity ?fairTradeCertified
        WHERE {{
          ?product eco:productId "{product_id}" ;
                   eco:productName ?productName ;
                   eco:productPrice ?productPrice ;
                   eco:productCategory ?productCategory ;
                   eco:isOrganic ?isOrganic ;
                   eco:isHandmade ?isHandmade ;
                   eco:producerName ?producerName ;
                   eco:stockQuantity ?stockQuantity ;
                   eco:fairTradeCertified ?fairTradeCertified .
          BIND("{product_id}" AS ?productId)
          OPTIONAL {{ ?product eco:productDescription ?productDescription }}
        }}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")

        product = _parse_product(binds[0])
        return {"status": "success", "product": product}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/products/", summary="Ajouter un produit local")
def add_local_product(data: LocalProductCreate):
    """Ajoute un nouveau produit local"""
    uri = f"eco:{data.productId}"
    triples = [f"{uri} a eco:LocalProduct ."]

    def add_triple(prop, val, is_bool=False, is_float=False, is_int=False):
        if val is not None:
            if is_bool:
                triples.append(f'{uri} eco:{prop} "{str(val).lower()}"^^xsd:boolean .')
            elif is_float:
                triples.append(f'{uri} eco:{prop} "{val}"^^xsd:float .')
            elif is_int:
                triples.append(f'{uri} eco:{prop} "{val}"^^xsd:integer .')
            else:
                escaped = str(val).replace('"', '\\"')
                triples.append(f'{uri} eco:{prop} "{escaped}" .')

    add_triple("productId", data.productId)
    add_triple("productName", data.productName)
    add_triple("productDescription", data.productDescription)
    add_triple("productPrice", data.productPrice, is_float=True)
    add_triple("productCategory", data.productCategory)
    add_triple("isOrganic", data.isOrganic, is_bool=True)
    add_triple("isHandmade", data.isHandmade, is_bool=True)
    add_triple("producerName", data.producerName)
    add_triple("stockQuantity", data.stockQuantity, is_int=True)
    add_triple("fairTradeCertified", data.fairTradeCertified, is_bool=True)

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
        return {"status": "success", "message": f"Product '{data.productName}' created", "productId": data.productId}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/products/{product_id}", summary="Mettre à jour un produit local")
def update_local_product(product_id: str, update: LocalProductUpdate):
    """Met à jour les informations d'un produit (prix, stock, description)"""
    try:
        check_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?product
        WHERE {{
          ?product eco:productId "{product_id}" .
        }}
        LIMIT 1
        """

        check_result = sparql_select(check_sparql)
        binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")

        if all(v is None for v in update.dict().values()):
            raise HTTPException(status_code=400, detail="Au moins un champ doit être fourni")

        delete_clauses = []
        insert_clauses = []
        where_clauses = [f'?product eco:productId "{product_id}" .']

        if update.productPrice is not None:
            delete_clauses.append("?product eco:productPrice ?oldPrice .")
            insert_clauses.append(f'?product eco:productPrice "{update.productPrice}"^^xsd:float .')
            where_clauses.append("OPTIONAL { ?product eco:productPrice ?oldPrice . }")

        if update.stockQuantity is not None:
            delete_clauses.append("?product eco:stockQuantity ?oldStock .")
            insert_clauses.append(f'?product eco:stockQuantity "{update.stockQuantity}"^^xsd:integer .')
            where_clauses.append("OPTIONAL { ?product eco:stockQuantity ?oldStock . }")

        if update.productDescription is not None:
            escaped = update.productDescription.replace('"', '\\"')
            delete_clauses.append("?product eco:productDescription ?oldDesc .")
            insert_clauses.append(f'?product eco:productDescription "{escaped}" .')
            where_clauses.append("OPTIONAL { ?product eco:productDescription ?oldDesc . }")

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
            "message": f"Product '{product_id}' mis à jour avec succès",
            "product_id": product_id,
            "updated_fields": updated_fields
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/products/{product_id}", summary="Supprimer un produit local")
def delete_local_product(product_id: str):
    """Supprime un produit local"""
    sparql = f"""
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    DELETE WHERE {{ eco:{product_id} ?p ?o . }}
    """
    try:
        result = sparql_delete(sparql)
        return {
            "status": "success",
            "message": f"Product '{product_id}' supprimé avec succès",
            "product_id": product_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# SUSTAINABILITY INDICATORS - ENDPOINTS CRUD
# ============================================
@router.get("/sustainability/all", summary="Lister tous les indicateurs de durabilité")
def get_all_sustainability_indicators():
    """Retourne tous les indicateurs de durabilité (Carbon, Renewable Energy, Water)"""
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?indicator ?indicatorId ?indicatorName ?indicatorValue ?measurementUnit ?measurementDate ?targetValue
        WHERE {
          {
            ?indicator a eco:CarbonFootprint .
          } UNION {
            ?indicator a eco:RenewableEnergyUsage .
          } UNION {
            ?indicator a eco:WaterConsumption .
          }
          ?indicator eco:indicatorId ?indicatorId ;
                     eco:indicatorName ?indicatorName ;
                     eco:indicatorValue ?indicatorValue ;
                     eco:measurementUnit ?measurementUnit ;
                     eco:measurementDate ?measurementDate .
          OPTIONAL { ?indicator eco:targetValue ?targetValue }
        }
        ORDER BY ?indicatorId
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        indicators = [_parse_indicator(b) for b in binds]

        return {"status": "success", "count": len(indicators), "indicators": indicators}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sustainability/", summary="Rechercher tous les indicateurs de durabilité")
def search_sustainability_indicators(
        indicator_type: Optional[str] = Query(None,
                                              description="CarbonFootprint, RenewableEnergyUsage, WaterConsumption"),
        limit: int = Query(20, ge=1, le=100)
):
    """Retourne tous les indicateurs de durabilité avec filtre optionnel par type"""
    try:
        type_filter = f"a eco:{indicator_type} ;" if indicator_type else "?type ;"

        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?indicator ?indicatorId ?indicatorName ?indicatorValue ?measurementUnit 
               ?measurementDate ?targetValue
        WHERE {{
          ?indicator {type_filter}
                     eco:indicatorId ?indicatorId ;
                     eco:indicatorName ?indicatorName ;
                     eco:indicatorValue ?indicatorValue ;
                     eco:measurementUnit ?measurementUnit ;
                     eco:measurementDate ?measurementDate .
          OPTIONAL {{ ?indicator eco:targetValue ?targetValue }}
        }}
        LIMIT {limit}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        indicators = [_parse_indicator(b) for b in binds]

        return {"status": "success", "count": len(indicators), "indicators": indicators}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/sustainability/{indicator_id}", summary="Afficher un indicateur de durabilité par ID")
def get_sustainability_indicator(indicator_id: str):
    """Récupère les détails d'un indicateur spécifique"""
    try:
        check_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?indicator
        WHERE {{
          ?indicator eco:indicatorId "{indicator_id}" .
        }}
        LIMIT 1
        """

        check_result = sparql_select(check_sparql)
        binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Indicator '{indicator_id}' not found")

        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?indicator ?indicatorId ?indicatorName ?indicatorValue ?measurementUnit 
               ?measurementDate ?targetValue
        WHERE {{
          ?indicator eco:indicatorId "{indicator_id}" ;
                     eco:indicatorName ?indicatorName ;
                     eco:indicatorValue ?indicatorValue ;
                     eco:measurementUnit ?measurementUnit ;
                     eco:measurementDate ?measurementDate .
          BIND("{indicator_id}" AS ?indicatorId)
          OPTIONAL {{ ?indicator eco:targetValue ?targetValue }}
        }}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Indicator '{indicator_id}' not found")

        indicator = _parse_indicator(binds[0])
        return {"status": "success", "indicator": indicator}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sustainability/", summary="Ajouter un indicateur de durabilité")
def create_sustainability_indicator(data: SustainabilityIndicatorCreate):
    """
    Ajoute un nouvel indicateur de durabilité (Carbon, Renewable Energy, ou Water).

    Exemples:
    - CarbonFootprint: indicatorType="CarbonFootprint", measurementUnit="kg CO2 per guest per night"
    - RenewableEnergyUsage: indicatorType="RenewableEnergyUsage", measurementUnit="Percentage"
    - WaterConsumption: indicatorType="WaterConsumption", measurementUnit="Liters per guest per day"
    """
    try:
        # 1. Vérifier si l'indicateur existe déjà
        check_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?indicator
        WHERE {{
          ?indicator eco:indicatorId "{data.indicatorId}" .
        }}
        LIMIT 1
        """

        check_result = sparql_select(check_sparql)
        binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []

        if binds:
            raise HTTPException(
                status_code=409,
                detail=f"Indicator with ID '{data.indicatorId}' already exists"
            )

        # 2. Créer le nouvel indicateur
        uri = f"eco:{data.indicatorId}"
        measurement_date = data.measurementDate or datetime.now().isoformat()

        rdf_class = f"eco:{data.indicatorType.value}"

        triples = [f"{uri} a {rdf_class} ."]
        triples.append(f'{uri} eco:indicatorId "{data.indicatorId}" .')
        triples.append(f'{uri} eco:indicatorName "{data.indicatorName}" .')
        triples.append(f'{uri} eco:indicatorValue "{data.indicatorValue}"^^xsd:float .')
        triples.append(f'{uri} eco:measurementUnit "{data.measurementUnit}" .')
        triples.append(f'{uri} eco:measurementDate "{measurement_date}"^^xsd:dateTime .')

        if data.targetValue is not None:
            triples.append(f'{uri} eco:targetValue "{data.targetValue}"^^xsd:float .')

        triples_str = "\n        ".join(triples)
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        INSERT DATA {{
            {triples_str}
        }}
        """

        print(f"DEBUG CREATE INDICATOR:\n{sparql}")

        result = sparql_insert(sparql)

        return {
            "status": "created",
            "message": f"{data.indicatorType.value} indicator '{data.indicatorName}' created successfully",
            "indicatorId": data.indicatorId,
            "indicatorType": data.indicatorType.value,
            "measurementDate": measurement_date
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR CREATE: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/sustainability/{indicator_id}", summary="Mettre à jour un indicateur de durabilité")
def update_sustainability_indicator(indicator_id: str, update: IndicatorUpdate):
    """Met à jour les valeurs d'un indicateur (value, target)"""
    try:
        check_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?indicator
        WHERE {{
          ?indicator eco:indicatorId "{indicator_id}" .
        }}
        LIMIT 1
        """

        check_result = sparql_select(check_sparql)
        binds = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Indicator '{indicator_id}' not found")

        if all(v is None for v in update.dict().values()):
            raise HTTPException(status_code=400, detail="Au moins un champ doit être fourni")

        delete_clauses = []
        insert_clauses = []
        where_clauses = [f'?indicator eco:indicatorId "{indicator_id}" .']

        if update.indicatorValue is not None:
            delete_clauses.append("?indicator eco:indicatorValue ?oldValue .")
            delete_clauses.append("?indicator eco:measurementDate ?oldDate .")
            insert_clauses.append(f'?indicator eco:indicatorValue "{update.indicatorValue}"^^xsd:float .')
            insert_clauses.append(f'?indicator eco:measurementDate "{datetime.now().isoformat()}"^^xsd:dateTime .')
            where_clauses.append("OPTIONAL { ?indicator eco:indicatorValue ?oldValue . }")
            where_clauses.append("OPTIONAL { ?indicator eco:measurementDate ?oldDate . }")

        if update.targetValue is not None:
            delete_clauses.append("?indicator eco:targetValue ?oldTarget .")
            insert_clauses.append(f'?indicator eco:targetValue "{update.targetValue}"^^xsd:float .')
            where_clauses.append("OPTIONAL { ?indicator eco:targetValue ?oldTarget . }")

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
            "message": f"Indicator '{indicator_id}' mis à jour avec succès",
            "indicator_id": indicator_id,
            "updated_fields": updated_fields
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/sustainability/{indicator_id}", summary="Supprimer un indicateur de durabilité")
def delete_sustainability_indicator(indicator_id: str):
    """Supprime un indicateur de durabilité"""
    try:
        find_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?indicator
        WHERE {{
          ?indicator eco:indicatorId "{indicator_id}" .
        }}
        """

        find_result = sparql_select(find_sparql)
        binds = find_result.get('results', {}).get('bindings', []) if isinstance(find_result, dict) else []

        if not binds:
            raise HTTPException(status_code=404, detail=f"Indicator '{indicator_id}' not found")

        delete_sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        DELETE WHERE {{
          ?indicator eco:indicatorId "{indicator_id}" .
          ?indicator ?p ?o .
        }}
        """

        result = sparql_delete(delete_sparql)
        return {
            "status": "success",
            "message": f"Indicator '{indicator_id}' supprimé avec succès",
            "indicator_id": indicator_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# ENDPOINTS AVANCÉS - PRODUCTS
# ============================================

# GET /products/filter/organic - Produits bio uniquement
@router.get("/products/filter/organic", summary="Produits biologiques uniquement")
def get_organic_products(limit: int = Query(20, ge=1, le=100)):
    """Retourne tous les produits biologiques"""
    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        SELECT ?product ?productId ?productName ?productPrice ?productCategory ?producerName
        WHERE {{
          ?product a eco:LocalProduct ;
                   eco:productId ?productId ;
                   eco:productName ?productName ;
                   eco:productPrice ?productPrice ;
                   eco:productCategory ?productCategory ;
                   eco:producerName ?producerName ;
                   eco:isOrganic "true"^^xsd:boolean .
        }}
        LIMIT {limit}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        products = [_parse_product(b) for b in binds]

        return {"status": "success", "count": len(products), "products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /products/filter/handmade - Produits artisanaux uniquement
@router.get("/products/filter/handmade", summary="Produits artisanaux uniquement")
def get_handmade_products(limit: int = Query(20, ge=1, le=100)):
    """Retourne tous les produits faits main"""
    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        SELECT ?product ?productId ?productName ?productPrice ?productCategory ?producerName
        WHERE {{
          ?product a eco:LocalProduct ;
                   eco:productId ?productId ;
                   eco:productName ?productName ;
                   eco:productPrice ?productPrice ;
                   eco:productCategory ?productCategory ;
                   eco:producerName ?producerName ;
                   eco:isHandmade "true"^^xsd:boolean .
        }}
        LIMIT {limit}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        products = [_parse_product(b) for b in binds]

        return {"status": "success", "count": len(products), "products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /products/filter/fair-trade - Produits commerce équitable
@router.get("/products/filter/fair-trade", summary="Produits certifiés commerce équitable")
def get_fair_trade_products(limit: int = Query(20, ge=1, le=100)):
    """Retourne tous les produits certifiés commerce équitable"""
    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        SELECT ?product ?productId ?productName ?productPrice ?productCategory ?producerName
        WHERE {{
          ?product a eco:LocalProduct ;
                   eco:productId ?productId ;
                   eco:productName ?productName ;
                   eco:productPrice ?productPrice ;
                   eco:productCategory ?productCategory ;
                   eco:producerName ?producerName ;
                   eco:fairTradeCertified "true"^^xsd:boolean .
        }}
        LIMIT {limit}
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        products = [_parse_product(b) for b in binds]

        return {"status": "success", "count": len(products), "products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /products/stats/cheapest - Top 10 moins chers
@router.get("/products/stats/cheapest", summary="Top 10 produits les moins chers")
def get_cheapest_products():
    """Retourne les 10 produits les moins chers"""
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?product ?productId ?productName ?productPrice ?productCategory
        WHERE {
          ?product a eco:LocalProduct ;
                   eco:productId ?productId ;
                   eco:productName ?productName ;
                   eco:productPrice ?productPrice ;
                   eco:productCategory ?productCategory .
        }
        ORDER BY ASC(?productPrice)
        LIMIT 10
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        products = [_parse_product(b) for b in binds]

        return {"status": "success", "count": len(products), "products": products, "ranking": "by_price"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /products/stats/low-stock - Produits en rupture de stock
@router.get("/products/stats/low-stock", summary="Produits avec stock bas")
def get_low_stock_products(threshold: int = Query(50, description="Seuil de stock")):
    """Retourne les produits avec un stock inférieur au seuil"""
    try:
        sparql = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?product ?productId ?productName ?stockQuantity ?productPrice
        WHERE {{
          ?product a eco:LocalProduct ;
                   eco:productId ?productId ;
                   eco:productName ?productName ;
                   eco:stockQuantity ?stockQuantity ;
                   eco:productPrice ?productPrice .
          FILTER(?stockQuantity < {threshold})
        }}
        ORDER BY ASC(?stockQuantity)
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        products = [_parse_product(b) for b in binds]

        return {"status": "success", "count": len(products), "products": products, "threshold": threshold}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# ENDPOINTS AVANCÉS - SUSTAINABILITY
# ============================================

# GET /sustainability/stats/carbon-leaders - Meilleurs indicateurs carbone
@router.get("/sustainability/stats/carbon-leaders", summary="Meilleurs indicateurs Carbon Footprint")
def get_carbon_leaders():
    """Retourne les indicateurs avec l'empreinte carbone la plus faible"""
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?indicator ?indicatorId ?indicatorName ?indicatorValue ?measurementUnit ?targetValue
        WHERE {
          ?indicator a eco:CarbonFootprint ;
                     eco:indicatorId ?indicatorId ;
                     eco:indicatorName ?indicatorName ;
                     eco:indicatorValue ?indicatorValue ;
                     eco:measurementUnit ?measurementUnit .
          OPTIONAL { ?indicator eco:targetValue ?targetValue }
        }
        ORDER BY ASC(?indicatorValue)
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        indicators = [_parse_indicator(b) for b in binds]

        return {"status": "success", "count": len(indicators), "indicators": indicators, "ranking": "by_carbon_value"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /sustainability/stats/renewable-leaders - Meilleurs indicateurs renouvelables
@router.get("/sustainability/stats/renewable-leaders", summary="Meilleurs indicateurs Renewable Energy")
def get_renewable_leaders():
    """Retourne les indicateurs avec le plus haut pourcentage d'énergie renouvelable"""
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?indicator ?indicatorId ?indicatorName ?indicatorValue ?measurementUnit ?targetValue
        WHERE {
          ?indicator a eco:RenewableEnergyUsage ;
                     eco:indicatorId ?indicatorId ;
                     eco:indicatorName ?indicatorName ;
                     eco:indicatorValue ?indicatorValue ;
                     eco:measurementUnit ?measurementUnit .
          OPTIONAL { ?indicator eco:targetValue ?targetValue }
        }
        ORDER BY DESC(?indicatorValue)
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        indicators = [_parse_indicator(b) for b in binds]

        return {"status": "success", "count": len(indicators), "indicators": indicators,
                "ranking": "by_renewable_percentage"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /sustainability/stats/water-efficient - Indicateurs consommation d'eau efficaces
@router.get("/sustainability/stats/water-efficient", summary="Indicateurs Water Consumption les plus efficaces")
def get_water_efficient():
    """Retourne les indicateurs avec la consommation d'eau la plus faible"""
    try:
        sparql = """
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        SELECT ?indicator ?indicatorId ?indicatorName ?indicatorValue ?measurementUnit ?targetValue
        WHERE {
          ?indicator a eco:WaterConsumption ;
                     eco:indicatorId ?indicatorId ;
                     eco:indicatorName ?indicatorName ;
                     eco:indicatorValue ?indicatorValue ;
                     eco:measurementUnit ?measurementUnit .
          OPTIONAL { ?indicator eco:targetValue ?targetValue }
        }
        ORDER BY ASC(?indicatorValue)
        """

        results = sparql_select(sparql)
        binds = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []
        indicators = [_parse_indicator(b) for b in binds]

        return {"status": "success", "count": len(indicators), "indicators": indicators,
                "ranking": "by_water_consumption"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))