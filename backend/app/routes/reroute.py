from fastapi import APIRouter, HTTPException

from app.services.risk_engine import calculate_risk
from app.services.routing import get_best_route
from app.services.store import shipments


router = APIRouter(tags=["routing"])


@router.get("/reroute/{shipment_id}")
def reroute(shipment_id: str) -> dict:
    shipment = shipments.get(shipment_id)
    if shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")

    if len(shipment.route) < 2:
        raise HTTPException(status_code=400, detail="Route must include start and end nodes")

    suggested_route = get_best_route(shipment.route[0], shipment.route[-1])
    if calculate_risk(shipment) == "HIGH":
        shipment.suggested_route = suggested_route

    return {"suggested_route": suggested_route}
