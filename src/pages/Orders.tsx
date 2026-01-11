import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, TrendingUp, Package, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import { getChannelWiseSales, getDashboardProducts, getSalesSummary, getProducts, createOrder, type ChannelSales, type ProductPerformance, type Order } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { KPICard } from "@/components/ui/kpi-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(value);
}

const CHANNEL_COLORS: Record<string, string> = {
  Amazon: "#FF9900",
  Blinkit: "#FFC220",
  Flipkart: "#2874F0",
  Retail: "#10B981",
  Direct: "#8B5CF6",
  Website: "#EC4899",
  Other: "#6B7280",
};

const CHANNEL_ICONS: Record<string, string> = {
  Amazon: "🛒",
  Blinkit: "⚡",
  Flipkart: "🛍️",
  Retail: "🏪",
  Direct: "📞",
  Website: "🌐",
  Other: "📦",
};

const SUGGESTED_CHANNELS = ["Amazon", "Flipkart", "Blinkit", "Zepto", "Retail", "Website", "Instagram", "WhatsApp"];

export default function Orders() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: channelSales, isLoading: isLoadingChannels } = useQuery({
    queryKey: ["channel-wise"],
    queryFn: getChannelWiseSales,
  });

  const { data: productPerformance, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["dashboard-products"],
    queryFn: getDashboardProducts,
  });

  const { data: salesSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["sales-summary"],
    queryFn: getSalesSummary,
  });

  const { data: products } = useQuery({
    queryKey: ["products-list"],
    queryFn: getProducts,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channel-wise"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast({ title: "Order created successfully" });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const order: Order = {
      product_id: Number(formData.get("product_id")),
      channel: formData.get("channel") as string,
      quantity: Number(formData.get("quantity")),
      customer_ref: formData.get("customer_ref") as string,
    };

    createMutation.mutate(order);
  };

  if (isLoadingChannels || isLoadingProducts || isLoadingSummary) {
    return <LoadingPage />;
  }

  const totalOrders = channelSales?.reduce((sum, c) => sum + c.orders, 0) || 0;
  const totalRevenue = channelSales?.reduce((sum, c) => sum + c.revenue, 0) || 0;

  const pieData = channelSales?.map((c) => ({
    name: c.channel,
    value: c.revenue,
    orders: c.orders,
    color: CHANNEL_COLORS[c.channel] || CHANNEL_COLORS.Other,
  })) || [];

  const productColumns = [
    {
      header: "Product",
      accessorKey: (row: ProductPerformance) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      header: "Orders",
      accessorKey: (row: ProductPerformance) => (
        <span className="font-semibold">{row.orders}</span>
      ),
      className: "text-center",
    },
    {
      header: "Revenue",
      accessorKey: (row: ProductPerformance) => (
        <span className="font-semibold text-primary">{formatCurrency(row.revenue)}</span>
      ),
      className: "text-right",
    },
    {
      header: "Profit",
      accessorKey: (row: ProductPerformance) => (
        <span className="text-success">{formatCurrency(row.profit)}</span>
      ),
      className: "text-right",
    },
    {
      header: "Margin",
      accessorKey: (row: ProductPerformance) => (
        <StatusBadge variant={row.margin > 35 ? "success" : row.margin > 25 ? "warning" : "destructive"}>
          {row.margin.toFixed(1)}%
        </StatusBadge>
      ),
      className: "text-center",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Orders & Sales"
        description="Track how your products are performing across Blinkit, Amazon, and other channels"
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Record a new sale. You can enter any channel name properly.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product_id">Product</Label>
                <Select name="product_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name} (Stock: {p.inventory})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel">Sales Channel</Label>
                <div className="relative">
                  <Input
                    id="channel"
                    name="channel"
                    list="channels-list"
                    placeholder="e.g. Amazon, Website, WhatsApp..."
                    required
                  />
                  <datalist id="channels-list">
                    {SUGGESTED_CHANNELS.map((ch) => (
                      <option key={ch} value={ch} />
                    ))}
                  </datalist>
                </div>
                <p className="text-xs text-muted-foreground">Type a new channel name to add it automatically.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" name="quantity" type="number" required min="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_ref">Customer Ref (Optional)</Label>
                  <Input id="customer_ref" name="customer_ref" placeholder="#ORD-..." />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Order"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          icon={ShoppingBag}
          trend={{ value: 12.5, positive: true }}
        />
        <KPICard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
          trend={{ value: 8.2, positive: true }}
        />
        <KPICard
          title="Avg Order Value"
          value={formatCurrency(salesSummary?.avg_order_value || 0)}
          icon={Package}
          trend={{ value: 3.1, positive: true }}
        />
        <KPICard
          title="Profit Margin"
          value={`${salesSummary?.margin_percent.toFixed(1) || 0}%`}
          icon={TrendingUp}
          trend={{ value: 1.5, positive: true }}
        />
      </div>

      {/* Channel Performance Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Channel Cards */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Channel Performance
            </CardTitle>
            <CardDescription>Revenue & orders from each sales channel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {channelSales?.map((channel, index) => {
              const percentage = totalRevenue > 0 ? ((channel.revenue / totalRevenue) * 100).toFixed(1) : "0";
              const color = CHANNEL_COLORS[channel.channel] || CHANNEL_COLORS.Other;
              const icon = CHANNEL_ICONS[channel.channel] || "📦";

              return (
                <div
                  key={channel.channel}
                  className="flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{channel.channel}</h4>
                      <span className="text-lg font-bold" style={{ color }}>
                        {formatCurrency(channel.revenue)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{channel.orders} orders</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        {Number(percentage) > 30 ? (
                          <ArrowUpRight className="h-3 w-3 text-success" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-muted-foreground" />
                        )}
                        {percentage}% of revenue
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Revenue Distribution Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
            <CardDescription>Breakdown by channel</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Orders by Channel Bar Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Orders by Channel</CardTitle>
          <CardDescription>Compare order volume and revenue across channels</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={channelSales}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="channel" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number, name: string) => [
                  name === "revenue" ? formatCurrency(value) : value,
                  name === "revenue" ? "Revenue" : "Orders"
                ]}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="hsl(var(--primary))" name="Orders" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" fill="hsl(var(--accent))" name="Revenue" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Product Performance Table */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Product Sales Performance</h2>
        <DataTable
          columns={productColumns}
          data={productPerformance || []}
          emptyMessage="No order data available"
        />
      </div>
    </div>
  );
}
