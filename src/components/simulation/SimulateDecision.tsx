import { useState } from "react";
import { Brain, TrendingUp, TrendingDown, Package, DollarSign, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SimulationResult {
  revenueImpact: { value: number; positive: boolean };
  profitImpact: { value: number; positive: boolean };
  unitsSoldChange: { value: number; positive: boolean };
  inventoryRisk: "low" | "medium" | "high";
  confidence: "low" | "medium" | "high";
  verdict: "proceed" | "modify" | "avoid";
}

const DECISION_OPTIONS = [
  { value: "price_increase_5", label: "Increase price by 5%" },
  { value: "price_increase_10", label: "Increase price by 10%" },
  { value: "price_decrease_5", label: "Decrease price by 5%" },
  { value: "pause_amazon", label: "Pause Amazon for selected period" },
  { value: "pause_blinkit", label: "Pause Blinkit for selected period" },
  { value: "double_production", label: "Double production capacity" },
  { value: "reduce_production", label: "Reduce production by 30%" },
  { value: "new_channel", label: "Launch on new channel" },
];

const TIME_RANGES = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
];

export function SimulateDecision() {
  const [decision, setDecision] = useState<string>("");
  const [timeRange, setTimeRange] = useState<string>("14");
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const runSimulation = async () => {
    if (!decision) return;
    
    setIsSimulating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock simulation results based on decision type
    const mockResults: Record<string, SimulationResult> = {
      price_increase_5: {
        revenueImpact: { value: 8.2, positive: true },
        profitImpact: { value: 12.5, positive: true },
        unitsSoldChange: { value: -3.1, positive: false },
        inventoryRisk: "low",
        confidence: "high",
        verdict: "proceed",
      },
      price_increase_10: {
        revenueImpact: { value: 4.1, positive: true },
        profitImpact: { value: 18.2, positive: true },
        unitsSoldChange: { value: -8.5, positive: false },
        inventoryRisk: "medium",
        confidence: "medium",
        verdict: "modify",
      },
      price_decrease_5: {
        revenueImpact: { value: 2.3, positive: true },
        profitImpact: { value: -4.2, positive: false },
        unitsSoldChange: { value: 15.8, positive: true },
        inventoryRisk: "high",
        confidence: "medium",
        verdict: "modify",
      },
      pause_amazon: {
        revenueImpact: { value: -35.2, positive: false },
        profitImpact: { value: -28.4, positive: false },
        unitsSoldChange: { value: -42.1, positive: false },
        inventoryRisk: "high",
        confidence: "high",
        verdict: "avoid",
      },
      pause_blinkit: {
        revenueImpact: { value: -18.5, positive: false },
        profitImpact: { value: -15.2, positive: false },
        unitsSoldChange: { value: -22.3, positive: false },
        inventoryRisk: "medium",
        confidence: "high",
        verdict: "avoid",
      },
      double_production: {
        revenueImpact: { value: 45.2, positive: true },
        profitImpact: { value: 32.1, positive: true },
        unitsSoldChange: { value: 85.4, positive: true },
        inventoryRisk: "high",
        confidence: "low",
        verdict: "modify",
      },
      reduce_production: {
        revenueImpact: { value: -12.3, positive: false },
        profitImpact: { value: 5.2, positive: true },
        unitsSoldChange: { value: -25.1, positive: false },
        inventoryRisk: "low",
        confidence: "medium",
        verdict: "proceed",
      },
      new_channel: {
        revenueImpact: { value: 22.5, positive: true },
        profitImpact: { value: 15.8, positive: true },
        unitsSoldChange: { value: 35.2, positive: true },
        inventoryRisk: "medium",
        confidence: "medium",
        verdict: "proceed",
      },
    };

    setResult(mockResults[decision] || mockResults.price_increase_5);
    setIsSimulating(false);
  };

  const getConfidenceBadge = (confidence: string) => {
    const styles = {
      low: "bg-destructive/10 text-destructive border-destructive/20",
      medium: "bg-warning/10 text-warning border-warning/20",
      high: "bg-success/10 text-success border-success/20",
    };
    return styles[confidence as keyof typeof styles];
  };

  const getVerdictBadge = (verdict: string) => {
    const config = {
      proceed: { style: "bg-success text-success-foreground", icon: CheckCircle, label: "Proceed" },
      modify: { style: "bg-warning text-warning-foreground", icon: AlertTriangle, label: "Modify" },
      avoid: { style: "bg-destructive text-destructive-foreground", icon: XCircle, label: "Avoid" },
    };
    return config[verdict as keyof typeof config];
  };

  const getRiskBadge = (risk: string) => {
    const styles = {
      low: "text-success",
      medium: "text-warning",
      high: "text-destructive",
    };
    return styles[risk as keyof typeof styles];
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Simulate My Decision</CardTitle>
            <CardDescription>Test business decisions before implementing them</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Input Section */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Decision to Simulate</label>
            <Select value={decision} onValueChange={setDecision}>
              <SelectTrigger>
                <SelectValue placeholder="Select a decision..." />
              </SelectTrigger>
              <SelectContent>
                {DECISION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Time Range</label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={runSimulation} 
          disabled={!decision || isSimulating}
          className="w-full"
          size="lg"
        >
          {isSimulating ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              Running Simulation...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Run Simulation
            </>
          )}
        </Button>

        {/* Results Section */}
        {result && (
          <div className="space-y-4 pt-4 border-t border-border animate-fade-in">
            {/* Verdict & Confidence */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">AI Verdict:</span>
                {(() => {
                  const verdict = getVerdictBadge(result.verdict);
                  const Icon = verdict.icon;
                  return (
                    <Badge className={cn("gap-1", verdict.style)}>
                      <Icon className="h-3 w-3" />
                      {verdict.label}
                    </Badge>
                  );
                })()}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Confidence:</span>
                <Badge variant="outline" className={getConfidenceBadge(result.confidence)}>
                  {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs font-medium">Revenue Impact</span>
                </div>
                <div className={cn(
                  "text-xl font-bold flex items-center gap-1",
                  result.revenueImpact.positive ? "text-success" : "text-destructive"
                )}>
                  {result.revenueImpact.positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {result.revenueImpact.positive ? "+" : ""}{result.revenueImpact.value}%
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium">Profit Impact</span>
                </div>
                <div className={cn(
                  "text-xl font-bold flex items-center gap-1",
                  result.profitImpact.positive ? "text-success" : "text-destructive"
                )}>
                  {result.profitImpact.positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {result.profitImpact.positive ? "+" : ""}{result.profitImpact.value}%
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span className="text-xs font-medium">Units Sold Change</span>
                </div>
                <div className={cn(
                  "text-xl font-bold flex items-center gap-1",
                  result.unitsSoldChange.positive ? "text-success" : "text-destructive"
                )}>
                  {result.unitsSoldChange.positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {result.unitsSoldChange.positive ? "+" : ""}{result.unitsSoldChange.value}%
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-medium">Inventory Risk</span>
                </div>
                <div className={cn("text-xl font-bold capitalize", getRiskBadge(result.inventoryRisk))}>
                  {result.inventoryRisk}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
