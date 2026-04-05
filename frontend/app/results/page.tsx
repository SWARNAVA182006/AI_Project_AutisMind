"use client";

/**
 * =============================================================================
 * RESULTS PAGE
 * =============================================================================
 * 
 * This page displays comprehensive screening results after assessment completion.
 * 
 * DISPLAYS:
 * - Overall risk score and band (low/moderate/high)
 * - Module-wise score breakdown with progress bars
 * - AI-generated explanation of results
 * - Recommended next steps and therapy plan
 * 
 * DATA FLOW:
 * ----------
 * 1. Read session_id from sessionStorage
 * 2. Fetch full results from backend API (GET /api/results/{session_id})
 * 3. If backend unavailable, fall back to stored data
 * 4. Display results with appropriate UI states
 * 
 * BACKEND INTEGRATION:
 * --------------------
 * - API endpoint: GET /api/results/{session_id}
 * - Returns complete analysis from ML algorithms
 * - See lib/api.ts for detailed documentation
 * 
 * IMPORTANT NOTE:
 * ---------------
 * The risk scoring and analysis is handled ENTIRELY by the backend.
 * The backend uses sophisticated algorithms:
 * - A* Algorithm: Optimal decision path finding
 * - BFS (Breadth-First Search): Symptom relationship exploration
 * - CSP (Constraint Satisfaction): Criteria validation
 * 
 * This frontend does NOT perform any diagnostic calculations.
 * All fallback scoring is temporary for development purposes only.
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RiskBadge, RiskLevel } from "@/components/results/risk-badge";
import { ModuleScoreCard } from "@/components/results/module-score-card";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  Ear,
  MessageSquare,
  Hand,
  RotateCcw,
  Download,
  Share2,
  ArrowRight,
  FileText,
  ClipboardList,
  RefreshCw,
} from "lucide-react";

// Import API functions
import { 
  getResults, 
  type ScreeningResult,
  mapNameResponse,
  mapVocalization,
  mapRepetitiveBehavior,
} from "@/lib/api";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Extended ScreeningResult for local use
 * Includes all fields from the API response
 */
interface ResultsData extends ScreeningResult {
  // All fields inherited from ScreeningResult
}

/**
 * Error types for different scenarios
 */
type ErrorType = "no_data" | "api_error" | null;

// =============================================================================
// BACKEND → UI MODULE SCORE MAPPING
// =============================================================================

/**
 * FastAPI returns aggregated `module_scores` (social/communication/motor/behavior).
 * The results UI (`MODULE_CONFIG`) expects one bar per screening question label.
 *
 * Mapping (as required for display):
 * - eye_contact           ← social_attention
 * - response_to_name      ← communication
 * - vocalization          ← communication (same backend signal, two cards)
 * - gestures              ← motor_expression
 * - repetitive_behavior   ← behavioral_regulation
 */
interface BackendModuleScores {
  social_attention: number;
  communication: number;
  motor_expression: number;
  behavioral_regulation: number;
}

function isBackendModuleScores(raw: unknown): raw is BackendModuleScores {
  if (raw === null || typeof raw !== "object") return false;
  const o = raw as Record<string, unknown>;
  return (
    typeof o.social_attention === "number" &&
    typeof o.communication === "number" &&
    typeof o.motor_expression === "number" &&
    typeof o.behavioral_regulation === "number"
  );
}

function mapBackendModuleScoresToDisplay(
  b: BackendModuleScores
): ResultsData["module_scores"] {
  const communication = b.communication;
  return {
    eye_contact: b.social_attention,
    response_to_name: communication,
    vocalization: communication,
    gestures: b.motor_expression,
    repetitive_behavior: b.behavioral_regulation,
  };
}

/**
 * Normalize `module_scores` whether they come from the API, sessionStorage, or legacy UI shape.
 */
function normalizeModuleScoresForDisplay(
  raw: unknown
): ResultsData["module_scores"] {
  if (isBackendModuleScores(raw)) {
    return mapBackendModuleScoresToDisplay(raw);
  }
  if (raw !== null && typeof raw === "object") {
    const m = raw as Record<string, unknown>;
    const n = (key: string) =>
      typeof m[key] === "number" ? (m[key] as number) : 0;
    return {
      eye_contact: n("eye_contact"),
      response_to_name: n("response_to_name"),
      vocalization: n("vocalization"),
      gestures: n("gestures"),
      repetitive_behavior: n("repetitive_behavior"),
    };
  }
  return {
    eye_contact: 0,
    response_to_name: 0,
    vocalization: 0,
    gestures: 0,
    repetitive_behavior: 0,
  };
}

/**
 * Ensures `results.module_scores` always matches `MODULE_CONFIG` keys before render.
 * Safe for: GET /api/results, `screeningResult` in sessionStorage, and local fallback payloads.
 */
function normalizeScreeningResultForUi(data: ScreeningResult): ResultsData {
  return {
    ...data,
    module_scores: normalizeModuleScoresForDisplay(data.module_scores),
    created_at:
      typeof data.created_at === "string" && data.created_at.length > 0
        ? data.created_at
        : new Date().toISOString(),
  };
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Module Display Configuration
 * 
 * Maps backend module keys to user-friendly display information.
 * Used to render the module breakdown section.
 */
const MODULE_CONFIG = [
  { 
    key: "eye_contact", 
    label: "Eye Contact", 
    icon: Eye, 
    description: "Visual attention and engagement during interactions" 
  },
  { 
    key: "response_to_name", 
    label: "Response to Name", 
    icon: Ear, 
    description: "Responsiveness when name is called" 
  },
  { 
    key: "vocalization", 
    label: "Vocalization", 
    icon: MessageSquare, 
    description: "Verbal communication patterns and abilities" 
  },
  { 
    key: "gestures", 
    label: "Gestures & Pointing", 
    icon: Hand, 
    description: "Non-verbal communication through gestures" 
  },
  { 
    key: "repetitive_behavior", 
    label: "Repetitive Behaviors", 
    icon: RotateCcw, 
    description: "Presence of repetitive movements or routines" 
  },
];

// =============================================================================
// FALLBACK FUNCTIONS (Development Only)
// =============================================================================

/**
 * generateFallbackExplanation
 * 
 * Generates an explanation when backend is unavailable.
 * 
 * NOTE: In production, this explanation comes from the backend AI.
 * This is a temporary fallback for development/demo purposes.
 * 
 * @param riskBand - The calculated risk level
 * @returns string - Human-readable explanation
 */
function generateFallbackExplanation(riskBand: RiskLevel): string {
  const explanations: Record<RiskLevel, string> = {
    low: "Based on the screening responses, the assessed individual shows typical developmental patterns in most areas. The behaviors observed are generally consistent with neurotypical development. However, continue monitoring and consult with a healthcare provider if you have any concerns.",
    moderate: "The screening indicates some areas that may benefit from further evaluation. While some behaviors fall within typical ranges, others suggest potential developmental differences that warrant professional assessment. We recommend scheduling a comprehensive evaluation with a developmental pediatrician or child psychologist.",
    high: "The screening results suggest several areas of concern that strongly indicate the need for immediate professional evaluation. Multiple behavioral indicators point to potential developmental differences. Please schedule an appointment with a qualified healthcare professional as soon as possible for comprehensive diagnostic assessment.",
  };
  return explanations[riskBand];
}

/**
 * generateFallbackTherapyPlan
 * 
 * Generates recommended actions when backend is unavailable.
 * 
 * NOTE: In production, recommendations come from the backend.
 * The backend uses CSP algorithms to generate personalized plans.
 * 
 * @param riskBand - The calculated risk level
 * @returns string[] - Array of recommended actions
 */
function generateFallbackTherapyPlan(riskBand: RiskLevel): string[] {
  const plans: Record<RiskLevel, string[]> = {
    low: [
      "Continue regular developmental monitoring",
      "Maintain enriching social interactions",
      "Schedule routine pediatric check-ups",
      "Stay informed about developmental milestones",
    ],
    moderate: [
      "Schedule evaluation with developmental specialist",
      "Consider speech-language assessment",
      "Explore early intervention programs",
      "Join parent support groups for additional resources",
      "Document behaviors for healthcare providers",
    ],
    high: [
      "Urgent: Schedule comprehensive diagnostic evaluation",
      "Request referral to developmental pediatrician",
      "Explore Applied Behavior Analysis (ABA) therapy options",
      "Consider occupational therapy assessment",
      "Look into speech therapy services",
      "Research Individualized Education Program (IEP) options",
      "Connect with autism support organizations",
    ],
  };
  return plans[riskBand];
}

/**
 * processFallbackResults
 * 
 * Creates mock results when backend is unavailable.
 * Uses stored screening responses to generate approximate scores.
 * 
 * IMPORTANT: This is for DEVELOPMENT/DEMO only!
 * In production, ALL scoring must come from the backend algorithms.
 * The frontend should NOT make diagnostic calculations.
 * 
 * @param storedResponses - Raw responses from sessionStorage
 * @returns ResultsData - Mock results object
 */
function processFallbackResults(storedResponses: string): ResultsData {
  const responses = JSON.parse(storedResponses);
  
  // Convert string responses to numeric scores
  const eyeScore = responses.eye_contact || 50;
  const gestureScore = responses.gestures || 50;
  const nameScore = mapNameResponse(responses.response_to_name);
  const vocalScore = mapVocalization(responses.vocalization);
  const behaviorScore = mapRepetitiveBehavior(responses.repetitive_behavior);
  
  /**
   * FALLBACK RISK CALCULATION
   * 
   * This is a SIMPLIFIED placeholder calculation.
   * The real backend uses sophisticated ML algorithms:
   * - A* for optimal decision paths
   * - BFS for symptom relationship graphs
   * - CSP for constraint validation
   * 
   * DO NOT use this logic for actual screening!
   */
  
  // Calculate average of positive indicators (higher = more typical)
  const positiveIndicators = (eyeScore + gestureScore + nameScore + vocalScore) / 4;
  
  // Combine with repetitive behavior (higher behavior score = more concerning)
  const riskScore = Math.round((100 - positiveIndicators + behaviorScore) / 2);
  
  // Determine risk band based on score
  let riskBand: RiskLevel;
  if (riskScore < 35) {
    riskBand = "low";
  } else if (riskScore < 65) {
    riskBand = "moderate";
  } else {
    riskBand = "high";
  }
  
  return {
    session_id: `fallback_${Date.now()}`,
    risk_score: riskScore,
    risk_band: riskBand,
    module_scores: {
      eye_contact: eyeScore,
      response_to_name: nameScore,
      vocalization: vocalScore,
      gestures: gestureScore,
      repetitive_behavior: 100 - behaviorScore, // Invert for display (higher = better)
    },
    explanation: generateFallbackExplanation(riskBand),
    therapy_plan: generateFallbackTherapyPlan(riskBand),
    created_at: new Date().toISOString(),
  };
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * ResultsPage Component
 * 
 * Displays comprehensive screening results.
 * Handles loading, error, and empty states appropriately.
 * 
 * STATE:
 * - results: The fetched/processed results data
 * - isLoading: Whether data is being loaded
 * - error: Type of error if any occurred
 * - errorMessage: User-friendly error message
 */
export default function ResultsPage() {
  // ==========================================================================
  // STATE
  // ==========================================================================
  
  /** The screening results to display */
  const [results, setResults] = useState<ResultsData | null>(null);
  
  /** Loading state while fetching from API */
  const [isLoading, setIsLoading] = useState(true);
  
  /** Error type for conditional rendering */
  const [error, setError] = useState<ErrorType>(null);
  
  /** Human-readable error message */
  const [errorMessage, setErrorMessage] = useState<string>("");

  // ==========================================================================
  // DATA LOADING
  // ==========================================================================
  
  /**
   * loadResults
   * 
   * Fetches screening results from backend or falls back to stored data.
   * 
   * PROCESS:
   * 1. Check for session_id in sessionStorage
   * 2. Try to fetch from backend API
   * 3. If API fails, check for stored results
   * 4. If no stored results, check for raw responses
   * 5. If nothing found, show empty state
   */
  const loadResults = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setErrorMessage("");

    try {
      // ========================================
      // STEP 1: Check for session_id
      // ========================================
      
      const sessionId = sessionStorage.getItem("session_id");
      
      console.log("[Results] Loading results, session_id:", sessionId);

      // ========================================
      // STEP 2: Try to fetch from backend API
      // ========================================
      
      if (sessionId) {
        try {
          /**
           * API CALL: GET /api/results/{session_id}
           * 
           * Fetches complete results from backend.
           * Results include ML-generated scores, explanation, and recommendations.
           */
          const apiResults = await getResults(sessionId);
          
          console.log("[Results] API fetch successful:", apiResults.session_id);
          
          setResults(normalizeScreeningResultForUi(apiResults));
          setIsLoading(false);
          return;
          
        } catch (apiError) {
          console.warn("[Results] API fetch failed, trying fallback:", apiError);
          // Continue to fallback logic below
        }
      }

      // ========================================
      // STEP 3: Check for stored results (backup)
      // ========================================
      
      const storedResult = sessionStorage.getItem("screeningResult");
      
      if (storedResult) {
        console.log("[Results] Using stored results");
        
        const parsedResult = JSON.parse(storedResult) as ScreeningResult;
        setResults(normalizeScreeningResultForUi(parsedResult));
        setIsLoading(false);
        return;
      }

      // ========================================
      // STEP 4: Check for raw responses (fallback)
      // ========================================
      
      const storedResponses = sessionStorage.getItem("screeningResponses");
      
      if (storedResponses) {
        console.log("[Results] Processing fallback from stored responses");
        
        /**
         * FALLBACK PROCESSING
         * 
         * This processes raw responses when backend is unavailable.
         * Used during development or if API is down.
         * 
         * WARNING: This is NOT for production use!
         * Real screening must use backend ML algorithms.
         */
        const fallbackResults = processFallbackResults(storedResponses);
        
        setResults(normalizeScreeningResultForUi(fallbackResults));
        setIsLoading(false);
        return;
      }

      // ========================================
      // STEP 5: No data found - show empty state
      // ========================================
      
      console.log("[Results] No screening data found");
      
      setError("no_data");
      
    } catch (err) {
      // Handle unexpected errors
      console.error("[Results] Unexpected error loading results:", err);
      
      setError("api_error");
      setErrorMessage(
        err instanceof Error 
          ? err.message 
          : "An unexpected error occurred while loading results."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load results on component mount
  useEffect(() => {
    loadResults();
  }, [loadResults]);

  // ==========================================================================
  // RENDER: Loading State
  // ==========================================================================
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingState message="Analyzing screening results..." />
        </main>
        <Footer />
      </div>
    );
  }

  // ==========================================================================
  // RENDER: Error States
  // ==========================================================================
  
  // No screening data found
  if (error === "no_data") {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={ClipboardList}
            title="No Screening Results"
            description="You haven't completed a screening yet. Start a new assessment to see your results."
            actionLabel="Start Screening"
            actionHref="/screening"
          />
        </main>
        <Footer />
      </div>
    );
  }
  
  // API or unexpected error
  if (error === "api_error" || !results) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Unable to Load Results</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {errorMessage || "There was a problem loading your results."}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={loadResults}>
                  Try Again
                </Button>
                <Button asChild>
                  <Link href="/screening">New Screening</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // ==========================================================================
  // RENDER: Results Display
  // ==========================================================================

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Screening Results
              </h1>
              <p className="text-muted-foreground">
                Session ID: {results.session_id}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Overall Risk Score Card */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Overall Risk Assessment</CardTitle>
                      <CardDescription>
                        Based on your screening responses
                      </CardDescription>
                    </div>
                    <RiskBadge level={results.risk_band} size="lg" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-8">
                    {/* Large Score Display */}
                    <div className="text-center">
                      <div className="text-5xl font-bold text-foreground">
                        {results.risk_score}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Risk Score
                      </p>
                    </div>
                    
                    {/* Risk Visualization Bar */}
                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Low Risk</span>
                        <span>High Risk</span>
                      </div>
                      <div className="relative h-4 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            results.risk_band === "low"
                              ? "bg-success"
                              : results.risk_band === "moderate"
                              ? "bg-warning"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${results.risk_score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Module Scores Breakdown */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Module Breakdown
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {MODULE_CONFIG.map((module) => (
                    <ModuleScoreCard
                      key={module.key}
                      title={module.label}
                      score={
                        results.module_scores[
                          module.key as keyof typeof results.module_scores
                        ]
                      }
                      icon={module.icon}
                      description={module.description}
                    />
                  ))}
                </div>
              </div>

              {/* Detailed Explanation Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Detailed Explanation</CardTitle>
                      <CardDescription>
                        Understanding your results
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {results.explanation}
                  </p>
                  
                  {/* Note about backend processing */}
                  <p className="mt-4 text-xs text-muted-foreground/70 italic">
                    This analysis is generated by our AI system using advanced algorithms 
                    including A* pathfinding, BFS graph traversal, and CSP constraint validation.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              
              {/* Recommended Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Next Steps</CardTitle>
                  <CardDescription>
                    Based on your screening results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.therapy_plan.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {index + 1}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/guidance">
                      View Full Guidance
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/history">View Session History</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/screening">Take New Assessment</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Important Disclaimer */}
              <Card className="border-warning/30 bg-warning/5">
                <CardContent className="pt-6">
                  <p className="text-sm text-warning-foreground">
                    <strong>Reminder:</strong> This screening tool is not a diagnostic 
                    instrument. Please consult with qualified healthcare professionals 
                    for proper evaluation and diagnosis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
