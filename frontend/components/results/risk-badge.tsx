import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

/**
 * Risk level type definition
 * Used throughout the application for consistent risk categorization
 */
export type RiskLevel = "low" | "moderate" | "high";

/**
 * Props interface for RiskBadge component
 */
interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * RiskBadge Component
 * Visual indicator for risk levels (Low, Moderate, High).
 * Color-coded for quick visual understanding:
 * - Low: Green (success color)
 * - Moderate: Yellow/Amber (warning color)
 * - High: Red (destructive color)
 */
export function RiskBadge({ level, showIcon = true, size = "md", className }: RiskBadgeProps) {
  // Configuration for each risk level
  const config = {
    low: {
      label: "Low Risk",
      icon: CheckCircle,
      bgClass: "bg-success/10",
      textClass: "text-success",
      borderClass: "border-success/30",
    },
    moderate: {
      label: "Moderate Risk",
      icon: AlertCircle,
      bgClass: "bg-warning/10",
      textClass: "text-warning-foreground",
      borderClass: "border-warning/30",
    },
    high: {
      label: "High Risk",
      icon: AlertTriangle,
      bgClass: "bg-destructive/10",
      textClass: "text-destructive",
      borderClass: "border-destructive/30",
    },
  };

  // Size classes for different badge sizes
  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  // Icon size classes
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const { label, icon: Icon, bgClass, textClass, borderClass } = config[level];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        bgClass,
        textClass,
        borderClass,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{label}</span>
    </div>
  );
}
