from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.openai_service import make_image

router = APIRouter()

class PreviewRequest(BaseModel):
    bedrooms: int = 2
    bathrooms: int = 1
    style: Optional[str] = "modern"
    size: Optional[str] = "1024x1024"

@router.post("/")
async def preview(req: PreviewRequest):
    prompt = (
        f"Isometric 3D architectural render of a {req.bedrooms}-bedroom, {req.bathrooms}-bathroom "
        f"apartment with {req.style} interior cues. Photorealistic, detailed floorplan and facade, no text, high detail."
    )
    try:
        b64 = make_image(prompt, size=req.size)
        return {"image_b64": b64}
    except Exception as e:
        return {"error": str(e)}
