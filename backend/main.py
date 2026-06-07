import io
import os
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import pdfplumber
from dotenv import load_dotenv
from prisma import Prisma, Json

# Load environment variables from the shared frontend config
load_dotenv(dotenv_path="../frontend/.env")

# Initialize Prisma Client
db = Prisma()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Try to connect to PostgreSQL via Prisma on startup
    try:
        await db.connect()
        print("INFO: Successfully connected to PostgreSQL via Prisma Client.")
    except Exception as e:
        print(f"WARNING: Database connection failed during startup: {str(e)}")
        print("FastAPI server starting without active database connection.")
    yield
    # Disconnect on shutdown
    if db.is_connected():
        await db.disconnect()

app = FastAPI(
    title="Automated Document Extraction API",
    description="Python backend to handle PDF ingestion, OCR processing, and API endpoints for extraction logic.",
    version="0.1.0",
    lifespan=lifespan
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

# Support Vercel routing prefixes dynamically
root_path = "/_/backend" if os.getenv("VERCEL") else ""
app.router.route_class = app.router.route_class  # No-op to verify routing

# Response schema for upload endpoint
class UploadResponse(BaseModel):
    message: str
    filename: str
    status: str
    file_size: int
    extracted_data: Optional[Dict[str, Any]] = None
    document_id: Optional[str] = None

def extract_pdf_text(file_bytes: bytes) -> str:
    """
    Parses and extracts raw text from PDF binary data using pdfplumber.
    """
    extracted_text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    extracted_text += page_text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to parse PDF content: {str(e)}")
    return extracted_text

def extract_clauses_with_ai(raw_text: str) -> Dict[str, Any]:
    """
    Simulates sending extracted PDF raw text to an LLM for structured clause extraction.
    Returns a mock JSON payload of key terms.
    """
    # In a production app, this would involve prompt engineering and calling Gemini/OpenAI
    return {
        "party_names": "Alpha Boutique Law Firm & Omega Real Estate Group",
        "termination_clause": "This Agreement may be terminated by either party upon thirty (30) days prior written notice.",
        "total_liability": "$150,000 USD",
        "effective_date": "2026-06-01",
        "governing_law": "State of New York",
        "raw_text_char_count": len(raw_text)
    }

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
    Receives PDF document uploads via multipart/form-data.
    Extracts raw text, simulates LLM extraction, and saves metadata into PostgreSQL.
    """
    # 1. Validate file format
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF files are supported."
        )

    # Ensure database connection is active or try to connect
    if not db.is_connected():
        try:
            await db.connect()
        except Exception as conn_err:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Database connection is offline. Please configure your DATABASE_URL correctly. Details: {str(conn_err)}"
            )

    try:
        # Read the uploaded file binary data
        file_bytes = await file.read()
        file_size = len(file_bytes)

        # 2. Extract raw text from the PDF
        raw_text = extract_pdf_text(file_bytes)

        # 3. Process extraction using simulated AI clauses function
        extracted_data = extract_clauses_with_ai(raw_text)

        # Write file to frontend public directory so it can be viewed in iframe
        public_upload_dir = os.path.abspath("../frontend/public/uploads")
        os.makedirs(public_upload_dir, exist_ok=True)
        file_path = os.path.join(public_upload_dir, file.filename)
        with open(file_path, "wb") as f:
            f.write(file_bytes)

        # 4. Database Sync: Ensure default organization is available for the multi-tenant schema
        org = await db.organization.find_first()
        if not org:
            org = await db.organization.create(
                data={
                    "name": "Default Legal & Real Estate Firm"
                }
            )

        # 5. Create Document record in PostgreSQL
        document = await db.document.create(
            data={
                "fileName": file.filename,
                "fileKey": f"/uploads/{file.filename}",  # Serve directly from Next.js public/uploads
                "fileSize": file_size,
                "status": "COMPLETED",
                "extractedData": Json(extracted_data),
                "organizationId": org.id
            }
        )

        return UploadResponse(
            message="Document uploaded, text parsed, and clauses extracted successfully.",
            filename=file.filename,
            status=document.status,
            file_size=file_size,
            extracted_data=extracted_data,
            document_id=document.id
        )

    except Exception as e:
        # Log and return errors gracefully
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during PDF processing or DB write: {str(e)}"
        )
