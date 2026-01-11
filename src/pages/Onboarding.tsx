import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Building2, ArrowRight, CheckCircle } from "lucide-react";
import { createStartupProfile, type StartupProfile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const businessTypes = ["Manufacturing", "Trading", "Services", "Agriculture", "Other"];
const industries = ["FMCG", "Electronics", "Textiles", "Food & Beverage", "Healthcare", "Technology", "Other"];
const growthStages = ["Idea", "Early", "Growth", "Mature"];
const locations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Other",
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [msmeRegistered, setMsmeRegistered] = useState(false);

  const createMutation = useMutation({
    mutationFn: createStartupProfile,
    onSuccess: (data) => {
      localStorage.setItem("startup_profile_id", String(data.id));
      toast({ title: "Profile created successfully!" });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const profile: StartupProfile = {
      business_name: formData.get("business_name") as string,
      business_type: formData.get("business_type") as string,
      industry: formData.get("industry") as string,
      location: formData.get("location") as string,
      growth_stage: formData.get("growth_stage") as string,
      msme_registered: msmeRegistered,
      annual_revenue: Number(formData.get("annual_revenue")),
    };

    createMutation.mutate(profile);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to VyaaparSahayak</h1>
          <p className="mt-2 text-muted-foreground">
            Let's set up your business profile to unlock all features
          </p>
        </div>

        {/* Form */}
        <Card className="shadow-card animate-slide-up">
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
            <CardDescription>
              This information helps us personalize your experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  id="business_name"
                  name="business_name"
                  required
                  placeholder="e.g., ComfNet Foods"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Select name="business_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select name="industry" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select name="location" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Growth Stage</Label>
                  <Select name="growth_stage" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {growthStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual_revenue">Annual Revenue (₹)</Label>
                <Input
                  id="annual_revenue"
                  name="annual_revenue"
                  type="number"
                  required
                  min="0"
                  placeholder="e.g., 4500000"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="msme_registered" className="font-medium">
                    MSME Registered
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Do you have MSME/Udyam registration?
                  </p>
                </div>
                <Switch
                  id="msme_registered"
                  checked={msmeRegistered}
                  onCheckedChange={setMsmeRegistered}
                />
              </div>

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  "Setting up..."
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          {[
            { title: "Schemes", desc: "Discover eligible government schemes" },
            { title: "AI Insights", desc: "Get personalized risk analysis" },
            { title: "Analytics", desc: "Track your business growth" },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg bg-muted/50 p-3"
            >
              <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
