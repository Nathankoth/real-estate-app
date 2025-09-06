# backend/services/openai_service.py
import os
import time
import base64
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY in backend/.env")

client = OpenAI(api_key=API_KEY)

def ask_text(system_prompt: str, user_prompt: str, model: str = "gpt-4.1", max_tokens: int = 800):
    """Return assistant text response (string)"""
    retries = 2
    for attempt in range(retries + 1):
        try:
            resp = client.chat.completions.create(
                model=model,
                messages=[{"role": "system", "content": system_prompt},
                          {"role": "user", "content": user_prompt}],
                temperature=0.2,
                max_tokens=max_tokens
            )
            return resp.choices[0].message.content.strip()
        except Exception as e:
            if attempt == retries:
                raise
            time.sleep(1 + attempt * 2)

def make_image(prompt: str, size: str = "1024x1024", model: str = "dall-e-3"):
    """Return image as base64 string (no data: prefix)."""
    retries = 2
    for attempt in range(retries + 1):
        try:
            img_resp = client.images.generate(
                model=model,
                prompt=prompt,
                size=size,
                response_format="b64_json"
            )
            # new SDK returns base64 in img_resp.data[0].b64_json
            b64 = img_resp.data[0].b64_json
            return b64
        except Exception as e:
            if attempt == retries:
                raise
            time.sleep(1 + attempt * 2)
