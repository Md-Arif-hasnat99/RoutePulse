from fastapi import APIRouter, HTTPException

from app.models import RiskResponse
from app.services.ai_explainer import generate_explanation
from app.services.risk_engine import calculate_risk
from app.services.store import shipments


router = APIRouter(tags=["risk"])


@router.get("/risk/{shipment_id}", response_model=RiskResponse)
async def get_risk(shipment_id: str) -> RiskResponse:
    shipment = shipments.get(shipment_id)
    if shipment is None:
        raise HTTPException(status_code=404, detail="Shipment not found")

    risk = calculate_risk(shipment)
    explanation = shipment.explanation or await generate_explanation(shipment, risk)
    shipment.explanation = explanation

    return RiskResponse(risk=risk, explanation=explanation)
