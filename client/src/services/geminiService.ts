
import { GoogleGenAI, Type } from "@google/genai";
import { ScenarioType, Message, RiskAnalysis, UserIdentity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_PROMPTS = {
  [ScenarioType.BANK]: "You are a realistic scammer pretending to be a security officer from Global Bank. Your goal is to get the user to provide their 6-digit OTP or login credentials. Be pushy but professional. Use urgency: 'Your account will be frozen in 10 minutes.'",
  [ScenarioType.JOB]: "You are a hiring manager for a tech startup. Offer a vague but high-paying job. Eventually ask for a processing fee for 'office equipment' or 'background checks'. Use flattery.",
  [ScenarioType.GOVERNMENT]: "You are an IRS/Gov agent. Inform the user they have an outstanding tax debt or legal issue. Threaten police involvement if not paid via gift cards or crypto immediately. Use authority and fear.",
  [ScenarioType.EMERGENCY]: "You are a distraught family member or friend. You're in a crisis (arrested, accident) and need immediate wire transfer for bail/help. Do not use names, use generic terms like 'Grandma' or 'Friend'. Create high emotional distress."
};

export class GeminiService {
  static async getScammerResponse(scenario: ScenarioType, identity: UserIdentity, history: Message[]): Promise<string> {
    const promptInstructions = `
      System Instruction: ${SYSTEM_PROMPTS[scenario]}
      Target Profile: The user is a ${identity.replace('_', ' ').toLowerCase()}. 
      Tailor your language and psychological pressure specifically to exploit the vulnerabilities of this profile.
      Keep responses concise and conversational (SMS/Chat style).
    `;

    const chat = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: promptInstructions }] },
        ...history.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }))
      ]
    });

    const response = await chat;
    return response.text || "Connection lost. Please retry.";
  }

  static async analyzeRisk(scenario: ScenarioType, identity: UserIdentity, userMessage: string): Promise<RiskAnalysis> {
    const prompt = `Analyze this message from a ${identity} in a ${scenario} scam simulation: "${userMessage}". 
    Is the user falling for the scam or revealing sensitive data? 
    Check for: 
    1. Compliance with risky requests (sending money, giving OTP, clicking links).
    2. Sharing sensitive info (SSN, Passwords).
    3. Emotional compliance.
    
    Return a JSON object:
    {
      "isAtRisk": boolean,
      "explanation": "Why is this dangerous for a ${identity}?",
      "manipulationTactic": "The core tactic used (e.g., Urgency, Authority, Fear)",
      "guidance": "A safe, alternative response."
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAtRisk: { type: Type.BOOLEAN },
            explanation: { type: Type.STRING },
            manipulationTactic: { type: Type.STRING },
            guidance: { type: Type.STRING }
          },
          required: ['isAtRisk', 'explanation', 'manipulationTactic', 'guidance']
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}') as RiskAnalysis;
    } catch (e) {
      return {
        isAtRisk: false,
        explanation: '',
        manipulationTactic: '',
        guidance: ''
      };
    }
  }
}
