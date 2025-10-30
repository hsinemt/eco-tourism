from fastapi import APIRouter, Query, HTTPException, Body
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field
import uuid

router = APIRouter()

PREFIXES = """
PREFIX eco: <http://www.ecotourism.org/ontology#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
"""


class BookingCreate(BaseModel):
    booking_id: Optional[str] = Field(None, description="ID du booking (auto-généré si non fourni)")
    booking_date: str = Field(..., description="Date de booking (ISO format: YYYY-MM-DDTHH:MM:SS)")
    booking_status: str = Field(default="confirmed", description="Statut: pending, confirmed, cancelled")
    check_out_date: Optional[str] = Field(None, description="Date de départ (ISO format)")
    payment_method: Optional[str] = Field(None, description="Méthode de paiement")
    confirmation_code: Optional[str] = Field(None, description="Code de confirmation")
    special_requests: Optional[str] = Field(None, description="Demandes spéciales")
    tourist_id: str = Field(..., description="ID du touriste (ex: Tourist_AliceJohnson)")
    accommodation_id: Optional[str] = Field(None, description="ID du logement (ex: EcoLodge_GreenValley)")
    activity_id: Optional[str] = Field(None, description="ID de l'activité (ex: Adventure_SaharaTrek)")


class BookingUpdate(BaseModel):
    booking_date: Optional[str] = Field(None, description="Date de booking (ISO format: YYYY-MM-DDTHH:MM:SS)")
    status: Optional[str] = Field(None, description="Statut du booking: pending, confirmed, cancelled")


def _extract_value(value):
    """
    Extrait la valeur d'une liaison SPARQL
    Gère les formats dict et string
    """
    if value is None:
        return None
    if isinstance(value, dict) and 'value' in value:
        return value['value']
    return value


@router.post("/create", summary="Créer un nouveau booking")
def create_booking(booking: BookingCreate):
    from app.services.sparql_helpers import sparql_insert

    try:
        booking_id = booking.booking_id or f"Booking_{uuid.uuid4().hex[:12].upper()}"
        confirmation_code = booking.confirmation_code or f"CONF-{uuid.uuid4().hex[:8].upper()}"

        sparql_triples = f"""
        eco:{booking_id} rdf:type eco:Booking ;
            eco:bookingId "{booking_id}"^^xsd:string ;
            eco:bookingDate "{booking.booking_date}"^^xsd:dateTime ;
            eco:bookingStatus "{booking.booking_status}"^^xsd:string ;
            eco:confirmationCode "{confirmation_code}"^^xsd:string ;
            eco:createdAt "{datetime.now().isoformat()}"^^xsd:dateTime 
        """

        if booking.check_out_date:
            sparql_triples += f""" ;
            eco:checkOutDate "{booking.check_out_date}"^^xsd:dateTime"""
        if booking.payment_method:
            sparql_triples += f""" ;
            eco:paymentMethod "{booking.payment_method}"^^xsd:string"""
        if booking.special_requests:
            escaped_requests = booking.special_requests.replace('"', '\\"')
            sparql_triples += f""" ;
            eco:specialRequests "{escaped_requests}"^^xsd:string"""
        sparql_triples += f""" ;
            eco:madeBy eco:{booking.tourist_id}"""
        if booking.accommodation_id:
            sparql_triples += f""" ;
            eco:concernsAccommodation eco:{booking.accommodation_id}"""
        if booking.activity_id:
            sparql_triples += f""" ;
            eco:concernsActivity eco:{booking.activity_id}"""
        sparql_triples += " ."

        sparql = PREFIXES + f"""
        INSERT DATA {{
            {sparql_triples}
        }}
        """
        print(f"DEBUG: SPARQL INSERT:\n{sparql}")

        result = sparql_insert(sparql)
        print(f"DEBUG: Insert result = {result}")

        return {
            "status": "created",
            "booking_id": booking_id,
            "confirmation_code": confirmation_code,
            "message": "Booking créé avec succès"
        }
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/all", summary="Lister tous les bookings")
def list_all_bookings():
    from app.services.sparql_helpers import sparql_select

    try:
        sparql = PREFIXES + """
        SELECT ?booking ?bookingId ?bookingDate ?status ?code ?tourist
        WHERE {
          ?booking rdf:type eco:Booking ;
                   eco:bookingId ?bookingId ;
                   eco:bookingDate ?bookingDate ;
                   eco:bookingStatus ?status ;
                   eco:confirmationCode ?code ;
                   eco:madeBy ?tourist .
        }
        ORDER BY DESC(?bookingDate)
        """
        print(f"DEBUG: SPARQL SELECT:\n{sparql}")

        results = sparql_select(sparql)
        bindings = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        bookings = []
        for binding in bindings:
            booking = {
                "booking_uri": _extract_value(binding.get('booking')),
                "booking_id": _extract_value(binding.get('bookingId')),
                "booking_date": _extract_value(binding.get('bookingDate')),
                "status": _extract_value(binding.get('status')),
                "confirmation_code": _extract_value(binding.get('code')),
                "tourist": _extract_value(binding.get('tourist'))
            }
            bookings.append(booking)

        return {
            "status": "success",
            "count": len(bookings),
            "bookings": bookings
        }
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{booking_id}", summary="Récupérer un booking par ID")
def get_booking(booking_id: str):
    from app.services.sparql_helpers import sparql_select

    try:
        # Vérifier si le booking existe
        check_sparql = PREFIXES + f"""
        SELECT ?booking
        WHERE {{
          ?booking rdf:type eco:Booking ;
                   eco:bookingId "{booking_id}" .
        }}
        LIMIT 1
        """

        check_result = sparql_select(check_sparql)
        check_bindings = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []

        if not check_bindings:
            raise HTTPException(status_code=404, detail=f"Booking '{booking_id}' not found")

        # Récupérer toutes les propriétés
        sparql = PREFIXES + f"""
        SELECT ?property ?value
        WHERE {{
          ?booking rdf:type eco:Booking ;
                   eco:bookingId "{booking_id}" ;
                   ?property ?value .
        }}
        """
        print(f"DEBUG: SPARQL SELECT:\n{sparql}")

        results = sparql_select(sparql)
        bindings = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        properties = {}
        for binding in bindings:
            prop = _extract_value(binding.get('property'))
            value = _extract_value(binding.get('value'))

            if prop and '#' in str(prop):
                prop_name = str(prop).split('#')[-1]
            else:
                prop_name = prop

            properties[prop_name] = value

        return {
            "status": "success",
            "booking_id": booking_id,
            "properties": properties
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{booking_id}", summary="Mettre à jour un booking (date et status uniquement)")
def update_booking(booking_id: str, booking_update: BookingUpdate):
    from app.services.sparql_helpers import sparql_update, sparql_select

    try:
        # Vérifier si le booking existe
        check_sparql = PREFIXES + f"""
        SELECT ?booking
        WHERE {{
          ?booking rdf:type eco:Booking ;
                   eco:bookingId "{booking_id}" .
        }}
        LIMIT 1
        """

        check_result = sparql_select(check_sparql)
        check_bindings = check_result.get('results', {}).get('bindings', []) if isinstance(check_result, dict) else []

        if not check_bindings:
            raise HTTPException(status_code=404, detail=f"Booking '{booking_id}' not found")

        # Vérifier qu'au moins un champ est fourni
        if booking_update.booking_date is None and booking_update.status is None:
            raise HTTPException(
                status_code=400,
                detail="Au moins un champ doit être fourni (booking_date ou status)"
            )

        # Construire la requête UPDATE
        delete_clauses = []
        insert_clauses = []
        where_clauses = []

        # Toujours vérifier que le booking existe
        where_clauses.append(f'?booking eco:bookingId "{booking_id}" .')

        # Mettre à jour booking_date si fourni
        if booking_update.booking_date is not None:
            delete_clauses.append("?booking eco:bookingDate ?oldDate .")
            insert_clauses.append(f'?booking eco:bookingDate "{booking_update.booking_date}"^^xsd:dateTime .')
            where_clauses.append("OPTIONAL { ?booking eco:bookingDate ?oldDate . }")

        # Mettre à jour status si fourni
        if booking_update.status is not None:
            delete_clauses.append("?booking eco:bookingStatus ?oldStatus .")
            insert_clauses.append(f'?booking eco:bookingStatus "{booking_update.status}"^^xsd:string .')
            where_clauses.append("OPTIONAL { ?booking eco:bookingStatus ?oldStatus . }")

        delete_str = "\n            ".join(delete_clauses)
        insert_str = "\n            ".join(insert_clauses)
        where_str = "\n            ".join(where_clauses)

        sparql = PREFIXES + f"""
        DELETE {{
            {delete_str}
        }}
        INSERT {{
            {insert_str}
        }}
        WHERE {{
            {where_str}
        }}
        """
        print(f"DEBUG: SPARQL UPDATE:\n{sparql}")

        result = sparql_update(sparql)
        print(f"DEBUG: Update result = {result}")

        # Construire la réponse avec les champs modifiés
        updated_fields = {}
        if booking_update.booking_date is not None:
            updated_fields["booking_date"] = booking_update.booking_date
        if booking_update.status is not None:
            updated_fields["status"] = booking_update.status

        return {
            "status": "success",
            "message": f"Booking '{booking_id}' mis à jour avec succès",
            "booking_id": booking_id,
            "updated_fields": updated_fields
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{booking_id}", summary="Supprimer un booking")
def delete_booking(booking_id: str):
    from app.services.sparql_helpers import sparql_delete

    try:
        sparql = PREFIXES + f"""
        DELETE WHERE {{
          eco:{booking_id} ?p ?o .
        }}
        """
        print(f"DEBUG: SPARQL DELETE:\n{sparql}")

        result = sparql_delete(sparql)

        return {
            "status": "deleted",
            "booking_id": booking_id,
            "message": f"Booking {booking_id} supprimé avec succès"
        }
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/by-tourist/{tourist_id}", summary="Lister les bookings d'un touriste")
def get_bookings_by_tourist(tourist_id: str):
    from app.services.sparql_helpers import sparql_select

    try:
        sparql = PREFIXES + f"""
        SELECT ?booking ?bookingId ?bookingDate ?status ?accommodation ?activity
        WHERE {{
          ?booking rdf:type eco:Booking ;
                   eco:bookingId ?bookingId ;
                   eco:madeBy eco:{tourist_id} ;
                   eco:bookingDate ?bookingDate ;
                   eco:bookingStatus ?status .

          OPTIONAL {{ ?booking eco:concernsAccommodation ?accommodation . }}
          OPTIONAL {{ ?booking eco:concernsActivity ?activity . }}
        }}
        ORDER BY DESC(?bookingDate)
        """
        print(f"DEBUG: SPARQL SELECT:\n{sparql}")

        results = sparql_select(sparql)
        bindings = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        bookings = []
        for binding in bindings:
            booking = {
                "booking_uri": _extract_value(binding.get('booking')),
                "booking_id": _extract_value(binding.get('bookingId')),
                "booking_date": _extract_value(binding.get('bookingDate')),
                "status": _extract_value(binding.get('status')),
                "accommodation": _extract_value(binding.get('accommodation')),
                "activity": _extract_value(binding.get('activity'))
            }
            bookings.append(booking)

        return {
            "status": "success",
            "tourist_id": tourist_id,
            "count": len(bookings),
            "bookings": bookings
        }
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/by-accommodation/{accommodation_id}", summary="Lister les bookings d'un logement")
def get_bookings_by_accommodation(accommodation_id: str):
    from app.services.sparql_helpers import sparql_select

    try:
        sparql = PREFIXES + f"""
        SELECT ?booking ?bookingId ?bookingDate ?status ?tourist
        WHERE {{
          ?booking rdf:type eco:Booking ;
                   eco:bookingId ?bookingId ;
                   eco:concernsAccommodation eco:{accommodation_id} ;
                   eco:bookingDate ?bookingDate ;
                   eco:bookingStatus ?status ;
                   eco:madeBy ?tourist .
        }}
        ORDER BY DESC(?bookingDate)
        """
        print(f"DEBUG: SPARQL SELECT:\n{sparql}")

        results = sparql_select(sparql)
        bindings = results.get('results', {}).get('bindings', []) if isinstance(results, dict) else []

        bookings = []
        for binding in bindings:
            booking = {
                "booking_uri": _extract_value(binding.get('booking')),
                "booking_id": _extract_value(binding.get('bookingId')),
                "booking_date": _extract_value(binding.get('bookingDate')),
                "status": _extract_value(binding.get('status')),
                "tourist": _extract_value(binding.get('tourist'))
            }
            bookings.append(booking)

        return {
            "status": "success",
            "accommodation_id": accommodation_id,
            "count": len(bookings),
            "bookings": bookings
        }
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))