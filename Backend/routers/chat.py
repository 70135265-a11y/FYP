import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from routers.auth import get_current_user
from models import User
import google.generativeai as genai

router = APIRouter()

def get_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key not configured. Please set GEMINI_API_KEY environment variable."
        )
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-1.5-flash")

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
        model = get_client()
        conversation = SYSTEM_PROMPT + "\n\n"
        for msg in request.messages:
            if msg.role == "user":
                conversation += f"User: {msg.content}\n"
            else:
                conversation += f"Assistant: {msg.content}\n"
        conversation += "Assistant:"

        response = model.generate_content(
            conversation,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=500,
                temperature=0.7,
            ),
        )

        assistant_message = response.text

        return ChatResponse(message=assistant_message)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
