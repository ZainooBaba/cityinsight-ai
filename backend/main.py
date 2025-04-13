import httpx
import json
import uuid
import asyncio
from io import BytesIO
from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader

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


@app.post("/summarize/")
async def summarize(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    content = await file.read()
    text = extract_text_from_file(file, content)

    job_id = str(uuid.uuid4())
    summary_jobs[job_id] = {"status": "processing", "summary": None}

    def process():
        result = asyncio.run(summarize_with_ollama(text))
        summary_jobs[job_id] = {
            "status": "done",
            "summary": result.get("response", ""),
            "error": result.get("error", None)
        }

    background_tasks.add_task(process)
    return {"job_id": job_id}


@app.get("/status/{job_id}")
async def get_summary_status(job_id: str):
    return summary_jobs.get(job_id, {"status": "not_found"})
