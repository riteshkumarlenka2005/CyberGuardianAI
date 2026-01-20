/**
 * API Service for CyberGuardian AI
 * Connects to the local FastAPI backend with Ollama + Mistral
 */

import { ScenarioType, UserIdentity, AgeGroup, RiskAnalysis } from "../types";

// Backend API base URL
const API_BASE_URL = "http://localhost:8000/api/v1";

// Map frontend enums to backend values
const PERSONA_MAP: Record<UserIdentity, string> = {
  [UserIdentity.STUDENT]: "student",
  [UserIdentity.JOB_SEEKER]: "job_seeker",
  [UserIdentity.SENIOR_CITIZEN]: "senior_citizen",
  [UserIdentity.TEENAGER]: "teenager",
  [UserIdentity.GENERAL_USER]: "general",
};

const SCENARIO_MAP: Record<ScenarioType, string> = {
  [ScenarioType.BANK]: "bank",
  [ScenarioType.GOVERNMENT]: "government",
  [ScenarioType.JOB]: "job_offer",
  [ScenarioType.EMERGENCY]: "relative_emergency",
};

const AGE_MAP: Record<AgeGroup, number> = {
  [AgeGroup.TEEN]: 16,
  [AgeGroup.YOUNG_ADULT]: 28,
  [AgeGroup.ADULT]: 45,
  [AgeGroup.SENIOR]: 65,
};

// Response types from backend
interface SimulationResponse {
  mode: "SIMULATOR" | "MENTOR" | "ENDED";
  message: string;
  risk?: "LOW" | "MEDIUM" | "HIGH";
  session_id?: string;
  manipulation_tactic?: string;
  guidance?: string;
}

// Session storage
let currentSessionId: string | null = null;

export class ApiService {
  /**
   * Start a new simulation session
   */
  static async startSimulation(
    scenario: ScenarioType,
    identity: UserIdentity,
    ageGroup?: AgeGroup
  ): Promise<{ message: string; sessionId: string }> {
    const response = await fetch(`${API_BASE_URL}/simulation/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        persona: PERSONA_MAP[identity],
        age: ageGroup ? AGE_MAP[ageGroup] : 30,
        scenario: SCENARIO_MAP[scenario],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to start simulation");
    }

    const data: SimulationResponse = await response.json();
    currentSessionId = data.session_id || null;

    return {
      message: data.message,
      sessionId: data.session_id || "",
    };
  }

  /**
   * Send a user message and get response
   */
  static async sendMessage(
    message: string,
    sessionId?: string
  ): Promise<{
    mode: "SIMULATOR" | "MENTOR" | "ENDED";
    message: string;
    risk?: string;
    isAtRisk: boolean;
    explanation?: string;
    manipulationTactic?: string;
    guidance?: string;
  }> {
    const sid = sessionId || currentSessionId;
    if (!sid) {
      throw new Error("No active session");
    }

    const response = await fetch(`${API_BASE_URL}/simulation/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sid,
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    const data: SimulationResponse = await response.json();

    return {
      mode: data.mode,
      message: data.message,
      risk: data.risk,
      isAtRisk: data.mode === "MENTOR",
      explanation: data.mode === "MENTOR" ? data.message : undefined,
      manipulationTactic: data.manipulation_tactic,
      guidance: data.guidance,
    };
  }

  /**
   * Continue simulation after mentor intervention
   */
  static async continueSimulation(sessionId?: string): Promise<{ message: string }> {
    const sid = sessionId || currentSessionId;
    if (!sid) {
      throw new Error("No active session");
    }

    const response = await fetch(`${API_BASE_URL}/simulation/continue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sid }),
    });

    if (!response.ok) {
      throw new Error("Failed to continue simulation");
    }

    const data: SimulationResponse = await response.json();
    return { message: data.message };
  }

  /**
   * Retry/reset simulation
   */
  static async retrySimulation(sessionId?: string): Promise<{ message: string }> {
    const sid = sessionId || currentSessionId;
    if (!sid) {
      throw new Error("No active session");
    }

    const response = await fetch(`${API_BASE_URL}/simulation/retry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sid }),
    });

    if (!response.ok) {
      throw new Error("Failed to retry simulation");
    }

    currentSessionId = null;
    const data: SimulationResponse = await response.json();
    return { message: data.message };
  }

  /**
   * Get current session ID
   */
  static getSessionId(): string | null {
    return currentSessionId;
  }

  /**
   * Clear current session
   */
  static clearSession(): void {
    currentSessionId = null;
  }
}

// Legacy GeminiService replacement - for backwards compatibility during transition
export class GeminiService {
  static async getScammerResponse(
    scenario: ScenarioType,
    identity: UserIdentity,
    history: { role: string; content: string }[],
    ageGroup?: AgeGroup
  ): Promise<string> {
    // If no session, start one
    if (!currentSessionId) {
      const result = await ApiService.startSimulation(scenario, identity, ageGroup);
      return result.message;
    }

    // Get last user message from history
    const lastUserMsg = [...history].reverse().find(m => m.role === "user");
    if (lastUserMsg) {
      const result = await ApiService.sendMessage(lastUserMsg.content);
      if (result.mode === "SIMULATOR") {
        return result.message;
      }
    }

    return "Continue the conversation...";
  }

  static async analyzeRisk(
    scenario: ScenarioType,
    identity: UserIdentity,
    userMessage: string,
    ageGroup?: AgeGroup
  ): Promise<RiskAnalysis> {
    // If no session, start one first
    if (!currentSessionId) {
      await ApiService.startSimulation(scenario, identity, ageGroup);
    }

    const result = await ApiService.sendMessage(userMessage);

    return {
      isAtRisk: result.isAtRisk,
      explanation: result.explanation || "",
      manipulationTactic: result.manipulationTactic || result.risk || "",
      guidance: result.guidance || "",
    };
  }
}
