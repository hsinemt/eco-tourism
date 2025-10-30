from fastapi import APIRouter, HTTPException, Body, Path, Query
from typing import Optional
from pydantic import BaseModel, Field
from app.services.feedback_manager import FeedbackManager
from datetime import datetime

router = APIRouter()


class FeedbackBase(BaseModel):
    activity_uri: str = Field(..., example="http://www.ecotourism.org/ontology#RandonneeIchkeul")
    user_name: str = Field(..., min_length=2, max_length=50)
    rating: int = Field(..., ge=1, le=5)
    comment: str = Field(..., min_length=10, max_length=500)


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: Optional[str] = Field(None, min_length=10, max_length=500)


@router.get("/", summary="Récupérer tous les feedbacks")
def get_all_feedbacks(
        limit: int = Query(10, ge=1, le=100, description="Nombre maximum de feedbacks à retourner"),
        offset: int = Query(0, ge=0, description="Nombre de feedbacks à ignorer (pagination)"),
        min_rating: Optional[int] = Query(None, ge=1, le=5, description="Note minimale pour filtrer"),
        max_rating: Optional[int] = Query(None, ge=1, le=5, description="Note maximale pour filtrer"),
        user_name: Optional[str] = Query(None, description="Filtrer par nom d'utilisateur"),
        sort_by: Optional[str] = Query("date_desc", description="Tri: date_desc, date_asc, rating_desc, rating_asc")
):
    """
    Récupère tous les feedbacks avec options de pagination et filtrage.

    - **limit**: Nombre de résultats par page (1-100, défaut: 10)
    - **offset**: Position de départ pour la pagination (défaut: 0)
    - **min_rating**: Filtrer par note minimale (1-5)
    - **max_rating**: Filtrer par note maximale (1-5)
    - **user_name**: Filtrer par nom d'utilisateur
    - **sort_by**: Ordre de tri (date_desc, date_asc, rating_desc, rating_asc)
    """
    try:
        manager = FeedbackManager()

        # Build filters dictionary
        filters = {}
        if min_rating is not None:
            filters['min_rating'] = min_rating
        if max_rating is not None:
            filters['max_rating'] = max_rating
        if user_name is not None:
            filters['user_name'] = user_name

        # Get all feedbacks with filters
        all_feedbacks = manager.get_all_feedbacks(
            limit=limit,
            offset=offset,
            filters=filters,
            sort_by=sort_by
        )

        # Get total count for pagination info
        total_count = manager.get_total_feedback_count(filters)

        return {
            "feedbacks": all_feedbacks,
            "pagination": {
                "total": total_count,
                "limit": limit,
                "offset": offset,
                "has_more": offset + limit < total_count
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", summary="Soumettre un avis utilisateur")
def submit_feedback(feedback: FeedbackCreate):
    try:
        manager = FeedbackManager()
        new_id = manager.add_feedback(
            activity_uri=feedback.activity_uri,
            user_name=feedback.user_name,
            rating=feedback.rating,
            comment=feedback.comment
        )
        if new_id is None:
            raise HTTPException(status_code=500, detail="Erreur lors de la création du feedback")
        return {
            "status": "created",
            "message": "Feedback ajouté avec succès",
            "feedback_id": new_id,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/activity/{activity_uri:path}", summary="Avis d'une activité")
def get_activity_feedback(activity_uri: str):
    try:
        manager = FeedbackManager()
        feedbacks = manager.get_feedback_for_activity(activity_uri)
        stats = manager.get_feedback_statistics(activity_uri)
        return {
            "activity_uri": activity_uri,
            "feedbacks": feedbacks,
            "statistics": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{feedback_id}", summary="Récupérer un feedback par ID")
def get_feedback(feedback_id: int = Path(..., ge=1)):
    try:
        manager = FeedbackManager()
        feedback = manager.get_feedback_by_id(feedback_id)
        if not feedback:
            raise HTTPException(status_code=404, detail="Feedback non trouvé")
        return feedback
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{feedback_id}", summary="Mettre à jour un feedback par ID")
def update_feedback(feedback_id: int, update_data: FeedbackUpdate):
    try:
        manager = FeedbackManager()
        updated = manager.update_feedback(feedback_id, update_data.dict(exclude_unset=True))
        if not updated:
            raise HTTPException(status_code=404, detail="Feedback non trouvé ou rien à mettre à jour")
        return {"status": "updated", "feedback_id": feedback_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{feedback_id}", summary="Supprimer un feedback par ID")
def delete_feedback(feedback_id: int):
    try:
        manager = FeedbackManager()
        deleted = manager.delete_feedback(feedback_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Feedback non trouvé")
        return {"status": "deleted", "feedback_id": feedback_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))