import os
import shutil
from typing import List
from uuid import uuid4
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session
from database import get_db
from models import Report, Scan, User
from routers.auth import get_current_user
from schemas import ScanResponse
from ai_modal.predict import predict_image, predict_score, score_to_prediction

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=ScanResponse)
def upload_scan(
    patient_name: str = Form(...),
    patient_phone: str = Form(...),
    patient_cnic: str = Form(...),
    patient_id_no: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    file_ext = os.path.splitext(file.filename or "")[1].lower()
    is_image = file.content_type and file.content_type.startswith("image/")
    is_dicom = file_ext == ".dcm" or file.content_type in ("application/dicom", "application/octet-stream")
    if not is_image and not is_dicom:
        raise HTTPException(status_code=400, detail="Only image or DICOM files are allowed")

    file_extension = os.path.splitext(file.filename or "")[1]
    filename = f"{uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        with open(file_path, "rb") as f:
            image_bytes = f.read()
        pred = predict_image(image_bytes)
        result, stage, confidence = pred["result"], pred["stage"], pred["confidence"]
    except Exception:
        result, stage, confidence = "Pending", "Pending", 0.0

    scan = Scan(
        user_id=current_user.id,
        patient_name=patient_name,
        patient_phone=patient_phone,
        patient_cnic=patient_cnic,
        patient_id_no=patient_id_no,
        image_path=file_path,
        result=result,
        stage=stage,
        confidence=confidence,
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    if result == "Normal":
        recommendation = "No signs of liver cirrhosis detected. Continue regular checkups."
    else:
        recommendation = "Liver cirrhosis indicators detected. Immediate clinical consultation recommended."

    report = Report(
        scan_id=scan.id,
        user_id=current_user.id,
        summary=f"MRI scan analysed for patient {patient_name}. AI Result: {result} — {stage}. Confidence: {round(confidence * 100, 1)}%.",
        recommendation=recommendation,
        doctor_notes="",
    )
    db.add(report)
    db.commit()

    return scan


@router.post("/upload-folder", response_model=ScanResponse)
def upload_folder(
    patient_name: str = Form(...),
    patient_cnic: str = Form(...),
    patient_phone: str = Form(...),
    patient_id_no: str = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    scores = []
    representative_path = None
    mid_index = len(files) // 2

    for i, file in enumerate(files):
        file_ext = os.path.splitext(file.filename or "")[1].lower()
        is_image = file.content_type and file.content_type.startswith("image/")
        is_dicom = file_ext == ".dcm" or file.content_type in ("application/dicom", "application/octet-stream")
        if not is_image and not is_dicom:
            continue

        image_bytes = file.file.read()

        if representative_path is None or i == mid_index:
            filename = f"{uuid4()}{file_ext}"
            file_path = os.path.join(UPLOAD_DIR, filename)
            with open(file_path, "wb") as f:
                f.write(image_bytes)
            representative_path = file_path

        try:
            score = predict_score(image_bytes)
            scores.append(score)
        except Exception:
            pass

    if not representative_path:
        raise HTTPException(status_code=400, detail="No valid image or DICOM files found")

    if scores:
        avg_score = sum(scores) / len(scores)
        pred = score_to_prediction(avg_score)
        result, stage, confidence = pred["result"], pred["stage"], pred["confidence"]
    else:
        result, stage, confidence = "Pending", "Pending", 0.0

    scan = Scan(
        user_id=current_user.id,
        patient_cnic=patient_cnic,
        patient_name=patient_name,
        patient_phone=patient_phone,
        patient_id_no=patient_id_no,
        image_path=representative_path,
        result=result,
        stage=stage,
        confidence=confidence,
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    slices_count = len(scores)
    if result == "Normal":
        recommendation = "No signs of liver cirrhosis detected across MRI slices. Continue regular checkups."
    else:
        recommendation = "Liver cirrhosis indicators detected across MRI slices. Immediate clinical consultation recommended."

    report = Report(
        scan_id=scan.id,
        user_id=current_user.id,
        summary=f"MRI series ({slices_count} slices) analysed for {patient_name}. AI Result: {result} — {stage}. Confidence: {round(confidence * 100, 1)}%.",
        recommendation=recommendation,
        doctor_notes="",
    )
    db.add(report)
    db.commit()

    return scan


@router.get("/history", response_model=list[ScanResponse])
def get_scan_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Scan).filter(Scan.user_id == current_user.id).order_by(Scan.created_at.desc()).all()


@router.delete("/{scan_id}")
def delete_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scan = db.query(Scan).filter(Scan.id == scan_id, Scan.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    # Delete the image file
    if scan.image_path and os.path.exists(scan.image_path):
        os.remove(scan.image_path)
    
    db.delete(scan)
    db.commit()
    return {"message": "Scan deleted successfully"}
    return scan
