from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    role: str = "patient"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    phone: str | None
    address: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    address: str | None = None


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class ScanResponse(BaseModel):
    id: int
    user_id: int
    patient_name: str
    patient_phone: str
    patient_id_no: str
    patient_cnic: str | None
    image_path: str
    result: str
    stage: str
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True


class PatientResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReportResponse(BaseModel):
    id: int
    scan_id: int
    user_id: int
    summary: str | None
    recommendation: str | None
    doctor_notes: str | None
    created_at: datetime
    scan: ScanResponse | None = None

    class Config:
        from_attributes = True
