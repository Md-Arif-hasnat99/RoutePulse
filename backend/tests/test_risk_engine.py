from app.models import Shipment
from app.services.risk_engine import calculate_risk


def make_shipment(speed: int) -> Shipment:
    return Shipment(
        id="S-TEST",
        current_location=[0.0, 0.0],
        speed=speed,
        route=["A", "D"],
        eta=50,
    )


def test_risk_high_when_speed_below_20() -> None:
    assert calculate_risk(make_shipment(10)) == "HIGH"


def test_risk_medium_when_speed_below_40() -> None:
    assert calculate_risk(make_shipment(35)) == "MEDIUM"


def test_risk_low_when_speed_is_40_or_more() -> None:
    assert calculate_risk(make_shipment(60)) == "LOW"
