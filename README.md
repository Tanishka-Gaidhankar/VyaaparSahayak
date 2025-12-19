# VyaaparSahayak — SaaS Platform for Startup Growth & Management

A centralized dashboard for Indian startups to manage, track, and grow their products with AI-powered risk analysis and government scheme matching.

## 🎯 Core Features

| Feature | Purpose |
|---------|---------|
| **Product & Inventory Management** | Track cost price, selling price, stock levels, and categories |
| **Orders & Sales Tracking** | Record sales by channel, auto-update inventory, calculate revenue |
| **Production Efficiency Mapping** | Monitor production costs, batch efficiency, cost leakage detection |
| **Dashboard Analytics** | Real-time KPIs: revenue, profit, best/worst products, channel breakdown |
| **Scheme Matching** | Auto-match startup profiles to 10+ Indian government MSME schemes (PMEGP, Mudra, Stand-Up India, etc.) |
| **AI Risk & Action Planner** | Detect risks (channel dependency, low margins, dead stock) + AI-generated action plans (OpenAI GPT-4) |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Virtual environment (already set up at `.venv/`)
- OpenAI API key (optional, for AI Risk Planner)

### 1. Activate Virtual Environment

**Windows (PowerShell/CMD):**
```bash
.venv\Scripts\activate
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### 3. Run the Server

```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8001 --reload
```

Server runs at: **http://127.0.0.1:8001**

### 4. Access API Documentation

- **Swagger UI**: http://127.0.0.1:8001/docs
- **ReDoc**: http://127.0.0.1:8001/redoc

---

## 📊 API Endpoints

### Products (Setup)
- `POST /products` — Create a product
- `GET /products` — List all products
- `GET /products/{id}/performance` — Product revenue, profit, velocity

### Orders (Master Module - transactional truth)
- `POST /orders` — Create an order (auto-deducts inventory, updates revenue)
- Sales captured by channel, customer, date

### Dashboard (Read-Only, Derived)
- `GET /dashboard` — Summary: revenue, profit, orders, best/worst products
- `GET /dashboard/channel-wise` — Channel breakdown: revenue, order count, units
- `GET /dashboard/products` — Per-product stats: revenue, profit, inventory, velocity
- `GET /dashboard/sales-summary` — Profit margin %, avg order value, inventory health

### Production Efficiency
- `POST /products/{id}/production_batches` — Record a production batch
- `GET /products/{id}/production_insights` — Cost per unit, leakage detection, margin impact

### Schemes & Opportunities
- `POST /startup-profile` — Create startup profile (business type, industry, location, MSME status, revenue)
- `GET /schemes` — List all government schemes (10 Indian MSME schemes pre-loaded)
- `GET /startup-profile/{id}/matched-schemes` — Auto-match schemes based on eligibility

### AI Risk & Action Planner
- `POST /risk-analysis` — Detect risks + get AI action plan (requires OpenAI API key)
- `GET /risk-analysis/{id}` — Retrieve stored risk report

---

## 🗂️ Data Models

### Database Schema

```
Products
├── id, name, category
├── cost_price, selling_price, inventory
├── units_per_batch, production_cost, production_time

Orders (Master Module)
├── id, product_id, channel, quantity, selling_price
├── customer_ref, date

ProductionBatches
├── id, product_id, units_produced
├── production_cost, production_time, date

StartupProfile
├── id, business_name, business_type, industry
├── location, growth_stage, msme_registered, annual_revenue

Schemes (pre-populated from schemes.json)
├── id, name, description, eligibility_json
├── benefits, source

RiskReport
├── id, startup_profile_id, risk_level
├── risks_json, ai_actions_json, timestamp
```

---

## 💡 Example Workflows

### Workflow 1: Track Sales & Monitor Dashboard

```bash
# 1. Create a product
curl -X POST http://127.0.0.1:8001/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Bag",
    "cost_price": 500,
    "selling_price": 1500,
    "inventory": 50,
    "category": "Accessories"
  }'

# 2. Create an order (inventory auto-deducts)
curl -X POST http://127.0.0.1:8001/orders \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "channel": "amazon",
    "quantity": 5
  }'

# 3. View dashboard
curl http://127.0.0.1:8001/dashboard
```

### Workflow 2: Track Production & Detect Cost Leakage

```bash
# 1. Record a production batch
curl -X POST http://127.0.0.1:8001/products/1/production_batches \
  -H "Content-Type: application/json" \
  -d '{
    "units_produced": 50,
    "production_cost": 30000,
    "production_time": 5
  }'

# 2. Get production insights
curl http://127.0.0.1:8001/products/1/production_insights
```

### Workflow 3: Match to Government Schemes

```bash
# 1. Create startup profile
curl -X POST http://127.0.0.1:8001/startup-profile \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "Tech Innovations Ltd",
    "business_type": "manufacturing",
    "industry": "electronics",
    "location": "Bangalore",
    "msme_registered": false,
    "annual_revenue": 5000000
  }'

# 2. List schemes
curl http://127.0.0.1:8001/schemes

# 3. Match schemes for profile (ID 1)
curl http://127.0.0.1:8001/startup-profile/1/matched-schemes
```

### Workflow 4: Run Risk Analysis (with OpenAI)

```bash
# Requires OpenAI API key
curl -X POST http://127.0.0.1:8001/risk-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "startup_profile_id": 1,
    "openai_api_key": "sk-YOUR_KEY_HERE"
  }'
```

---

## 🧪 Testing

### Run Pytest

```bash
pip install pytest pytest-asyncio httpx

pytest backend/test_main.py -v
```

### Run Specific Test

```bash
pytest backend/test_main.py::test_create_product -v
```

### With Coverage

```bash
pip install pytest-cov
pytest backend/test_main.py --cov=backend.main --cov-report=html
```

---

## 📝 Environment Variables (Optional)

Create a `.env` file:

```bash
# Database (optional, default: sqlite)
DATABASE_URL=sqlite:///./app.db

# OpenAI (required for real AI Risk Planner)
OPENAI_API_KEY=sk-your-key-here

# Server
HOST=127.0.0.1
PORT=8001
```

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8001
kill -9 <PID>
```

### Database Locked

```bash
# Delete and recreate
rm app.db
# Restart server
```

### Pydantic Warning

If you see `orm_mode has been renamed to from_attributes`, it's harmless (already fixed in code).

---

## 📦 Project Structure

```
VyaaparSahayak/
├── backend/
│   ├── main.py               # FastAPI app, all endpoints
│   ├── schemes.json          # 10 Indian government schemes
│   ├── requirements.txt       # Dependencies
│   └── test_main.py          # Pytest suite
├── frontend/
│   ├── index.html            # (TBD)
│   ├── app.js                # (TBD)
│   └── favicon.ico           # App icon
├── app.db                     # SQLite database (auto-created)
├── .env.example              # Config template
├── README.md                 # This file
└── pyproject.toml            # Project metadata
```

---

## 🔐 Security Notes

- ⚠️ **OpenAI API Key**: Never commit your key. Pass via environment or request body only.
- ⚠️ **CORS**: Configured to allow all origins (`*`). For production, restrict to your frontend domain.
- ⚠️ **Database**: SQLite is fine for MVP. Use PostgreSQL for production.

---

## 📈 Roadmap

- [ ] Frontend dashboard (React/Vue)
- [ ] Customer Insights: repeat customers, regional demand patterns
- [ ] Marketing-Aware Inputs: AI-generated social media captions
- [ ] Multi-user authentication
- [ ] PostgreSQL migration
- [ ] Real-time notifications
- [ ] Mobile app

---

## 🤝 Contributing

Found a bug or have a feature request? Open an issue or submit a PR.

---

## 📄 License

This is a hackathon project. Free to use and modify.

---

## 📧 Support

For questions or issues, reach out to the development team.

**Built for Indian startups, by builders.**
