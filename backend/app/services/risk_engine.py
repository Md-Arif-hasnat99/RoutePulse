from app.models import Shipment


def calculate_risk(shipment: Shipment) -> str:
    if shipment.speed < 20:
        return "HIGH"
    if shipment.speed < 40:
        return "MEDIUM"
    return "LOW"
