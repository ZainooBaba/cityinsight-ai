from PyPDF2 import PdfReader
from fastapi import UploadFile
from io import BytesIO

def extract_text_from_file(file: UploadFile, content: bytes) -> str:
    if file.filename.endswith('.pdf'):
        reader = PdfReader(BytesIO(content))
        return "\n".join(page.extract_text() for page in reader.pages)
    elif file.filename.endswith('.txt'):
        return content.decode('utf-8')
    raise ValueError("Unsupported file type. Please upload a PDF or TXT file.")
