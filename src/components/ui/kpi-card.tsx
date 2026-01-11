import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
  className?: string;
}

const variantStyles = {
  default: "bg-card border border-border",
  primary: "gradient-primary text-primary-foreground border-0",
  success: "bg-success/10 border border-success/20",
  warning: "bg-warning/10 border border-warning/20",
  destructive: "bg-destructive/10 border border-destructive/20",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary-foreground/20 text-primary-foreground",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  destructive: "bg-destructive/20 text-destructive",
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: KPICardProps) {
  const isPrimary = variant === "primary";

  return (
    <div
      className={cn(
        "rounded-xl p-5 shadow-card transition-all duration-300 hover:shadow-lg animate-scale-in",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p
            className={cn(
              "text-sm font-medium",
              isPrimary ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              "text-2xl font-bold tracking-tight",
              isPrimary ? "text-primary-foreground" : "text-foreground"
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p
              className={cn(
                "text-xs",
                isPrimary ? "text-primary-foreground/60" : "text-muted-foreground"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5", iconVariantStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={cn(
              "text-xs font-medium",
              trend.positive
                ? isPrimary
                  ? "text-primary-foreground"
                  : "text-success"
                : isPrimary
                ? "text-primary-foreground/80"
                : "text-destructive"
            )}
          >
            {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          <span
            className={cn(
              "text-xs",
              isPrimary ? "text-primary-foreground/60" : "text-muted-foreground"
            )}
          >
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}
