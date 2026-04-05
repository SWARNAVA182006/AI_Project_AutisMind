/**
 * =============================================================================
 * API SERVICE LAYER
 * =============================================================================
 * 
 * This module centralizes all API communication for the Autism Screening System.
 * It provides a clean interface between the frontend and backend services.
 * 
 * ARCHITECTURE OVERVIEW:
 * ----------------------
 * Frontend (React) → API Service Layer → Backend (FastAPI)
 * 
 * WHY USE A CENTRALIZED API LAYER?
 * ---------------------------------
 * 1. Single source of truth for API endpoints
 * 2. Consistent error handling across the app
 * 3. Easy to swap mock data with real API calls
 * 4. Type-safe request/response handling
 * 5. Simplifies testing and maintenance
 * 
 * BACKEND INTEGRATION NOTES:
 * --------------------------
 * The backend uses AI/ML algorithms including:
 * - A* Algorithm: For optimal path finding in decision trees
 * - BFS (Breadth-First Search): For exploring symptom relationships
 * - CSP (Constraint Satisfaction): For validating screening criteria
 * 
 * These algorithms process the numeric screening data to generate
 * risk assessments and personalized recommendations.
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * API Base URL Configuration
 * 
 * Uses environment variable for flexibility across environments:
 * - Development: http://localhost:8000
 * - Staging: https://staging-api.yourapp.com
 * - Production: https://api.yourapp.com
 * 
 * Set this in your .env.local file:
 * NEXT_PUBLIC_API_URL=http://localhost:8000
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * ScreeningPayload
 * 
 * Data structure sent to the backend for analysis.
 * All values are numeric (0-100 scale) because:
 * 1. Machine learning models require numeric inputs
 * 2. Allows mathematical operations (averaging, weighting)
 * 3. Enables consistent scoring across all modules
 */
export interface ScreeningPayload {
  /** Eye contact frequency score (0-100, higher = more frequent) */
  eye_contact: number;
  /** Response to name score (0-100, higher = more responsive) */
  name_response: number;
  /** Vocalization ability score (0-100, higher = more verbal) */
  vocalization: number;
  /** Gesture usage score (0-100, higher = more gestures) */
  gestures: number;
  /** Repetitive behavior score (0-100, higher = more behaviors observed) */
  repetitive_behavior: number;
}

/**
 * ScreeningResult
 * 
 * Data structure returned from the backend after analysis.
 * Contains comprehensive assessment data for display.
 */
export interface ScreeningResult {
  /** Unique identifier for this screening session */
  session_id: string;
  /** Overall risk score percentage (0-100) */
  risk_score: number;
  /** Risk classification band */
  risk_band: "low" | "moderate" | "high";
  /** Individual scores for each assessment module */
  module_scores: {
    eye_contact: number;
    response_to_name: number;
    vocalization: number;
    gestures: number;
    repetitive_behavior: number;
  };
  /** AI-generated explanation of the results */
  explanation: string;
  /** Recommended actions based on risk level */
  therapy_plan: string[];
  /** Timestamp when the screening was completed */
  created_at: string;
}

/**
 * SessionSummary
 * 
 * Abbreviated session data for history listings.
 */
export interface SessionSummary {
  session_id: string;
  risk_score: number;
  risk_band: "low" | "moderate" | "high";
  created_at: string;
}

/**
 * ApiError
 * 
 * Standardized error structure for consistent error handling.
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// =============================================================================
// API CLIENT FUNCTIONS
// =============================================================================

/**
 * submitScreening
 * 
 * Submits screening responses to the backend for AI analysis.
 * 
 * FLOW:
 * 1. Frontend collects user responses
 * 2. Responses are mapped to numeric values (0-100)
 * 3. Data is sent to POST /api/analyze
 * 4. Backend runs A*, BFS, CSP algorithms
 * 5. Returns risk assessment and recommendations
 * 
 * @param payload - Numeric screening data
 * @returns Promise<ScreeningResult> - Complete analysis results
 * @throws Error if API call fails
 * 
 * EXAMPLE USAGE:
 * ```typescript
 * const result = await submitScreening({
 *   eye_contact: 75,
 *   name_response: 60,
 *   vocalization: 80,
 *   gestures: 70,
 *   repetitive_behavior: 20
 * });
 * ```
 */
export async function submitScreening(payload: ScreeningPayload): Promise<ScreeningResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check for HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    // Parse and return the result
    const result: ScreeningResult = await response.json();
    return result;
  } catch (error) {
    // Log error for debugging
    console.error("[API] submitScreening failed:", error);
    
    // Re-throw with user-friendly message
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to submit screening. Please try again."
    );
  }
}

/**
 * getResults
 * 
 * Fetches screening results for a specific session.
 * 
 * WHEN TO USE:
 * - Loading results page after completing screening
 * - Viewing historical session details
 * - Sharing results via session_id
 * 
 * @param sessionId - Unique session identifier
 * @returns Promise<ScreeningResult> - Complete session results
 * @throws Error if session not found or API fails
 */
export async function getResults(sessionId: string): Promise<ScreeningResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/results/${sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Session not found. Please complete a new screening.");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const result: ScreeningResult = await response.json();
    return result;
  } catch (error) {
    console.error("[API] getResults failed:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to load results. Please try again."
    );
  }
}

/**
 * getSessionHistory
 * 
 * Retrieves list of all past screening sessions.
 * 
 * NOTE: In production, this would typically require authentication
 * to ensure users only see their own sessions.
 * 
 * @returns Promise<SessionSummary[]> - Array of session summaries
 */
export async function getSessionHistory(): Promise<SessionSummary[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sessions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const sessions: SessionSummary[] = await response.json();
    return sessions;
  } catch (error) {
    console.error("[API] getSessionHistory failed:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Failed to load session history. Please try again."
    );
  }
}

// =============================================================================
// MAPPING FUNCTIONS
// =============================================================================

/**
 * WHY MAPPING FUNCTIONS ARE NEEDED:
 * ==================================
 * 
 * The frontend collects responses in human-readable formats:
 * - Sliders: 0-100 numeric values (already ready)
 * - Radio buttons: String labels like "always", "usually", etc.
 * 
 * The backend ML algorithms require:
 * - All numeric values on a consistent 0-100 scale
 * - Higher values = more typical/positive behavior
 * - Lower values = more concerning behavior
 * 
 * These functions convert string responses to numeric scores.
 */

/**
 * mapNameResponse
 * 
 * Converts "Response to Name" radio selection to numeric score.
 * 
 * SCORING LOGIC:
 * - "always" (100): Child consistently responds immediately - typical behavior
 * - "usually" (80): Generally responsive - mostly typical
 * - "sometimes" (50): Inconsistent - potential concern
 * - "rarely" (30): Poor responsiveness - concerning
 * - "never" (10): No response to name - significant concern
 * 
 * @param value - Radio button selection string
 * @returns number - Numeric score (0-100)
 */
export function mapNameResponse(value: string): number {
  const mapping: Record<string, number> = {
    always: 100,   // Typical development
    usually: 80,   // Mostly typical
    sometimes: 50, // Borderline concern
    rarely: 30,    // Concerning
    never: 10,     // Significant concern
  };
  
  // Return mapped value or default to 50 (neutral) if unknown
  return mapping[value] ?? 50;
}

/**
 * mapVocalization
 * 
 * Converts "Vocalization" radio selection to numeric score.
 * 
 * SCORING LOGIC:
 * - "advanced" (100): Age-appropriate verbal skills
 * - "developing" (75): Progressing normally
 * - "limited" (40): Below expected - needs monitoring
 * - "echolalia" (30): Repetitive speech pattern - autism indicator
 * - "nonverbal" (20): No verbal communication - significant concern
 * 
 * @param value - Radio button selection string
 * @returns number - Numeric score (0-100)
 */
export function mapVocalization(value: string): number {
  const mapping: Record<string, number> = {
    advanced: 100,    // Age-appropriate development
    developing: 75,   // On track
    limited: 40,      // Needs attention
    echolalia: 30,    // Common autism characteristic
    nonverbal: 20,    // Requires intervention
  };
  
  return mapping[value] ?? 50;
}

/**
 * mapRepetitiveBehavior
 * 
 * Converts "Repetitive Behavior" radio selection to numeric score.
 * 
 * IMPORTANT: This scale is INVERTED compared to others!
 * - Higher score = MORE repetitive behaviors (more concerning)
 * - This is because the presence of repetitive behaviors is a concern,
 *   unlike other modules where higher = more typical
 * 
 * SCORING LOGIC:
 * - "none" (10): No repetitive behaviors - typical
 * - "occasional" (30): Some repetitive movements - monitor
 * - "frequent" (60): Regular repetitive behaviors - concerning
 * - "intense" (80): Strong focus on routines/objects - significant concern
 * - "distress" (100): Distress when routines change - major concern
 * 
 * @param value - Radio button selection string
 * @returns number - Numeric score (0-100, higher = more concerning)
 */
export function mapRepetitiveBehavior(value: string): number {
  const mapping: Record<string, number> = {
    none: 10,       // Typical behavior
    occasional: 30, // Minor concern
    frequent: 60,   // Notable concern
    intense: 80,    // Significant concern
    distress: 100,  // Major concern
  };
  
  return mapping[value] ?? 50;
}

/**
 * prepareScreeningPayload
 * 
 * Convenience function to convert all frontend responses to API-ready payload.
 * Combines all mapping functions into a single transformation.
 * 
 * @param responses - Raw frontend response object
 * @returns ScreeningPayload - API-ready numeric payload
 * 
 * EXAMPLE:
 * ```typescript
 * const payload = prepareScreeningPayload({
 *   eye_contact: 75,
 *   response_to_name: "usually",
 *   vocalization: "developing",
 *   gestures: 60,
 *   repetitive_behavior: "occasional"
 * });
 * // Result: { eye_contact: 75, name_response: 80, vocalization: 75, gestures: 60, repetitive_behavior: 30 }
 * ```
 */
export function prepareScreeningPayload(responses: {
  eye_contact: number;
  response_to_name: string;
  vocalization: string;
  gestures: number;
  repetitive_behavior: string;
}): ScreeningPayload {
  return {
    eye_contact: responses.eye_contact,
    name_response: mapNameResponse(responses.response_to_name),
    vocalization: mapVocalization(responses.vocalization),
    gestures: responses.gestures,
    repetitive_behavior: mapRepetitiveBehavior(responses.repetitive_behavior),
  };
}
