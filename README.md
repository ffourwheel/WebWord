# ✍️ Worddee.ai: AI-Powered English Vocabulary Coach

**Worddee.ai** คือเว็บแอปพลิเคชันฝึกภาษาอังกฤษที่ช่วยให้ผู้เรียนฝึกแต่งประโยคจากคำศัพท์ประจำวัน (Word of the Day) โดยมี AI คอยตรวจไวยากรณ์ ให้คะแนน และแนะนำประโยคที่สละสลวยกว่า พร้อมระบบ Dashboard ติดตามพัฒนาการของผู้เรียนแบบ Real-time

---

## 📸 App Screenshots

| Word of the Day Challenge | Learner Dashboard |
|:---:|:---:|
| ![Word Challenge](https://via.placeholder.com/400x300?text=Challenge+Mode) | ![Dashboard](https://via.placeholder.com/400x300?text=Dashboard+Progress) |
| *หน้าสุ่มคำศัพท์และแต่งประโยค* | *หน้าสรุปผลการเรียนและกราฟพัฒนาการ* |

---

## ✨ Key Features (ฟีเจอร์หลัก)

* **🎯 Word of the Day Challenge:** สุ่มคำศัพท์ภาษาอังกฤษแบ่งตามระดับ (Beginner, Intermediate, Advanced) พร้อมคำอ่าน ความหมาย และรูปภาพประกอบ
* **🤖 AI Feedback & Scoring:** ตรวจประโยคด้วย AI (ผ่าน n8n Workflow) ให้คะแนนความถูกต้อง (0-10), ระบุระดับ CEFR และแก้ไขประโยคให้ดีขึ้น
* **📊 Smart Dashboard:**
    * **Progress Chart:** กราฟแสดงแนวโน้มคะแนนย้อนหลัง (Recharts)
    * **Learning Stats:** ระบบนับ Streak (จำนวนวันต่อเนื่อง) และ Total Minutes (เวลาเรียนรวม)
* **💾 Persistent Data:** บันทึกประวัติการเรียนและสถิติทั้งหมดลงใน PostgreSQL

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14** | React Framework, TypeScript, Tailwind CSS |
| **Visualization**| **Recharts** | Library สำหรับวาดกราฟ Dashboard |
| **Backend** | **FastAPI** | Python Web Framework (High Performance Async) |
| **AI Workflow** | **n8n** | Workflow Automation เชื่อมต่อกับ LLM (Gemini/OpenAI) |
| **Database** | **PostgreSQL** | ฐานข้อมูลหลักสำหรับเก็บ History และ User Stats |
| **Infra** | **Docker** | Containerization สำหรับรันทุก Service พร้อมกัน |

---

## 📂 Project Structure

โครงสร้างไฟล์ของโปรเจกต์เป็นแบบ Monorepo:

```text
worddee-project/
├── 📂 backend/            # FastAPI Application
│   ├── main.py            # API Logic & Endpoints
│   ├── requirements.txt   # Python Dependencies
│   └── Dockerfile         # Backend Container Setup
│
├── 📂 frontend/           # Next.js Application
│   ├── app/               # App Router Pages
│   ├── public/            # Static Assets
│   ├── package.json       # JS Dependencies
│   └── Dockerfile         # Frontend Container Setup
│
├── .env                   # Environment Variables
├── .gitignore             # Git Ignore Rules
├── docker-compose.yml     # Orchestration Config
└── README.md              # Project Documentation