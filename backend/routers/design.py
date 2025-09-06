from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.openai_service import ask_text, make_image

router = APIRouter()

class DesignRequest(BaseModel):
    prompt: str
    style: Optional[str] = None
    size: Optional[str] = "1024x1024"

@router.post("/text")
async def text_to_image(req: DesignRequest):
    prompt = req.prompt
    if req.style:
        prompt = f"{prompt}, style: {req.style}"
    try:
        b64 = make_image(prompt, size=req.size)
        return {"image_b64": b64}
    except Exception as e:
        return {"error": str(e)}

@router.post("/ask")
def ask_design(system_prompt: str, user_prompt: str):
    try:
        result = ask_text(system_prompt, user_prompt)
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/image")
def generate_image(prompt: str):
    try:
        b64_img = make_image(prompt)
        return {"image_base64": b64_img}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
