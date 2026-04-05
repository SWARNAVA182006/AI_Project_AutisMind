"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge, RiskLevel } from "@/components/results/risk-badge";
import { Calendar, Clock, ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";

/**
 * Session interface - structure for session data
 * These fields will be populated from backend API
 */
export interface Session {
  session_id: string;
  date: string;
  time: string;
  risk_score: number;
  risk_band: RiskLevel;
  completed: boolean;
}

/**
 * Props interface for SessionCard
 */
interface SessionCardProps {
  session: Session;
  onDelete?: (sessionId: string) => void;
}

/**
 * SessionCard Component
 * Displays a summary card for a past screening session.
 * Used in the Session History page to list all previous assessments.
 */
export function SessionCard({ session, onDelete }: SessionCardProps) {
  return (
    <Card className="transition-all hover:shadow-md hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Date and time information */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{session.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{session.time}</span>
            </div>
          </div>
          
          {/* Risk badge */}
          <RiskBadge level={session.risk_band} size="sm" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Risk Score</p>
            <p className="text-2xl font-bold text-foreground">{session.risk_score}%</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Delete button (placeholder) */}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(session.session_id)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Delete session"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            
            {/* View details link */}
            <Button asChild variant="outline" size="sm">
              <Link href={`/results?session=${session.session_id}`}>
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="mt-3 pt-3 border-t border-border">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium",
              session.completed ? "text-success" : "text-warning-foreground"
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                session.completed ? "bg-success" : "bg-warning"
              )}
            />
            {session.completed ? "Completed" : "In Progress"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to apply conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
