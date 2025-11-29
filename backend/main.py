import os
import json
import time
import datetime
import google.generativeai as genai
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import sessionmaker, Session, declarative_base

DB_HOST = os.getenv("DB_HOST", "postgres_db")
DB_NAME = os.getenv("DB_NAME", "webwords_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "112233")
DB_PORT = os.getenv("DB_PORT", "5432")
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")

if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)
else:
    print("GEMINI_API_KEY is missing!")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class History(Base):
    __tablename__ = "history"
    id = Column(Integer, primary_key=True, index=True)
    word = Column(String)
    sentence = Column(String)
    score = Column(Float)
    level = Column(String)
    suggestion = Column(String)
    corrected_sentence = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SentenceInput(BaseModel):
    word: str
    sentence: str

while True:
    try:
        Base.metadata.create_all(bind=engine)
        print("PostgreSQL connected and tables created successfully!")
        break
    except Exception as e:
        print(f"PostgreSQL not ready yet... Waiting. ({e})")
        time.sleep(2)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def clean_json_string(json_str: str) -> str:
    if "```json" in json_str:
        json_str = json_str.split("```json")[1].split("```")[0]
    elif "```" in json_str:
        json_str = json_str.split("```")[1].split("```")[0]
    return json_str.strip()

@app.get("/api/word")
def get_word():
    if not GENAI_API_KEY:
        raise HTTPException(status_code=500, detail="Server missing API Key")
    try:
        model = genai.GenerativeModel('gemini-2.5-flash') 
        prompt = """
        You are an English vocabulary generator. Select one interesting, intermediate-level Noun.
        Provide the word, its pronunciation (phonetic spelling in easy English), definition, and an example sentence.
        
        Return ONLY a JSON object in the following format (for the image field, use a descriptive keyword like 'sunset' or 'library'): 
        { "word": "...", "pronunciation": "...", "type": "Noun", "meaning": "...", "example": "...", "image": "descriptive_keyword" }
        """
        response = model.generate_content(prompt)
        result = json.loads(clean_json_string(response.text))

        keyword = result.get('image', 'default').replace(' ', '_')
        result['image'] = f"https://via.placeholder.com/400?text={keyword.upper()}"
        
        return result

    except Exception as e:
        print(f"AI Word Gen Error: {e}")
        return {
            "word": "Resilience", "pronunciation": "ri-zil-yuhns", "type": "Noun",
            "meaning": "The capacity to recover quickly from difficulties.",
            "example": "His resilience helped him overcome the failure.",
            "image": "https://via.placeholder.com/400?text=RESILIENCE"
        }

@app.post("/api/validate")
def validate_sentence(data: SentenceInput, db: Session = Depends(get_db)):
    if not GENAI_API_KEY:
        raise HTTPException(status_code=500, detail="Server missing API Key")

    try:
        model = genai.GenerativeModel('gemini-2.5-flash') 
        prompt = f"""
        Act as an English teacher. Target: "{data.word}". Sentence: "{data.sentence}".
        Return ONLY JSON: {{ "score": (0-10, use .5 if needed), "level": ("Beginner"/"Intermediate"/"Advanced"), "suggestion": "...", "corrected_sentence": "..." }}
        """
        response = model.generate_content(prompt)
        
        try:
            result = json.loads(clean_json_string(response.text))
        except:
            result = {"score": 5, "level": "Intermediate", "suggestion": "AI format error.", "corrected_sentence": data.sentence}

        new_record = History(
            word=data.word, sentence=data.sentence, score=float(result.get('score', 0)),
            level=result.get('level', 'Unknown'), suggestion=result.get('suggestion', ''),
            corrected_sentence=result.get('corrected_sentence', '')
        )
        db.add(new_record)
        db.commit()
        return result

    except Exception as e:
        print(f"AI Error: {e}")
        raise HTTPException(status_code=500, detail=f"Model Error: {str(e)}")

@app.get("/api/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    history = db.query(History).order_by(History.created_at.desc()).limit(10).all()
    history_list = list(reversed(history)) 
    return {
        "dates": [r.created_at.strftime("%H:%M") for r in history_list],
        "scores": [r.score for r in history_list]
    }