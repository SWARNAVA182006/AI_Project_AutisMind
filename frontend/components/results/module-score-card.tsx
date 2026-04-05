import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Props interface for ModuleScoreCard
 */
interface ModuleScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  icon: LucideIcon;
  description?: string;
}

/**
 * ModuleScoreCard Component
 * Displays individual module scores with a progress bar visualization.
 * Used in the Results Dashboard to show breakdown by assessment category.
 */
export function ModuleScoreCard({
  title,
  score,
  maxScore = 100,
  icon: Icon,
  description,
}: ModuleScoreCardProps) {
  // Calculate percentage for progress bar
  const percentage = Math.round((score / maxScore) * 100);

  // Determine color based on score threshold
  const getScoreColor = () => {
    if (percentage >= 70) return "text-success";
    if (percentage >= 40) return "text-warning-foreground";
    return "text-destructive";
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-base font-medium">{title}</CardTitle>
          </div>
          <span className={cn("text-2xl font-bold", getScoreColor())}>
            {score}
            <span className="text-sm text-muted-foreground font-normal">/{maxScore}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Progress
          value={percentage}
          className="h-2 mb-2"
        />
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
