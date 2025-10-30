# activity_comparator.py - Comparaison d'Activités
from SPARQLWrapper import SPARQLWrapper, JSON
import re

class ActivityComparator:
    def __init__(self):
        self.endpoint = "http://localhost:3030/Eco-Tourism/sparql"
        self.sparql = SPARQLWrapper(self.endpoint)
        self.sparql.setReturnFormat(JSON)
    
    def get_activity_details(self, activity_uri):
        """Récupère les détails complets d'une activité"""
        query = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        
        SELECT ?carbon ?difficulty ?duration ?season ?location
        WHERE {{
            <{activity_uri}> eco:carbonFootprint ?carbon ;
                            eco:difficulty ?difficulty ;
                            eco:duration ?duration ;
                            eco:season ?season ;
                            eco:hasLocation ?location .
        }}
        """
        
        self.sparql.setQuery(query)
        try:
            results = self.sparql.query().convert()
            if results["results"]["bindings"]:
                return results["results"]["bindings"][0]
            return None
        except Exception as e:
            print(f"❌ Erreur : {e}")
            return None
    
    def calculate_eco_score(self, carbon, difficulty, duration):
        """Calcule un score écologique (0-100)"""
        # Score basé sur l'empreinte carbone (poids: 50%)
        carbon_val = float(carbon)
        carbon_score = max(0, 100 - (carbon_val * 20))  # 5kg CO2 = 0 points
        
        # Score basé sur la difficulté (poids: 20%)
        difficulty_scores = {"Facile": 100, "Modérée": 70, "Difficile": 40}
        difficulty_score = difficulty_scores.get(difficulty, 50)
        
        # Score basé sur la durée (poids: 30%)
        duration_val = float(duration)
        duration_score = min(100, duration_val * 20)  # Plus longue = mieux
        
        # Score final pondéré
        total = (carbon_score * 0.5) + (difficulty_score * 0.2) + (duration_score * 0.3)
        return round(total, 1)
    
    def compare_activities(self, activity_uris):
        """Compare plusieurs activités"""
        activities_data = []
        
        for uri in activity_uris:
            details = self.get_activity_details(uri)
            if details:
                name = uri.split('#')[-1]
                name = re.sub(r'([a-z])([A-Z])', r'\1 \2', name)
                
                eco_score = self.calculate_eco_score(
                    details['carbon']['value'],
                    details['difficulty']['value'],
                    details['duration']['value']
                )
                
                activities_data.append({
                    'name': name,
                    'uri': uri,
                    'carbon': float(details['carbon']['value']),
                    'difficulty': details['difficulty']['value'],
                    'duration': float(details['duration']['value']),
                    'season': details['season']['value'],
                    'location': details['location']['value'].split('#')[-1],
                    'eco_score': eco_score
                })
        
        return activities_data
    
    def display_comparison(self, activities_data):
        """Affiche une comparaison formatée"""
        if not activities_data:
            print("❌ Aucune donnée à comparer")
            return
        
        print("\n" + "="*80)
        print("🔄 COMPARAISON D'ACTIVITÉS ÉCO-TOURISTIQUES")
        print("="*80)
        
        # Tri par score écologique
        sorted_activities = sorted(activities_data, key=lambda x: x['eco_score'], reverse=True)
        
        # En-tête du tableau
        print(f"\n{'Activité':<25} {'Score Éco':<12} {'CO2':<10} {'Difficulté':<12} {'Durée':<10}")
        print("-"*80)
        
        # Données
        for act in sorted_activities:
            score_icon = "🟢" if act['eco_score'] >= 70 else "🟡" if act['eco_score'] >= 50 else "🔴"
            print(f"{act['name']:<25} {score_icon} {act['eco_score']:<8.1f} {act['carbon']:<8.1f}kg {act['difficulty']:<12} {act['duration']:<7.1f}h")
        
        # Détails complets
        print("\n" + "="*80)
        print("📊 DÉTAILS COMPLETS")
        print("="*80)
        
        for i, act in enumerate(sorted_activities, 1):
            print(f"\n{i}. {act['name'].upper()}")
            print(f"   🌱 Empreinte Carbone : {act['carbon']}kg CO2")
            print(f"   🏷️  Difficulté : {act['difficulty']}")
            print(f"   ⏱️  Durée : {act['duration']}h")
            print(f"   🎯 Saison : {act['season']}")
            print(f"   📍 Lieu : {act['location']}")
            print(f"   🏆 Score Écologique : {act['eco_score']}/100")
        
        # Recommandation
        best = sorted_activities[0]
        print(f"\n{'='*80}")
        print(f"✨ MEILLEURE OPTION : {best['name']}")
        print(f"   Score écologique de {best['eco_score']}/100")
        print(f"   Empreinte carbone de seulement {best['carbon']}kg CO2")
        print(f"{'='*80}")
    
    def get_alternatives(self, activity_uri, max_carbon_diff=1.0):
        """Trouve des activités alternatives similaires"""
        current = self.get_activity_details(activity_uri)
        if not current:
            return []
        
        current_carbon = float(current['carbon']['value'])
        current_difficulty = current['difficulty']['value']
        
        query = f"""
        PREFIX eco: <http://www.ecotourism.org/ontology#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        
        SELECT ?activity ?carbon ?difficulty ?duration ?location
        WHERE {{
            ?activity a eco:EcoActivity ;
                     eco:carbonFootprint ?carbon ;
                     eco:difficulty ?difficulty ;
                     eco:duration ?duration ;
                     eco:hasLocation ?location .
            FILTER(?activity != <{activity_uri}>)
            FILTER(?difficulty = "{current_difficulty}")
            FILTER(ABS(xsd:float(?carbon) - {current_carbon}) <= {max_carbon_diff})
        }}
        ORDER BY ABS(xsd:float(?carbon) - {current_carbon})
        LIMIT 5
        """
        
        self.sparql.setQuery(query)
        try:
            results = self.sparql.query().convert()
            return results["results"]["bindings"]
        except Exception as e:
            print(f"❌ Erreur : {e}")
            return []

# TEST DU SYSTÈME
if __name__ == "__main__":
    comparator = ActivityComparator()
    
    print("🎯 SYSTÈME DE COMPARAISON D'ACTIVITÉS")
    
    # Activités à comparer
    activities_to_compare = [
        "http://www.ecotourism.org/ontology#SafariStellaire",
        "http://www.ecotourism.org/ontology#RandoBotanique",
        "http://www.ecotourism.org/ontology#ObservationFlamants",
        "http://www.ecotourism.org/ontology#PlongeeZembra",
        "http://www.ecotourism.org/ontology#AscensionBoukornine"
    ]
    
    # Comparaison
    data = comparator.compare_activities(activities_to_compare)
    comparator.display_comparison(data)
    
    # Alternatives
    print("\n\n" + "="*80)
    print("🔄 ACTIVITÉS ALTERNATIVES SIMILAIRES")
    print("="*80)
    
    alternatives = comparator.get_alternatives(
        "http://www.ecotourism.org/ontology#SafariStellaire",
        max_carbon_diff=0.5
    )
    
    if alternatives:
        print(f"\n✅ {len(alternatives)} alternatives trouvées:\n")
        for i, alt in enumerate(alternatives, 1):
            name = alt['activity']['value'].split('#')[-1]
            name = re.sub(r'([a-z])([A-Z])', r'\1 \2', name)
            print(f"{i}. {name}")
            print(f"   🌱 {alt['carbon']['value']}kg CO2")
            print(f"   🏷️  {alt['difficulty']['value']}")
            print(f"   ⏱️  {alt['duration']['value']}h\n")
    else:
        print("\n❌ Aucune alternative trouvée")