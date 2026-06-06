import os
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

app = FastAPI(
    title="Automated Document Extraction API",
    description="Python backend to handle PDF ingestion, OCR processing, and API endpoints for extraction logic.",
    version="0.1.0"
)

# Configure CORS to accept requests from Next.js frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Response schema for upload endpoint
class UploadResponse(BaseModel):
    message: str
    filename: str
    status: str
    file_size: int

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify the backend server is running.
    """
    return {
        "status": "healthy",
        "service": "document-extraction-backend",
        "version": "0.1.0"
    }

@app.post("/upload", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(file: UploadFile = File(...)):
    """
    Placeholder endpoint for PDF document upload.
    Validates file format and returns upload metadata.
    OCR and processing pipeline will be integrated in subsequent steps.
    """
    # Validate file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF files are supported."
        )

    # Read file size
    try:
        file.file.seek(0, os.SEEK_END)
        file_size = file.file.tell()
        file.file.seek(0)  # Reset file pointer
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read file size: {str(e)}"
        )

    # Note: File storage and extraction logic will be implemented in future action steps.

    return UploadResponse(
        message="Document uploaded successfully. Ready for OCR processing.",
        filename=file.filename,
        status="PENDING",
        file_size=file_size
    )
