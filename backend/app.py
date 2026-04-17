from fastapi import FastAPI
from backend.routes.event_routes import router as event_router

app = FastAPI(title="Event Discovery Agent")

app.include_router(event_router)

@app.get("/")
def root():
    return {"message": "Event Discovery Agent Running"}