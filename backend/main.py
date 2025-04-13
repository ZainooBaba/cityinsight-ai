from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
from io import BytesIO

app = FastAPI()

# Enable CORS so frontend can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/summarize/")
async def summarize(file: UploadFile = File(...)):
    content = await file.read()

    if file.filename.endswith(".pdf"):
        try:
            reader = PdfReader(BytesIO(content))
            text = "\n".join(
                page.extract_text() or "" for page in reader.pages
            )
        except Exception as e:
            return {"error": f"Failed to read PDF: {str(e)}"}
    else:
        try:
            text = content.decode("utf-8")
        except UnicodeDecodeError:
            return {"error": "Unsupported file encoding. Use .txt or .pdf with text content."}

    # Mock response for now
    return {
        "summary": f"Summary of file: {file.filename[:20]}...",
        "topics": ["housing", "budget", "zoning"]
    }
