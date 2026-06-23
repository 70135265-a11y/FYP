# LiverAI - Technology Stack Documentation

## Project Overview
LiverAI is a web-based application for detecting and classifying liver cirrhosis stages using AI-powered MRI scan analysis. The system allows users to upload DICOM MRI scans, processes them through a trained neural network, and provides diagnostic reports.

---

## Frontend Technologies

### Core Framework
- **React** - JavaScript library for building user interfaces
- **React Router** - Client-side routing for navigation between pages

### Styling
- **TailwindCSS** - Utility-first CSS framework for rapid UI development

### Key Libraries
- **React Hooks** - useState, useRef, useEffect for state management
- **axios** (implied) - HTTP client for API requests

### Pages/Components
- Landing Page
- Login/Register Pages
- Dashboard
- Upload Scans Page
- Scans History Page
- Reports Page
- Sidebar Component
- ChatWidget Component (AI Assistant)

---

## Backend Technologies

### Core Framework
- **FastAPI** - Modern, fast web framework for building APIs with Python
- **Uvicorn** - ASGI server for running FastAPI applications

### Database & ORM
- **MySQL** - Relational database for storing user, patient, scan, and report data
- **SQLAlchemy** - Python SQL toolkit and ORM for database operations
- **PyMySQL** - MySQL driver for Python

### Authentication & Security
- **python-jose** - JWT (JSON Web Token) implementation for authentication
- **Passlib** - Password hashing library
- **bcrypt** - Password hashing algorithm
- **python-multipart** - Handling multipart form data (file uploads)

### File Processing
- **pydicom** - Reading and processing DICOM medical imaging files
- **Pillow (PIL)** - Image processing library for regular image formats

### AI & Machine Learning
- **PyTorch** - Deep learning framework for neural network inference
- **NumPy** - Numerical computing library for array operations
- **Custom UNet Model** - Trained U-Net architecture for liver cirrhosis detection
  - Model file: `unet_liver.pth` (30.8 MB)
  - Input: 256×256 grayscale images
  - Output: Segmentation mask with confidence score

### AI Chatbot
- **Google Generative AI (Gemini)** - AI assistant for medical queries
  - Model: gemini-1.5-flash
  - Used for explaining scan results, answering liver health questions, and drafting reports

### Utilities
- **python-dotenv** - Loading environment variables from .env file
- **email-validator** - Email address validation

---

## Database Schema

### Tables
1. **Users** - User authentication and profile information
2. **Patients** - Patient demographic information
3. **Scans** - Uploaded scan records with file paths and metadata
4. **Reports** - Diagnostic reports linked to scans

### Relationships
- One User can have multiple Patients
- One Patient can have multiple Scans
- One Scan has one Report

---

## API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - User registration

### Scans (`/api/scans`)
- `POST /upload` - Single image upload (legacy)
- `POST /upload-folder` - Batch folder upload with aggregation
- `GET /` - List all scans
- `GET /{scan_id}` - Get specific scan details

### Patients (`/api/patients`)
- `POST /` - Create patient record
- `GET /` - List patients
- `GET /{patient_id}` - Get patient details

### Reports (`/api/reports`)
- `POST /` - Generate report
- `GET /` - List reports
- `GET /{report_id}` - Get report details

### Chat (`/api/chat`)
- `POST /chat` - Send message to AI assistant

---

## Environment Variables

Required in `.env` file:
```
GEMINI_API_KEY=<your_gemini_api_key>
```

Database configuration is typically in `database.py`:
```
DATABASE_URL=mysql+pymysql://username:password@localhost/liverai_db
```

---

## AI Model Details

### Model Architecture
- **Type**: U-Net (Encoder-Decoder convolutional network)
- **Input**: 256×256 grayscale images
- **Output**: Segmentation mask (confidence score 0-1)

### Classification Thresholds
Based on mean mask score (0-100 scale):
- **≥45**: Normal (No Cirrhosis)
- **35-44**: Stage 1 — Mild Fibrosis
- **25-34**: Stage 2 — Significant Fibrosis
- **15-24**: Stage 3 — Advanced Fibrosis
- **<15**: Stage 4 — Cirrhosis

### Inference Pipeline
1. Load image (DICOM or regular format)
2. Convert to grayscale
3. Resize to 256×256
4. Normalize pixel values (0-1)
5. Pass through U-Net model
6. Calculate mean of output mask
7. Classify based on threshold
8. Return result, stage, and confidence

---

## File Structure

```
Liver-disease-/
├── Backend/
│   ├── ai_modal/
│   │   ├── predict.py          # Prediction logic
│   │   ├── inference.py        # Model architecture
│   │   └── unet_liver.pth      # Trained model weights
│   ├── routers/
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── scans.py            # Scan upload/retrieval
│   │   ├── patients.py         # Patient management
│   │   ├── reports.py          # Report generation
│   │   └── chat.py             # AI chatbot
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic schemas
│   ├── database.py             # Database connection
│   ├── main.py                 # FastAPI app entry point
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables
├── frontend/
│   ├── src/
│   │   ├── Pages/              # Page components
│   │   ├── Components/         # Reusable components
│   │   └── App.js              # React app entry
│   └── public/
│       └── logo.png            # Application logo
└── uploads/                    # Uploaded scan storage
```

---

## Development Setup

### Backend
```bash
cd Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

---

## Deployment Considerations

- **Database**: MySQL server required
- **AI Model**: GPU recommended for faster inference (CPU supported)
- **File Storage**: Ensure `uploads/` directory has write permissions
- **API Keys**: Gemini API key required for chatbot functionality
- **CORS**: Configure allowed origins in production

---

## License & Credits

This is a Final Year Project (FYP) for liver cirrhosis detection using AI.
