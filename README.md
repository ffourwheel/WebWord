# ✍️ Worddee.ai: AI-Powered English Sentence Practice

Worddee.ai คือเว็บแอปพลิเคชันที่ออกแบบมาเพื่อช่วยพัฒนาทักษะการเขียนประโยคภาษาอังกฤษ โดยใช้ Generative AI (Gemini) ในการสุ่มคำศัพท์ ให้คะแนนความถูกต้อง และให้คำแนะนำในการปรับปรุงประโยคแบบ Real-time

---

## ✨ Main Features

* **AI Sentence Scoring:** ใช้ Gemini 2.5 Flash ในการตรวจสอบไวยากรณ์ ความหมาย และการใช้คำศัพท์ที่ถูกต้อง พร้อมให้คะแนน 0-10
* **AI-Driven Word Generation:** สุ่มคำนามใหม่ๆ (Nouns) จาก AI ทุกครั้งที่กด Skip/Load เพื่อให้เกิดความหลากหลายของบทเรียน
* **Learning Dashboard:** บันทึกประวัติการเล่น คะแนน และระดับของผู้ใช้ลงใน PostgreSQL เพื่อแสดงผลในหน้า Dashboard
* **Modern Full-Stack:** พัฒนาด้วย Next.js (Frontend) และ FastAPI (Backend) ทั้งหมดถูกจัดวางใน Docker Containers

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js** | React Framework, TypeScript, Tailwind CSS (Styling) |
| **Backend** | **FastAPI** | Python Web Framework (High Performance) |
| **AI/NLP** | **Gemini 2.5 Flash** | Google's Generative AI for scoring and word generation |
| **Database** | **PostgreSQL** | SQL Database for storing user history and progress |
| **Orchestration** | **Docker Compose** | จัดการ 3 services (Frontend, Backend, DB) ให้รันพร้อมกัน |

---

## 🚀 Getting Started

### Prerequisites

1.  **Git:** สำหรับโคลนโปรเจกต์
2.  **Docker & Docker Compose:** ติดตั้งและเปิดใช้งาน (สำคัญมาก)
3.  **Gemini API Key:** ขอคีย์ฟรีจาก [Google AI Studio](https://aistudio.google.com/app/apikey)

### Setup & Run

1.  **Clone Project:**
    ```bash
    git clone [Your Repository URL]
    cd worddee-project 
    ```

2.  **API Key Configuration:**
    เปิดไฟล์ **`docker-compose.yml`** และแทนที่ `YOUR_GEMINI_API_KEY_HERE` ด้วยรหัสจริงของคุณในส่วนของ `backend` environment:
    ```yaml
        # ... ใน docker-compose.yml
        environment:
          - GEMINI_API_KEY=AIzaSyD_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx 
          # ...
    ```

3.  **Build and Start Services:**
    รันคำสั่งเดียวเพื่อสร้าง Image และรัน Frontend, Backend, และ Database ทั้งหมด (คำสั่งนี้จะสร้าง PostgreSQL Database และเติมคำศัพท์ชุดแรกให้โดยอัตโนมัติ)
    ```bash
    docker-compose up --build
    ```

4.  **Access the Application:**
    เมื่อทุกอย่างรันเสร็จ (Backend ขึ้นว่า `Application startup complete` และ DB ขึ้นว่า `PostgreSQL connected`), เปิด Browser แล้วเข้าลิงก์:
    ```
    🌐 Frontend (App): http://localhost:3000
    ⚙️ Backend (API Docs): http://localhost:8000/docs
    ```
---

## 🛑 Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Error 500 / AI Error** | API Key ผิด, หรือโควตาหมด | ตรวจสอบ `GEMINI_API_KEY` และรอ 30 วินาทีก่อนลองใหม่ |
| **Connection Refused** | Database ตื่นไม่ทัน Backend | รัน `docker-compose restart backend` หรือรอให้ Health Check ผ่าน |
| **Frontend Module Not Found** | Cache เสีย | รัน `docker-compose down -v` แล้วรัน `up --build` ใหม่ทั้งหมด |
| **No Word Randomization** | (Fix Applied: DB Random) | ตรวจสอบ Logs ว่า "10 words seeded successfully." หรือยัง |

***

## 🗑️ II. .gitignore (ไฟล์ที่ต้องซ่อน)

ก๊อปปี้โค้ดนี้ไปวางในไฟล์ **`.gitignore`** ที่ Root Directory (โฟลเดอร์นอกสุด) ครับ

```gitignore
# ------------------------------------
# 1. NEXT.JS / NODE.JS (FRONTEND)
# ------------------------------------
/frontend/node_modules
/frontend/.next
/frontend/out
/frontend/build
/frontend/npm-debug.log
/frontend/package-lock.json # อาจถูกสร้างใหม่ใน Container
/frontend/.env.local
/frontend/.vercel

# ------------------------------------
# 2. PYTHON / FASTAPI (BACKEND)
# ------------------------------------
/backend/__pycache__
/backend/.venv
/backend/venv
/backend/*.pyc
/backend/*.log
/backend/.pytest_cache

# ------------------------------------
# 3. DOCKER / DATABASE VOLUMES
# ------------------------------------
# PostgreSQL data volume (Docker handles this, but exclude if local)
/postgres_data
# Local SQLite file (if used for development fallback)
/backend/worddee.db 

# ------------------------------------
# 4. IDE and System Files
# ------------------------------------
.DS_Store
.vscode/ # Visual Studio Code settings