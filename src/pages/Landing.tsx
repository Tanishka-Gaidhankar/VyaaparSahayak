import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  BarChart3, 
  Box, 
  Shield, 
  Zap, 
  TrendingUp,
  Users,
  CheckCircle2,
  Sparkles,
  IndianRupee,
  Factory,
  FileText
} from "lucide-react";

const features = [
  {
    icon: Box,
    title: "Smart Inventory",
    description: "Track products, stock levels, and get low-inventory alerts automatically."
  },
  {
    icon: Factory,
    title: "Production Tracking",
    description: "Monitor manufacturing costs, efficiency, and detect cost leakages."
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description: "Understand channel-wise performance and identify your best sellers."
  },
  {
    icon: Shield,
    title: "AI Risk Analysis",
    description: "Get AI-powered insights on business risks and actionable recommendations."
  },
  {
    icon: FileText,
    title: "Government Schemes",
    description: "Discover eligible schemes and subsidies for your MSME business."
  },
  {
    icon: TrendingUp,
    title: "Profit Optimization",
    description: "Track margins, identify leakages, and maximize your profitability."
  }
];

const stats = [
  { value: "10,000+", label: "MSMEs Empowered" },
  { value: "₹50Cr+", label: "Revenue Tracked" },
  { value: "98%", label: "User Satisfaction" },
  { value: "24/7", label: "AI Support" }
];

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Set up your business profile in minutes with our simple onboarding."
  },
  {
    step: "02",
    title: "Add Your Products",
    description: "Import or add your inventory and production details."
  },
  {
    step: "03",
    title: "Track & Grow",
    description: "Get instant insights, track orders, and grow your business."
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">VyaaparSahayak</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Login</Link>
              </Button>
              <Button asChild className="shadow-md">
                <Link to="/onboarding">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Business Intelligence for MSMEs
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Grow Your Business with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"> Smart Insights</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              The all-in-one platform for Indian MSMEs to manage inventory, track production, 
              analyze sales, and discover government schemes — powered by AI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="text-lg px-8 shadow-lg shadow-primary/25">
                <Link to="/onboarding">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link to="/dashboard">View Demo</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm">14-day free trial</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm">Made for India</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful tools designed specifically for Indian small businesses and manufacturers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground">
              From signup to insights in minutes, not days.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="text-6xl font-bold text-primary/10 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-primary/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 lg:p-16 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-xl" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Join thousands of Indian MSMEs already using VyaaparSahayak to grow smarter.
              </p>
              <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                <Link to="/onboarding">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">VyaaparSahayak</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IndianRupee className="w-4 h-4" />
              Made with ❤️ in India
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
