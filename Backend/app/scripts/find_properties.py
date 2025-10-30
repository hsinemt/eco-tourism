# app/scripts/find_properties.py - Trouvez les vrais noms de propriétés

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from app.services.ecotourism_client import EcotourismClient

client = EcotourismClient()

print("\n" + "="*70)
print("🔍 DÉCOUVERTE DES PROPRIÉTÉS")
print("="*70 + "\n")

# 1. Trouver tous les prédicats utilisés pour les activités
print("1️⃣ PROPRIÉTÉS DES ACTIVITÉS")
print("-"*70)

query_activities = """
SELECT DISTINCT ?predicate
WHERE {
    ?activity a eco:EcoActivity ;
              ?predicate ?value .
}
ORDER BY ?predicate
"""

predicates = client.execute_query(query_activities)
print(f"Propriétés trouvées pour EcoActivity: {len(predicates)}\n")
for p in predicates:
    pred = p.get('predicate', {}).get('value', '')
    if pred:
        name = pred.split('#')[-1]
        print(f"  - {name} ({pred})")

print()

# 2. Trouver tous les prédicats pour les hébergements
print("2️⃣ PROPRIÉTÉS DES HÉBERGEMENTS")
print("-"*70)

query_accommodations = """
SELECT DISTINCT ?predicate
WHERE {
    ?accommodation a eco:EcoLodge ;
                   ?predicate ?value .
}
ORDER BY ?predicate
"""

predicates = client.execute_query(query_accommodations)
print(f"Propriétés trouvées pour EcoLodge: {len(predicates)}\n")
for p in predicates:
    pred = p.get('predicate', {}).get('value', '')
    if pred:
        name = pred.split('#')[-1]
        print(f"  - {name} ({pred})")

print()

# 3. Vérifier les valeurs réelles
print("3️⃣ EXEMPLES DE VALEURS")
print("-"*70)

query_example = """
SELECT ?activity ?name ?property ?value
WHERE {
    ?activity a eco:EcoActivity ;
              rdfs:label ?name ;
              ?property ?value .
}
LIMIT 5
"""

examples = client.execute_query(query_example)
print(f"Exemples trouvés: {len(examples)}\n")
for ex in examples[:3]:
    activity = ex.get('activity', {}).get('value', '').split('#')[-1]
    name = ex.get('name', {}).get('value', '')
    prop = ex.get('property', {}).get('value', '').split('#')[-1]
    value = ex.get('value', {}).get('value', '')
    print(f"  Activité: {activity}")
    print(f"  Nom: {name}")
    print(f"  Propriété: {prop} = {value}\n")

print("="*70)
