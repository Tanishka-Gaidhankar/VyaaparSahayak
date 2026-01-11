import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl animate-fade-in">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>{children}</div>}
    </div>
  );
}
