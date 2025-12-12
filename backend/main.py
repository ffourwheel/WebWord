import os
import json
import time
import datetime
import logging
import httpx
from datetime import date, timedelta
from tenacity import retry, stop_after_attempt, wait_fixed, retry_if_exception_type
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from contextlib import asynccontextmanager
from typing import List, Optional

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("worddee-backend")

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "webwords_db")
DB_USER = os.getenv("DB_USER", "root")
DB_PASS = os.getenv("DB_PASS", "root")
DB_PORT = os.getenv("DB_PORT", "3306")

N8N_BASE_URL = os.getenv("N8N_URL", "http://n8n:5678/webhook")
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class History(Base):
    __tablename__ = "history"
    id = Column(Integer, primary_key=True, index=True)
    word = Column(String(255))
    sentence = Column(Text)
    score = Column(Float)
    level = Column(String(50))
    suggestion = Column(Text)
    corrected_sentence = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
class SummaryResponse(BaseModel):
    dates: List[str]
    scores: List[float]
    current_streak: int
    total_minutes: int

class SentenceInput(BaseModel):
    word: str
    sentence: str

http_client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global http_client
    http_client = httpx.AsyncClient(
        timeout=30.0, 
        limits=httpx.Limits(max_keepalive_connections=5, max_connections=10)
    )

    for i in range(10):
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("MySQL connected and tables created!")
            break
        except Exception as e:
            logger.warning(f"MySQL not ready Waiting ({i+1}/10). Error: {e}")
            time.sleep(2)
    
    yield

    await http_client.aclose()
    logger.info("HTTP Client closed.")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@retry(
    stop=stop_after_attempt(3),
    wait=wait_fixed(2),
    retry=retry_if_exception_type(httpx.RequestError),
    reraise=True
)
async def call_n8n(webhook_path: str, payload: dict = None):
    url = f"{N8N_BASE_URL}/{webhook_path}"
    try:
        logger.info(f"Sending request to n8n: {url}")
        response = await http_client.post(url, json=payload or {})
        response.raise_for_status()
        return response.json()
    except httpx.HTTPStatusError as e:
        logger.error(f"n8n Server Error: {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail="AI Service Error")
    except httpx.RequestError as e:
        logger.error(f"n8n Connection Failed: {e}")
        raise e

@app.get("/api/word")
async def get_word():
    try:
        result = await call_n8n("generate-word")
        if 'image' not in result or not result['image']:
             result['image'] = f"https://via.placeholder.com/400?text={result.get('word', 'WORD')}"
             
        return result
    except Exception as e:
        logger.error(f"Critical Failure: {e}")
        return {
            "word": "System Offline",
            "pronunciation": "sys-tem off-line",
            "type": "Error",
            "meaning": "Unable to connect to AI service.",
            "example": "Please check n8n container.",
            "image": "https://via.placeholder.com/400?text=ERROR"
        }

@app.post("/api/validate")
async def validate_sentence(data: SentenceInput, db: Session = Depends(get_db)):
    try:
        payload = {"word": data.word, "sentence": data.sentence}
        result = await call_n8n("validate-sentence", payload)

        new_record = History(
            word=data.word, 
            sentence=data.sentence, 
            score=float(result.get('score', 0)),
            level=result.get('level', 'Unknown'), 
            suggestion=result.get('suggestion', ''),
            corrected_sentence=result.get('corrected_sentence', '')
        )
        db.add(new_record)
        db.commit()
        
        return result
        
    except Exception as e:
        logger.error(f"Validation Failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/summary", response_model=SummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    history = db.query(History).order_by(History.created_at.desc()).limit(10).all()
    history_list = list(reversed(history)) 

    total_records = db.query(History).count()
    total_minutes = total_records * 2

    all_dates_query = db.query(History.created_at).order_by(History.created_at.desc()).all()

    unique_dates = sorted(list(set([d[0].date() for d in all_dates_query])), reverse=True)
    
    current_streak = 0
    today = date.today()
    
    if unique_dates:
        if unique_dates[0] == today or unique_dates[0] == today - timedelta(days=1):
            current_streak = 1
            for i in range(len(unique_dates) - 1):
                if unique_dates[i] - unique_dates[i+1] == timedelta(days=1):
                    current_streak += 1
                else:
                    break
        else:
            current_streak = 0 

    return {
        "dates": [r.created_at.strftime("%H:%M") for r in history_list],
        "scores": [r.score for r in history_list],
        "current_streak": current_streak,
        "total_minutes": total_minutes
    }