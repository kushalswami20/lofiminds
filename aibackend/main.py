from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import torch
import torch.nn as nn
from torchvision import transforms, models
import cv2
import numpy as np
from tensorflow.keras.models import load_model
import threading
import os

# -------------------- App Setup --------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Model Definitions --------------------

class FacialExpressionResNet(nn.Module):
    def __init__(self, num_classes=7):
        super(FacialExpressionResNet, self).__init__()
        self.resnet = models.resnet18(weights=None)
        self.resnet.fc = nn.Linear(self.resnet.fc.in_features, num_classes)

    def forward(self, x):
        return self.resnet(x)

class EmotionCNN(nn.Module):
    def __init__(self):
        super(EmotionCNN, self).__init__()
        self.cnn = nn.Sequential(
            self.conv_block(1, 32),
            nn.Dropout(0.15),
            self.conv_block(32, 64),
            nn.Dropout(0.20),
            self.conv_block(64, 128),
            nn.Dropout(0.25),
            self.conv_block(128, 256),
            nn.Dropout(0.30),
        )
        self.fc = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Linear(256, 256),
            nn.ReLU(inplace=True),
            nn.Dropout(0.4),
            nn.Linear(256, 7)
        )

    def conv_block(self, in_ch, out_ch):
        return nn.Sequential(
            nn.Conv2d(in_ch, out_ch, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_ch, out_ch, kernel_size=3, padding=1, bias=False),
            nn.BatchNorm2d(out_ch),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2)
        )

    def forward(self, x):
        x = self.cnn(x)
        return self.fc(x)

# -------------------- Load Models --------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# Load PyTorch ResNet (facial expression)
face_model = FacialExpressionResNet()
face_model.load_state_dict(torch.load(os.path.join(MODEL_DIR, "facial_expression_resnet.pth"), map_location='cpu'))
face_model.eval()

# Load PyTorch emotion CNN
model2 = EmotionCNN()
model2.load_state_dict(torch.load(os.path.join(MODEL_DIR, "emotion_cnn2.pth"), map_location='cpu'))
model2.eval()

# Load TensorFlow meditation model
model3 = load_model(os.path.join(MODEL_DIR, "demo_meditation_cnn.h5"))

# -------------------- Preprocessing --------------------

# RGB transform for ResNet
transform_rgb = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

# Grayscale transform for EmotionCNN
transform_gray = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Grayscale(num_output_channels=1),  # ❗ Fix input channels here
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# TensorFlow model input
def preprocess_for_model3(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)  # convert to grayscale
    resized = cv2.resize(gray, (64, 64))
    reshaped = resized.reshape(1, 64, 64, 1)  # reshape to match input shape
    return reshaped / 255.0  # normalize to [0,1]


# -------------------- Global --------------------
current_score = 0.0

# -------------------- Scoring Logic --------------------
def calculate_score(frame):
    try:
        tensor_rgb = transform_rgb(frame).unsqueeze(0)
        tensor_gray = transform_gray(frame).unsqueeze(0)

        # Model 1 - facial expression
        face_out = face_model(tensor_rgb)
        face_score = torch.softmax(face_out, dim=1)[0][0].item()

        # Model 2 - emotion CNN
        m2_out = model2(tensor_gray)
        m2_score = torch.sigmoid(m2_out)[0].max().item()  # ✅ FIXED

        # Model 3 - meditation CNN
        m3_score = model3.predict(preprocess_for_model3(frame), verbose=0)[0][0]

        final_score = 0.6 * face_score + 0.2 * m2_score + 0.2 * m3_score
        return round(final_score, 2)
    except Exception as e:
        print("Error in calculate_score:", e)
        return 0.0

# -------------------- Webcam Thread --------------------
def video_loop():
    global current_score
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Camera couldn't be initialized.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        current_score = calculate_score(rgb_frame)

threading.Thread(target=video_loop, daemon=True).start()

# -------------------- API Endpoint --------------------
@app.get("/score")
def get_score():
    return {"score": current_score}

# -------------------- Server --------------------
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
