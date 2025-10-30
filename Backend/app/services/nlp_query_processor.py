# app/services/nlp_query_processor.py - VERSION BILINGUE FR/EN

import re
import logging
from typing import Dict, List, Optional
from enum import Enum

logger = logging.getLogger(__name__)


class QueryType(Enum):
    ACTIVITIES = "activities"
    ACCOMMODATIONS = "accommodations"
    TRANSPORT = "transport"
    SEASONS = "seasons"
    SUSTAINABILITY = "sustainability"
    PRODUCTS = "products"
    RECOMMENDATION = "recommendation"
    SEARCH = "search"


class NLPQueryProcessor:
    """Convertit questions FR/EN en langage naturel → requêtes SPARQL avec entités anglaises"""

    def __init__(self):
        self.ontology_namespace = "http://www.ecotourism.org/ontology#"

        # ============= MAPPING BILINGUE FR/EN → VALEURS EN ANGLAIS =============

        # Difficulté : FR/EN → Easy/Moderate/Difficult
        self.difficulty_mapping = {
            # Français
            "facile": "Easy", "simple": "Easy", "débutant": "Easy",
            "moyen": "Moderate", "moyenne": "Moderate", "modéré": "Moderate",
            "modérée": "Moderate", "intermédiaire": "Moderate",
            "difficile": "Difficult", "dur": "Difficult", "expert": "Difficult",
            "avancé": "Difficult",
            # Anglais
            "easy": "Easy", "beginner": "Easy",
            "moderate": "Moderate", "medium": "Moderate", "intermediate": "Moderate",
            "difficult": "Difficult", "hard": "Difficult", "advanced": "Difficult"
        }

        # Saisons : FR/EN → Spring/Summer/Autumn/Winter
        self.season_mapping = {
            "printemps": "Spring", "été": "Summer", "automne": "Autumn", "hiver": "Winter",
            "spring": "Spring", "summer": "Summer", "autumn": "Autumn",
            "fall": "Autumn", "winter": "Winter"
        }

        # Types d'activités : FR/EN → AdventureActivity/CulturalActivity/NatureActivity
        self.activity_type_mapping = {
            "aventure": "AdventureActivity", "aventureuse": "AdventureActivity",
            "sport": "AdventureActivity", "sportif": "AdventureActivity",
            "culturel": "CulturalActivity", "culturelle": "CulturalActivity",
            "culture": "CulturalActivity", "historique": "CulturalActivity",
            "musée": "CulturalActivity", "visite": "CulturalActivity",
            "nature": "NatureActivity", "naturelle": "NatureActivity",
            "écologique": "NatureActivity", "faune": "NatureActivity",
            "flore": "NatureActivity", "observation": "NatureActivity",
            "adventure": "AdventureActivity", "cultural": "CulturalActivity",
            "historic": "CulturalActivity", "museum": "CulturalActivity",
            "wildlife": "NatureActivity", "fauna": "NatureActivity"
        }

        # Types d'hébergements : FR/EN → EcoLodge/GuestHouse/Hotel
        self.accommodation_type_mapping = {
            "eco-lodge": "EcoLodge", "ecolodge": "EcoLodge",
            "gîte": "GuestHouse", "gite": "GuestHouse",
            "maison d'hôtes": "GuestHouse", "chambre d'hôtes": "GuestHouse",
            "auberge": "GuestHouse", "hôtel": "Hotel", "hotel": "Hotel",
            "guest house": "GuestHouse", "guesthouse": "GuestHouse",
            "bed and breakfast": "GuestHouse", "b&b": "GuestHouse"
        }

        # Types de transport : FR/EN → Bike/ElectricVehicle/PublicTransport
        self.transport_type_mapping = {
            "vélo": "Bike", "velo": "Bike", "bicyclette": "Bike",
            "voiture électrique": "ElectricVehicle", "véhicule électrique": "ElectricVehicle",
            "ev": "ElectricVehicle", "transport public": "PublicTransport",
            "transport en commun": "PublicTransport", "bus": "PublicTransport",
            "métro": "PublicTransport", "metro": "PublicTransport",
            "train": "PublicTransport", "tram": "PublicTransport",
            "bike": "Bike", "bicycle": "Bike",
            "electric vehicle": "ElectricVehicle", "electric car": "ElectricVehicle",
            "public transport": "PublicTransport", "public transportation": "PublicTransport"
        }

        # ============= PATTERNS DE DÉTECTION BILINGUES =============

        self.entity_patterns = {
            "activity_keywords": [
                "activité", "activités", "faire", "randonnée", "plongée",
                "observation", "tour", "visite", "excursion", "balade",
                "activity", "activities", "hiking", "diving", "what to do"
            ],
            "accommodation_keywords": [
                "hébergement", "hébergements", "hôtel", "lodge", "gîte",
                "auberge", "dormir", "nuit", "où dormir", "séjour",
                "accommodation", "accommodations", "hotel", "stay", "sleep"
            ],
            "transport_keywords": [
                "transport", "vélo", "voiture", "bus", "déplacement",
                "aller", "se déplacer", "circulation",
                "transportation", "bike", "car", "vehicle", "travel", "go"
            ],
            "eco_keywords": [
                "écologique", "éco", "vert", "verte", "durable",
                "bio", "biologique", "renouvelable", "certifié",
                "ecological", "eco", "green", "sustainable", "organic", "renewable"
            ],
            "price_keywords": [
                "prix", "coût", "tarif", "budget", "cher", "pas cher",
                "abordable", "économique", "€", "euro",
                "price", "cost", "rate", "expensive", "cheap", "affordable"
            ],
            "rating_keywords": [
                "note", "évaluation", "avis", "meilleur", "meilleure",
                "top", "qualité", "recommandé",
                "rating", "review", "best", "quality", "recommended"
            ],
            "capacity_keywords": [
                "personne", "personnes", "gens", "participant",
                "participants", "capacité", "place", "places",
                "person", "people", "guest", "guests", "participant", "capacity"
            ],
            "amenity_keywords": {
                "piscine": "hasSwimmingPool", "spa": "hasSpa",
                "restaurant": "hasRestaurant", "wifi": "wifiAvailable",
                "parking": "parkingAvailable",
                "swimming pool": "hasSwimmingPool", "pool": "hasSwimmingPool"
            }
        }

        self.filters = {}
        self.query_type = None
        self.detected_entities = []

    def process_question(self, question: str) -> Dict:
        """Traite une question FR/EN et retourne la requête SPARQL"""
        question_lower = question.lower()
        self.filters = {}
        self.detected_entities = []

        self.query_type = self._detect_query_type(question_lower)
        self._extract_entities(question_lower)
        self._extract_filters(question_lower)

        sparql_query = self._generate_sparql()
        confidence = self._calculate_confidence(sparql_query)

        return {
            "query_type": self.query_type.value if self.query_type else "unknown",
            "sparql_query": sparql_query,
            "entities": self.detected_entities,
            "filters": self.filters,
            "confidence": confidence,
            "original_question": question
        }

    def _detect_query_type(self, question: str) -> QueryType:
        """Détecte le type de requête (bilingue)"""
        if any(kw in question for kw in self.entity_patterns["activity_keywords"]):
            return QueryType.ACTIVITIES

        if any(kw in question for kw in self.entity_patterns["accommodation_keywords"]):
            return QueryType.ACCOMMODATIONS

        if any(kw in question for kw in self.entity_patterns["transport_keywords"]):
            return QueryType.TRANSPORT

        if any(kw in question for kw in ["saison", "season", "quand", "when", "période", "weather"]):
            return QueryType.SEASONS

        if any(kw in question for kw in ["durable", "sustainable", "carbone", "carbon", "indicateur"]):
            return QueryType.SUSTAINABILITY

        if any(kw in question for kw in ["produit", "product", "local", "artisan", "handmade"]):
            return QueryType.PRODUCTS

        if any(kw in question for kw in ["recommand", "suggest", "conseill", "meilleur", "best"]):
            return QueryType.RECOMMENDATION

        return QueryType.SEARCH

    def _extract_entities(self, question: str):
        """Extrait les entités avec mapping vers l'anglais"""

        for fr_en, english_type in self.activity_type_mapping.items():
            if fr_en in question:
                self.detected_entities.append({
                    "type": "activity_type",
                    "value": english_type,
                    "original": fr_en
                })
                break

        for fr_en, english_type in self.accommodation_type_mapping.items():
            if fr_en in question:
                self.detected_entities.append({
                    "type": "accommodation_type",
                    "value": english_type,
                    "original": fr_en
                })
                break

        for fr_en, english_type in self.transport_type_mapping.items():
            if fr_en in question:
                self.detected_entities.append({
                    "type": "transport_type",
                    "value": english_type,
                    "original": fr_en
                })
                break

    def _extract_filters(self, question: str):
        """Extrait les filtres avec mapping vers l'anglais"""

        # Difficulté
        for fr_en, english_level in self.difficulty_mapping.items():
            if fr_en in question:
                self.filters["difficulty"] = english_level
                break

        # Saison
        for fr_en, english_season in self.season_mapping.items():
            if fr_en in question:
                self.filters["season"] = english_season
                break

        # Prix
        price_patterns = [
            r'(\d+)\s*€',
            r'(\d+)\s*euro',
            r'moins de (\d+)',
            r'under (\d+)',
            r'below (\d+)',
            r'max (\d+)'
        ]

        for pattern in price_patterns:
            match = re.search(pattern, question)
            if match:
                self.filters["max_price"] = int(match.group(1))
                break

        # Écologique
        if any(kw in question for kw in self.entity_patterns["eco_keywords"]):
            self.filters["eco_friendly"] = True

        # Note/Rating
        if any(kw in question for kw in self.entity_patterns["rating_keywords"]):
            self.filters["high_rating"] = True

        # Capacité
        capacity_patterns = [
            r'(\d+)\s*(?:personne|person|people|guest|participant)',
            r'pour\s*(\d+)',
            r'for\s*(\d+)'
        ]

        for pattern in capacity_patterns:
            match = re.search(pattern, question)
            if match:
                self.filters["min_capacity"] = int(match.group(1))
                break

        # Équipements
        for amenity_keyword, property_name in self.entity_patterns["amenity_keywords"].items():
            if amenity_keyword in question:
                self.filters[property_name] = True

    def _generate_sparql(self) -> str:
        """Génère la requête SPARQL selon le type"""
        if self.query_type == QueryType.ACTIVITIES:
            return self._generate_activities_query()
        elif self.query_type == QueryType.ACCOMMODATIONS:
            return self._generate_accommodations_query()
        elif self.query_type == QueryType.TRANSPORT:
            return self._generate_transport_query()
        elif self.query_type == QueryType.SEASONS:
            return self._generate_seasons_query()
        elif self.query_type == QueryType.SUSTAINABILITY:
            return self._generate_sustainability_query()
        elif self.query_type == QueryType.PRODUCTS:
            return self._generate_products_query()

        return ""

    def _generate_activities_query(self) -> str:
        """Requête activités avec filtres en anglais"""
        filters = []

        if "difficulty" in self.filters:
            filters.append(f'CONTAINS(LCASE(?difficultyLevel), LCASE("{self.filters["difficulty"]}"))')

        if "season" in self.filters:
            filters.append(f'CONTAINS(LCASE(?bestTimeToVisit), LCASE("{self.filters["season"]}"))')

        if "max_price" in self.filters:
            filters.append(f'?pricePerPerson <= {self.filters["max_price"]}')

        if "high_rating" in self.filters:
            filters.append('?activityRating >= 4.0')

        if "min_capacity" in self.filters:
            filters.append(f'?maxParticipants >= {self.filters["min_capacity"]}')

        filter_clause = f"FILTER({' && '.join(filters)})" if filters else ""

        activity_type = next((e["value"] for e in self.detected_entities if e["type"] == "activity_type"), None)

        if activity_type:
            type_clause = f"?activity a eco:{activity_type} ."
        else:
            type_clause = """{
        ?activity a eco:AdventureActivity .
    } UNION {
        ?activity a eco:CulturalActivity .
    } UNION {
        ?activity a eco:NatureActivity .
    }"""

        return f"""PREFIX eco: <{self.ontology_namespace}>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT DISTINCT ?activity ?activityName ?activityDescription 
                ?difficultyLevel ?pricePerPerson ?durationHours 
                ?activityRating ?bestTimeToVisit ?maxParticipants ?minAge
WHERE {{
    {type_clause}

    ?activity eco:activityName ?activityName .

    OPTIONAL {{ ?activity eco:activityDescription ?activityDescription }}
    OPTIONAL {{ ?activity eco:difficultyLevel ?difficultyLevel }}
    OPTIONAL {{ ?activity eco:pricePerPerson ?pricePerPerson }}
    OPTIONAL {{ ?activity eco:durationHours ?durationHours }}
    OPTIONAL {{ ?activity eco:activityRating ?activityRating }}
    OPTIONAL {{ ?activity eco:bestTimeToVisit ?bestTimeToVisit }}
    OPTIONAL {{ ?activity eco:maxParticipants ?maxParticipants }}
    OPTIONAL {{ ?activity eco:minAge ?minAge }}

    {filter_clause}
}}
ORDER BY DESC(?activityRating)
LIMIT 20
"""

    def _generate_accommodations_query(self) -> str:
        """Requête hébergements avec filtres en anglais"""
        filters = []

        if "eco_friendly" in self.filters or self.filters.get("ecoCertified"):
            filters.append('?ecoCertified = "true"^^<http://www.w3.org/2001/XMLSchema#boolean>')

        if "max_price" in self.filters:
            filters.append(f'?pricePerNight <= {self.filters["max_price"]}')

        if "high_rating" in self.filters:
            filters.append('?accommodationRating >= 4.0')

        if "min_capacity" in self.filters:
            filters.append(f'?maxGuests >= {self.filters["min_capacity"]}')

        if self.filters.get("hasSwimmingPool"):
            filters.append('?hasSwimmingPool = "true"^^<http://www.w3.org/2001/XMLSchema#boolean>')

        if self.filters.get("hasSpa"):
            filters.append('?hasSpa = "true"^^<http://www.w3.org/2001/XMLSchema#boolean>')

        if self.filters.get("hasRestaurant"):
            filters.append('?hasRestaurant = "true"^^<http://www.w3.org/2001/XMLSchema#boolean>')

        filter_clause = f"FILTER({' && '.join(filters)})" if filters else ""

        accommodation_type = next((e["value"] for e in self.detected_entities if e["type"] == "accommodation_type"),
                                  None)

        if accommodation_type:
            type_clause = f"?accommodation a eco:{accommodation_type} ."
        else:
            type_clause = """{
        ?accommodation a eco:EcoLodge .
    } UNION {
        ?accommodation a eco:GuestHouse .
    } UNION {
        ?accommodation a eco:Hotel .
    }"""

        return f"""PREFIX eco: <{self.ontology_namespace}>

SELECT DISTINCT ?accommodation ?accommodationName ?accommodationDescription
                ?pricePerNight ?accommodationRating ?ecoCertified 
                ?numberOfRooms ?maxGuests ?wifiAvailable ?parkingAvailable
                ?hasSwimmingPool ?hasSpa ?hasRestaurant
WHERE {{
    {type_clause}

    ?accommodation eco:accommodationName ?accommodationName .

    OPTIONAL {{ ?accommodation eco:accommodationDescription ?accommodationDescription }}
    OPTIONAL {{ ?accommodation eco:pricePerNight ?pricePerNight }}
    OPTIONAL {{ ?accommodation eco:accommodationRating ?accommodationRating }}
    OPTIONAL {{ ?accommodation eco:ecoCertified ?ecoCertified }}
    OPTIONAL {{ ?accommodation eco:numberOfRooms ?numberOfRooms }}
    OPTIONAL {{ ?accommodation eco:maxGuests ?maxGuests }}
    OPTIONAL {{ ?accommodation eco:wifiAvailable ?wifiAvailable }}
    OPTIONAL {{ ?accommodation eco:parkingAvailable ?parkingAvailable }}
    OPTIONAL {{ ?accommodation eco:hasSwimmingPool ?hasSwimmingPool }}
    OPTIONAL {{ ?accommodation eco:hasSpa ?hasSpa }}
    OPTIONAL {{ ?accommodation eco:hasRestaurant ?hasRestaurant }}

    {filter_clause}
}}
ORDER BY ?pricePerNight
LIMIT 20
"""

    def _generate_transport_query(self) -> str:
        """Requête transports"""
        filters = []

        if "eco_friendly" in self.filters:
            filters.append('?carbonEmissionPerKm = 0.0')

        if "max_price" in self.filters:
            filters.append(f'?pricePerKm <= {self.filters["max_price"]}')

        filter_clause = f"FILTER({' && '.join(filters)})" if filters else ""

        transport_type = next((e["value"] for e in self.detected_entities if e["type"] == "transport_type"), None)

        if transport_type:
            type_clause = f"?transport a eco:{transport_type} ."
        else:
            type_clause = """{
        ?transport a eco:Bike .
    } UNION {
        ?transport a eco:ElectricVehicle .
    } UNION {
        ?transport a eco:PublicTransport .
    }"""

        return f"""PREFIX eco: <{self.ontology_namespace}>

SELECT DISTINCT ?transport ?transportName ?transportType 
                ?pricePerKm ?carbonEmissionPerKm ?capacity 
                ?availability ?averageSpeed
WHERE {{
    {type_clause}

    ?transport eco:transportName ?transportName .

    OPTIONAL {{ ?transport eco:transportType ?transportType }}
    OPTIONAL {{ ?transport eco:pricePerKm ?pricePerKm }}
    OPTIONAL {{ ?transport eco:carbonEmissionPerKm ?carbonEmissionPerKm }}
    OPTIONAL {{ ?transport eco:capacity ?capacity }}
    OPTIONAL {{ ?transport eco:availability ?availability }}
    OPTIONAL {{ ?transport eco:averageSpeed ?averageSpeed }}

    {filter_clause}
}}
ORDER BY ?carbonEmissionPerKm
LIMIT 20
"""

    def _generate_seasons_query(self) -> str:
        filters = []
        if "season" in self.filters:
            filters.append(f'?seasonName = "{self.filters["season"]}"')

        filter_clause = f"FILTER({' && '.join(filters)})" if filters else ""

        return f"""PREFIX eco: <{self.ontology_namespace}>

SELECT ?season ?seasonName ?startDate ?endDate 
       ?averageTemperature ?peakTourismSeason
WHERE {{
    ?season a eco:Season ;
            eco:seasonName ?seasonName .

    OPTIONAL {{ ?season eco:startDate ?startDate }}
    OPTIONAL {{ ?season eco:endDate ?endDate }}
    OPTIONAL {{ ?season eco:averageTemperature ?averageTemperature }}
    OPTIONAL {{ ?season eco:peakTourismSeason ?peakTourismSeason }}

    {filter_clause}
}}
ORDER BY ?seasonName
"""

    def _generate_sustainability_query(self) -> str:
        return f"""PREFIX eco: <{self.ontology_namespace}>

SELECT DISTINCT ?indicator ?indicatorName ?indicatorValue 
                ?measurementUnit ?measurementDate ?targetValue
WHERE {{
    {{
        ?indicator a eco:CarbonFootprint .
    }} UNION {{
        ?indicator a eco:RenewableEnergyUsage .
    }} UNION {{
        ?indicator a eco:WaterConsumption .
    }}

    ?indicator eco:indicatorName ?indicatorName ;
               eco:indicatorValue ?indicatorValue ;
               eco:measurementUnit ?measurementUnit .

    OPTIONAL {{ ?indicator eco:measurementDate ?measurementDate }}
    OPTIONAL {{ ?indicator eco:targetValue ?targetValue }}
}}
ORDER BY ?indicatorName
LIMIT 20
"""

    def _generate_products_query(self) -> str:
        filters = []

        if "eco_friendly" in self.filters:
            filters.append('?isOrganic = "true"^^<http://www.w3.org/2001/XMLSchema#boolean>')

        if "max_price" in self.filters:
            filters.append(f'?productPrice <= {self.filters["max_price"]}')

        filter_clause = f"FILTER({' && '.join(filters)})" if filters else ""

        return f"""PREFIX eco: <{self.ontology_namespace}>

SELECT DISTINCT ?product ?productName ?productDescription 
                ?productPrice ?productCategory ?isOrganic 
                ?isHandmade ?producerName ?fairTradeCertified
WHERE {{
    ?product a eco:LocalProduct ;
             eco:productName ?productName ;
             eco:productPrice ?productPrice .

    OPTIONAL {{ ?product eco:productDescription ?productDescription }}
    OPTIONAL {{ ?product eco:productCategory ?productCategory }}
    OPTIONAL {{ ?product eco:isOrganic ?isOrganic }}
    OPTIONAL {{ ?product eco:isHandmade ?isHandmade }}
    OPTIONAL {{ ?product eco:producerName ?producerName }}
    OPTIONAL {{ ?product eco:fairTradeCertified ?fairTradeCertified }}

    {filter_clause}
}}
ORDER BY ?productPrice
LIMIT 20
"""

    def _calculate_confidence(self, sparql_query: str) -> float:
        confidence = 0.5
        if sparql_query and "SELECT" in sparql_query:
            confidence += 0.2
        if self.detected_entities:
            confidence += 0.15
        if self.filters:
            confidence += 0.15
        return min(1.0, confidence)


# Alias pour compatibilité
class AdvancedNLPProcessor(NLPQueryProcessor):
    pass
