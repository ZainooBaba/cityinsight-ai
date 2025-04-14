# 🏙️ CityInsight AI

**CityInsight AI** helps local governments and civic analysts instantly summarize and tag city council meeting transcripts using LLMs. Upload a PDF, get a clear policy summary with flagged topics, departments, and detected city metadata — all in seconds.

---

## 🚀 Features

- ✅ **LLM-powered Summarization** — Upload city council PDFs or .txt files and get a 3–5 sentence summary
- 🏷️ **Automatic Topic Tagging** — Extract 3–5 key issues using a second LLM prompt (e.g. zoning, climate, budget)
- 🏛️ **Department + City Detection** — AI identifies which department and city the transcript refers to
- 🧑‍💼 **User Roles** — Admin vs User access, powered by Supabase Auth
- 🗂 **Submission History** — Users can view their past uploads with timestamps and summary previews
- 📊 **Admin Dashboard** — View all submissions across users with powerful metadata
- 🔒 **RLS Security** — Row-level security ensures users only see their own submissions
- 🌐 **Public Summary URLs** — Every summary has a shareable detail page

---

## 🧠 How It Works

1. User logs in via Supabase Auth
2. Uploads a `.pdf` or `.txt` transcript file
3. Backend extracts raw text and runs two LLM prompts:
   - 1️⃣ Summary prompt
   - 2️⃣ Metadata extraction prompt (city, department, topics)
4. All data is saved to Supabase
5. Users can view and revisit summaries, admins see global dashboard

---

## 🛠 Tech Stack

| Layer          | Tech                                           |
|----------------|------------------------------------------------|
| Frontend       | Next.js 14 (App Router), TailwindCSS, TypeScript |
| Backend        | FastAPI + Uvicorn                             |
| LLM Runtime    | [Ollama](https://ollama.com) running Mistral locally |
| Database       | Supabase (PostgreSQL)                         |
| Auth           | Supabase Auth                                 |
| Deployment     | Docker-ready (frontend + backend separately)  |

---

## 📁 Project Structure

```
cityinsight-ai/
│
├── frontend/             # Next.js frontend
│   └── app/              # App router structure
│   └── components/       # Shared UI (AuthProvider, Sidebar, CardList)
│
├── backend/              # FastAPI server
│   └── routes/           # /summarize endpoint and job status
│   └── utils/            # ollama, supabase, file parsing
│
├── docker/               # Optional Docker setup for Ollama + FastAPI
```

---

## 🧪 Local Development

### Backend

```bash
cd backend
uvicorn main:app --reload
```

Ensure Ollama is running and `mistral` is downloaded:

```bash
ollama run mistral
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📦 .env Setup

Create two `.env` files:

**`frontend/.env.local`**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

**`backend/.env`**

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
```

---

## 🧱 Database Schema (Supabase: `summaries` Table)

| Column               | Type      |
|----------------------|-----------|
| id                   | uuid      |
| user_id              | uuid      |
| file_name            | text      |
| summary              | text      |
| topics               | text[]    |
| city_detected        | text      |
| department_detected  | text      |
| created_at           | timestamp |

---

## 🌟 Demo Highlights

- Upload → Summary + Tags in under 5 seconds
- City + department auto-detection from content
- Admins can view full city-wide activity
- Public pages like `/summary/[id]` with shareable links

---

## 📬 Future Features

- AI-powered semantic search
- Compare summaries by city or department
- PDF download of summary reports
- Auto-ingest from Gmail or shared drive

---

## 👥 Created By

**Zain Siddiqui**  
CS + Data Science @ UW-Madison  
[LinkedIn](https://linkedin.com/in/zain-siddiqui-usa/)  
[GitHub](https://github.com/ZainooBaba)

---

## 🧠 Powered By

[![Supabase](https://img.shields.io/badge/Powered%20By-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)  
[![Ollama](https://img.shields.io/badge/LLM%20Runtime-Ollama-blue)](https://ollama.com)

