# Event Discovery Agent

## Overview
An AI-powered event recommendation system that uses LLM reasoning and semantic similarity to suggest personalized events.

---

## 🚀 Features

- Learns from user preferences and feedback
- Recommends events based on:
  - Past attendance
  - Stated interests
  - Feedback (interested / not interested / attended)
- Uses semantic similarity (embeddings)
- Generates explanations using LLM (Gemini)
- Interactive demo UI (Streamlit)


## Problem
Current platforms:
- Use static filters
- Lack personalization
- Require repeated manual searches

## Solution
LLM-powered agent that:
- Understands natural language preferences
- Tracks user behavior
- Generates personalized recommendations

---

## ⚙️ Setup

### 1. Clone repo & install dependencies

## Run
```
$ python -m venv venv
(e.g.windows) 
$ source venv/Scripts/activate 

$ pip install -r requirements.txt
$ python backend/app.py
```

### 2. Add environment variables
Create .env
- GOOGLE_API_KEY=your_api_key_here

### 3. Run backend
From root directory
```
$ uvicorn backend.app:app --reload
```
http://127.0.0.1:8000

Debug with Swagger Docs:
- http://127.0.0.1:8000/docs


▶️ Test Event Recommendations
Example input:
```
{
  "session_id": "user1",
  "text": "I like small indie concerts"
}
```

Example output:
```
{
  "recommendations": [...],
  "explanation": "..."
}
```

🔁 Test Feedback System
Example input:
```
{
  "session_id": "user1",
  "event_text": "indie rock",
  "feedback": "attended"
}
```
Run /events/recommend again
Results should adapt to preferences

### 4. Test Demo UI (Streamlit)
Have backend running on second terminal. 
$ streamlit run tests/demo.py

1. Enter session ID (e.g. "demo-user")
2. Enter Query
  - "I like indie concrets in small venues"
3. View Results
  - Event recommendations
  - AI-generated explanation
4. Test Learning
  1. Copy an event description
  2. Scroll to Feedback section
  3. Choose:
    - interested
    - not_interested
    - attended
  4. Submit

### 5. Run React Frontend
The project now includes a React + TypeScript frontend in `frontend/`.

From the repo root:
```bash
cd frontend
npm install
npm run dev
```

Frontend URL:
- http://127.0.0.1:5173

Backend URL expected by default:
- http://127.0.0.1:8000

Optional:
- Set `VITE_API_BASE_URL` in `frontend/.env` if your backend runs elsewhere.
