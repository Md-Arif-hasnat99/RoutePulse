import asyncio
import os

from google import genai

from app.models import Shipment


def _fallback_explanation(risk: str) -> str:
    if risk == "HIGH":
        return (
            "Shipment slowed significantly, likely due to congestion. "
            "Alternate route recommended."
        )
    if risk == "MEDIUM":
        return "Shipment speed is below normal. Keep monitoring for potential delays."
    return "Shipment is moving normally with low delay risk."


def _call_gemini(prompt: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        raise RuntimeError("Missing GEMINI_API_KEY")

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
    )
    text = response.text or ""
    return " ".join(text.strip().split())


async def generate_explanation(shipment: Shipment, risk: str) -> str:
    prompt = (
        "You are helping operations managers. "
        "Give a concise 1-2 line explanation for this shipment status. "
        f"Speed: {shipment.speed}. Route: {' -> '.join(shipment.route)}. Risk: {risk}."
    )

    try:
        return await asyncio.wait_for(asyncio.to_thread(_call_gemini, prompt), timeout=5)
    except Exception:
        return _fallback_explanation(risk)
