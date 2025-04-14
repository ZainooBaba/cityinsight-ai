import os
import uuid
import json
import httpx
import asyncio
import requests

from io import BytesIO
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Form
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader

SUPABASE_URL = "https://vjmjwkulzqdbjkkzzhxv.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqbWp3a3VsenFkYmpra3p6aHh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDU3Nzk0MywiZXhwIjoyMDYwMTUzOTQzfQ.6vSbQ8dX2_MadSN2CxsQOYUwrqDAc-ea9dUoPuAGNoo"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

summary_jobs = {}  # In-memory job tracker

def extract_text_from_file(file: UploadFile, content: bytes) -> str:
    if file.filename.endswith('.pdf'):
        reader = PdfReader(BytesIO(content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    elif file.filename.endswith('.txt'):
        return content.decode('utf-8')
    else:
        raise ValueError("Unsupported file type. Please upload a PDF or TXT file.")

async def summarize_with_ollama(text: str) -> dict:
    prompt = f"""
You are an assistant that summarizes city council meeting transcripts.

Summarize this transcript in 3-5 sentences. Also list 3-5 key topics or issues discussed.

Transcript:
{text[:4000]}
"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={"model": "mistral", "prompt": prompt, "stream": False},
                timeout=60
            )
            response.raise_for_status()
            result = response.json()
            return {"response": result.get("response", "").strip()}
    except Exception as e:
        return {"response": "", "error": str(e)}

def save_to_supabase(user_id: str, file_name: str, summary: str):
    url = f"{SUPABASE_URL}/rest/v1/summaries"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }

    topics = ["housing", "zoning", "budget"] if summary else []

    payload = {
        "user_id": user_id,
        "file_name": file_name,
        "summary": summary,
        "topics": topics
    }

    print("📤 Sending to Supabase:", json.dumps(payload, indent=2))

    try:
        response = requests.post(url, headers=headers, json=payload)
        print("📥 Supabase response:", response.status_code, response.text)
        response.raise_for_status()
    except Exception as e:
        print(f"❌ Failed to save to Supabase: {e}")

@app.post("/summarize/")
async def summarize(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user_id: str = Form(...),
    file_name: str = Form(...)
):
    content = await file.read()
    text = extract_text_from_file(file, content)

    job_id = str(uuid.uuid4())
    summary_jobs[job_id] = {"status": "processing", "summary": None}

    def process():
        result = asyncio.run(summarize_with_ollama(text))
        summary_text = result.get("response", "")
        error = result.get("error", None)

        summary_jobs[job_id] = {
            "status": "done",
            "summary": summary_text,
            "error": error
        }

        if summary_text:
            save_to_supabase(user_id, file_name, summary_text)

    background_tasks.add_task(process)
    return {"job_id": job_id}

@app.get("/status/{job_id}")
async def get_summary_status(job_id: str):
    return summary_jobs.get(job_id, {"status": "not_found"})
