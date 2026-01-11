import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Factory,
  FileText,
  AlertTriangle,
  Building2,
  Menu,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getStartupProfile, type StartupProfile } from "@/lib/api";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Products", href: "/products", icon: Package },
  { title: "Orders", href: "/orders", icon: ShoppingCart },
  { title: "Production", href: "/production", icon: Factory },
  { title: "Marketing", href: "/marketing", icon: Megaphone },
  { title: "AI Growth", href: "/ai-growth", icon: Sparkles },
  { title: "Schemes", href: "/schemes", icon: FileText },
  { title: "Risk Analysis", href: "/risk-analysis", icon: AlertTriangle },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<StartupProfile | null>(null);

  useEffect(() => {
    const profileId = localStorage.getItem("startup_profile_id");
    if (profileId) {
      getStartupProfile(Number(profileId))
        .then(setProfile)
        .catch((err) => console.error("Failed to load profile:", err));
    }
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm transition-opacity lg:hidden",
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={() => setCollapsed(true)}
      />

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col bg-sidebar transition-all duration-300",
          "lg:relative lg:translate-x-0",
          collapsed ? "-translate-x-full lg:w-20" : "translate-x-0 w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in flex-1 min-w-0">
              <h1 className="font-bold text-sidebar-foreground truncate">
                {profile?.business_name || "VyaaparSahayak"}
              </h1>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {profile?.industry || "Business Intelligence"}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  "hover:bg-sidebar-accent",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                    : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
                )}
                onClick={() => window.innerWidth < 1024 && setCollapsed(true)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="animate-fade-in">{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse toggle for desktop */}
        <div className="hidden border-t border-sidebar-border p-3 lg:block">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </aside>
    </>
  );
}
