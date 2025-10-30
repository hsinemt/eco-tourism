"""
Script de DEBUG - À exécuter dans votre environnement FastAPI
pour voir EXACTEMENT ce que contient votre triplestore
"""

def debug_sparql_responses():
    """Exécute des requêtes de debug progressives"""
    from app.services.sparql_helpers import sparql_select
    
    PREFIXES = """
    PREFIX eco: <http://www.ecotourism.org/ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    """
    
    print("\n" + "="*80)
    print("🔍 DEBUG SPARQL - INSPECTION DU TRIPLESTORE")
    print("="*80)
    
    # ============ TEST 1 ============
    print("\n\n📋 TEST 1 : TOUS LES TRIPLES (aucun filtre)")
    print("-" * 80)
    query = PREFIXES + """
    SELECT ?s ?p ?o
    WHERE {
      ?s ?p ?o
    }
    LIMIT 100
    """
    print("REQUÊTE :")
    print(query)
    print("\nRÉSULTATS BRUTS :")
    try:
        results = sparql_select(query)
        if results:
            print(f"✅ {len(results)} résultats trouvés")
            for i, result in enumerate(results[:10]):
                print(f"\n  Résultat {i}:")
                print(f"    Type: {type(result)}")
                print(f"    Contenu: {result}")
        else:
            print("❌ Aucun résultat")
    except Exception as e:
        print(f"❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()
    
    # ============ TEST 2 ============
    print("\n\n📋 TEST 2 : CHERCHER TOUS LES BOOKINGS")
    print("-" * 80)
    query = PREFIXES + """
    SELECT ?s ?p ?o
    WHERE {
      ?s rdf:type eco:Booking ;
         ?p ?o
    }
    LIMIT 100
    """
    print("REQUÊTE :")
    print(query)
    print("\nRÉSULTATS BRUTS :")
    try:
        results = sparql_select(query)
        if results:
            print(f"✅ {len(results)} résultats trouvés")
            for i, result in enumerate(results[:20]):
                print(f"\n  Résultat {i}:")
                print(f"    Contenu: {result}")
        else:
            print("❌ Aucun résultat - Les Bookings n'existent pas ou pas de type rdf:type eco:Booking")
    except Exception as e:
        print(f"❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()
    
    # ============ TEST 3 ============
    print("\n\n📋 TEST 3 : CHERCHER AVEC eco:madeBy")
    print("-" * 80)
    query = PREFIXES + """
    SELECT ?booking ?madeBy
    WHERE {
      ?booking eco:madeBy ?madeBy
    }
    LIMIT 100
    """
    print("REQUÊTE :")
    print(query)
    print("\nRÉSULTATS BRUTS :")
    try:
        results = sparql_select(query)
        if results:
            print(f"✅ {len(results)} résultats trouvés")
            for i, result in enumerate(results):
                print(f"\n  Résultat {i}:")
                print(f"    Contenu: {result}")
        else:
            print("❌ Aucun résultat - Pas de propriété eco:madeBy trouvée")
    except Exception as e:
        print(f"❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()
    
    # ============ TEST 4 ============
    print("\n\n📋 TEST 4 : CHERCHER AVEC eco:bookedBy (l'ancienne façon)")
    print("-" * 80)
    query = PREFIXES + """
    SELECT ?booking ?bookedBy
    WHERE {
      ?booking eco:bookedBy ?bookedBy
    }
    LIMIT 100
    """
    print("REQUÊTE :")
    print(query)
    print("\nRÉSULTATS BRUTS :")
    try:
        results = sparql_select(query)
        if results:
            print(f"✅ {len(results)} résultats trouvés")
            for i, result in enumerate(results):
                print(f"\n  Résultat {i}:")
                print(f"    Contenu: {result}")
        else:
            print("❌ Aucun résultat - eco:bookedBy n'existe pas (c'est normal)")
    except Exception as e:
        print(f"❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()
    
    # ============ TEST 5 ============
    print("\n\n📋 TEST 5 : CHERCHER TOUTES LES PROPRIÉTÉS DE Booking_001 EXACTEMENT")
    print("-" * 80)
    query = PREFIXES + """
    SELECT ?p ?o
    WHERE {
      eco:Booking_001 ?p ?o
    }
    """
    print("REQUÊTE :")
    print(query)
    print("\nRÉSULTATS BRUTS :")
    try:
        results = sparql_select(query)
        if results:
            print(f"✅ {len(results)} résultats trouvés")
            for i, result in enumerate(results):
                print(f"\n  Résultat {i}:")
                print(f"    Contenu: {result}")
        else:
            print("❌ Aucun résultat - eco:Booking_001 n'existe pas")
    except Exception as e:
        print(f"❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()
    
    # ============ TEST 6 ============
    print("\n\n📋 TEST 6 : FORMAT DE RÉPONSE SPARQL (parser les résultats)")
    print("-" * 80)
    query = PREFIXES + """
    SELECT ?booking
    WHERE {
      ?booking rdf:type eco:Booking
    }
    LIMIT 1
    """
    print("REQUÊTE :")
    print(query)
    print("\nRÉSULTATS COMPLETS :")
    try:
        results = sparql_select(query)
        if results:
            result = results[0]
            print(f"Premier résultat:")
            print(f"  Type Python: {type(result)}")
            print(f"  Contenu brut: {result}")
            print(f"\n  Essai d'accès aux clés:")
            if isinstance(result, dict):
                for key in result.keys():
                    print(f"    - Clé '{key}': {result[key]} (type: {type(result[key])})")
                    if isinstance(result[key], dict):
                        print(f"      Sous-clés: {result[key].keys()}")
                        for subkey in result[key].keys():
                            print(f"        - '{subkey}': {result[key][subkey]}")
        else:
            print("❌ Aucun résultat")
    except Exception as e:
        print(f"❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "="*80)
    print("FIN DU DEBUG")
    print("="*80)

if __name__ == "__main__":
    # À exécuter dans une route FastAPI ou via un script
    debug_sparql_responses()