
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

export enum AgeGroup {
  TEEN = 'TEEN',           // 13-19 years
  YOUNG_ADULT = 'YOUNG_ADULT', // 20-35 years
  ADULT = 'ADULT',         // 36-55 years
  SENIOR = 'SENIOR'        // 56+ years
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

// Training Session - tracks a single training interaction
export interface TrainingSession {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  timestamp: number;
  scenarioType: ScenarioType;
  identity: UserIdentity;
  ageGroup?: AgeGroup; // optional for backwards compatibility
  messagesCount: number;
  mentorInterventions: number;
  tacticsEncountered: string[];
  completed: boolean;
  duration: number; // in seconds
}

// Daily aggregated stats for charts
export interface DailyStats {
  date: string;
  sessionsCompleted: number;
  correctDecisions: number;
  mistakesCaught: number;
}

// User's overall progress
export interface UserProgress {
  totalSessions: number;
  scenariosCompleted: Record<ScenarioType, number>;
  totalMentorInterventions: number;
  tacticsLearned: string[];
  totalMessagesExchanged: number;
  totalTimeSpent: number; // in seconds
  dailyStats: DailyStats[];
  badges: Badge[];
  lastSessionDate: string | null;
  streak: number; // consecutive days
}

// Badge/Achievement
export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: number | null; // timestamp when earned, null if not earned
  requirement: {
    type: 'sessions' | 'scenario_type' | 'tactics' | 'streak';
    value: number;
    scenarioType?: ScenarioType;
  };
}

// Legacy interface for backwards compatibility
export interface UserStats {
  scenariosCompleted: number;
  patternsLearned: number;
  mistakesAvoided: number;
  score: number;
  badges: string[];
}

// Gallery item from API
export interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  category: string;
  frame_type: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

// Resource types from API
export interface ResourceAlert {
  id: number;
  title: string;
  tag: string;
  date_text: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ResourceVideo {
  id: number;
  title: string;
  thumbnail_url: string;
  video_url: string;
  duration: string;
  label: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ResourceLink {
  id: number;
  name: string;
  url: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}
