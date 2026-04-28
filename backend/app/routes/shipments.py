from typing import List
from fastapi import APIRouter, HTTPException, Depends
from app.models import Shipment, ShipmentSummary
from app.services.risk_engine import calculate_risk
from app.services.store import shipments
from app.services.auth import get_current_user

router = APIRouter(prefix="/shipments", tags=["shipments"])

@router.get("", response_model=List[ShipmentSummary])
def list_shipments(user: dict = Depends(get_current_user)) -> List[ShipmentSummary]:
    # The 'user' variable now contains the decoded Clerk token
    return [
        ShipmentSummary(
            id=shipment.id,
            speed=shipment.speed,
            risk=calculate_risk(shipment),
            suggested_route=shipment.suggested_route,
        )
        for shipment in shipments.values()
    ]

@router.get("/{shipment_id}", response_model=Shipment)
def get_shipment(shipment_id: str, user: dict = Depends(get_current_user)) -> Shipment:
    shipment = shipments.get(shipment_id)
    if shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment

@router.post("", response_model=Shipment, status_code=201)
def create_shipment(shipment: Shipment, user: dict = Depends(get_current_user)) -> Shipment:
    shipments[shipment.id] = shipment
    return shipment
