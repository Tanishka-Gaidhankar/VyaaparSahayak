import pytest
from fastapi.testclient import TestClient
from backend.main import app, SessionLocal, Base, engine
import json

# Create test database tables
Base.metadata.create_all(bind=engine)

client = TestClient(app)


class TestRootEndpoint:
    def test_root(self):
        """Test root endpoint returns status."""
        response = client.get("/")
        assert response.status_code == 200
        assert response.json()["status"] == "VyaaparSahayak backend running"


class TestProducts:
    def test_create_product(self):
        """Test creating a product."""
        payload = {
            "name": "Test Product",
            "cost_price": 100,
            "selling_price": 250,
            "inventory": 50,
            "category": "Electronics"
        }
        response = client.post("/products", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Product"
        assert data["cost_price"] == 100

    def test_list_products(self):
        """Test listing products."""
        response = client.get("/products")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_product_performance(self):
        """Test product performance endpoint."""
        # Create a product first
        payload = {
            "name": "Perf Test",
            "cost_price": 50,
            "selling_price": 150,
            "inventory": 100
        }
        create_response = client.post("/products", json=payload)
        product_id = create_response.json()["id"]

        # Get performance
        response = client.get(f"/products/{product_id}/performance")
        assert response.status_code == 200
        data = response.json()
        assert data["product_id"] == product_id
        assert "revenue" in data
        assert "profit" in data


class TestOrders:
    def test_create_order(self):
        """Test creating an order."""
        # Create product first
        prod_payload = {
            "name": "Order Test Product",
            "cost_price": 100,
            "selling_price": 300,
            "inventory": 50
        }
        prod_response = client.post("/products", json=prod_payload)
        product_id = prod_response.json()["id"]

        # Create order
        order_payload = {
            "product_id": product_id,
            "channel": "amazon",
            "quantity": 5
        }
        response = client.post("/orders", json=order_payload)
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Order created successfully"
        assert data["remaining_inventory"] == 45

    def test_create_order_insufficient_inventory(self):
        """Test order fails with insufficient inventory."""
        # Create product with low inventory
        prod_payload = {
            "name": "Low Stock Product",
            "cost_price": 100,
            "selling_price": 300,
            "inventory": 2
        }
        prod_response = client.post("/products", json=prod_payload)
        product_id = prod_response.json()["id"]

        # Try to order more than available
        order_payload = {
            "product_id": product_id,
            "channel": "shopify",
            "quantity": 5
        }
        response = client.post("/orders", json=order_payload)
        assert response.status_code == 400
        assert "Insufficient inventory" in response.json()["detail"]

    def test_create_order_nonexistent_product(self):
        """Test order fails for nonexistent product."""
        order_payload = {
            "product_id": 9999,
            "channel": "flipkart",
            "quantity": 1
        }
        response = client.post("/orders", json=order_payload)
        assert response.status_code == 404


class TestDashboard:
    def test_dashboard_metrics(self):
        """Test dashboard summary endpoint."""
        response = client.get("/dashboard")
        assert response.status_code == 200
        data = response.json()
        assert "summary" in data
        assert "total_revenue" in data["summary"]
        assert "total_profit" in data["summary"]
        assert "total_orders" in data["summary"]

    def test_dashboard_channel_wise(self):
        """Test channel-wise breakdown."""
        response = client.get("/dashboard/channel-wise")
        assert response.status_code == 200
        data = response.json()
        assert "channels" in data
        assert "total_revenue" in data

    def test_dashboard_products(self):
        """Test product-wise dashboard."""
        response = client.get("/dashboard/products")
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        assert isinstance(data["products"], list)

    def test_dashboard_sales_summary(self):
        """Test sales summary endpoint."""
        response = client.get("/dashboard/sales-summary")
        assert response.status_code == 200
        data = response.json()
        assert "total_revenue" in data
        assert "profit_margin_percent" in data
        assert "inventory_health_percent" in data


class TestProductionBatches:
    def test_create_production_batch(self):
        """Test recording a production batch."""
        # Create product
        prod_payload = {
            "name": "Batch Test",
            "cost_price": 200,
            "selling_price": 500,
            "inventory": 100
        }
        prod_response = client.post("/products", json=prod_payload)
        product_id = prod_response.json()["id"]

        # Record batch
        batch_payload = {
            "units_produced": 50,
            "production_cost": 8000,
            "production_time": 2.5
        }
        response = client.post(f"/products/{product_id}/production_batches", json=batch_payload)
        assert response.status_code == 200
        assert response.json()["message"] == "Production batch recorded"

    def test_production_insights(self):
        """Test production efficiency insights."""
        # Create product and batch
        prod_payload = {
            "name": "Insights Test",
            "cost_price": 100,
            "selling_price": 300,
            "inventory": 100
        }
        prod_response = client.post("/products", json=prod_payload)
        product_id = prod_response.json()["id"]

        batch_payload = {
            "units_produced": 50,
            "production_cost": 6000,
            "production_time": 2
        }
        client.post(f"/products/{product_id}/production_batches", json=batch_payload)

        # Get insights
        response = client.get(f"/products/{product_id}/production_insights")
        assert response.status_code == 200
        data = response.json()
        assert "production_cost_per_unit" in data
        assert "units_per_hour" in data
        assert "margin_percent" in data


class TestSchemes:
    def test_list_schemes(self):
        """Test listing government schemes."""
        response = client.get("/schemes")
        assert response.status_code == 200
        data = response.json()
        assert data["total"] >= 10  # Pre-loaded schemes
        assert len(data["schemes"]) > 0

    def test_create_startup_profile(self):
        """Test creating a startup profile."""
        payload = {
            "business_name": "Tech Startup",
            "business_type": "manufacturing",
            "industry": "electronics",
            "location": "Bangalore",
            "msme_registered": False,
            "annual_revenue": 5000000
        }
        response = client.post("/startup-profile", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["business_name"] == "Tech Startup"
        assert "id" in data

    def test_matched_schemes(self):
        """Test scheme matching for a startup profile."""
        # Create profile
        profile_payload = {
            "business_name": "Manufacturing Co",
            "business_type": "manufacturing",
            "industry": "textiles",
            "location": "Tiruppur",
            "msme_registered": False,
            "annual_revenue": 3000000
        }
        profile_response = client.post("/startup-profile", json=profile_payload)
        profile_id = profile_response.json()["id"]

        # Get matched schemes
        response = client.get(f"/startup-profile/{profile_id}/matched-schemes")
        assert response.status_code == 200
        data = response.json()
        assert "matched_schemes" in data
        assert "total_matched" in data
        assert data["total_matched"] > 0


class TestRiskAnalysis:
    def test_risk_analysis_endpoint_exists(self):
        """Test risk analysis endpoint structure."""
        # Create profile first
        profile_payload = {
            "business_name": "Risk Test Co",
            "business_type": "manufacturing",
            "industry": "electronics",
            "location": "Delhi",
            "msme_registered": False,
            "annual_revenue": 2000000
        }
        profile_response = client.post("/startup-profile", json=profile_payload)
        profile_id = profile_response.json()["id"]

        # Call risk analysis (with placeholder key)
        analysis_payload = {
            "startup_profile_id": profile_id,
            "openai_api_key": "sk-test-placeholder"
        }
        response = client.post("/risk-analysis", json=analysis_payload)
        assert response.status_code == 200
        data = response.json()
        assert "report_id" in data
        assert "risk_level" in data
        assert "risks" in data

    def test_get_risk_report(self):
        """Test retrieving a risk report."""
        # Create profile and run analysis
        profile_payload = {
            "business_name": "Report Test Co",
            "business_type": "services",
            "industry": "consulting",
            "location": "Mumbai",
            "msme_registered": True,
            "annual_revenue": 4000000
        }
        profile_response = client.post("/startup-profile", json=profile_payload)
        profile_id = profile_response.json()["id"]

        analysis_payload = {
            "startup_profile_id": profile_id,
            "openai_api_key": "sk-test"
        }
        analysis_response = client.post("/risk-analysis", json=analysis_payload)
        report_id = analysis_response.json()["report_id"]

        # Get report
        response = client.get(f"/risk-analysis/{report_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == report_id
        assert "risk_level" in data
        assert "risks" in data


class TestEdgeCases:
    def test_favicon(self):
        """Test favicon endpoint."""
        response = client.get("/favicon.ico")
        # Should return 200 if file exists, or 404 if not (both acceptable)
        assert response.status_code in [200, 404]

    def test_nonexistent_endpoints(self):
        """Test nonexistent endpoint returns 404."""
        response = client.get("/nonexistent")
        assert response.status_code == 404

    def test_invalid_production_batch_product(self):
        """Test production batch creation fails for invalid product."""
        batch_payload = {
            "units_produced": 50,
            "production_cost": 5000,
            "production_time": 2
        }
        response = client.post("/products/9999/production_batches", json=batch_payload)
        assert response.status_code == 404


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
