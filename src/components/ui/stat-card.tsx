import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  variant = 'default',
  className 
}: StatCardProps) => {
  const variants = {
    default: 'bg-card border-border',
    primary: 'gradient-primary text-white border-transparent',
    success: 'gradient-success text-white border-transparent',
    warning: 'bg-warning text-warning-foreground border-transparent',
  };

  const iconVariants = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-white/20 text-white',
    success: 'bg-white/20 text-white',
    warning: 'bg-foreground/10 text-warning-foreground',
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-lg animate-fade-in",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn(
            "text-sm font-medium",
            variant === 'default' ? 'text-muted-foreground' : 'opacity-90'
          )}>
            {title}
          </p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className={cn(
              "text-xs",
              variant === 'default' ? 'text-muted-foreground' : 'opacity-75'
            )}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn("p-2 rounded-lg", iconVariants[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};