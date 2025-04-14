from fastapi import APIRouter, UploadFile, File, BackgroundTasks, Form
from utils.ollama import summarize_with_ollama, extract_metadata_with_ollama
from utils.extract import extract_text_from_file
from utils.ollama import summarize_with_ollama
from utils.supabase import save_to_supabase
from jobs.memory import create_job, update_job, get_job_status

import uuid
import asyncio

router = APIRouter()

@router.post("/summarize/")
async def summarize(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user_id: str = Form(...),
    file_name: str = Form(...)
):
    content = await file.read()
    text = extract_text_from_file(file, content)
    print("⚙️ Running background summarization...")

    job_id = str(uuid.uuid4())
    create_job(job_id)
    print("⚙️ Running background summarization...")

    def process():
        print("⚙️ Running background summarization...")
        result = asyncio.run(summarize_with_ollama(text))
        summary = result.get("response", "")
        error = result.get("error", None)
        update_job(job_id, summary, error)
        print("📄 Summary:", summary[:100])
        print("❌ Error (if any):", error)

        if summary:
            metadata = asyncio.run(extract_metadata_with_ollama(summary))
            print("🏷️ Extracted metadata:", metadata)
            save_to_supabase(
                user_id=user_id,
                file_name=file_name,
                summary=summary,
                topics=metadata.get("topics", []),
                city=metadata.get("city"),
                department=metadata.get("department")
            )

    background_tasks.add_task(process)
    return {"job_id": job_id}

@router.get("/status/{job_id}")
async def get_status(job_id: str):
    return get_job_status(job_id)
