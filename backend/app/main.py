from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import PyMongoError

from app.config.database import client
from app.routes.auth import router as auth_router
from app.routes.workspace import router as workspace_router
from app.routes.feedback import router as feedback_router
from app.routes.analysis import router as analysis_router
from app.routes.documents import router as documents_router
from app.routes.roadmap import router as roadmap_router

app = FastAPI(
    title="AI Product Management Assistant API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes
app.include_router(auth_router)
app.include_router(workspace_router)
app.include_router(feedback_router)
app.include_router(analysis_router)
app.include_router(documents_router)
app.include_router(roadmap_router)

@app.get("/")
def home():
    return {
        "message": "AI Product Management Assistant API is running"
    }


@app.get("/health")
def health():

    try:
        client.admin.command("ping")

        return {
            "status": "healthy",
            "database": "connected"
        }

    except PyMongoError:

        return {
            "status": "unhealthy",
            "database": "disconnected"
        }