from fastapi import APIRouter, HTTPException, Body
from typing import List
from app.services.activity_comparateur import ActivityComparator


router = APIRouter()

@router.post("/", summary="Comparer plusieurs activités")
def compare_activities(
    activity_uris: List[str] = Body(..., example=[
        "http://www.ecotourism.org/ontology#AscensionBoukornine",
        "http://www.ecotourism.org/ontology#RandonneeIchkeul"
    ])
):
    """Compare 2+ activités selon critères écologiques"""
    try:
        if len(activity_uris) < 2:
            raise HTTPException(status_code=400, detail="Au moins 2 activités requises")
        
        comparator = ActivityComparator()
        comparison_data = []
        
        for uri in activity_uris:
            details = comparator.get_activity_details(uri)
            if details:
                activity_name = uri.split('#')[-1]
                comparison_data.append({
                    "uri": uri,
                    "name": activity_name,
                    "details": details
                })
        
        return {
            "comparison": comparison_data,
            "count": len(comparison_data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
