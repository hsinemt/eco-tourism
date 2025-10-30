from SPARQLWrapper import SPARQLWrapper, JSON
from app.config import settings
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class FeedbackManager:
    def __init__(self):
        self.select_endpoint = settings.SPARQL_ENDPOINT
        self.update_endpoint = settings.SPARQL_UPDATE_ENDPOINT

        self.sparql_select = SPARQLWrapper(self.select_endpoint)
        self.sparql_select.setReturnFormat(JSON)

        self.sparql_update = SPARQLWrapper(self.update_endpoint)
        self.sparql_update.setMethod('POST')

        self.prefixes = f"""
        PREFIX eco: <{settings.ONTOLOGY_NAMESPACE}>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        """

        self._id_counter = self._fetch_max_feedback_id() or 0

    def _fetch_max_feedback_id(self):
        query = """
        SELECT (MAX(xsd:integer(?id)) AS ?maxId)
        WHERE {
            ?feedback a eco:Feedback ;
                      eco:feedbackId ?id .
        }
        """
        results = self.execute_query(query)
        if results and 'maxId' in results[0]:
            try:
                return int(results[0]['maxId']['value'])
            except Exception:
                return 0
        return 0

    def _generate_new_id(self):
        self._id_counter += 1
        return self._id_counter

    def execute_query(self, query: str):
        full_query = self.prefixes + query
        self.sparql_select.setQuery(full_query)
        try:
            results = self.sparql_select.query().convert()
            return results["results"]["bindings"]
        except Exception as e:
            logger.error(f"Erreur SELECT: {e}")
            return []

    def update_data(self, query: str):
        full_query = self.prefixes + query
        self.sparql_update.setQuery(full_query)
        try:
            self.sparql_update.query()
            logger.info("Mise à jour réussie")
            return True
        except Exception as e:
            logger.error(f"Erreur UPDATE: {e}")
            return False

    def add_feedback(self, activity_uri: str, user_name: str, rating: int, comment: str):
        new_id = self._generate_new_id()
        feedback_uri = f"eco:Feedback_{new_id}"

        query = f"""
        INSERT DATA {{
            {feedback_uri} a eco:Feedback ;
                          rdfs:label "Feedback from {user_name}" ;
                          eco:feedbackId "{new_id}"^^xsd:integer ;
                          eco:rating "{rating}"^^xsd:integer ;
                          eco:comment "{comment}" ;
                          eco:writtenBy "{user_name}" ;
                          eco:concernsActivity <{activity_uri}> ;
                          eco:timestamp "{datetime.now().isoformat()}"^^xsd:string .
        }}
        """
        success = self.update_data(query)
        if success:
            return new_id
        return None

    def get_feedback_by_id(self, feedback_id: int):
        query = f"""
        SELECT ?rating ?comment ?author ?activity ?timestamp
        WHERE {{
            ?feedback a eco:Feedback ;
                      eco:feedbackId "{feedback_id}"^^xsd:integer ;
                      eco:rating ?rating ;
                      eco:comment ?comment ;
                      eco:concernsActivity ?activity .
            OPTIONAL {{ ?feedback eco:writtenBy ?author }}
            OPTIONAL {{ ?feedback eco:timestamp ?timestamp }}
        }}
        """
        results = self.execute_query(query)
        if results:
            return results[0]
        return None

    def get_all_feedbacks(self, limit=10, offset=0, filters=None, sort_by="date_desc"):
        """
        Récupère tous les feedbacks avec pagination et filtres.

        Args:
            limit: Nombre maximum de résultats
            offset: Position de départ
            filters: Dictionnaire de filtres (min_rating, max_rating, user_name)
            sort_by: Ordre de tri (date_desc, date_asc, rating_desc, rating_asc)

        Returns:
            Liste de dictionnaires contenant les feedbacks
        """
        # Build filter conditions
        filter_conditions = []

        if filters:
            if 'min_rating' in filters:
                filter_conditions.append(f"FILTER(?rating >= {filters['min_rating']})")

            if 'max_rating' in filters:
                filter_conditions.append(f"FILTER(?rating <= {filters['max_rating']})")

            if 'user_name' in filters:
                filter_conditions.append(f'FILTER(CONTAINS(LCASE(?author), LCASE("{filters["user_name"]}")))')

        filter_clause = "\n".join(filter_conditions) if filter_conditions else ""

        # Determine sort order
        sort_mapping = {
            "date_desc": "DESC(?timestamp)",
            "date_asc": "ASC(?timestamp)",
            "rating_desc": "DESC(?rating)",
            "rating_asc": "ASC(?rating)"
        }
        order_by = sort_mapping.get(sort_by, "DESC(?timestamp)")

        query = f"""
        SELECT ?feedbackId ?rating ?comment ?author ?activity ?timestamp
        WHERE {{
            ?feedback a eco:Feedback ;
                      eco:feedbackId ?feedbackId ;
                      eco:rating ?rating ;
                      eco:comment ?comment ;
                      eco:concernsActivity ?activity .
            OPTIONAL {{ ?feedback eco:writtenBy ?author }}
            OPTIONAL {{ ?feedback eco:timestamp ?timestamp }}
            {filter_clause}
        }}
        ORDER BY {order_by}
        LIMIT {limit}
        OFFSET {offset}
        """

        results = self.execute_query(query)

        feedbacks = []
        for result in results:
            feedback = {
                "id": int(result.get('feedbackId', {}).get('value', 0)),
                "activity_uri": result.get('activity', {}).get('value', ''),
                "user_name": result.get('author', {}).get('value', 'Anonymous'),
                "rating": int(result.get('rating', {}).get('value', 0)),
                "comment": result.get('comment', {}).get('value', ''),
                "timestamp": result.get('timestamp', {}).get('value', '')
            }
            feedbacks.append(feedback)

        return feedbacks

    def get_total_feedback_count(self, filters=None):
        """
        Compte le nombre total de feedbacks correspondant aux filtres.

        Args:
            filters: Dictionnaire de filtres (min_rating, max_rating, user_name)

        Returns:
            Nombre total de feedbacks
        """
        # Build filter conditions
        filter_conditions = []

        if filters:
            if 'min_rating' in filters:
                filter_conditions.append(f"FILTER(?rating >= {filters['min_rating']})")

            if 'max_rating' in filters:
                filter_conditions.append(f"FILTER(?rating <= {filters['max_rating']})")

            if 'user_name' in filters:
                filter_conditions.append(f'FILTER(CONTAINS(LCASE(?author), LCASE("{filters["user_name"]}")))')

        filter_clause = "\n".join(filter_conditions) if filter_conditions else ""

        query = f"""
        SELECT (COUNT(?feedback) AS ?count)
        WHERE {{
            ?feedback a eco:Feedback ;
                      eco:rating ?rating .
            OPTIONAL {{ ?feedback eco:writtenBy ?author }}
            {filter_clause}
        }}
        """

        results = self.execute_query(query)
        if results and 'count' in results[0]:
            try:
                return int(results[0]['count']['value'])
            except Exception:
                return 0
        return 0

    def get_feedback_for_activity(self, activity_uri: str):
        """
        Récupère tous les feedbacks pour une activité spécifique.

        Args:
            activity_uri: URI de l'activité

        Returns:
            Liste des feedbacks pour cette activité
        """
        query = f"""
        SELECT ?feedbackId ?rating ?comment ?author ?timestamp
        WHERE {{
            ?feedback a eco:Feedback ;
                      eco:feedbackId ?feedbackId ;
                      eco:rating ?rating ;
                      eco:comment ?comment ;
                      eco:concernsActivity <{activity_uri}> .
            OPTIONAL {{ ?feedback eco:writtenBy ?author }}
            OPTIONAL {{ ?feedback eco:timestamp ?timestamp }}
        }}
        ORDER BY DESC(?timestamp)
        """

        results = self.execute_query(query)

        feedbacks = []
        for result in results:
            feedback = {
                "id": int(result.get('feedbackId', {}).get('value', 0)),
                "user_name": result.get('author', {}).get('value', 'Anonymous'),
                "rating": int(result.get('rating', {}).get('value', 0)),
                "comment": result.get('comment', {}).get('value', ''),
                "timestamp": result.get('timestamp', {}).get('value', '')
            }
            feedbacks.append(feedback)

        return feedbacks

    def get_feedback_statistics(self, activity_uri: str):
        """
        Calcule les statistiques des feedbacks pour une activité.

        Args:
            activity_uri: URI de l'activité

        Returns:
            Dictionnaire avec les statistiques
        """
        query = f"""
        SELECT (COUNT(?feedback) AS ?total)
               (AVG(?rating) AS ?avgRating)
               (MIN(?rating) AS ?minRating)
               (MAX(?rating) AS ?maxRating)
        WHERE {{
            ?feedback a eco:Feedback ;
                      eco:rating ?rating ;
                      eco:concernsActivity <{activity_uri}> .
        }}
        """

        results = self.execute_query(query)

        if results and results[0]:
            result = results[0]
            return {
                "total_feedbacks": int(result.get('total', {}).get('value', 0)),
                "average_rating": round(float(result.get('avgRating', {}).get('value', 0)), 2),
                "min_rating": int(result.get('minRating', {}).get('value', 0)),
                "max_rating": int(result.get('maxRating', {}).get('value', 0))
            }

        return {
            "total_feedbacks": 0,
            "average_rating": 0.0,
            "min_rating": 0,
            "max_rating": 0
        }

    def update_feedback(self, feedback_id: int, updates: dict):
        query_find = f"""
        SELECT ?feedback WHERE {{
            ?feedback a eco:Feedback ;
                      eco:feedbackId "{feedback_id}"^^xsd:integer .
        }}
        """
        found = self.execute_query(query_find)
        if not found:
            return False
        feedback_uri = found[0]['feedback']['value']

        clauses_delete = []
        clauses_insert = []

        if 'rating' in updates:
            clauses_delete.append(f"<{feedback_uri}> eco:rating ?oldRating .")
            clauses_insert.append(f"<{feedback_uri}> eco:rating \"{updates['rating']}\"^^xsd:integer .")

        if 'comment' in updates:
            clauses_delete.append(f"<{feedback_uri}> eco:comment ?oldComment .")
            clauses_insert.append(f"<{feedback_uri}> eco:comment \"{updates['comment']}\" .")

        if not clauses_delete:
            return False

        delete_clause = " ".join(clauses_delete)
        insert_clause = " ".join(clauses_insert)

        query_update = f"""
        DELETE {{ {delete_clause} }}
        INSERT {{ {insert_clause} }}
        WHERE {{
            {delete_clause}
        }}
        """
        return self.update_data(query_update)

    def delete_feedback(self, feedback_id: int):
        query_find = f"""
        SELECT ?feedback WHERE {{
            ?feedback a eco:Feedback ;
                      eco:feedbackId "{feedback_id}"^^xsd:integer .
        }}
        """
        found = self.execute_query(query_find)
        if not found:
            return False
        feedback_uri = found[0]['feedback']['value']

        query_delete = f"""
        DELETE WHERE {{
            <{feedback_uri}> ?p ?o .
        }}
        """
        return self.update_data(query_delete)