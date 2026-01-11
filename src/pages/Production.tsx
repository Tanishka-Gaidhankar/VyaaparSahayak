import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Factory, Clock, TrendingDown, AlertTriangle, Zap } from "lucide-react";
import {
  getProducts,
  addProductionBatch,
  getProductionInsights,
  type ProductionBatch,
  type ProductionInsights,
  type Product,
} from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { LoadingPage, LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/status-badge";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(value);
}

function ProductInsightsCard({ product }: { product: Product }) {
  const { data: insights, isLoading } = useQuery({
    queryKey: ["production-insights", product.id],
    queryFn: () => getProductionInsights(product.id),
  });

  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex h-48 items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Factory className="h-6 w-6 text-primary" />
          </div>
          {insights?.cost_leakage && (
            <StatusBadge variant="destructive">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Cost Leakage
            </StatusBadge>
          )}
        </div>
        <CardTitle className="mt-3 text-lg">{product.name}</CardTitle>
        <CardDescription>{product.category}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Cost/Unit</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(insights.production_cost_per_unit)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Units/Hour</p>
                <p className="text-lg font-semibold">{insights.units_per_hour.toFixed(1)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Produced</p>
                <p className="text-lg font-semibold">{insights.total_units_produced}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Margin</p>
                <StatusBadge
                  variant={
                    insights.margin_percent >= 20
                      ? "success"
                      : insights.margin_percent >= 10
                      ? "warning"
                      : "destructive"
                  }
                >
                  {insights.margin_percent.toFixed(1)}%
                </StatusBadge>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No production data yet. Add a batch to see insights.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function Production() {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const batchMutation = useMutation({
    mutationFn: (data: { productId: number; batch: ProductionBatch }) =>
      addProductionBatch(data.productId, data.batch),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["production-insights"] });
      toast({
        title: "Production batch recorded",
        description: `Batch #${data.batch_id} added successfully`,
      });
      setOpen(false);
      setSelectedProduct(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const formData = new FormData(e.currentTarget);
    const batch: ProductionBatch = {
      units_produced: Number(formData.get("units_produced")),
      production_cost: Number(formData.get("production_cost")),
      production_time: Number(formData.get("production_time")),
      date: formData.get("date") as string,
    };
    batchMutation.mutate({ productId: selectedProduct.id, batch });
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Production Tracking"
        description="Monitor manufacturing efficiency and costs"
      />

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-card gradient-primary text-primary-foreground">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary-foreground/20 p-3">
              <Factory className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-80">Active Products</p>
              <p className="text-2xl font-bold">{products?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-success/10 p-3">
              <Zap className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Efficiency Goal</p>
              <p className="text-2xl font-bold">85%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-warning/10 p-3">
              <TrendingDown className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cost Target</p>
              <p className="text-2xl font-bold">-10%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Production Insights by Product</h2>
        </div>

        {products?.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Factory className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-lg font-medium">No products available</p>
              <p className="text-sm text-muted-foreground">
                Add products first to track production
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products?.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProductInsightsCard product={product} />
                <Button
                  variant="outline"
                  className="mt-2 w-full gap-2"
                  onClick={() => {
                    setSelectedProduct(product);
                    setOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add Batch
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Batch Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Production Batch</DialogTitle>
            <DialogDescription>
              {selectedProduct
                ? `Recording batch for ${selectedProduct.name}`
                : "Record a new manufacturing batch"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="units_produced">Units Produced</Label>
                <Input
                  id="units_produced"
                  name="units_produced"
                  type="number"
                  required
                  min="1"
                  placeholder="e.g., 50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="production_cost">Total Cost (₹)</Label>
                <Input
                  id="production_cost"
                  name="production_cost"
                  type="number"
                  required
                  min="0"
                  placeholder="e.g., 6000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="production_time">Time (hours)</Label>
                <Input
                  id="production_time"
                  name="production_time"
                  type="number"
                  required
                  min="0.5"
                  step="0.5"
                  placeholder="e.g., 10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={batchMutation.isPending}>
                {batchMutation.isPending ? "Recording..." : "Record Batch"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
