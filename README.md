# Automated Document Extraction - Micro SaaS

A full-stack Micro SaaS application for boutique legal and real estate firms to ingest messy PDFs, extract key clauses using OCR, and verify details on a split-screen dashboard.

## Project Structure

This workspace is organized as a monorepo containing:
*   **`frontend/`**: Next.js App Router (React, Tailwind CSS, shadcn/ui, Prisma ORM).
*   **`backend/`**: Python FastAPI backend (Handles PDF ingestion, OCR processing, and endpoints).

```
.
├── backend/
│   ├── main.py                # FastAPI entry point
│   ├── requirements.txt       # Python dependencies
│   └── venv/                  # Python virtual environment (gitignored)
├── frontend/
│   ├── prisma/
│   │   └── schema.prisma      # Prisma schema (User, Organization, Document)
│   ├── src/                   # Next.js App Router source
│   ├── package.json           # Node.js dependencies
│   └── tsconfig.json          # TypeScript config
└── README.md                  # This file
```

---

## Backend Setup

1. Navigate to the backend directory (done from project root):
   ```bash
   cd backend
   ```
2. Activate virtual environment:
   ```bash
   source venv/bin/activate
   ```
3. Run the development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

---

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Set up database credentials in your local environment `.env` file.
3. Validate and sync the Prisma schema:
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.
