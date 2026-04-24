from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.event_routes import router as event_router

app = FastAPI(title="Event Discovery Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(event_router)

@app.get("/")
def root():
    return {"message": "Event Discovery Agent Running"}

