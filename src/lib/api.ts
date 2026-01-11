const API_BASE_URL = "http://127.0.0.1:8000";

const getProfileId = () => {
  const id = localStorage.getItem("startup_profile_id");
  return id ? parseInt(id) : undefined;
};

// Types
export interface Product {
  id: number;
  name: string;
  category: string;
  cost_price: number;
  selling_price: number;
  inventory: number;
  units_per_batch?: number;
  production_cost?: number;
  production_time?: number;
}

export interface ProductCreate {
  name: string;
  category: string;
  cost_price: number;
  selling_price: number;
  inventory: number;
  units_per_batch: number;
  production_cost: number;
  production_time: number;
}

export interface ProductionBatch {
  units_produced: number;
  production_cost: number;
  production_time: number;
  date: string;
}

export interface ProductionInsights {
  production_cost_per_unit: number;
  units_per_hour: number;
  total_units_produced: number;
  cost_leakage: boolean;
  margin_percent: number;
}

export interface Order {
  product_id: number;
  channel: string;
  quantity: number;
  customer_ref: string;
}

export interface OrderResponse {
  message: string;
  order_id: number;
  remaining_inventory: number;
}

export interface DashboardSummary {
  summary: {
    total_revenue: number;
    total_profit: number;
    total_orders: number;
    total_inventory: number;
  };
  best_product: {
    id: number;
    name: string;
    revenue: number;
  };
}

export interface ProductPerformance {
  id: number;
  name: string;
  revenue: number;
  profit: number;
  orders: number;
  margin: number;
}

export interface ChannelSales {
  channel: string;
  revenue: number;
  orders: number;
}

export interface SalesSummary {
  total_revenue: number;
  total_profit: number;
  avg_order_value: number;
  inventory_health: string;
  margin_percent: number;
}

export interface StartupProfile {
  id?: number;
  business_name: string;
  business_type: string;
  industry: string;
  location: string;
  growth_stage: string;
  msme_registered: boolean;
  annual_revenue: number;
}

export interface Scheme {
  id: number;
  name: string;
  description: string;
  eligibility: string;
  benefits: string;
  link?: string;
}

export interface RiskAnalysisRequest {
  startup_profile_id: number;
  groq_api_key?: string; // Optional now, uses backend env value if omitted
}

export interface RiskReport {
  risk_level: string;
  risks: Array<{
    type: string;
    severity: string;
    message: string;
  }>;
  ai_action_plan: string;
}

// Mock Data for Demo
const mockProducts: Product[] = [
  { id: 1, name: "Peanut Butter", category: "Food", cost_price: 120, selling_price: 180, inventory: 95 },
  { id: 2, name: "Almond Butter", category: "Food", cost_price: 200, selling_price: 320, inventory: 45 },
  { id: 3, name: "Honey Jar", category: "Food", cost_price: 80, selling_price: 150, inventory: 120 },
  { id: 4, name: "Organic Jam", category: "Food", cost_price: 90, selling_price: 160, inventory: 78 },
  { id: 5, name: "Coconut Oil", category: "Health", cost_price: 150, selling_price: 250, inventory: 200 },
];

const mockDashboard: DashboardSummary = {
  summary: {
    total_revenue: 287500,
    total_profit: 68400,
    total_orders: 156,
    total_inventory: 538,
  },
  best_product: {
    id: 1,
    name: "Peanut Butter",
    revenue: 98000,
  },
};

const mockProductPerformance: ProductPerformance[] = [
  { id: 1, name: "Peanut Butter", revenue: 98000, profit: 24500, orders: 54, margin: 33.3 },
  { id: 2, name: "Almond Butter", revenue: 76800, profit: 28800, orders: 24, margin: 37.5 },
  { id: 3, name: "Honey Jar", revenue: 45000, profit: 21000, orders: 30, margin: 46.7 },
  { id: 4, name: "Organic Jam", revenue: 40000, profit: 17500, orders: 25, margin: 43.8 },
  { id: 5, name: "Coconut Oil", revenue: 27700, profit: 11100, orders: 23, margin: 40.0 },
];

const mockChannelSales: ChannelSales[] = [
  { channel: "Amazon", revenue: 115000, orders: 64 },
  { channel: "Flipkart", revenue: 72500, orders: 38 },
  { channel: "Retail", revenue: 58000, orders: 32 },
  { channel: "Direct", revenue: 42000, orders: 22 },
];

const mockSalesSummary: SalesSummary = {
  total_revenue: 287500,
  total_profit: 68400,
  avg_order_value: 1843,
  inventory_health: "Good",
  margin_percent: 23.8,
};

const mockSchemes: Scheme[] = [
  {
    id: 1,
    name: "PMEGP - Prime Minister Employment Generation Programme",
    description: "Credit-linked subsidy scheme for setting up micro enterprises in the non-farm sector",
    eligibility: "Any individual above 18 years, Self Help Groups, Charitable Trusts, and Production Co-operative Societies",
    benefits: "Subsidy of 15-35% of the project cost for setting up new manufacturing units",
    link: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
  },
  {
    id: 2,
    name: "Credit Guarantee Scheme for Micro & Small Enterprises",
    description: "Provides collateral-free credit to MSEs with guarantee coverage up to 85%",
    eligibility: "New and existing Micro & Small Enterprises engaged in manufacturing or service activities",
    benefits: "Guarantee cover up to Rs. 2 crore without collateral security",
    link: "https://www.cgtmse.in/",
  },
  {
    id: 3,
    name: "Udyam Registration",
    description: "Free online registration for MSMEs to get various benefits under government schemes",
    eligibility: "Any manufacturing or service enterprise with defined investment and turnover limits",
    benefits: "Priority sector lending, lower interest rates, easy access to government tenders",
    link: "https://udyamregistration.gov.in/",
  },
  {
    id: 4,
    name: "Stand-Up India Scheme",
    description: "Facilitates bank loans between Rs. 10 lakh to Rs. 1 crore for SC/ST and women entrepreneurs",
    eligibility: "SC/ST and/or women entrepreneurs above 18 years for greenfield enterprises",
    benefits: "Bank loans for setting up greenfield enterprise in manufacturing, services, or trading",
    link: "https://www.standupmitra.in/",
  },
];

const mockProductionInsights: ProductionInsights = {
  production_cost_per_unit: 115,
  units_per_hour: 5.5,
  total_units_produced: 450,
  cost_leakage: false,
  margin_percent: 36.1,
};

// API Functions - connects to backend
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "An error occurred" }));
    throw new Error(error.detail || `HTTP error ${response.status}`);
  }

  return response.json();
}

// Products
export const getProducts = () => {
  const profileId = getProfileId();
  const endpoint = profileId ? `/products?profile_id=${profileId}` : "/products";
  return fetchAPI<Product[]>(endpoint);
};

export const createProduct = (product: ProductCreate) => {
  const profileId = getProfileId();
  const payload = { ...product, startup_profile_id: profileId };
  return fetchAPI<Product>("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getProductPerformance = (productId: number) =>
  fetchAPI<ProductPerformance>(`/products/${productId}/performance`);

// Production
export const addProductionBatch = (productId: number, batch: ProductionBatch) => {
  const profileId = getProfileId();
  const payload = { ...batch, startup_profile_id: profileId };
  return fetchAPI<{ message: string; batch_id: number }>(`/products/${productId}/production_batches`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getProductionInsights = (productId: number) =>
  fetchAPI<ProductionInsights>(`/products/${productId}/production_insights`);

// Orders
export const createOrder = (order: Order) => {
  const profileId = getProfileId();
  const payload = { ...order, startup_profile_id: profileId };
  return fetchAPI<OrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// Dashboard
export const getDashboard = () => {
  const profileId = getProfileId();
  const endpoint = profileId ? `/dashboard?profile_id=${profileId}` : "/dashboard";
  return fetchAPI<DashboardSummary>(endpoint);
};

export const getDashboardProducts = () => {
  const profileId = getProfileId();
  const endpoint = profileId ? `/dashboard/products?profile_id=${profileId}` : "/dashboard/products";
  return fetchAPI<ProductPerformance[]>(endpoint);
};

export const getChannelWiseSales = () => {
  const profileId = getProfileId();
  const endpoint = profileId ? `/dashboard/channel-wise?profile_id=${profileId}` : "/dashboard/channel-wise";
  return fetchAPI<ChannelSales[]>(endpoint);
};

export const getSalesSummary = () => {
  const profileId = getProfileId();
  const endpoint = profileId ? `/dashboard/sales-summary?profile_id=${profileId}` : "/dashboard/sales-summary";
  return fetchAPI<SalesSummary>(endpoint);
};

// Startup Profile
export const createStartupProfile = (profile: StartupProfile) =>
  fetchAPI<{ id: number; message: string }>("/startup-profile", {
    method: "POST",
    body: JSON.stringify(profile),
  });

export const getStartupProfile = (profileId: number) =>
  fetchAPI<StartupProfile>(`/startup-profile/${profileId}`);

// Schemes
export const getSchemes = () => fetchAPI<Scheme[]>("/schemes");

export const getMatchedSchemes = (profileId: number) =>
  fetchAPI<Scheme[]>(`/startup-profile/${profileId}/matched-schemes`);

// Risk Analysis
export const runRiskAnalysis = (data: RiskAnalysisRequest) =>
  fetchAPI<RiskReport>("/risk-analysis", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getRiskReport = (reportId: number) =>
  fetchAPI<RiskReport>(`/risk-analysis/${reportId}`);

// AI Marketing & Growth Features
export interface AudienceMatchingRequest {
  product_name: string;
  category: string;
  price_range: string;
  description: string;
  target_country?: string;
}

export interface PlatformRecommendation {
  platform: string;
  reason: string;
  confidence_score: number;
  keywords: string[];
}

export interface TargetAudience {
  age_range: string;
  interests: string[];
  buying_intent: string;
  demographics: string;
  summary: string;
}

export interface AudienceMatchingResponse {
  success: boolean;
  product: string;
  target_audience: TargetAudience;
  platform_recommendations: PlatformRecommendation[];
  overall_strategy: string;
  market_trends_used: boolean;
}

export interface ContentOptimizationRequest {
  product_name: string;
  product_details: string;
  selected_platform: string;
  target_audience: string;
  category: string;
}

export interface OptimizedContent {
  title: string;
  description: string;
  call_to_action: string;
  hashtags_or_tags: string[];
}

export interface PostingStrategy {
  best_timing: string;
  format: string;
  frequency: string;
  additional_tips: string[];
}

export interface ActionRecommendation {
  action: string;
  expected_impact: string;
  priority: string;
}

export interface ContentOptimizationResponse {
  success: boolean;
  platform: string;
  optimized_content: OptimizedContent;
  posting_strategy: PostingStrategy;
  compliance_warnings: string[];
  action_recommendations: ActionRecommendation[];
}

export const getAudienceMatching = (data: AudienceMatchingRequest) =>
  fetchAPI<AudienceMatchingResponse>("/ai/audience-matching", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getContentOptimization = (data: ContentOptimizationRequest) =>
  fetchAPI<ContentOptimizationResponse>("/ai/content-optimization", {
    method: "POST",
    body: JSON.stringify(data),
  });

