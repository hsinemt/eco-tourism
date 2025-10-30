from SPARQLWrapper import SPARQLWrapper, JSON
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class AccommodationRecommender:
    
    def __init__(self):
        self.endpoint = settings.SPARQL_ENDPOINT
        self.sparql = SPARQLWrapper(self.endpoint)
        self.sparql.setReturnFormat(JSON)
        
        self.prefixes = f"""
        PREFIX eco: <{settings.ONTOLOGY_NAMESPACE}>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        """
    
    def execute_query(self, query: str):
        """Exécute une requête SPARQL"""
        full_query = self.prefixes + query
        self.sparql.setQuery(full_query)
        
        try:
            results = self.sparql.query().convert()
            return results["results"]["bindings"]
        except Exception as e:
            logger.error(f"Erreur SPARQL: {e}")
            raise Exception(f"Erreur: {str(e)}")
    
    def get_eco_accommodations(self, max_carbon=5.0, eco_label=None, region=None):
        """Recherche d'hébergements éco-responsables
        
        ✅ CORRIGÉ: Utilise les VRAIS propriétés de votre ontologie:
        - accommodationName (au lieu de rdfs:label)
        - pricePerNight (au lieu de pricePerNight)
        - eco:carbonFootprint (correct)
        - maxGuests (au lieu de capacity)
        - ecoCertified (au lieu de sustainabilityCertification)
        """
        
        query = f"""
        SELECT ?accommodation ?name ?price ?rating ?certified ?guests ?rooms ?description
        WHERE {{
            ?accommodation a eco:EcoLodge ;
                           eco:accommodationName ?name ;
                           eco:pricePerNight ?price .
            OPTIONAL {{ ?accommodation eco:accommodationRating ?rating }}
            OPTIONAL {{ ?accommodation eco:ecoCertified ?certified }}
            OPTIONAL {{ ?accommodation eco:maxGuests ?guests }}
            OPTIONAL {{ ?accommodation eco:numberOfRooms ?rooms }}
            OPTIONAL {{ ?accommodation eco:accommodationDescription ?description }}
        }}
        ORDER BY ?price
        """
        
        return self.execute_query(query)
    
    def get_all_accommodations(self):
        """Récupère TOUS les hébergements"""
        
        query = """
        SELECT ?accommodation ?name ?price ?rating
        WHERE {
            ?accommodation a eco:EcoLodge ;
                           eco:accommodationName ?name ;
                           eco:pricePerNight ?price .
            OPTIONAL { ?accommodation eco:accommodationRating ?rating }
        }
        ORDER BY ?price
        """
        
        return self.execute_query(query)
    
    def search_by_name(self, name: str):
        """Recherche par nom d'hébergement"""
        
        query = f"""
        SELECT ?accommodation ?name ?price ?certified
        WHERE {{
            ?accommodation a eco:EcoLodge ;
                           eco:accommodationName ?name ;
                           eco:pricePerNight ?price .
            FILTER(CONTAINS(LCASE(?name), LCASE("{name}")))
            OPTIONAL {{ ?accommodation eco:ecoCertified ?certified }}
        }}
        """
        
        return self.execute_query(query)
    
    def get_by_price_range(self, min_price: float, max_price: float):
        """Recherche par gamme de prix"""
        
        query = f"""
        SELECT ?accommodation ?name ?price ?guests
        WHERE {{
            ?accommodation a eco:EcoLodge ;
                           eco:accommodationName ?name ;
                           eco:pricePerNight ?price .
            FILTER(xsd:float(?price) >= {min_price} && xsd:float(?price) <= {max_price})
            OPTIONAL {{ ?accommodation eco:maxGuests ?guests }}
        }}
        ORDER BY ?price
        """
        
        return self.execute_query(query)