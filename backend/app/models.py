from typing import List, Optional

from pydantic import BaseModel, Field


class Shipment(BaseModel):
    id: str
    current_location: List[float] = Field(
        ...,
        min_length=2,
        max_length=2,
        description="[lat, lng]",
    )
    speed: int
    route: List[str]
    eta: int
    suggested_route: Optional[List[str]] = None
    explanation: Optional[str] = None


class ShipmentSummary(BaseModel):
    id: str
    speed: int
    risk: str
    suggested_route: Optional[List[str]] = None


class RiskResponse(BaseModel):
    risk: str
    explanation: str
