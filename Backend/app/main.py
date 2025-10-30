"""
🌍 Eco-Tourism Semantic API - Complete Edition
App principale FastAPI avec tous les routers intégrés
Version: 3.0.0
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# ============================================
# IMPORTS DES ENDPOINTS
# ============================================

# Imports des routers (adaptés à votre structure)
from app.api.endpoints.accommodation import router as accommodation_router
from app.api.endpoints.activities import router as activities_router
from app.api.endpoints.booking import router as booking_router
from app.api.endpoints.feedback import router as feedback_router
from app.api.endpoints.location import router as location_router
from app.api.endpoints.users import router as users_router
from app.api.endpoints.transport import router as transport_router
from app.api.endpoints.season import router as season_router
from app.api.endpoints.sustainability import router as sustainability_products_router
from app.api.endpoints.analytics import router as analytics_router
from app.api.endpoints.nlp import router as nlp_router
from app.api.endpoints.ai_nlp import router as ai_router
from app.api.endpoints.ai_debug import router as debug_router
from app.api.endpoints import carbon_optimizer


# 🆕 NOUVEAU: Import du router itinéraires
try:
    from app.api.endpoints.itinerary import router as itinerary_router
except ImportError:
    print("⚠️  Warning: itinerary router not found - check import path")
    itinerary_router = None

# ============================================
# CONFIGURATION FASTAPI
# ============================================

app = FastAPI(
    title="🌿 Eco-Tourism Semantic API - Complete Edition",
    description="""
    API sémantique et intelligente pour la gestion complète du tourisme écologique en Tunisie.
    
    **Fonctionnalités principales:**
    - ✅ Gestion complète d'hébergements écologiques (CRUD)
    - ✅ Gestion d'activités écotouristiques (CRUD)
    - ✅ Système de réservations et avis (CRUD)
    - ✅ Géolocalisation et gestion des saisons
    - ✅ Gestion des utilisateurs (touristes/guides)
    - ✅ Transport écologique et durabilité
    - ✅ Comparateurs intelligents d'hébergements et activités
    - ✅ Analytics et reporting
    - ✅ **🆕 Générateur d'itinéraires écologiques de 3 jours**
    - ✅ Recommandations basées sur IA (Gemini + SPARQL)
    - ✅ NLP pour recherche intelligente
    
    **Technologies:**
    - FastAPI pour l'API RESTful
    - SPARQL pour les requêtes sémantiques
    - Google Gemini pour les recommandations IA
    - RDF/OWL pour l'ontologie écotourisme
    """,
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# ============================================
# MIDDLEWARE - CORS
# ============================================
# origins = [
#     "http://localhost:3000",  # Next.js dev server
#     "http://127.0.0.1:3000",  # Alternative localhost
#     "http://localhost:3001",  # Another port if needed
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# ============================================
# ENREGISTREMENT DES ROUTERS - CRUDL
# ============================================

# 📍 DONNÉES PRINCIPALES
# =====================

# Hébergements - CRUD complet
app.include_router(
    accommodation_router,
    prefix="/accommodations",
    tags=["🏠 Hébergements"]
)

# Activités - CRUD complet
app.include_router(
    activities_router,
    prefix="/activities",
    tags=["🎯 Activités"]
)

# Géolocalisation - CRUD complet
app.include_router(
    location_router,
    prefix="/locations",
    tags=["🗺️ Lieux & Géolocalisation"]
)

# Saisons - CRUD complet
app.include_router(
    season_router,
    prefix="/seasons",
    tags=["🌡️ Saisons"]
)

# 📅 RÉSERVATIONS ET RETOURS D'EXPÉRIENCE
# ========================================

# Réservations - CRUD complet
app.include_router(
    booking_router,
    prefix="/bookings",
    tags=["📅 Réservations"]
)

# Avis et Feedback - CRUD complet
app.include_router(
    feedback_router,
    prefix="/feedback",
    tags=["⭐ Avis & Feedback"]
)

# 👥 UTILISATEURS
# ================

# Utilisateurs (Touristes/Guides) - CRUD complet
app.include_router(
    users_router,
    prefix="/users",
    tags=["👥 Utilisateurs"]
)
#app.include_router(users.router, prefix="/tourists", tags=["tourists"])

# 🌱 TRANSPORT ET DURABILITÉ
# ==========================

# Transport écologique - CRUD complet
app.include_router(
    transport_router,
    prefix="/transport",
    tags=["🚗 Transport Écologique"]
)

# Durabilité et Produits locaux - CRUD complet
app.include_router(
    sustainability_products_router,
    prefix="/sustainability",
    tags=["♻️ Durabilité & Produits Locaux"]
)

# 🔄 FONCTIONNALITÉS AVANCÉES
# ============================


# Analytics et reporting
app.include_router(
    analytics_router,
    prefix="/analytics",
    tags=["📊 Analytics & Reporting"]
)

# NLP local
app.include_router(
    nlp_router,
    prefix="/nlp",
    tags=["🧠 NLP/IA (Local)"]
)

# IA avec Gemini
app.include_router(
    ai_router,
    prefix="/ai",
    tags=["🤖 IA/Gemini (SPARQL)"]
)

# Debug IA
app.include_router(
    debug_router,
    prefix="/debug",
    tags=["🔧 Debug IA"]
)


app.include_router(
    carbon_optimizer.router,
    prefix="/carbon-optimizer",
    tags=["🌍 Optimisation Carbone"]
)


# 🆕 ITINÉRAIRES ÉCOLOGIQUES (NOUVEAU V3.0)
# ==========================================

if itinerary_router:
    app.include_router(
        itinerary_router,
        prefix="/itineraries",
        tags=["🗺️ Itinéraires Écologiques 3 Jours"]
    )

# ============================================
# ENDPOINTS RACINE
# ============================================

@app.get("/", tags=["🏠 Root"])
def read_root():
    """Endpoint racine - Information sur l'API"""
    return {
        "message": "✅ Eco-Tourism Complete Semantic API is running!",
        "version": "3.0.0",
        "status": "🟢 Production Ready",
        "timestamp": datetime.now().isoformat(),
        "features": [
            "🏠 CRUD Hébergements",
            "🎯 CRUD Activités",
            "📅 CRUD Réservations",
            "⭐ CRUD Avis",
            "🗺️ CRUD Géolocalisation",
            "🌡️ CRUD Saisons",
            "👥 CRUD Utilisateurs",
            "🚗 CRUD Transport",
            "♻️ CRUD Durabilité",
            "⚖️ Comparateurs",
            "📊 Analytics",
            "🧠 NLP",
            "🤖 IA Gemini",
            "🗺️ 🆕 Itinéraires 3 jours"
        ],
        "endpoints": {
            "documentation": {
                "swagger": "/docs",
                "redoc": "/redoc",
                "openapi": "/openapi.json"
            },
            "data_management": {
                "accommodations": "/accommodations (CRUD)",
                "activities": "/activities (CRUD)",
                "locations": "/locations (CRUD)",
                "seasons": "/seasons (CRUD)",
                "users": "/users (CRUD)",
                "transport": "/transport (CRUD)",
                "sustainability": "/sustainability (CRUD)"
            },
            "bookings_feedback": {
                "bookings": "/bookings (CRUD)",
                "feedback": "/feedback (CRUD)"
            },
            "advanced": {
                "compare": "/compare",
                "analytics": "/analytics",
                "nlp": "/nlp/query",
                "ai_gemini": "/ai/ai-query",
                "itineraries": "/itineraries 🆕"
            }
        }
    }


@app.get("/health", tags=["🏥 Health"])
def health_check():
    """Vérification de santé de l'API"""
    return {
        "status": "healthy",
        "api": "Eco-Tourism Semantic API",
        "version": "3.0.0",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/info", tags=["ℹ️ Info"])
def get_api_info():
    """Information détaillée sur l'API"""
    return {
        "api_name": "Eco-Tourism Semantic API",
        "api_version": "3.0.0",
        "build_date": "2025-01-20",
        "status": "Production Ready",
        "environment": "Deployed",
        "endpoints_count": 65,
        "features": {
            "crud_operations": [
                "✅ CREATE (POST)",
                "✅ READ (GET)",
                "✅ UPDATE (PUT)",
                "✅ DELETE (DELETE)",
                "✅ LIST (GET with filters)"
            ],
            "entities_supported": [
                "Accommodations (Hébergements)",
                "Activities (Activités)",
                "Locations (Lieux)",
                "Seasons (Saisons)",
                "Bookings (Réservations)",
                "Feedback (Avis)",
                "Users (Touristes/Guides)",
                "Transport (Moyens de transport)",
                "Local Products (Produits locaux)",
                "Sustainability Indicators (Indicateurs de durabilité)"
            ],
            "advanced_features": [
                "🆕 Semantic search with SPARQL",
                "🆕 AI-powered recommendations (Gemini)",
                "🆕 Natural Language Processing",
                "🆕 3-Day Eco-Itineraries Generation",
                "🆕 Analytics & reporting",
                "🆕 Comparison tools"
            ]
        },
        "databases": {
            "ontology": "Ecotourism Tunisia Ontology (OWL)",
            "rdf_store": "Triple Store SPARQL",
            "ai_service": "Google Gemini API"
        },
        "documentation": {
            "swagger_ui": "/docs",
            "redoc": "/redoc",
            "openapi_schema": "/openapi.json"
        }
    }


@app.get("/api/structure", tags=["📋 Structure"])
def get_api_structure():
    """Retourne la structure complète de l'API"""
    return {
        "api_version": "3.0.0",
        "last_updated": datetime.now().isoformat(),
        "structure": {
            "data_management_modules": {
                "accommodations": {
                    "prefix": "/accommodations",
                    "operations": ["CREATE", "READ", "UPDATE", "DELETE", "LIST", "COMPARE"],
                    "endpoints": 10,
                    "status": "✅ Active"
                },
                "activities": {
                    "prefix": "/activities",
                    "operations": ["CREATE", "READ", "UPDATE", "DELETE", "LIST", "COMPARE"],
                    "endpoints": 11,
                    "status": "✅ Active"
                },
                "locations": {
                    "prefix": "/locations",
                    "operations": ["CREATE", "READ", "UPDATE", "DELETE", "LIST"],
                    "endpoints": 5,
                    "status": "✅ Active"
                },
                "seasons": {
                    "prefix": "/seasons",
                    "operations": ["CREATE", "READ", "UPDATE", "DELETE", "LIST"],
                    "endpoints": 5,
                    "status": "✅ Active"
                },
                "users": {
                    "prefix": "/users",
                    "operations": ["CREATE", "READ", "UPDATE", "DELETE", "LIST"],
                    "endpoints": 5,
                    "status": "✅ Active"
                },
                "transport": {
                    "prefix": "/transport",
                    "operations": ["CREATE", "READ", "UPDATE", "DELETE", "LIST"],
                    "endpoints": 5,
                    "status": "✅ Active"
                },
                "sustainability": {
                    "prefix": "/sustainability",
                    "operations": ["CREATE", "READ", "UPDATE", "DELETE", "LIST"],
                    "endpoints": 5,
                    "status": "✅ Active"
                }
            },
            "transactional_modules": {
                "bookings": {
                    "prefix": "/bookings",
                    "operations": ["CREATE", "READ", "UPDATE", "DELETE", "LIST"],
                    "endpoints": 5,
                    "status": "✅ Active"
                },
                "feedback": {
                    "prefix": "/feedback",
                    "operations": ["CREATE", "READ", "UPDATE", "DELETE", "LIST"],
                    "endpoints": 5,
                    "status": "✅ Active"
                }
            },
            "advanced_modules": {

                "analytics": {
                    "prefix": "/analytics",
                    "operations": ["GET_STATS", "GET_TRENDS", "GET_REPORTS"],
                    "endpoints": 3,
                    "status": "✅ Active"
                },
                "nlp": {
                    "prefix": "/nlp",
                    "operations": ["QUERY_NLP", "PARSE_TEXT"],
                    "endpoints": 2,
                    "status": "✅ Active"
                },
                "ai_gemini": {
                    "prefix": "/ai",
                    "operations": ["QUERY_AI", "RECOMMENDATION"],
                    "endpoints": 2,
                    "status": "✅ Active"
                },
                "itineraries": {
                    "prefix": "/itineraries",
                    "operations": ["GENERATE_3DAY", "GET_TEMPLATES", "APPLY_TEMPLATE", "ECO_GUIDE"],
                    "endpoints": 4,
                    "status": "✅ Active 🆕"
                },
                "debug": {
                    "prefix": "/debug",
                    "operations": ["DEBUG_SPARQL", "DEBUG_AI"],
                    "endpoints": 2,
                    "status": "✅ Active"
                }
            }
        },
        "total_endpoints": 65,
        "core_technologies": [
            "FastAPI - Modern Python Web Framework",
            "SPARQL - Semantic Query Language",
            "RDF/OWL - Semantic Web Standards",
            "Google Gemini - AI Recommendations",
            "CORS - Cross-Origin Support"
        ]
    }


@app.get("/api/versions", tags=["📊 Versions"])
def get_versions_info():
    """Information sur les versions de l'API"""
    return {
        "current_version": "3.0.0",
        "release_date": "2025-01-20",
        "version_history": [
            {
                "version": "1.0.0",
                "date": "2024-12-01",
                "status": "Deprecated",
                "features": ["Basic CRUD", "SPARQL integration"]
            },
            {
                "version": "2.0.0",
                "date": "2025-01-01",
                "status": "Stable",
                "features": ["Comparators", "Advanced CRUD", "Analytics"]
            },
            {
                "version": "3.0.0",
                "date": "2025-01-20",
                "status": "Latest",
                "features": [
                    "All previous features",
                    "🆕 3-Day Eco-Itineraries",
                    "🆕 Eco-Score Calculation",
                    "🆕 Template-Based Planning",
                    "🆕 Carbon Footprint Tracking"
                ]
            }
        ]
    }


# ============================================
# ERROR HANDLERS
# ============================================

@app.exception_handler(404)
async def not_found_exception_handler(request, exc):
    """Gestionnaire pour les erreurs 404"""
    return {
        "status": "error",
        "code": 404,
        "message": "Endpoint not found",
        "path": str(request.url.path),
        "documentation": "/docs"
    }


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Gestionnaire pour les erreurs générales"""
    return {
        "status": "error",
        "code": 500,
        "message": "Internal Server Error",
        "detail": str(exc),
        "timestamp": datetime.now().isoformat()
    }


# ============================================
# LIFESPAN (Startup/Shutdown)
# ============================================

@app.on_event("startup")
async def startup_event():
    """Événement de démarrage de l'API"""
    print("🚀 Starting Eco-Tourism Semantic API v3.0.0...")
    print("📊 All modules loaded successfully")
    print("🌍 Ready for eco-tourism data management")


@app.on_event("shutdown")
async def shutdown_event():
    """Événement d'arrêt de l'API"""
    print("🛑 Shutting down Eco-Tourism Semantic API...")


# ============================================
# POINT D'ENTRÉE
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )