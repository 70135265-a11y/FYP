import torch
import torch.nn as nn
import numpy as np
from PIL import Image
import os

IMG_SIZE = 256
MODEL_PATH = os.path.join(os.path.dirname(__file__), "unet_liver.pth")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class UNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.pool = nn.MaxPool2d(2)

        self.e1 = nn.Sequential(
            nn.Conv2d(1, 64, 3, padding=1), nn.ReLU(),
            nn.Conv2d(64, 64, 3, padding=1), nn.ReLU(),
        )
        self.e2 = nn.Sequential(
            nn.Conv2d(64, 128, 3, padding=1), nn.ReLU(),
            nn.Conv2d(128, 128, 3, padding=1), nn.ReLU(),
        )
        self.e3 = nn.Sequential(
            nn.Conv2d(128, 256, 3, padding=1), nn.ReLU(),
            nn.Conv2d(256, 256, 3, padding=1), nn.ReLU(),
        )
        self.bn = nn.Sequential(
            nn.Conv2d(256, 512, 3, padding=1), nn.ReLU(),
            nn.Conv2d(512, 512, 3, padding=1), nn.ReLU(),
        )
        self.up3 = nn.ConvTranspose2d(512, 256, 2, stride=2)
        self.d3 = nn.Sequential(
            nn.Conv2d(512, 256, 3, padding=1), nn.ReLU(),
            nn.Conv2d(256, 256, 3, padding=1), nn.ReLU(),
        )
        self.up2 = nn.ConvTranspose2d(256, 128, 2, stride=2)
        self.d2 = nn.Sequential(
            nn.Conv2d(256, 128, 3, padding=1), nn.ReLU(),
            nn.Conv2d(128, 128, 3, padding=1), nn.ReLU(),
        )
        self.up1 = nn.ConvTranspose2d(128, 64, 2, stride=2)
        self.d1 = nn.Sequential(
            nn.Conv2d(128, 64, 3, padding=1), nn.ReLU(),
            nn.Conv2d(64, 64, 3, padding=1), nn.ReLU(),
        )
        self.out = nn.Conv2d(64, 1, 1)

    def forward(self, x):
        e1 = self.e1(x)
        e2 = self.e2(self.pool(e1))
        e3 = self.e3(self.pool(e2))
        bn = self.bn(self.pool(e3))

        d3 = self.d3(torch.cat([self.up3(bn), e3], dim=1))
        d2 = self.d2(torch.cat([self.up2(d3), e2], dim=1))
        d1 = self.d1(torch.cat([self.up1(d2), e1], dim=1))

        return torch.sigmoid(self.out(d1))


def _load_model():
    model = UNet()
    state_dict = torch.load(MODEL_PATH, map_location=DEVICE, weights_only=True)
    model.load_state_dict(state_dict)
    model.to(DEVICE)
    model.eval()
    return model


_model = None


def get_model():
    global _model
    if _model is None:
        _model = _load_model()
    return _model


def _classify(score: float):
    if score >= 0.45:
        return "Normal", "No Cirrhosis", round(score, 4)
    elif score >= 0.35:
        return "Cirrhosis Detected", "Stage 1 — Mild Fibrosis", round(1 - score, 4)
    elif score >= 0.25:
        return "Cirrhosis Detected", "Stage 2 — Significant Fibrosis", round(1 - score + 0.1, 4)
    elif score >= 0.15:
        return "Cirrhosis Detected", "Stage 3 — Advanced Fibrosis", round(1 - score + 0.15, 4)
    else:
        return "Cirrhosis Detected", "Stage 4 — Cirrhosis", round(1 - score + 0.2, 4)


def run_inference(image_path: str):
    img = Image.open(image_path).convert("L")
    img = img.resize((IMG_SIZE, IMG_SIZE))
    arr = np.array(img, dtype=np.float32) / 255.0
    tensor = torch.from_numpy(arr).unsqueeze(0).unsqueeze(0).to(DEVICE)

    model = get_model()
    with torch.no_grad():
        output = model(tensor)

    mask = output.squeeze().cpu().numpy()
    score = float(mask.mean())

    result, stage, confidence = _classify(score)
    confidence = min(max(confidence, 0.01), 0.99)

    return result, stage, confidence
