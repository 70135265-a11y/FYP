import torch
import torch.nn as nn
import numpy as np
from PIL import Image
import io
import os
import gc
import pydicom

MODEL_PATH = os.path.join(os.path.dirname(__file__), "unet_liver.pth")


class UNet(nn.Module):
    def __init__(self):
        super().__init__()
        def block(i, o):
            return nn.Sequential(
                nn.Conv2d(i, o, 3, padding=1), nn.ReLU(),
                nn.Conv2d(o, o, 3, padding=1), nn.ReLU()
            )
        self.e1 = block(1, 64)
        self.e2 = block(64, 128)
        self.e3 = block(128, 256)
        self.pool = nn.MaxPool2d(2)
        self.bn = block(256, 512)
        self.up3 = nn.ConvTranspose2d(512, 256, 2, stride=2)
        self.d3 = block(512, 256)
        self.up2 = nn.ConvTranspose2d(256, 128, 2, stride=2)
        self.d2 = block(256, 128)
        self.up1 = nn.ConvTranspose2d(128, 64, 2, stride=2)
        self.d1 = block(128, 64)
        self.out = nn.Conv2d(64, 1, 1)

    def forward(self, x):
        e1 = self.e1(x)
        e2 = self.e2(self.pool(e1))
        e3 = self.e3(self.pool(e2))
        b  = self.bn(self.pool(e3))
        d3 = self.d3(torch.cat([self.up3(b),  e3], 1))
        d2 = self.d2(torch.cat([self.up2(d3), e2], 1))
        d1 = self.d1(torch.cat([self.up1(d2), e1], 1))
        return torch.sigmoid(self.out(d1))


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

_model = None


def get_model():
    global _model
    if _model is None:
        _model = UNet().to(device)
        _model.load_state_dict(torch.load(MODEL_PATH, map_location=device, weights_only=True))
        _model.eval()
    return _model


def _load_image(image_bytes: bytes) -> Image.Image:
    try:
        ds = pydicom.dcmread(io.BytesIO(image_bytes), force=True)
        pixels = ds.pixel_array.astype(np.float32)
        while pixels.ndim > 2:
            pixels = pixels[0]
        lo, hi = pixels.min(), pixels.max()
        pixels = ((pixels - lo) / (hi - lo + 1e-8) * 255).astype(np.uint8)
        return Image.fromarray(pixels).convert("L").resize((128, 128))
    except Exception:
        pass
    try:
        return Image.open(io.BytesIO(image_bytes)).convert("L").resize((128, 128))
    except Exception:
        return Image.new("L", (128, 128), 128)


def predict_score(image_bytes: bytes) -> float:
    img = _load_image(image_bytes)
    img_array = np.array(img, dtype=np.float32) / 255.0
    tensor = torch.tensor(img_array).unsqueeze(0).unsqueeze(0).to(device)
    model = get_model()
    output = None
    try:
        with torch.inference_mode():
            output = model(tensor)
        mask = output.squeeze().cpu().numpy()
        score = float(mask.mean()) * 100
        del mask
    finally:
        del tensor
        if output is not None:
            del output
        gc.collect()
    return score


def score_to_prediction(raw_score: float) -> dict:
    if raw_score >= 45:
        result, stage = "Normal", "No Cirrhosis"
        confidence = round(raw_score / 100, 4)
    elif raw_score >= 35:
        result, stage = "Cirrhosis Detected", "Stage 1 — Mild Fibrosis"
        confidence = round(1 - raw_score / 100 + 0.1, 4)
    elif raw_score >= 25:
        result, stage = "Cirrhosis Detected", "Stage 2 — Significant Fibrosis"
        confidence = round(1 - raw_score / 100 + 0.15, 4)
    elif raw_score >= 15:
        result, stage = "Cirrhosis Detected", "Stage 3 — Advanced Fibrosis"
        confidence = round(1 - raw_score / 100 + 0.2, 4)
    else:
        result, stage = "Cirrhosis Detected", "Stage 4 — Cirrhosis"
        confidence = round(1 - raw_score / 100 + 0.25, 4)
    return {"result": result, "stage": stage, "confidence": min(max(confidence, 0.01), 0.99)}


def predict_image(image_bytes: bytes) -> dict:
    return score_to_prediction(predict_score(image_bytes))
