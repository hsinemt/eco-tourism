# populate_tunisia_data.py - VERSION CORRIGÉE
from ecotourism_client import EcotourismClient

def populate_tunisia_ecotourism():
    client = EcotourismClient()
    
    print("🇹🇳 Ajout des données écotouristiques tunisiennes...")
    
    # REQUÊTE CORRIGÉE - format SPARQL UPDATE correct
    query = """
    INSERT DATA {
        # PARCS NATIONAUX
        <http://www.ecotourism.org/ontology#ParcIchkeul> a <http://www.ecotourism.org/ontology#NationalPark> ;
            <http://www.w3.org/2000/01/rdf-schema#label> "Parc National d'Ichkeul" ;
            <http://www.w3.org/2000/01/rdf-schema#comment> "Réserve de biosphère UNESCO, habitat d'oiseaux migrateurs" ;
            <http://www.ecotourism.org/ontology#region> "Bizerte" ;
            <http://www.ecotourism.org/ontology#area> "12600" ;
            <http://www.ecotourism.org/ontology#unescoHeritage> "true" .
            
        <http://www.ecotourism.org/ontology#ParcBouhedma> a <http://www.ecotourism.org/ontology#NationalPark> ;
            <http://www.w3.org/2000/01/rdf-schema#label> "Parc National de Bouhedma" ;
            <http://www.w3.org/2000/01/rdf-schema#comment> "Écosystème steppique, gazelles et autruches" ;
            <http://www.ecotourism.org/ontology#region> "Sidi Bouzid" ;
            <http://www.ecotourism.org/ontology#area> "16488" .
            
        # ACTIVITÉS ÉCOTOURISTIQUES
        <http://www.ecotourism.org/ontology#RandoIchkeul> a <http://www.ecotourism.org/ontology#EcoActivity> ;
            <http://www.w3.org/2000/01/rdf-schema#label> "Randonnée écologique à Ichkeul" ;
            <http://www.w3.org/2000/01/rdf-schema#comment> "Randonnée guidée avec observation des oiseaux migrateurs" ;
            <http://www.ecotourism.org/ontology#carbonFootprint> "2.1" ;
            <http://www.ecotourism.org/ontology#duration> "3" ;
            <http://www.ecotourism.org/ontology#difficulty> "Modérée" ;
            <http://www.ecotourism.org/ontology#hasLocation> <http://www.ecotourism.org/ontology#ParcIchkeul> ;
            <http://www.ecotourism.org/ontology#season> "Automne,Hiver" .
            
        <http://www.ecotourism.org/ontology#ObservationFlamants> a <http://www.ecotourism.org/ontology#EcoActivity> ;
            <http://www.w3.org/2000/01/rdf-schema#label> "Observation des flamants roses" ;
            <http://www.w3.org/2000/01/rdf-schema#comment> "Session d'observation des flamants roses avec guide naturaliste" ;
            <http://www.ecotourism.org/ontology#carbonFootprint> "1.5" ;
            <http://www.ecotourism.org/ontology#duration> "2" ;
            <http://www.ecotourism.org/ontology#difficulty> "Facile" ;
            <http://www.ecotourism.org/ontology#hasLocation> <http://www.ecotourism.org/ontology#ParcIchkeul> ;
            <http://www.ecotourism.org/ontology#season> "Toute l'année" .
    }
    """
    
    result = client.update_data(query)
    if result:
        print("✅ Données tunisiennes ajoutées avec succès!")
        return True
    else:
        print("❌ Erreur lors de l'ajout des données")
        return False

if __name__ == "__main__":
    populate_tunisia_ecotourism()