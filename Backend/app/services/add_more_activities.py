# add_more_activities.py
from ecotourism_client import EcotourismClient

def add_diverse_activities():
    client = EcotourismClient()
    
    print("🎯 Ajout d'activités écotouristiques variées...")
    
    query = """
    INSERT DATA {
        # ACTIVITÉS MARINES
        eco:PlongeeZembra a eco:EcoActivity ;
            rdfs:label "Plongée sous-marine à Zembra" ;
            rdfs:comment "Exploration des fonds marins préservés de l'île de Zembra" ;
            eco:carbonFootprint "1.8" ;
            eco:duration "3" ;
            eco:difficulty "Modérée" ;
            eco:hasLocation eco:ParcZembra ;
            eco:season "Été" ;
            eco:activityType "Marine" .
            
        eco:ObservationDauphins a eco:EcoActivity ;
            rdfs:label "Observation des dauphins" ;
            rdfs:comment "Tour en bateau pour observer les dauphins en mer" ;
            eco:carbonFootprint "2.5" ;
            eco:duration "2.5" ;
            eco:difficulty "Facile" ;
            eco:hasLocation eco:ParcZembra ;
            eco:season "Printemps,Été" ;
            eco:activityType "Marine" .
            
        # ACTIVITÉS MONTAGNARDES
        eco:AscensionBoukornine a eco:EcoActivity ;
            rdfs:label "Ascension du Jebel Boukornine" ;
            rdfs:comment "Randonnée vers le sommet avec vue panoramique sur le golfe de Tunis" ;
            eco:carbonFootprint "3.2" ;
            eco:duration "4" ;
            eco:difficulty "Modérée" ;
            eco:hasLocation eco:ParcBouKornine ;
            eco:season "Automne,Printemps" ;
            eco:activityType "Montagne" .
            
        eco:RandoBotanique a eco:EcoActivity ;
            rdfs:label "Randonnée botanique" ;
            rdfs:comment "Découverte de la flore méditerranéenne avec guide naturaliste" ;
            eco:carbonFootprint "1.2" ;
            eco:duration "2" ;
            eco:difficulty "Facile" ;
            eco:hasLocation eco:ParcBouKornine ;
            eco:season "Printemps" ;
            eco:activityType "Botanique" .
            
        # ACTIVITÉS DÉSERTIQUES
        eco:SafariStellaire a eco:EcoActivity ;
            rdfs:label "Safari stellaire au désert" ;
            rdfs:comment "Observation des étoiles dans le désert de Sidi Toui" ;
            eco:carbonFootprint "0.8" ;
            eco:duration "3" ;
            eco:difficulty "Facile" ;
            eco:hasLocation eco:ParcSidiToui ;
            eco:season "Automne,Hiver" ;
            eco:activityType "Astronomie" .
            
        eco:ObservationGazelles a eco:EcoActivity ;
            rdfs:label "Observation des gazelles dorcas" ;
            rdfs:comment "Observation des gazelles réintroduites dans leur habitat naturel" ;
            eco:carbonFootprint "1.5" ;
            eco:duration "2" ;
            eco:difficulty "Facile" ;
            eco:hasLocation eco:ParcSidiToui ;
            eco:season "Toute l'année" ;
            eco:activityType "Faune" .
            
        # ACTIVITÉS CULTURELLES
        eco:VisiteArcheologique a eco:EcoActivity ;
            rdfs:label "Visite archéologique de Jebel Serj" ;
            rdfs:comment "Découverte des sites romains et des grottes préhistoriques" ;
            eco:carbonFootprint "1.0" ;
            eco:duration "2.5" ;
            eco:difficulty "Facile" ;
            eco:hasLocation eco:ParcJebelSerj ;
            eco:season "Toute l'année" ;
            eco:activityType "Culturel" .
            
        eco:Speleologie a eco:EcoActivity ;
            rdfs:label "Spéléologie dans les grottes" ;
            rdfs:comment "Exploration des grottes calcaires du parc" ;
            eco:carbonFootprint "2.8" ;
            eco:duration "3.5" ;
            eco:difficulty "Difficile" ;
            eco:hasLocation eco:ParcJebelSerj ;
            eco:season "Printemps,Automne" ;
            eco:activityType "Aventure" .
    }
    """
    
    result = client.update_data(query)
    if result:
        print("✅ 8 nouvelles activités ajoutées!")
        return True
    else:
        print("❌ Erreur lors de l'ajout")
        return False

if __name__ == "__main__":
    add_diverse_activities()