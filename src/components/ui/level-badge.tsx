import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: 'beginner' | 'intermediate' | 'advanced';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LevelBadge = ({ level, size = 'md', className }: LevelBadgeProps) => {
  const labels = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
  };

  const colors = {
    beginner: 'bg-level-beginner text-white',
    intermediate: 'bg-level-intermediate text-foreground',
    advanced: 'bg-level-advanced text-white',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full",
        colors[level],
        sizes[size],
        className
      )}
    >
      <span className="w-2 h-2 rounded-full bg-current opacity-50" />
      {labels[level]}
    </span>
  );
};