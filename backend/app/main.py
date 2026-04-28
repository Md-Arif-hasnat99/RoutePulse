import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.reroute import router as reroute_router
from app.routes.risk import router as risk_router
from app.routes.shipments import router as shipments_router
from app.services.simulator import simulator_task
from app.services.store import seed_shipments

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    seed_shipments()
    asyncio.create_task(simulator_task())


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(shipments_router)
app.include_router(risk_router)
app.include_router(reroute_router)
