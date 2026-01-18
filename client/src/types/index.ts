
export enum ScenarioType {
  BANK = 'BANK',
  GOVERNMENT = 'GOVERNMENT',
  JOB = 'JOB',
  EMERGENCY = 'EMERGENCY'
}

export enum UserIdentity {
  STUDENT = 'STUDENT',
  JOB_SEEKER = 'JOB_SEEKER',
  SENIOR_CITIZEN = 'SENIOR_CITIZEN',
  GENERAL_USER = 'GENERAL_USER',
  TEENAGER = 'TEENAGER'
}

export interface Message {
  id: string;
  role: 'scammer' | 'user' | 'mentor';
  content: string;
  timestamp: number;
}

export interface RiskAnalysis {
  isAtRisk: boolean;
  explanation: string;
  manipulationTactic: string;
  guidance: string;
}

export interface Scenario {
  id: ScenarioType;
  title: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface UserStats {
  scenariosCompleted: number;
  patternsLearned: number;
  mistakesAvoided: number;
  score: number;
  badges: string[];
}
