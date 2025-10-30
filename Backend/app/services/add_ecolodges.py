# add_ecolodges.py
from ecotourism_client import EcotourismClient

def add_ecolodges():
    client = EcotourismClient()
    
    print("🏨 Ajout d'éco-lodges tunisiens...")
    
    query = """
    INSERT DATA {
        # ÉCO-LODGES
        eco:DarHi a eco:EcoLodge ;
            rdfs:label "Dar Hi" ;
            rdfs:comment "Éco-lodge design à Nefta, architecture traditionnelle" ;
            eco:carbonFootprint "0.9" ;
            eco:capacity "12" ;
            eco:hasLocation eco:ParcSidiToui ;
            eco:sustainabilityCertification "Clef Verte" ;
            eco:priceRange "Moyen" ;
            eco:energySource "Solaire" .
            
        eco:LaBadira a eco:EcoLodge ;
            rdfs:label "La Badira" ;
            rdfs:comment "Hôtel écologique à Hammamet, piscine naturelle" ;
            eco:carbonFootprint "1.2" ;
            eco:capacity "120" ;
            eco:hasLocation eco:ParcBouKornine ;
            eco:sustainabilityCertification "Green Key" ;
            eco:priceRange "Élevé" ;
            eco:energySource "Solaire,Éolien" .
            
        eco:AubergeZembra a eco:EcoLodge ;
            rdfs:label "Auberge de Zembra" ;
            rdfs:comment "Auberge écologique sur l'île, autonomie énergétique" ;
            eco:carbonFootprint "0.5" ;
            eco:capacity "8" ;
            eco:hasLocation eco:ParcZembra ;
            eco:sustainabilityCertification "EcoLabel" ;
            eco:priceRange "Économique" ;
            eco:energySource "Solaire" .
            
        eco:RefugeSerj a eco:EcoLodge ;
            rdfs:label "Refuge du Jebel Serj" ;
            rdfs:comment "Refuge de montagne écologique, matériaux locaux" ;
            eco:carbonFootprint "0.7" ;
            eco:capacity "16" ;
            eco:hasLocation eco:ParcJebelSerj ;
            eco:sustainabilityCertification "Ecologique" ;
            eco:priceRange "Économique" ;
            eco:energySource "Solaire" .
    }
    """
    
    result = client.update_data(query)
    if result:
        print("✅ 4 éco-lodges ajoutés!")
        return True
    else:
        print("❌ Erreur lors de l'ajout")
        return False

if __name__ == "__main__":
    add_ecolodges()