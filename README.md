# API Integration - n8n & Gemini

ระบบเชื่อมต่อ n8n API และ Gemini API ที่เสถียรและรวดเร็ว

## Features

- ✅ Auto-retry และ error handling
- ✅ Connection pooling สำหรับประสิทธิภาพสูง
- ✅ Timeout protection
- ✅ Logging system
- ✅ Environment variables สำหรับความปลอดภัย

## Installation

```bash
pip install -r requirements.txt
```

## Configuration

1. คัดลอกไฟล์ตัวอย่าง:
```bash
cp .env.example .env
```

2. แก้ไขไฟล์ `.env`:
```env
N8N_URL=https://your-n8n-instance.com
N8N_API_KEY=your-n8n-api-key
GEMINI_API_KEY=your-gemini-api-key
```

## Usage

```python
from api_integration import N8NClient, GeminiClient
import os

# Initialize clients
n8n = N8NClient(
    os.getenv('N8N_URL'),
    os.getenv('N8N_API_KEY'),
    timeout=30,
    max_retries=3
)

gemini = GeminiClient(
    os.getenv('GEMINI_API_KEY'),
    timeout=30,
    max_retries=3
)

# Use Gemini
response = gemini.chat("Hello!")
print(response)

# Trigger n8n workflow
result = n8n.trigger_workflow('workflow-id', {'message': response})
print(result)

# Get workflow executions
executions = n8n.get_executions('workflow-id')
print(executions)
```

## API Reference

### GeminiClient

```python
GeminiClient(api_key, timeout=30, max_retries=3)
```

**Methods:**
- `chat(message, temperature=0.7)` - ส่งข้อความและรับคำตอบ

### N8NClient

```python
N8NClient(url, api_key, timeout=30, max_retries=3)
```

**Methods:**
- `trigger_workflow(workflow_id, data=None)` - เรียกใช้ workflow
- `get_executions(workflow_id)` - ดึงประวัติการทำงาน

## License

MIT
