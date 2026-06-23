from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def patients_root():
    return {"message": "Patients router working"}
