# app/api/endpoints/analytics.py - VERSION COMPLÈTE CORRIGÉE

from fastapi import APIRouter, HTTPException, Query
from app.services.analytics_dashboard import AnalyticsDashboard
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/carbon-stats", summary="Statistiques d'empreinte carbone")
def get_carbon_statistics():
    """Statistiques globales d'empreinte carbone"""
    try:
        dashboard = AnalyticsDashboard()
        stats = dashboard.get_carbon_statistics()
        return {"carbon_statistics": stats}
    except Exception as e:
        logger.error(f"Erreur: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/by-region", summary="Statistiques par région")
def get_statistics_by_region():
    """Analyse des activités par région"""
    try:
        dashboard = AnalyticsDashboard()
        stats = dashboard.get_statistics_by_region()
        return {"regions": stats}
    except Exception as e:
        logger.error(f"Erreur: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/top-eco", summary="Top activités écologiques")
def get_top_eco_activities(limit: int = Query(10, ge=1, le=50)):
    """Activités les plus écologiques"""
    try:
        dashboard = AnalyticsDashboard()
        top = dashboard.get_top_eco_activities(limit=limit)
        return {"top_activities": top}
    except Exception as e:
        logger.error(f"Erreur: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/activity-types", summary="Distribution par type")
def get_activity_types():
    """Répartition des activités par type"""
    try:
        dashboard = AnalyticsDashboard()
        distribution = dashboard.get_activity_types_distribution()
        return {"activity_types": distribution}
    except Exception as e:
        logger.error(f"Erreur: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/accommodations-stats", summary="Stats hébergements")
def get_accommodations_stats():
    """Statistiques des hébergements"""
    try:
        dashboard = AnalyticsDashboard()
        stats = dashboard.get_accommodations_stats()
        return {"accommodations": stats}
    except Exception as e:
        logger.error(f"Erreur: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/difficulty", summary="Par difficulté")
def get_difficulty():
    """Distribution par niveau de difficulté"""
    try:
        dashboard = AnalyticsDashboard()
        distribution = dashboard.get_activities_by_difficulty()
        return {"by_difficulty": distribution}
    except Exception as e:
        logger.error(f"Erreur: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard", summary="Dashboard complet")
def get_complete_dashboard():
    """Toutes les métriques"""
    try:
        dashboard = AnalyticsDashboard()
        metrics = dashboard.get_all_metrics()
        
        return {
            "dashboard": metrics,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Erreur: {e}")
        raise HTTPException(status_code=500, detail=str(e))
