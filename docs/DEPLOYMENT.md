# Karnataka Yatra AI — Deployment Guide

## 1. Local Development Quickstart

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
python app/db/seed.py
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 2. Docker & Containerized Deployment
A production-ready `docker-compose.yml` is provided at the repository root:
```bash
docker-compose up --build
```
This launches:
- `backend`: FastAPI Python service on port 8000
- `frontend`: Vite React service on port 5173 (or production Nginx bundle)
- `db`: PostgreSQL 16 container with persistent volumes

---

## 3. Azure Cloud Deployment

### 3.1 Azure App Service (Backend)
1. Create a Linux App Service plan with Python 3.11 runtime.
2. Configure App Settings:
   - `DATABASE_URL`: Azure Database for PostgreSQL Flexible Server connection string.
   - `AZURE_OPENAI_ENDPOINT` & `AZURE_OPENAI_API_KEY`: (Optional) Microsoft Foundry / Azure OpenAI.
   - `AZURE_SPEECH_KEY` & `AZURE_SPEECH_REGION`: (Optional) Azure AI Speech resource.
   - `ALLOWED_ORIGINS`: Your Azure Static Web App URL.
3. Deploy the `backend/` directory using Azure CLI or GitHub Actions:
   ```bash
   az webapp up --name karnataka-yatra-backend --resource-group rg-karnataka-yatra --runtime "PYTHON:3.11"
   ```

### 3.2 Azure Static Web Apps (Frontend)
1. Build command: `npm run build`
2. App artifact location: `dist`
3. Configure API proxy or custom domain pointing `/api` to the Azure App Service URL.
