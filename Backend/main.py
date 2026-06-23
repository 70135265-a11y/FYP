from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models
from routers import auth, scans, patients, reports, chat
from ai_modal.predict import get_model
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="LiverAI API")

Base.metadata.create_all(bind=engine)


@app.on_event("startup")
def preload_model():
    try:
        get_model()
    except Exception:
        pass

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(scans.router, prefix="/api/scans", tags=["Scans"])
app.include_router(patients.router, prefix="/api/patients", tags=["Patients"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])

@app.get("/")
def root():
    return {"message": "LiverAI API Running!"}
