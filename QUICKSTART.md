# VyaaparSahayak — Quick Start Guide

## ⚡ 30-Second Setup

```bash
# 1. Activate virtualenv
.venv\Scripts\activate

# 2. Install dependencies (first time only)
pip install -r backend/requirements.txt

# 3. Run server
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8001 --reload

# 4. Open browser
http://127.0.0.1:8001/docs
```

---

## 🧪 Run Tests

```bash
# All tests
pytest backend/test_main.py -v

# Specific test
pytest backend/test_main.py::TestProducts::test_create_product -v

# With coverage
pytest backend/test_main.py --cov=backend.main --cov-report=html
```

**Test Status**: ✅ 21/21 passing

---

## 📡 Quick API Calls (PowerShell / Windows)

### 1. Create a Product

```powershell
curl -X POST http://127.0.0.1:8001/products `
  -H "Content-Type: application/json" `
  -d '{"name":"Laptop Bag","cost_price":500,"selling_price":1500,"inventory":50,"category":"Accessories"}'
```

### 2. Create an Order (auto-deducts inventory)

```powershell
curl -X POST http://127.0.0.1:8001/orders `
  -H "Content-Type: application/json" `
  -d '{"product_id":1,"channel":"amazon","quantity":5}'
```

### 3. View Dashboard

```powershell
curl http://127.0.0.1:8001/dashboard
curl http://127.0.0.1:8001/dashboard/channel-wise
curl http://127.0.0.1:8001/dashboard/products
```

### 4. Record Production Batch

```powershell
curl -X POST http://127.0.0.1:8001/products/1/production_batches `
  -H "Content-Type: application/json" `
  -d '{"units_produced":50,"production_cost":8000,"production_time":2.5}'
```

### 5. Create Startup Profile

```powershell
curl -X POST http://127.0.0.1:8001/startup-profile `
  -H "Content-Type: application/json" `
  -d '{"business_name":"Tech Startup","business_type":"manufacturing","industry":"electronics","location":"Bangalore","msme_registered":false,"annual_revenue":5000000}'
```

### 6. Match Schemes (ID 1 from step 5)

```powershell
curl http://127.0.0.1:8001/startup-profile/1/matched-schemes
```

### 7. Run Risk Analysis (with OpenAI key)

```powershell
curl -X POST http://127.0.0.1:8001/risk-analysis `
  -H "Content-Type: application/json" `
  -d '{"startup_profile_id":1,"openai_api_key":"sk-your-key"}'
```

---

## 📁 Project Layout

```
VyaaparSahayak/
├── backend/
│   ├── main.py              ← All endpoints (880+ lines)
│   ├── schemes.json         ← 10 Indian government schemes
│   ├── test_main.py         ← 21 pytest tests
│   └── requirements.txt
├── frontend/
│   ├── index.html           (TBD)
│   ├── app.js               (TBD)
│   └── favicon.ico
├── README.md                ← Full documentation
├── QUICKSTART.md            ← This file
├── .env.example             ← Config template
├── postman_collection.json  ← Import into Postman
└── app.db                   ← SQLite (auto-created)
```

---

## 🚀 What's Built (All 8 Core Areas ✅)

| # | Feature | Status | Endpoints |
|---|---------|--------|-----------|
| 1️⃣ | **Startup Profile Intelligence** | ✅ | `POST /startup-profile` |
| 2️⃣ | **Product Performance Tracking** | ✅ | `GET /products/{id}/performance`, `/dashboard/products` |
| 3️⃣ | **Production Efficiency Mapping** | ✅ | `POST /products/{id}/production_batches`, `GET /products/{id}/production_insights` |
| 4️⃣ | **Orders & Sales Automation** | ✅ | `POST /orders`, `/dashboard/channel-wise` |
| 5️⃣ | **Customer Insights** | ⏸️ | Skipped per request |
| 6️⃣ | **Marketing-Aware Inputs** | ⏸️ | Skipped per request |
| 7️⃣ | **Scheme & Opportunity Matching** | ✅ | `GET /schemes`, `GET /startup-profile/{id}/matched-schemes` |
| 8️⃣ | **AI Risk & Action Planner** | ✅ | `POST /risk-analysis`, `GET /risk-analysis/{id}` |

---

## 🔗 Using Postman

1. **Import Collection**:
   - Open Postman
   - `File` → `Import` → Select `postman_collection.json`
   - Collection loads with all endpoints

2. **Run Requests**:
   - Change `http://127.0.0.1:8001` if using different port
   - Fill in request bodies as needed
   - Click Send

---

## 🔑 Enable OpenAI (Optional)

For **real** AI-powered risk recommendations:

1. Get your API key: https://platform.openai.com/api-keys
2. In `backend/main.py`, find `call_openai_action_planner()` function (line ~700)
3. Uncomment the OpenAI block (between `# UNCOMMENT THIS BLOCK WHEN READY...` markers)
4. Run: `pip install openai`
5. Test with real key:

```powershell
curl -X POST http://127.0.0.1:8001/risk-analysis `
  -H "Content-Type: application/json" `
  -d '{"startup_profile_id":1,"openai_api_key":"sk-your-real-key"}'
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8001 in use | `taskkill /PID <PID> /F` or use `--port 8002` |
| `ModuleNotFoundError` | Run `pip install -r backend/requirements.txt` |
| `app.db` locked | Delete `app.db`, restart server |
| Tests failing | Ensure clean DB: `rm app.db` then `pytest backend/test_main.py -v` |

---

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│       FastAPI Backend (main.py)         │
├─────────────────────────────────────────┤
│  Core: Orders (Master) → Products       │
│  Analytics: Dashboard (read-only)       │
│  Production: Batches + Insights         │
│  Schemes: Matching + Gov Schemes        │
│  AI: Risk Detection + OpenAI Planning   │
├─────────────────────────────────────────┤
│          SQLite Database (app.db)       │
│  Tables: Products, Orders, Batches,     │
│  StartupProfiles, Schemes, RiskReports  │
└─────────────────────────────────────────┘
```

---

## 📝 Next Steps

1. **Frontend** (TBD): React/Vue dashboard connecting to these endpoints
2. **Customer Insights** (Skipped): Add repeat customer tracking, regional demand
3. **Marketing AI** (Skipped): Social media caption generation
4. **Auth** (TBD): User login, multi-tenant isolation
5. **PostgreSQL** (TBD): For production scaling

---

## 💬 Questions?

- Check `README.md` for full API docs
- Review `backend/main.py` for endpoint logic
- Run `pytest backend/test_main.py -v` for working examples

**Happy hacking! 🚀**
