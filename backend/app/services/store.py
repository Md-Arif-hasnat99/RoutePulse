from app.models import Shipment


shipments: dict[str, Shipment] = {}


def seed_shipments() -> None:
    if shipments:
        return

    shipments["S-001"] = Shipment(
        id="S-001",
        current_location=[40.71, -74.00],
        speed=62,
        route=["A", "D"],
        eta=120,
    )
    shipments["S-002"] = Shipment(
        id="S-002",
        current_location=[34.05, -118.24],
        speed=49,
        route=["A", "C", "D"],
        eta=250,
    )
    shipments["S-003"] = Shipment(
        id="S-003",
        current_location=[41.87, -87.62],
        speed=35,
        route=["B", "D"],
        eta=180,
    )