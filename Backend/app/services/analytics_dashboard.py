from SPARQLWrapper import SPARQLWrapper, JSON
from app.config import settings
import statistics
import logging

logger = logging.getLogger(__name__)

class AnalyticsDashboard:
    
    def __init__(self):
        self.endpoint = settings.SPARQL_ENDPOINT
        self.sparql = SPARQLWrapper(self.endpoint)
        self.sparql.setReturnFormat(JSON)
        
        # ✅ Utiliser le bon namespace
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
            return []
    
    def get_carbon_statistics(self):
        """Statistiques sur l'empreinte carbone - CORRIGÉ avec eco:carbonFootprint"""
        
        query = """
        SELECT ?carbon
        WHERE {
            ?activity a eco:EcoActivity ;
                      eco:carbonFootprint ?carbon .
            FILTER(BOUND(?carbon))
        }
        """
        
        results = self.execute_query(query)
        
        if not results:
            return {
                "total_activities": 0,
                "average": 0,
                "median": 0,
                "min": 0,
                "max": 0,
                "std_dev": 0
            }
        
        carbons = []
        for r in results:
            try:
                carbon = float(r.get('carbon', {}).get('value', 0))
                carbons.append(carbon)
            except:
                pass
        
        if not carbons:
            return {
                "total_activities": len(results),
                "average": 0,
                "median": 0,
                "min": 0,
                "max": 0,
                "std_dev": 0
            }
        
        return {
            "total_activities": len(carbons),
            "average": round(statistics.mean(carbons), 2),
            "median": round(statistics.median(carbons), 2),
            "min": round(min(carbons), 2),
            "max": round(max(carbons), 2),
            "std_dev": round(statistics.stdev(carbons), 2) if len(carbons) > 1 else 0
        }
    
    def get_statistics_by_region(self):
        """Statistiques par région"""
        
        query = """
        SELECT ?region (COUNT(?activity) as ?count)
        WHERE {
            ?activity a eco:EcoActivity ;
                      eco:hasLocation ?location .
            ?location rdfs:label ?region .
        }
        GROUP BY ?region
        ORDER BY DESC(?count)
        """
        
        results = self.execute_query(query)
        
        stats_by_region = {}
        for r in results:
            region = r.get('region', {}).get('value', 'Unknown')
            count = int(r.get('count', {}).get('value', 0))
            if region and region != 'Unknown':
                stats_by_region[region] = count
        
        return stats_by_region if stats_by_region else {}
    
    def get_top_eco_activities(self, limit: int = 10):
        """Top activités les plus écologiques (faible carbone) - CORRIGÉ"""
        
        query = f"""
        SELECT ?activity ?name ?carbon
        WHERE {{
            ?activity a eco:EcoActivity ;
                      rdfs:label ?name ;
                      eco:carbonFootprint ?carbon .
        }}
        ORDER BY ASC(xsd:float(?carbon))
        LIMIT {limit}
        """
        
        results = self.execute_query(query)
        
        top_activities = []
        for r in results:
            activity_name = r.get('name', {}).get('value', 'Unknown')
            carbon = float(r.get('carbon', {}).get('value', 0)) if r.get('carbon') else 0
            
            top_activities.append({
                "name": activity_name,
                "carbon": carbon,
                "uri": r.get('activity', {}).get('value', '')
            })
        
        return top_activities
    
    def get_activity_types_distribution(self):
        """Distribution des activités par type"""
        
        query = """
        SELECT ?type (COUNT(?activity) as ?count)
        WHERE {
            ?activity a ?type .
            FILTER(STRSTARTS(STR(?type), STR(eco:)))
        }
        GROUP BY ?type
        ORDER BY DESC(?count)
        """
        
        results = self.execute_query(query)
        
        distribution = {}
        for r in results:
            type_uri = r.get('type', {}).get('value', '')
            count = int(r.get('count', {}).get('value', 0))
            
            if type_uri:
                type_name = type_uri.split('#')[-1]
                # Inclure les types intéressants
                if type_name in ['EcoActivity', 'NationalPark', 'EcoLodge', 'Bike', 'ElectricVehicle', 'PublicTransport', 'LocalProduct']:
                    distribution[type_name] = count
        
        return distribution
    
    def get_accommodations_stats(self):
        """Statistiques des hébergements - CORRIGÉ avec les vraies propriétés"""
        
        query = """
        SELECT (COUNT(?accommodation) as ?count) (AVG(xsd:integer(?capacity)) as ?avgCapacity)
        WHERE {
            ?accommodation a eco:EcoLodge ;
                           eco:capacity ?capacity .
            FILTER(BOUND(?capacity))
        }
        """
        
        results = self.execute_query(query)
        
        if results:
            r = results[0]
            count = int(r.get('count', {}).get('value', 0))
            avg_capacity = float(r.get('avgCapacity', {}).get('value', 0)) if r.get('avgCapacity') else 0
            
            return {
                "total_accommodations": count,
                "average_capacity": round(avg_capacity, 0)
            }
        
        return {"total_accommodations": 0, "average_capacity": 0}
    
    def get_activities_by_difficulty(self):
        """Distribution par niveau de difficulté"""
        
        query = """
        SELECT ?difficulty (COUNT(?activity) as ?count)
        WHERE {
            ?activity a eco:EcoActivity ;
                      eco:difficulty ?difficulty .
        }
        GROUP BY ?difficulty
        ORDER BY ?difficulty
        """
        
        results = self.execute_query(query)
        
        distribution = {}
        for r in results:
            difficulty = r.get('difficulty', {}).get('value', 'Unknown')
            count = int(r.get('count', {}).get('value', 0))
            distribution[difficulty] = count
        
        return distribution
    
    def get_all_metrics(self):
        """Retourne tous les métriques pour un dashboard complet"""
        
        return {
            "carbon_stats": self.get_carbon_statistics(),
            "accommodations_stats": self.get_accommodations_stats(),
            "activities_by_difficulty": self.get_activities_by_difficulty(),
            "activity_types": self.get_activity_types_distribution(),
            "top_eco_activities": self.get_top_eco_activities(limit=5)
        }


if __name__ == "__main__":
    dashboard = AnalyticsDashboard()
    
    print("\n📊 STATISTIQUES ECO-TOURISM\n")
    print("=" * 60)
    
    print("\n1️⃣ CARBONE")
    print("-" * 60)
    carbon_stats = dashboard.get_carbon_statistics()
    for key, value in carbon_stats.items():
        print(f"   {key}: {value}")
    
    print("\n2️⃣ TOP ACTIVITÉS ÉCOLOGIQUES")
    print("-" * 60)
    top = dashboard.get_top_eco_activities(limit=5)
    for activity in top:
        print(f"   - {activity['name']}: {activity['carbon']} kg CO2")
    
    print("\n3️⃣ HÉBERGEMENTS")
    print("-" * 60)
    acc_stats = dashboard.get_accommodations_stats()
    for key, value in acc_stats.items():
        print(f"   {key}: {value}")
    
    print("\n4️⃣ TYPES D'ACTIVITÉS")
    print("-" * 60)
    types = dashboard.get_activity_types_distribution()
    for type_name, count in types.items():
        print(f"   {type_name}: {count}")
    
    print("\n" + "=" * 60)