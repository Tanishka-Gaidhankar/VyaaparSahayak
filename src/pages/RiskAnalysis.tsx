import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Lightbulb,
  Key,
  Building2,
} from "lucide-react";
import { runRiskAnalysis, type RiskReport } from "@/lib/api";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";

function RiskLevelIcon({ level }: { level: string }) {
  switch (level.toLowerCase()) {
    case "low":
      return <ShieldCheck className="h-12 w-12 text-success" />;
    case "medium":
      return <ShieldAlert className="h-12 w-12 text-warning" />;
    case "high":
      return <ShieldX className="h-12 w-12 text-destructive" />;
    default:
      return <AlertTriangle className="h-12 w-12 text-muted-foreground" />;
  }
}

function RiskLevelBadge({ level }: { level: string }) {
  const variant =
    level.toLowerCase() === "low"
      ? "success"
      : level.toLowerCase() === "medium"
        ? "warning"
        : "destructive";

  return (
    <StatusBadge variant={variant} className="text-base px-4 py-1">
      {level.toUpperCase()} RISK
    </StatusBadge>
  );
}

export default function RiskAnalysis() {
  const [report, setReport] = useState<RiskReport | null>(null);
  const { toast } = useToast();

  const profileId = localStorage.getItem("startup_profile_id");

  const analysisMutation = useMutation({
    mutationFn: runRiskAnalysis,
    onSuccess: (data) => {
      setReport(data);
      toast({ title: "Risk analysis complete" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleAnalyze = () => {
    if (!profileId) {
      toast({
        title: "Profile required",
        description: "Please complete your startup profile first",
        variant: "destructive",
      });
      return;
    }

    analysisMutation.mutate({
      startup_profile_id: Number(profileId),
      // No key needed from frontend
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Risk Analysis"
        description="Get AI-powered insights and action plans for your business"
      />

      {!profileId && (
        <Card className="border-warning/50 bg-warning/5 shadow-card">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-warning/20 p-3">
              <Building2 className="h-6 w-6 text-warning" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Complete your profile first</p>
              <p className="text-sm text-muted-foreground">
                Risk analysis requires your startup profile to generate personalized insights
              </p>
            </div>
            <Button variant="outline" asChild>
              <a href="/onboarding">Set Up Profile</a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analysis Trigger - Simplified */}
      <Card className="shadow-card border-l-4 border-l-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Generate Risk Report
          </CardTitle>
          <CardDescription>
            Analyze your latest sales, inventory, and production data to detect risks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleAnalyze}
            disabled={analysisMutation.isPending || !profileId}
            size="lg"
            className="gap-2 w-full sm:w-auto"
          >
            {analysisMutation.isPending ? (
              <>
                <LoadingSpinner size="sm" />
                Analyzing Business Data...
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4" />
                Run AI Risk Analysis
              </>
            )}
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            * Uses secure server-side AI processing (GROQ)
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      {report && (
        <div className="space-y-6 animate-slide-up">
          {/* Risk Level Overview */}
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center py-8 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="flex items-center gap-6">
                <RiskLevelIcon level={report.risk_level} />
                <div>
                  <p className="text-sm text-muted-foreground">Overall Risk Level</p>
                  <RiskLevelBadge level={report.risk_level} />
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground sm:mt-0 sm:max-w-xs">
                Based on your business profile and current operations
              </p>
            </CardContent>
          </Card>

          {/* Individual Risks */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Identified Risks</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {report.risks.map((risk, index) => (
                <Card
                  key={index}
                  className="shadow-card animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="rounded-lg bg-destructive/10 p-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      </div>
                      <StatusBadge
                        variant={
                          risk.severity === "high"
                            ? "destructive"
                            : risk.severity === "medium"
                              ? "warning"
                              : "default"
                        }
                      >
                        {risk.severity}
                      </StatusBadge>
                    </div>
                    <CardTitle className="mt-2 text-base capitalize">
                      {risk.type.replace(/_/g, " ")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{risk.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Action Plan */}
          <Card className="shadow-card border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                AI-Generated Action Plan
              </CardTitle>
              <CardDescription>
                Personalized recommendations using {report.ai_action_plan.includes("mock-fallback") ? "simulated insights" : "Advanced AI"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground">
                {report.ai_action_plan.split("\n").map((line, index) => (
                  <p key={index} className="mb-2">
                    {line}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
