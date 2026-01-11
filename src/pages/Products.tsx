import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Package, IndianRupee, Archive, TrendingUp } from "lucide-react";
import { getProducts, createProduct, type ProductCreate, type Product } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const categories = ["Food", "Electronics", "Clothing", "Home & Garden", "Health", "Other"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function Products() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product created successfully" });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const product: ProductCreate = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      cost_price: Number(formData.get("cost_price")),
      selling_price: Number(formData.get("selling_price")),
      inventory: Number(formData.get("inventory")),
      units_per_batch: Number(formData.get("units_per_batch")),
      production_cost: Number(formData.get("production_cost")),
      production_time: Number(formData.get("production_time")),
    };
    createMutation.mutate(product);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  const columns = [
    {
      header: "Product",
      accessorKey: (row: Product) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-sm text-muted-foreground">{row.category}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Cost Price",
      accessorKey: (row: Product) => formatCurrency(row.cost_price),
    },
    {
      header: "Selling Price",
      accessorKey: (row: Product) => formatCurrency(row.selling_price),
    },
    {
      header: "Margin",
      accessorKey: (row: Product) => {
        const margin = ((row.selling_price - row.cost_price) / row.selling_price) * 100;
        return (
          <StatusBadge variant={margin >= 20 ? "success" : margin >= 10 ? "warning" : "destructive"}>
            {margin.toFixed(1)}%
          </StatusBadge>
        );
      },
    },
    {
      header: "Inventory",
      accessorKey: (row: Product) => (
        <StatusBadge variant={row.inventory > 50 ? "success" : row.inventory > 20 ? "warning" : "destructive"}>
          {row.inventory} units
        </StatusBadge>
      ),
    },
  ];

  const totalInventory = products?.reduce((acc, p) => acc + p.inventory, 0) || 0;
  const avgMargin = products?.length
    ? products.reduce((acc, p) => acc + ((p.selling_price - p.cost_price) / p.selling_price) * 100, 0) /
      products.length
    : 0;

  return (
    <div className="space-y-8">
      <PageHeader title="Products" description="Manage your product catalog and inventory">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your inventory
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" required placeholder="e.g., Peanut Butter" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost_price">Cost Price (₹)</Label>
                  <Input id="cost_price" name="cost_price" type="number" required min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selling_price">Selling Price (₹)</Label>
                  <Input id="selling_price" name="selling_price" type="number" required min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inventory">Initial Inventory</Label>
                  <Input id="inventory" name="inventory" type="number" required min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units_per_batch">Units per Batch</Label>
                  <Input id="units_per_batch" name="units_per_batch" type="number" required min="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="production_cost">Production Cost (₹)</Label>
                  <Input id="production_cost" name="production_cost" type="number" required min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="production_time">Production Time (hrs)</Label>
                  <Input id="production_time" name="production_time" type="number" required min="0" step="0.5" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{products?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-success/10 p-3">
              <Archive className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Inventory</p>
              <p className="text-2xl font-bold">{totalInventory} units</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-accent/20 p-3">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Margin</p>
              <p className="text-2xl font-bold">{avgMargin.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <DataTable
        columns={columns}
        data={products || []}
        emptyMessage="No products yet. Add your first product to get started."
      />
    </div>
  );
}
