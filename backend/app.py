
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import guide, finance, design, preview

app = FastAPI(title="RealEstate Vision API")

@app.get("/")
def root():
    return {"message": "Welcome to Real Estate App API"}

# Allow local frontend (React) on various ports
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
    "http://localhost:8081",  # Your current frontend port
    "http://127.0.0.1:8081",
    "http://localhost:8080",  # Alternative port
    "http://127.0.0.1:8080"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(guide.router, prefix="/guide", tags=["guide"])
app.include_router(finance.router, prefix="/finance", tags=["finance"])
app.include_router(design.router, prefix="/design", tags=["design"])
app.include_router(preview.router, prefix="/preview", tags=["preview"])


@app.post("/guide")  # must match frontend
async def guide_endpoint(payload: dict):
    prompt = payload.get("prompt")
    return {"text": f"Mock guide answer for {prompt}", "image": None}

@app.get("/health")
def health():
    return {"status": "ok"}