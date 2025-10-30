import requests
from app.config import settings

def execute_select_query(query: str):
    """
    Exécute une requête SPARQL SELECT sur Apache Fuseki.
    Retourne une réponse JSON formatée.
    """
    headers = {"Accept": "application/sparql-results+json"}
    try:
        response = requests.post(
            settings.SPARQL_ENDPOINT,
            data={"query": query},
            headers=headers,
            timeout=10
        )
        if response.status_code != 200:
            raise ValueError(f"Erreur SPARQL ({response.status_code}): {response.text}")
        return response.json()
    except Exception as e:
        raise RuntimeError(f"Erreur lors de la requête SPARQL : {e}")

def execute_update_query(query: str):
    """
    Exécute une requête SPARQL UPDATE (INSERT/DELETE) sur Apache Fuseki.
    """
    headers = {"Content-Type": "application/sparql-update"}
    try:
        response = requests.post(
            settings.SPARQL_UPDATE_ENDPOINT,    # souvent SPARQL_UPDATE_ENDPOINT ≠ SPARQL_ENDPOINT, adapte si nécessaire
            data=query.encode("utf-8"),
            headers=headers,
            timeout=10
        )
        if response.status_code not in (200, 204):
            raise ValueError(f"Erreur SPARQL UPDATE ({response.status_code}): {response.text}")
        return {"success": True}
    except Exception as e:
        raise RuntimeError(f"Erreur lors de la requête SPARQL UPDATE : {e}")

# helpers utilisables dans tes endpoints
def sparql_select(query: str):
    return execute_select_query(query)

def sparql_insert(query: str):
    # Requête INSERT DATA
    return execute_update_query(query)

def sparql_delete(query: str):
    # Requête DELETE DATA/DELETE WHERE
    return execute_update_query(query)

def sparql_update(query: str):
    # Requête DELETE/INSERT WHERE (UPDATE)
    return execute_update_query(query)
