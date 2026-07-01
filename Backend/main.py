from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models
from routers import auth, scans, patients, reports
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="LiverAI API")

Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://fyp-pi-six.vercel.app", "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(scans.router, prefix="/api/scans", tags=["Scans"])
app.include_router(patients.router, prefix="/api/patients", tags=["Patients"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

@app.get("/")
def root():
    return {"message": "LiverAI API Running!"}
