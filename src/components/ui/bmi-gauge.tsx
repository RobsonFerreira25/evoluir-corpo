import { cn } from "@/lib/utils";

interface BMIGaugeProps {
  bmi: number;
  category: string;
  className?: string;
}

export const BMIGauge = ({ bmi, category, className }: BMIGaugeProps) => {
  // BMI ranges: <18.5, 18.5-24.9, 25-29.9, 30-34.9, 35-39.9, 40+
  const getPosition = () => {
    if (bmi < 18.5) return (bmi / 18.5) * 16.66;
    if (bmi < 25) return 16.66 + ((bmi - 18.5) / 6.5) * 16.66;
    if (bmi < 30) return 33.32 + ((bmi - 25) / 5) * 16.66;
    if (bmi < 35) return 49.98 + ((bmi - 30) / 5) * 16.66;
    if (bmi < 40) return 66.64 + ((bmi - 35) / 5) * 16.66;
    return Math.min(83.3 + ((bmi - 40) / 10) * 16.66, 100);
  };

  const getCategoryColor = () => {
    if (bmi < 18.5) return 'text-blue-500';
    if (bmi < 25) return 'text-success';
    if (bmi < 30) return 'text-warning';
    return 'text-destructive';
  };

  const position = getPosition();

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-end mb-2">
        <div>
          <span className="text-4xl font-bold">{bmi}</span>
          <span className="text-muted-foreground ml-2">kg/m²</span>
        </div>
        <span className={cn("text-lg font-semibold", getCategoryColor())}>
          {category}
        </span>
      </div>
      
      {/* Gauge bar */}
      <div className="relative h-4 rounded-full overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-blue-400" />
          <div className="flex-1 bg-success" />
          <div className="flex-1 bg-warning" />
          <div className="flex-1 bg-orange-500" />
          <div className="flex-1 bg-destructive" />
          <div className="flex-1 bg-red-700" />
        </div>
        
        {/* Indicator */}
        <div 
          className="absolute top-0 w-1 h-full bg-foreground rounded-full shadow-lg transition-all duration-500"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>35</span>
        <span>40</span>
      </div>
    </div>
  );
};