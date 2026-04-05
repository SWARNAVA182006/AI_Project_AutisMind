"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SessionCard, Session } from "@/components/history/session-card";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { History, Search, Filter, Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import { RiskLevel } from "@/components/results/risk-badge";

/**
 * HistoryPage Component
 * Displays a list of all previous screening sessions.
 * Features filtering, search, and session management capabilities.
 */
export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  useEffect(() => {
    /**
     * API PLACEHOLDER
     * Replace this with actual API call to fetch session history
     * Expected endpoint: GET /api/sessions
     * 
     * Expected response:
     * {
     *   sessions: Array<{
     *     session_id: string,
     *     date: string,
     *     time: string,
     *     risk_score: number,
     *     risk_band: "low" | "moderate" | "high",
     *     completed: boolean
     *   }>
     * }
     */
    
    const loadSessions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Mock session data for UI demonstration
        const mockSessions: Session[] = [
          {
            session_id: "sess_001",
            date: "April 3, 2026",
            time: "2:30 PM",
            risk_score: 25,
            risk_band: "low",
            completed: true,
          },
          {
            session_id: "sess_002",
            date: "March 28, 2026",
            time: "10:15 AM",
            risk_score: 52,
            risk_band: "moderate",
            completed: true,
          },
          {
            session_id: "sess_003",
            date: "March 15, 2026",
            time: "4:45 PM",
            risk_score: 78,
            risk_band: "high",
            completed: true,
          },
          {
            session_id: "sess_004",
            date: "March 1, 2026",
            time: "11:00 AM",
            risk_score: 45,
            risk_band: "moderate",
            completed: true,
          },
          {
            session_id: "sess_005",
            date: "February 20, 2026",
            time: "3:20 PM",
            risk_score: 18,
            risk_band: "low",
            completed: true,
          },
        ];
        
        setSessions(mockSessions);
        setFilteredSessions(mockSessions);
      } catch {
        setError("Failed to load session history");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSessions();
  }, []);

  // Filter sessions when search or filter changes
  useEffect(() => {
    let filtered = [...sessions];
    
    // Apply risk filter
    if (riskFilter !== "all") {
      filtered = filtered.filter((session) => session.risk_band === riskFilter);
    }
    
    // Apply search filter (by date or session ID)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (session) =>
          session.session_id.toLowerCase().includes(query) ||
          session.date.toLowerCase().includes(query)
      );
    }
    
    setFilteredSessions(filtered);
  }, [sessions, searchQuery, riskFilter]);

  // Handle session deletion
  const handleDeleteSession = (sessionId: string) => {
    /**
     * API PLACEHOLDER
     * Replace with actual API call to delete session
     * Expected endpoint: DELETE /api/sessions/{sessionId}
     */
    
    // Remove from local state (optimistic update)
    setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
  };

  // Calculate statistics
  const stats = {
    total: sessions.length,
    lowRisk: sessions.filter((s) => s.risk_band === "low").length,
    moderateRisk: sessions.filter((s) => s.risk_band === "moderate").length,
    highRisk: sessions.filter((s) => s.risk_band === "high").length,
    avgScore: sessions.length > 0
      ? Math.round(sessions.reduce((acc, s) => acc + s.risk_score, 0) / sessions.length)
      : 0,
  };

  // Determine trend (comparing latest to previous)
  const getTrend = () => {
    if (sessions.length < 2) return "neutral";
    const latest = sessions[0].risk_score;
    const previous = sessions[1].risk_score;
    if (latest < previous) return "improving";
    if (latest > previous) return "worsening";
    return "neutral";
  };

  const trend = getTrend();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingState message="Loading session history..." />
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <ErrorState
            title="Failed to Load History"
            message={error}
            onRetry={() => window.location.reload()}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Page header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Session History</h1>
              <p className="text-muted-foreground">
                View and manage your past screening sessions
              </p>
            </div>
            <Button asChild>
              <Link href="/screening">
                <Plus className="mr-2 h-4 w-4" />
                New Screening
              </Link>
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                    <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <History className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-3xl font-bold text-foreground">{stats.avgScore}%</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    trend === "improving" ? "bg-success/10" : 
                    trend === "worsening" ? "bg-destructive/10" : "bg-muted"
                  }`}>
                    {trend === "improving" ? (
                      <TrendingDown className="h-6 w-6 text-success" />
                    ) : trend === "worsening" ? (
                      <TrendingUp className="h-6 w-6 text-destructive" />
                    ) : (
                      <Minus className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">Risk Distribution</p>
                    <div className="flex gap-1">
                      <div 
                        className="h-2 rounded-l-full bg-success"
                        style={{ width: `${stats.total ? (stats.lowRisk / stats.total) * 100 : 0}%` }}
                      />
                      <div 
                        className="h-2 bg-warning"
                        style={{ width: `${stats.total ? (stats.moderateRisk / stats.total) * 100 : 0}%` }}
                      />
                      <div 
                        className="h-2 rounded-r-full bg-destructive"
                        style={{ width: `${stats.total ? (stats.highRisk / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Low: {stats.lowRisk}</span>
                  <span>Mod: {stats.moderateRisk}</span>
                  <span>High: {stats.highRisk}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Latest Result</p>
                {sessions.length > 0 ? (
                  <>
                    <p className="text-3xl font-bold text-foreground">{sessions[0].risk_score}%</p>
                    <p className="text-xs text-muted-foreground mt-1">{sessions[0].date}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">No sessions yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by date or session ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Risk filter */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by risk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="moderate">Moderate Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sessions List */}
          {filteredSessions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredSessions.map((session) => (
                <SessionCard
                  key={session.session_id}
                  session={session}
                  onDelete={handleDeleteSession}
                />
              ))}
            </div>
          ) : sessions.length > 0 ? (
            // No results for current filter
            <Card>
              <CardContent className="py-12">
                <EmptyState
                  icon={Search}
                  title="No Results Found"
                  description="No sessions match your current filters. Try adjusting your search or filter criteria."
                />
              </CardContent>
            </Card>
          ) : (
            // No sessions at all
            <Card>
              <CardContent className="py-12">
                <EmptyState
                  icon={History}
                  title="No Sessions Yet"
                  description="You haven't completed any screening sessions yet. Start your first assessment to see your history here."
                  actionLabel="Start First Screening"
                  actionHref="/screening"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
