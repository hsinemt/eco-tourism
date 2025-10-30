# app/scripts/diagnose.py - Diagnostic complet du problème

from SPARQLWrapper import SPARQLWrapper, JSON
import json

class Diagnostic:
    
    def __init__(self):
        self.select_endpoint = "http://localhost:3030/Eco-Tourism/sparql"
        self.sparql = SPARQLWrapper(self.select_endpoint)
        self.sparql.setReturnFormat(JSON)
    
    def run_query(self, query_str):
        """Exécute une requête et affiche le résultat"""
        self.sparql.setQuery(query_str)
        try:
            results = self.sparql.query().convert()
            return results
        except Exception as e:
            print(f"❌ Erreur: {e}")
            return None
    
    def diagnose_all(self):
        """Diagnostic complet"""
        print("\n" + "="*70)
        print("🔍 DIAGNOSTIC COMPLET DE VOTRE TRIPLESTORE FUSEKI")
        print("="*70 + "\n")
        
        # 1. Vérifier la connexion
        print("1️⃣ TEST DE CONNEXION")
        print("-" * 70)
        query = "SELECT * WHERE { ?s ?p ?o } LIMIT 1"
        result = self.run_query(query)
        if result is not None:
            print("✅ Connexion à Fuseki OK\n")
        else:
            print("❌ IMPOSSIBLE DE SE CONNECTER À FUSEKI\n")
            return
        
        # 2. Compter les triplets totaux
        print("2️⃣ NOMBRE TOTAL DE TRIPLETS")
        print("-" * 70)
        query = "SELECT (COUNT(*) as ?count) WHERE { ?s ?p ?o }"
        result = self.run_query(query)
        if result and result["results"]["bindings"]:
            count = int(result["results"]["bindings"][0]["count"]["value"])
            print(f"Total de triplets: {count}\n")
            
            if count == 0:
                print("⚠️ LE DATASET EST COMPLÈTEMENT VIDE!\n")
                return
        
        # 3. Trouver tous les namespaces utilisés
        print("3️⃣ NAMESPACES/PRÉFIXES UTILISÉS")
        print("-" * 70)
        query = """
        SELECT DISTINCT ?namespace
        WHERE {
            ?s ?p ?o .
            BIND(STRBEFORE(STR(?s), STRAFTER(STR(?s), "#")) as ?namespace)
        }
        LIMIT 20
        """
        result = self.run_query(query)
        if result and result["results"]["bindings"]:
            namespaces = set()
            for binding in result["results"]["bindings"]:
                ns = binding.get("namespace", {}).get("value")
                if ns:
                    namespaces.add(ns)
            print(f"Namespaces trouvés:")
            for ns in sorted(namespaces):
                print(f"  - {ns}")
            print()
        
        # 4. Compter les classes utilisées
        print("4️⃣ CLASSES RDF UTILISÉES")
        print("-" * 70)
        query = """
        SELECT ?type (COUNT(?entity) as ?count)
        WHERE {
            ?entity a ?type
        }
        GROUP BY ?type
        ORDER BY DESC(?count)
        """
        result = self.run_query(query)
        if result and result["results"]["bindings"]:
            print("Classes trouvées:")
            for binding in result["results"]["bindings"]:
                type_uri = binding.get("type", {}).get("value", "?")
                count = int(binding.get("count", {}).get("value", 0))
                # Extraire le nom court
                type_name = type_uri.split("#")[-1] if "#" in type_uri else type_uri.split("/")[-1]
                print(f"  - {type_name}: {count} instances")
            print()
        else:
            print("❌ Aucune classe trouvée\n")
        
        # 5. Tous les sujets
        print("5️⃣ TOUS LES SUJETS (Entités)")
        print("-" * 70)
        query = """
        SELECT DISTINCT ?subject
        WHERE { ?subject ?p ?o }
        LIMIT 50
        """
        result = self.run_query(query)
        if result and result["results"]["bindings"]:
            print(f"Entités trouvées ({len(result['results']['bindings'])}):")
            for binding in result["results"]["bindings"]:
                subject = binding.get("subject", {}).get("value", "?")
                # Extraire le nom court
                name = subject.split("#")[-1] if "#" in subject else subject.split("/")[-1]
                print(f"  - {name}")
                print(f"    ({subject})")
            print()
        else:
            print("❌ Aucune entité trouvée\n")
        
        # 6. Tous les prédicats
        print("6️⃣ TOUS LES PRÉDICATS UTILISÉS")
        print("-" * 70)
        query = """
        SELECT DISTINCT ?predicate
        WHERE { ?s ?predicate ?o }
        LIMIT 50
        """
        result = self.run_query(query)
        if result and result["results"]["bindings"]:
            predicates = []
            for binding in result["results"]["bindings"]:
                pred = binding.get("predicate", {}).get("value", "?")
                predicates.append(pred)
            print(f"Prédicats trouvés ({len(predicates)}):")
            for pred in sorted(predicates):
                name = pred.split("#")[-1] if "#" in pred else pred.split("/")[-1]
                print(f"  - {name}")
            print()
        else:
            print("❌ Aucun prédicat trouvé\n")
        
        # 7. Exemples de triplets
        print("7️⃣ EXEMPLES DE TRIPLETS DANS LA BASE")
        print("-" * 70)
        query = """
        SELECT ?subject ?predicate ?object
        WHERE { ?subject ?predicate ?object }
        LIMIT 20
        """
        result = self.run_query(query)
        if result and result["results"]["bindings"]:
            print(f"Triplets trouvés ({len(result['results']['bindings'])}):")
            for binding in result["results"]["bindings"]:
                s = binding.get("subject", {}).get("value", "?")
                p = binding.get("predicate", {}).get("value", "?")
                o = binding.get("object", {}).get("value", "?")
                
                s_name = s.split("#")[-1] if "#" in s else s.split("/")[-1]
                p_name = p.split("#")[-1] if "#" in p else p.split("/")[-1]
                o_name = o.split("#")[-1] if "#" in o else o.split("/")[-1]
                
                print(f"  {s_name} -[{p_name}]-> {o_name}")
            print()
        else:
            print("❌ Aucun triplet trouvé\n")
        
        # 8. Compter par type RDF
        print("8️⃣ DÉTAIL PAR TYPE (rdf:type)")
        print("-" * 70)
        query = """
        SELECT ?type (COUNT(*) as ?count)
        WHERE {
            ?s a ?type
        }
        GROUP BY ?type
        """
        result = self.run_query(query)
        if result and result["results"]["bindings"]:
            for binding in result["results"]["bindings"]:
                type_uri = binding.get("type", {}).get("value", "?")
                count = int(binding.get("count", {}).get("value", 0))
                type_name = type_uri.split("#")[-1] if "#" in type_uri else type_uri.split("/")[-1]
                print(f"  {type_name}: {count}")
            print()
        
        print("="*70)
        print("FIN DU DIAGNOSTIC")
        print("="*70)


if __name__ == "__main__":
    diag = Diagnostic()
    diag.diagnose_all()
