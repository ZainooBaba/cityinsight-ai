from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

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
    text = content.decode("utf-8")

    # Temporary mock response
    return {
        "summary": "This is a mock summary of the transcript.",
        "topics": ["housing", "budget", "zoning"]
    }
