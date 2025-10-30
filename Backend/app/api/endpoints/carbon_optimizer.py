# app/api/endpoints/carbon_optimizer.py - VERSION CORRIGÉE

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from app.services.sparql_helpers import execute_select_query
import math
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# ==================== MODÈLES ====================

class TripRequest(BaseModel):
    tourist_id: str = Field(..., example="TOURIST-001")
    accommodation_id: str = Field(..., example="ACC-001")
    activity_ids: List[str] = Field(..., example=["ACT-001", "ACT-002", "ACT-003"])
    start_date: str = Field(..., example="2025-11-01")
    end_date: str = Field(..., example="2025-11-03")
    optimization_mode: str = Field("balanced", example="balanced")  # "shortest", "greenest", "balanced"

class TransportSegment(BaseModel):
    from_location: str
    to_location: str
    transport_type: str
    transport_name: str
    distance_km: float
    duration_minutes: int
    co2_emissions_kg: float
    cost_euros: float
    eco_score: int  # 0-100

class OptimizedTrip(BaseModel):
    trip_summary: Dict[str, Any]
    daily_itinerary: List[Dict[str, Any]]
    transport_segments: List[TransportSegment]
    carbon_footprint: Dict[str, Any]
    compensation_suggestions: List[Dict[str, Any]]
    total_cost: float
    eco_score: int

# ==================== CONSTANTES ====================

# Facteurs d'émission CO₂ (kg CO₂ par km)
EMISSION_FACTORS = {
    "Bike": 0.0,
    "ElectricVehicle": 0.05,
    "PublicTransport": 0.08,
    "Car": 0.12,
    "Taxi": 0.15
}

# Vitesses moyennes (km/h)
AVERAGE_SPEEDS = {
    "Bike": 15,
    "ElectricVehicle": 50,
    "PublicTransport": 40,
    "Car": 60,
    "Taxi": 50
}

# ==================== SERVICES ====================

class CarbonOptimizer:
    """Service d'optimisation de voyage avec calcul carbone"""
    
    def __init__(self):
        self.ontology_ns = "http://www.ecotourism.org/ontology#"
    
    def calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calcule la distance entre deux coordonnées GPS (formule Haversine)"""
        R = 6371  # Rayon de la Terre en km
        
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        
        a = (math.sin(dlat / 2) ** 2 + 
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
             math.sin(dlon / 2) ** 2)
        
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        return R * c
    
    def get_location_coords(self, location_uri: str) -> Optional[Dict]:
        """Récupère les coordonnées d'un lieu"""
        query = f"""
        PREFIX eco: <{self.ontology_ns}>
        
        SELECT ?lat ?lon
        WHERE {{
            <{location_uri}> eco:latitude ?lat ;
                            eco:longitude ?lon .
        }}
        """
        
        try:
            result = execute_select_query(query)
            bindings = result.get("results", {}).get("bindings", [])
            
            if bindings:
                return {
                    "latitude": float(bindings[0]["lat"]["value"]),
                    "longitude": float(bindings[0]["lon"]["value"])
                }
        except Exception as e:
            logger.error(f"Erreur récupération coordonnées: {e}")
        
        return None
    
    def get_available_transports(self) -> List[Dict[str, Any]]:
        """Récupère tous les transports disponibles"""
        query = f"""
        PREFIX eco: <{self.ontology_ns}>
        
        SELECT DISTINCT ?transport ?transportName ?transportType 
                        ?pricePerKm ?carbonEmissionPerKm
        WHERE {{
            {{
                ?transport a eco:Bike .
                BIND("Bike" AS ?transportType)
            }} UNION {{
                ?transport a eco:ElectricVehicle .
                BIND("ElectricVehicle" AS ?transportType)
            }} UNION {{
                ?transport a eco:PublicTransport .
                BIND("PublicTransport" AS ?transportType)
            }}
            
            ?transport eco:transportName ?transportName .
            
            OPTIONAL {{ ?transport eco:pricePerKm ?pricePerKm }}
            OPTIONAL {{ ?transport eco:carbonEmissionPerKm ?carbonEmissionPerKm }}
        }}
        """
        
        try:
            result = execute_select_query(query)
            bindings = result.get("results", {}).get("bindings", [])
            
            transports = []
            for binding in bindings:
                transport_data = {
                    "transport_uri": binding.get("transport", {}).get("value", ""),
                    "transportName": binding.get("transportName", {}).get("value", "Unknown"),
                    "transportType": binding.get("transportType", {}).get("value", "Unknown"),
                    "pricePerKm": float(binding.get("pricePerKm", {}).get("value", 0.5)),
                    "carbonEmissionPerKm": float(binding.get("carbonEmissionPerKm", {}).get("value", 
                                                  EMISSION_FACTORS.get(binding.get("transportType", {}).get("value", ""), 0.1)))
                }
                transports.append(transport_data)
            
            logger.info(f"✅ {len(transports)} transports récupérés")
            return transports
            
        except Exception as e:
            logger.error(f"Erreur récupération transports: {e}")
            return []
    
    def calculate_transport_options(
        self, 
        from_coords: Dict, 
        to_coords: Dict, 
        transports: List[Dict[str, Any]],
        from_name: str = "Point A",
        to_name: str = "Point B"
    ) -> List[TransportSegment]:
        """Calcule les options de transport entre deux points"""
        
        distance_km = self.calculate_distance(
            from_coords["latitude"], from_coords["longitude"],
            to_coords["latitude"], to_coords["longitude"]
        )
        
        options = []
        
        for transport in transports:
            transport_type = transport.get("transportType", "Unknown")
            transport_name = transport.get("transportName", "Unknown")
            
            # Utiliser les valeurs depuis la base ou les valeurs par défaut
            emission_factor = transport.get("carbonEmissionPerKm", 
                                           EMISSION_FACTORS.get(transport_type, 0.1))
            
            price_per_km = transport.get("pricePerKm", 0.5)
            
            # Calculs
            co2_kg = distance_km * emission_factor
            cost = distance_km * price_per_km
            speed = AVERAGE_SPEEDS.get(transport_type, 40)
            duration_minutes = int((distance_km / speed) * 60)
            
            # Score écologique (0-100, 100 = meilleur)
            eco_score = max(0, int(100 - (emission_factor * 100)))
            
            options.append(TransportSegment(
                from_location=from_name,
                to_location=to_name,
                transport_type=transport_type,
                transport_name=transport_name,
                distance_km=round(distance_km, 2),
                duration_minutes=duration_minutes,
                co2_emissions_kg=round(co2_kg, 3),
                cost_euros=round(cost, 2),
                eco_score=eco_score
            ))
        
        return options
    
    def select_best_transport(
        self, 
        options: List[TransportSegment], 
        mode: str
    ) -> TransportSegment:
        """Sélectionne le meilleur transport selon le mode d'optimisation"""
        
        if not options:
            raise HTTPException(status_code=404, detail="Aucune option de transport disponible")
        
        if mode == "greenest":
            # Priorité aux émissions les plus faibles
            return min(options, key=lambda x: x.co2_emissions_kg)
        
        elif mode == "shortest":
            # Priorité au temps le plus court
            return min(options, key=lambda x: x.duration_minutes)
        
        else:  # balanced
            # Score combiné : 40% carbone, 30% temps, 30% coût
            def balanced_score(opt):
                # Normaliser entre 0 et 1
                max_co2 = max(o.co2_emissions_kg for o in options) or 1
                max_time = max(o.duration_minutes for o in options) or 1
                max_cost = max(o.cost_euros for o in options) or 1
                
                co2_norm = opt.co2_emissions_kg / max_co2
                time_norm = opt.duration_minutes / max_time
                cost_norm = opt.cost_euros / max_cost
                
                return 0.4 * co2_norm + 0.3 * time_norm + 0.3 * cost_norm
            
            return min(options, key=balanced_score)
    
    def get_compensation_products(self, co2_kg: float) -> List[Dict[str, Any]]:
        """Suggère des produits locaux pour compenser le carbone"""
        query = f"""
        PREFIX eco: <{self.ontology_ns}>
        
        SELECT ?product ?productName ?productPrice 
               ?isOrganic ?isHandmade ?producerName
        WHERE {{
            ?product a eco:LocalProduct ;
                     eco:productName ?productName ;
                     eco:productPrice ?productPrice .
            
            OPTIONAL {{ ?product eco:isOrganic ?isOrganic }}
            OPTIONAL {{ ?product eco:isHandmade ?isHandmade }}
            OPTIONAL {{ ?product eco:producerName ?producerName }}
            
            FILTER(?isOrganic = "true"^^<http://www.w3.org/2001/XMLSchema#boolean> ||
                   ?isHandmade = "true"^^<http://www.w3.org/2001/XMLSchema#boolean>)
        }}
        ORDER BY ?productPrice
        LIMIT 5
        """
        
        try:
            result = execute_select_query(query)
            bindings = result.get("results", {}).get("bindings", [])
            
            suggestions = []
            for product in bindings:
                # Estimer la compensation carbone (1 produit local = ~2kg CO₂ compensé)
                compensation_kg = 2.0
                
                suggestions.append({
                    "product_name": product.get("productName", {}).get("value", "Produit local"),
                    "price": float(product.get("productPrice", {}).get("value", 10.0)),
                    "producer": product.get("producerName", {}).get("value", "Producteur local"),
                    "carbon_offset_kg": compensation_kg,
                    "description": f"Acheter ce produit local aide à compenser {compensation_kg} kg de CO₂"
                })
            
            return suggestions
            
        except Exception as e:
            logger.error(f"Erreur récupération produits: {e}")
            # Retourner des suggestions par défaut
            return [
                {
                    "product_name": "Panier de produits bio locaux",
                    "price": 25.0,
                    "producer": "Coopérative locale",
                    "carbon_offset_kg": 3.0,
                    "description": "Acheter ce produit local aide à compenser 3.0 kg de CO₂"
                },
                {
                    "product_name": "Artisanat traditionnel",
                    "price": 15.0,
                    "producer": "Artisan local",
                    "carbon_offset_kg": 2.0,
                    "description": "Acheter ce produit local aide à compenser 2.0 kg de CO₂"
                }
            ]

# ==================== ENDPOINTS ====================

@router.post("/optimize-trip", summary="🌍 Optimiser un voyage écologique complet")
async def optimize_carbon_neutral_trip(request: TripRequest) -> OptimizedTrip:
    """
    Planifie un voyage optimisé avec calcul d'empreinte carbone et suggestions de compensation.
    
    **Modes d'optimisation:**
    - `greenest`: Minimise les émissions CO₂ (priorité vélo et transport public)
    - `shortest`: Minimise le temps de trajet
    - `balanced`: Équilibre entre temps, coût et empreinte carbone
    
    **Retourne:**
    - Itinéraire jour par jour
    - Calcul détaillé de l'empreinte carbone
    - Suggestions de transport écologique
    - Produits locaux pour compenser les émissions
    """
    
    optimizer = CarbonOptimizer()
    
    try:
        # 1. Récupérer les transports disponibles
        transports = optimizer.get_available_transports()
        
        if not transports:
            # Utiliser des transports par défaut si la base est vide
            logger.warning("Aucun transport en base, utilisation de données par défaut")
            transports = [
                {
                    "transportName": "Vélo Électrique",
                    "transportType": "Bike",
                    "pricePerKm": 0.2,
                    "carbonEmissionPerKm": 0.0
                },
                {
                    "transportName": "Bus Électrique",
                    "transportType": "PublicTransport",
                    "pricePerKm": 0.3,
                    "carbonEmissionPerKm": 0.08
                },
                {
                    "transportName": "Voiture Électrique",
                    "transportType": "ElectricVehicle",
                    "pricePerKm": 0.4,
                    "carbonEmissionPerKm": 0.05
                }
            ]
        
        # 2. Simuler des coordonnées (à remplacer par vraies données depuis l'ontologie)
        accommodation_coords = {"latitude": 36.8065, "longitude": 10.1815}  # Tunis
        activity_coords = [
            {"latitude": 36.8189, "longitude": 10.1658, "name": "Médina de Tunis"},
            {"latitude": 36.8500, "longitude": 10.2000, "name": "Parc du Belvédère"},
            {"latitude": 36.7900, "longitude": 10.1500, "name": "Site de Carthage"},
        ]
        
        # 3. Calculer les segments de transport
        all_segments = []
        total_co2 = 0
        total_cost = 0
        
        # Hébergement → Activité 1
        options = optimizer.calculate_transport_options(
            accommodation_coords,
            activity_coords[0],
            transports,
            from_name="Hébergement",
            to_name=activity_coords[0]["name"]
        )
        best = optimizer.select_best_transport(options, request.optimization_mode)
        all_segments.append(best)
        total_co2 += best.co2_emissions_kg
        total_cost += best.cost_euros
        
        # Activité 1 → Activité 2
        options = optimizer.calculate_transport_options(
            activity_coords[0],
            activity_coords[1],
            transports,
            from_name=activity_coords[0]["name"],
            to_name=activity_coords[1]["name"]
        )
        best = optimizer.select_best_transport(options, request.optimization_mode)
        all_segments.append(best)
        total_co2 += best.co2_emissions_kg
        total_cost += best.cost_euros
        
        # Activité 2 → Activité 3
        options = optimizer.calculate_transport_options(
            activity_coords[1],
            activity_coords[2],
            transports,
            from_name=activity_coords[1]["name"],
            to_name=activity_coords[2]["name"]
        )
        best = optimizer.select_best_transport(options, request.optimization_mode)
        all_segments.append(best)
        total_co2 += best.co2_emissions_kg
        total_cost += best.cost_euros
        
        # Activité 3 → Retour hébergement
        options = optimizer.calculate_transport_options(
            activity_coords[2],
            accommodation_coords,
            transports,
            from_name=activity_coords[2]["name"],
            to_name="Hébergement"
        )
        best = optimizer.select_best_transport(options, request.optimization_mode)
        all_segments.append(best)
        total_co2 += best.co2_emissions_kg
        total_cost += best.cost_euros
        
        # 4. Calculer le score écologique global
        avg_eco_score = int(sum(s.eco_score for s in all_segments) / len(all_segments))
        
        # 5. Suggestions de compensation
        compensation = optimizer.get_compensation_products(total_co2)
        
        # 6. Construire l'itinéraire jour par jour
        daily_itinerary = [
            {
                "day": 1,
                "date": request.start_date,
                "activities": [
                    {
                        "time": "09:00",
                        "type": "transport",
                        "description": f"Départ hébergement vers {activity_coords[0]['name']} en {all_segments[0].transport_name}",
                        "co2_kg": all_segments[0].co2_emissions_kg,
                        "distance_km": all_segments[0].distance_km
                    },
                    {
                        "time": "10:00",
                        "type": "activity",
                        "description": f"Visite: {activity_coords[0]['name']}",
                        "activity_id": request.activity_ids[0]
                    }
                ]
            },
            {
                "day": 2,
                "date": (datetime.strptime(request.start_date, "%Y-%m-%d") + timedelta(days=1)).strftime("%Y-%m-%d"),
                "activities": [
                    {
                        "time": "09:00",
                        "type": "transport",
                        "description": f"{activity_coords[0]['name']} → {activity_coords[1]['name']} en {all_segments[1].transport_name}",
                        "co2_kg": all_segments[1].co2_emissions_kg,
                        "distance_km": all_segments[1].distance_km
                    },
                    {
                        "time": "11:00",
                        "type": "activity",
                        "description": f"Visite: {activity_coords[1]['name']}",
                        "activity_id": request.activity_ids[1]
                    }
                ]
            },
            {
                "day": 3,
                "date": request.end_date,
                "activities": [
                    {
                        "time": "09:00",
                        "type": "transport",
                        "description": f"{activity_coords[1]['name']} → {activity_coords[2]['name']} en {all_segments[2].transport_name}",
                        "co2_kg": all_segments[2].co2_emissions_kg,
                        "distance_km": all_segments[2].distance_km
                    },
                    {
                        "time": "14:00",
                        "type": "activity",
                        "description": f"Visite: {activity_coords[2]['name']}",
                        "activity_id": request.activity_ids[2]
                    },
                    {
                        "time": "17:00",
                        "type": "transport",
                        "description": f"Retour hébergement en {all_segments[3].transport_name}",
                        "co2_kg": all_segments[3].co2_emissions_kg,
                        "distance_km": all_segments[3].distance_km
                    }
                ]
            }
        ]
        
        # 7. Résumé
        trip_summary = {
            "tourist_id": request.tourist_id,
            "accommodation_id": request.accommodation_id,
            "start_date": request.start_date,
            "end_date": request.end_date,
            "optimization_mode": request.optimization_mode,
            "total_segments": len(all_segments),
            "total_distance_km": round(sum(s.distance_km for s in all_segments), 2)
        }
        
        carbon_footprint = {
            "total_co2_kg": round(total_co2, 3),
            "equivalent_trees_needed": int(total_co2 / 20),  # 1 arbre absorbe ~20kg CO₂/an
            "equivalent_km_car": int(total_co2 / 0.12) if total_co2 > 0 else 0,
            "rating": "🌿🌿🌿" if total_co2 < 5 else "🌿🌿" if total_co2 < 10 else "🌿",
            "category": "Excellent" if total_co2 < 5 else "Bon" if total_co2 < 10 else "À améliorer"
        }
        
        return OptimizedTrip(
            trip_summary=trip_summary,
            daily_itinerary=daily_itinerary,
            transport_segments=all_segments,
            carbon_footprint=carbon_footprint,
            compensation_suggestions=compensation[:3],
            total_cost=round(total_cost, 2),
            eco_score=avg_eco_score
        )
        
    except Exception as e:
        logger.error(f"Erreur lors de l'optimisation: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de l'optimisation du voyage: {str(e)}"
        )


@router.get("/carbon-stats/{tourist_id}", summary="📊 Statistiques carbone d'un touriste")
async def get_tourist_carbon_stats(tourist_id: str):
    """
    Affiche l'historique d'empreinte carbone d'un touriste et ses efforts de compensation.
    """
    
    # Simuler des données (à remplacer par vraies données depuis l'ontologie)
    return {
        "tourist_id": tourist_id,
        "total_trips": 5,
        "total_co2_emitted_kg": 45.6,
        "total_co2_compensated_kg": 30.0,
        "net_carbon_footprint_kg": 15.6,
        "eco_rating": "Gold",  # Bronze, Silver, Gold, Platinum
        "trees_planted_equivalent": 2,
        "favorite_transport": "Bike",
        "greenest_trip": {
            "date": "2025-10-15",
            "co2_kg": 2.1,
            "description": "Voyage 100% vélo"
        },
        "achievements": [
            "🚴 Vélo Champion: 50+ km en vélo",
            "🌱 Carbon Neutral: Compensé 100% de vos émissions",
            "♻️ Eco Warrior: 10 produits locaux achetés"
        ]
    }
