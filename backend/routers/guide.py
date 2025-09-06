# backend/routers/guide.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.openai_service import ask_text

router = APIRouter()


# Accept a single 'prompt' field for frontend compatibility
class GuideRequest(BaseModel):
    prompt: str

SYSTEM_PROMPT = (
    "You are a real-estate compliance assistant. Provide concise, numbered steps to legally "
    "acquire property in the user's location. Mention typical agencies/documents where applicable "
    "(e.g., Lagos State Lands Bureau, Governor's Consent; UK Land Registry; US county recorder). "
    "Include a short disclaimer: 'This is general information, not legal advice.'"
)


@router.post("/guide")
async def generate_guide(req: GuideRequest):
    # Use the prompt directly from the frontend
    steps = ask_text(SYSTEM_PROMPT, req.prompt)
    return {"steps": steps}
