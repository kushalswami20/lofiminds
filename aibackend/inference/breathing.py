import torch
from PIL import Image
from torchvision import transforms

model = torch.load('./models/breathing.pth', map_location='cpu')
model.eval()

labels = ['Normal', 'Irregular']  # adjust if needed

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

def predict(image_path):
    img = Image.open(image_path).convert("RGB")
    img = transform(img).unsqueeze(0)
    with torch.no_grad():
        output = model(img)
    return labels[torch.argmax(output, dim=1).item()]
