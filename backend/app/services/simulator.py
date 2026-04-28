import asyncio
import random
from app.models import Shipment
from app.services.ai_explainer import generate_explanation
from app.services.risk_engine import calculate_risk
from app.services.routing import get_best_route
from app.services.store import shipments


async def simulator_task():
    while True:
        for shipment in shipments.values():
            shipment.current_location[0] += random.uniform(-0.01, 0.01)
            shipment.current_location[1] += random.uniform(-0.01, 0.01)

            if random.random() < 0.2:
                shipment.speed = random.randint(5, 19)
            else:
                shipment.speed = random.randint(30, 80)

            if shipment.speed > 20 and shipment.eta > 0:
                shipment.eta -= 1

            risk = calculate_risk(shipment)
            if risk == "HIGH" and len(shipment.route) >= 2:
                shipment.suggested_route = get_best_route(
                    shipment.route[0],
                    shipment.route[-1],
                )
                if not shipment.explanation:
                    shipment.explanation = await generate_explanation(shipment, risk)
            else:
                shipment.suggested_route = None
                shipment.explanation = None

        print("[simulator] updated shipments")
        await asyncio.sleep(3)
