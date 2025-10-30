# app/services/advanced_recommender.py - CORRIGÉ POUR VOTRE ONTOLOGIE

from SPARQLWrapper import SPARQLWrapper, JSON
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class EnhancedEcoRecommender:
    
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
    
    def get_eco_activities(self):
        """Récupère TOUTES les activités écotouristiques
        
        ✅ CORRIGÉ: Utilise les VRAIES propriétés de votre ontologie:
        - label (rdfs:label trouvé dans les données)
        - eco:difficulty
        - eco:duration
        - eco:season
        - eco:activityType
        """
        
        query = """
        SELECT ?activity ?name ?difficulty ?duration ?season ?type
        WHERE {
            ?activity a eco:EcoActivity ;
                      rdfs:label ?name .
            OPTIONAL { ?activity eco:difficulty ?difficulty }
            OPTIONAL { ?activity eco:duration ?duration }
            OPTIONAL { ?activity eco:season ?season }
            OPTIONAL { ?activity eco:activityType ?type }
        }
        ORDER BY ?name
        """
        
        return self.execute_query(query)
    
    def get_smart_recommendations(self, carbon_level="low", difficulty=None, season=None):
        """Recommandations intelligentes d'activités"""
        
        filters = []
        
        if difficulty:
            filters.append(f'FILTER(?difficulty = "{difficulty}")')
        
        if season:
            filters.append(f'FILTER(CONTAINS(LCASE(STR(?season)), LCASE("{season}")))')
        
        filter_clause = " ".join(filters)
        
        query = f"""
        SELECT ?activity ?name ?difficulty ?duration ?season
        WHERE {{
            ?activity a eco:EcoActivity ;
                      rdfs:label ?name .
            OPTIONAL {{ ?activity eco:difficulty ?difficulty }}
            OPTIONAL {{ ?activity eco:duration ?duration }}
            OPTIONAL {{ ?activity eco:season ?season }}
            {filter_clause}
        }}
        ORDER BY ?name
        """
        
        return self.execute_query(query)
    
    def get_activities_by_type(self, activity_type: str):
        """Récupère les activités d'un type spécifique"""
        
        query = f"""
        SELECT ?activity ?name ?type ?difficulty ?duration
        WHERE {{
            ?activity a eco:EcoActivity ;
                      rdfs:label ?name ;
                      eco:activityType ?type .
            FILTER(CONTAINS(LCASE(?type), LCASE("{activity_type}")))
            OPTIONAL {{ ?activity eco:difficulty ?difficulty }}
            OPTIONAL {{ ?activity eco:duration ?duration }}
        }}
        ORDER BY ?name
        """
        
        return self.execute_query(query)
    
    def get_activities_by_difficulty(self, difficulty: str):
        """Filtre par niveau de difficulté"""
        
        query = f"""
        SELECT ?activity ?name ?difficulty ?duration ?season
        WHERE {{
            ?activity a eco:EcoActivity ;
                      rdfs:label ?name ;
                      eco:difficulty "{difficulty}" .
            OPTIONAL {{ ?activity eco:duration ?duration }}
            OPTIONAL {{ ?activity eco:season ?season }}
        }}
        ORDER BY ?name
        """
        
        return self.execute_query(query)
    
    def get_activities_by_season(self, season: str):
        """Filtre par saison"""
        
        query = f"""
        SELECT ?activity ?name ?season ?difficulty ?duration
        WHERE {{
            ?activity a eco:EcoActivity ;
                      rdfs:label ?name ;
                      eco:season ?season .
            FILTER(CONTAINS(LCASE(?season), LCASE("{season}")))
            OPTIONAL {{ ?activity eco:difficulty ?difficulty }}
            OPTIONAL {{ ?activity eco:duration ?duration }}
        }}
        ORDER BY ?name
        """
        
        return self.execute_query(query)
