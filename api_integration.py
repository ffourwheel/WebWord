import os
import requests
from openai import OpenAI
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
N8N_URL = os.getenv('N8N_URL', 'https://your-n8n-instance.com')
N8N_API_KEY = os.getenv('N8N_API_KEY', 'your-n8n-api-key')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'your-openai-api-key')

class N8NClient:
    def __init__(self, url, api_key, timeout=30, max_retries=3):
        self.url = url.rstrip('/')
        self.headers = {'X-N8N-API-KEY': api_key}
        self.timeout = timeout
        self.session = self._create_session(max_retries)
    
    def _create_session(self, max_retries):
        session = requests.Session()
        retry = Retry(total=max_retries, backoff_factor=0.5, status_forcelist=[500, 502, 503, 504])
        adapter = HTTPAdapter(max_retries=retry, pool_connections=10, pool_maxsize=20)
        session.mount('http://', adapter)
        session.mount('https://', adapter)
        return session
    
    def trigger_workflow(self, workflow_id, data=None):
        try:
            endpoint = f"{self.url}/api/v1/workflows/{workflow_id}/execute"
            response = self.session.post(endpoint, headers=self.headers, json=data or {}, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"n8n workflow trigger failed: {e}")
            raise
    
    def get_executions(self, workflow_id):
        try:
            endpoint = f"{self.url}/api/v1/executions"
            response = self.session.get(endpoint, headers=self.headers, params={'workflowId': workflow_id}, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"n8n get executions failed: {e}")
            raise

class ChatGPTClient:
    def __init__(self, api_key, timeout=30, max_retries=3):
        self.client = OpenAI(api_key=api_key, timeout=timeout, max_retries=max_retries)
    
    def chat(self, message, model="gpt-4o-mini", temperature=0.7):
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": message}],
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"ChatGPT request failed: {e}")
            raise

# Usage Example
if __name__ == "__main__":
    # Initialize clients
    n8n = N8NClient(N8N_URL, N8N_API_KEY)
    chatgpt = ChatGPTClient(OPENAI_API_KEY)
    
    # Use ChatGPT
    ai_response = chatgpt.chat("Hello, how are you?")
    print(f"ChatGPT: {ai_response}")
    
    # Use n8n (example: trigger workflow with AI response)
    # workflow_result = n8n.trigger_workflow('workflow-id', {'message': ai_response})
    # print(f"n8n Result: {workflow_result}")
