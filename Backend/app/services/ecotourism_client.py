# app/services/ecotourism_client.py - VERSION CORRIGÉE

from SPARQLWrapper import SPARQLWrapper, JSON
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class EcotourismClient:
    
    def __init__(self):
        # Endpoint pour les requêtes SELECT
        self.select_endpoint = settings.SPARQL_ENDPOINT
        
        # Endpoint pour les requêtes UPDATE (INSERT/DELETE)
        self.update_endpoint = settings.SPARQL_UPDATE_ENDPOINT
        
        self.sparql_select = SPARQLWrapper(self.select_endpoint)
        self.sparql_select.setReturnFormat(JSON)
        
        self.sparql_update = SPARQLWrapper(self.update_endpoint)
        self.sparql_update.setMethod('POST')
        
        # ✅ CORRIGÉ: Utiliser le bon namespace
        self.prefixes = f"""
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX eco: <{settings.ONTOLOGY_NAMESPACE}>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        """
    
    def execute_query(self, query):
        """Exécute une requête SELECT"""
        self.sparql_select.setQuery(self.prefixes + query)
        
        try:
            results = self.sparql_select.query().convert()
            return results["results"]["bindings"]
        except Exception as e:
            logger.error(f"Erreur SELECT: {e}")
            raise Exception(f"Erreur lors de l'exécution de la requête SELECT: {str(e)}")
    
    def update_data(self, query):
        """Exécute une requête UPDATE (INSERT/DELETE)"""
        self.sparql_update.setQuery(self.prefixes + query)
        
        try:
            self.sparql_update.query()
            logger.info("Mise à jour réussie")
            return True
        except Exception as e:
            logger.error(f"Erreur UPDATE: {e}")
            raise Exception(f"Erreur lors de la mise à jour: {str(e)}")
    
    def count_all(self):
        """Compte tous les triplets"""
        query = "SELECT (COUNT(*) as ?count) WHERE { ?s ?p ?o }"
        results = self.execute_query(query)
        return int(results[0]["count"]["value"]) if results else 0
    
    def count_by_type(self, rdf_type):
        """Compte les instances d'un type"""
        query = f"""
        SELECT (COUNT(?entity) as ?count)
        WHERE {{ ?entity a eco:{rdf_type} }}
        """
        results = self.execute_query(query)
        return int(results[0]["count"]["value"]) if results else 0


if __name__ == "__main__":
    client = EcotourismClient()
    print(f"Total triplets: {client.count_all()}")
    print(f"EcoActivity: {client.count_by_type('EcoActivity')}")
    print(f"EcoLodge: {client.count_by_type('EcoLodge')}")
