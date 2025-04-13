# backend/main.py
from fastapi import FastAPI, UploadFile, File
import openai

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.post("/summarize/")
async def summarize_transcript(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("utf-8")

    # Mocked summary for now
    return {
        "summary": "This is a summary of the transcript.",
        "topics": ["budget", "transportation", "housing"]
    }
