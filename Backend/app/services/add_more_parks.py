# add_more_parks.py
from ecotourism_client import EcotourismClient

def add_tunisian_parks():
    client = EcotourismClient()
    
    print("🇹🇳 Ajout de parcs nationaux tunisiens...")
    
    query = """
    INSERT DATA {
        # PARCS NATIONAUX ADDITIONNELS
        eco:ParcBouKornine a eco:NationalPark ;
            rdfs:label "Parc National de Boukornine" ;
            rdfs:comment "Montagne près de Hammam Lif, riche biodiversité" ;
            eco:region "Ben Arous" ;
            eco:area "1939" ;
            eco:elevation "576" .
            
        eco:ParcZembra a eco:NationalPark ;
            rdfs:label "Parc National de Zembra" ;
            rdfs:comment "Île et réserve marine, nidification des oiseaux" ;
            eco:region "Nabeul" ;
            eco:area "369" ;
            eco:marinePark "true" .
            
        eco:ParcSidiToui a eco:NationalPark ;
            rdfs:label "Parc National de Sidi Toui" ;
            rdfs:comment "Écosystème désertique, réintroduction des gazelles" ;
            eco:region "Tataouine" ;
            eco:area "6300" ;
            eco:desertEcosystem "true" .
            
        eco:ParcJebelSerj a eco:NationalPark ;
            rdfs:label "Parc National de Jebel Serj" ;
            rdfs:comment "Gorges et forêts, site archéologique romain" ;
            eco:region "Siliana" ;
            eco:area "1720" ;
            eco:archaeologicalSite "true" .
    }
    """
    
    result = client.update_data(query)
    if result:
        print("✅ 4 parcs nationaux ajoutés!")
        return True
    else:
        print("❌ Erreur lors de l'ajout")
        return False

if __name__ == "__main__":
    add_tunisian_parks()