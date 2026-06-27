import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from routers.auth import get_current_user
from models import User
import google.genai as genai
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

def get_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key not configured. Please set GEMINI_API_KEY environment variable."
        )
    client = genai.Client(api_key=api_key)
    return client

SYSTEM_PROMPT = """You are a helpful medical AI assistant for a liver cirrhosis detection application. Your role is to:

1. Explain scan results to patients in simple, easy-to-understand language
2. Answer general questions about liver disease, cirrhosis, and liver health
3. Help doctors draft medical reports based on scan results
4. Provide information about cirrhosis stages (Normal, Mild, Moderate, Severe)
5. Explain confidence scores and what they mean
6. Give general health advice related to liver health

Important guidelines:
- Always clarify that you are an AI assistant and not a substitute for professional medical advice
- For serious concerns, always recommend consulting a healthcare professional
- Be empathetic and supportive in your responses
- Keep explanations simple for patients, but you can be more technical with doctors
- If you're unsure about something, say so and suggest consulting a specialist
- Never make specific diagnoses beyond what the scan results indicate
- Protect patient privacy and don't ask for personal health information

The application uses AI to analyze MRI scans and classify them into:
- Normal (no signs of cirrhosis)
- Mild Cirrhosis
- Moderate Cirrhosis
- Severe Cirrhosis

Confidence scores range from 0-100% and indicate how certain the AI is about its prediction."""


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


class ChatResponse(BaseModel):
    message: str


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        logger.info(f"Chat request from user {current_user.id}")
        client = get_client()
        
        # Build conversation history
        messages = [{"role": "model", "parts": [{"text": SYSTEM_PROMPT}]}]
        for msg in request.messages:
            if msg.role == "user":
                messages.append({"role": "user", "parts": [{"text": msg.content}]})
            else:
                messages.append({"role": "model", "parts": [{"text": msg.content}]})

        logger.info("Calling Gemini API...")
        response = client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=messages,
        )

        assistant_message = response.text
        logger.info("Gemini API response received")

        return ChatResponse(message=assistant_message)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
