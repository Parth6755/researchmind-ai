from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pipeline import run_research

app=FastAPI(
    title="researchMind AI API",
    description="AI-powered reasearch assistant",
    version="1.0.0",
)

@app.get("/")
def home():
    return{
        "app": "ResearchMind AI",
        "status": "online",
    }

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://researchmind-ai-frontend-xvfe.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic:str =Field(...,main_length=3,description="Research topic")

@app.post("/api/research")
def reasearch(request:ResearchRequest):
    topic=request.topic.strip()

    result=run_research(topic)

    return result     