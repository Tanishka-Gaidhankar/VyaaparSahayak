import { useQuery } from "@tanstack/react-query";
import {
  IndianRupee,
  TrendingUp,
  ShoppingCart,
  Package,
  Award,
  BarChart3,
} from "lucide-react";
import {
  getDashboard,
  getDashboardProducts,
  getChannelWiseSales,
  getSalesSummary,
  type ProductPerformance,
} from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { KPICard } from "@/components/ui/kpi-card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulateDecision } from "@/components/simulation/SimulateDecision";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["hsl(173, 77%, 26%)", "hsl(38, 92%, 50%)", "hsl(142, 71%, 45%)", "hsl(0, 84%, 60%)", "hsl(215, 16%, 47%)"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Dashboard() {
  const { data: dashboard, isLoading: dashboardLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["dashboard-products"],
    queryFn: getDashboardProducts,
  });

  const { data: channelSales, isLoading: channelLoading } = useQuery({
    queryKey: ["channel-sales"],
    queryFn: getChannelWiseSales,
  });

  const { data: salesSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ["sales-summary"],
    queryFn: getSalesSummary,
  });

  const isLoading = dashboardLoading || productsLoading || channelLoading || summaryLoading;

  if (isLoading) {
    return <LoadingPage />;
  }

  const productColumns = [
    { header: "Product", accessorKey: "name" as keyof ProductPerformance },
    {
      header: "Revenue",
      accessorKey: (row: ProductPerformance) => formatCurrency(row.revenue),
    },
    {
      header: "Profit",
      accessorKey: (row: ProductPerformance) => formatCurrency(row.profit),
    },
    { header: "Orders", accessorKey: "orders" as keyof ProductPerformance },
    {
      header: "Margin",
      accessorKey: (row: ProductPerformance) => (
        <StatusBadge variant={row.margin >= 20 ? "success" : row.margin >= 10 ? "warning" : "destructive"}>
          {row.margin.toFixed(1)}%
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Your business at a glance"
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(dashboard?.summary.total_revenue || 0)}
          icon={IndianRupee}
          variant="primary"
          trend={{ value: 12.5, positive: true }}
        />
        <KPICard
          title="Total Profit"
          value={formatCurrency(dashboard?.summary.total_profit || 0)}
          icon={TrendingUp}
          variant="success"
          subtitle="Net earnings"
        />
        <KPICard
          title="Total Orders"
          value={dashboard?.summary.total_orders || 0}
          icon={ShoppingCart}
          subtitle="Across all channels"
        />
        <KPICard
          title="Inventory"
          value={dashboard?.summary.total_inventory || 0}
          icon={Package}
          subtitle="Units in stock"
        />
      </div>

      {/* Best Product & Sales Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="rounded-lg bg-accent/20 p-2">
              <Award className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg">Best Performer</CardTitle>
              <p className="text-sm text-muted-foreground">Top revenue product</p>
            </div>
          </CardHeader>
          <CardContent>
            {dashboard?.best_product && (
              <div className="space-y-2">
                <p className="text-2xl font-bold">{dashboard.best_product.name}</p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(dashboard.best_product.revenue)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Sales Summary</CardTitle>
              <p className="text-sm text-muted-foreground">Key metrics</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-xl font-bold">{formatCurrency(salesSummary?.avg_order_value || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Margin</p>
                <p className="text-xl font-bold">{salesSummary?.margin_percent?.toFixed(1)}%</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Inventory Health</p>
                <StatusBadge
                  variant={
                    salesSummary?.inventory_health === "Good"
                      ? "success"
                      : salesSummary?.inventory_health === "Low"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {salesSummary?.inventory_health || "Unknown"}
                </StatusBadge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle>Channel-wise Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelSales}
                    dataKey="revenue"
                    nameKey="channel"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ channel, percent }) =>
                      `${channel} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {channelSales?.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card animate-slide-up" style={{ animationDelay: "0.25s" }}>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={products?.slice(0, 5)}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="hsl(173, 77%, 26%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Profit" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simulate Decision */}
      <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <SimulateDecision />
      </div>

      {/* Product Table */}
      <div className="animate-slide-up" style={{ animationDelay: "0.35s" }}>
        <h2 className="mb-4 text-xl font-semibold">All Products Performance</h2>
        <DataTable columns={productColumns} data={products || []} />
      </div>
    </div>
  );
}
