import {
    TrainingSession,
    UserProgress,
    DailyStats,
    Badge,
    ScenarioType
} from '../types';
import authService from './authService';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/v1/progress`;

// helper to get auth headers
const getHeaders = () => {
    const token = authService.getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// Default badges (used as fallback when API is unreachable)
const DEFAULT_BADGES: Badge[] = [
    { id: 'first_session', name: 'First Steps', icon: '🎯', description: 'Complete your first training session', earnedAt: null, requirement: { type: 'sessions', value: 1 } },
    { id: 'five_sessions', name: 'Dedicated Learner', icon: '📚', description: 'Complete 5 training sessions', earnedAt: null, requirement: { type: 'sessions', value: 5 } },
    { id: 'ten_sessions', name: 'Safety Expert', icon: '🛡️', description: 'Complete 10 training sessions', earnedAt: null, requirement: { type: 'sessions', value: 10 } },
    { id: 'bank_master', name: 'Banking Guardian', icon: '🏦', description: 'Complete 3 bank fraud scenarios', earnedAt: null, requirement: { type: 'scenario_type', value: 3, scenarioType: ScenarioType.BANK } },
    { id: 'job_master', name: 'Recruitment Shield', icon: '💼', description: 'Complete 3 job scam scenarios', earnedAt: null, requirement: { type: 'scenario_type', value: 3, scenarioType: ScenarioType.JOB } },
    { id: 'govt_master', name: 'Authority Detector', icon: '🏛️', description: 'Complete 3 government impersonation scenarios', earnedAt: null, requirement: { type: 'scenario_type', value: 3, scenarioType: ScenarioType.GOVERNMENT } },
    { id: 'emergency_master', name: 'Crisis Calm', icon: '🚨', description: 'Complete 3 family emergency scenarios', earnedAt: null, requirement: { type: 'scenario_type', value: 3, scenarioType: ScenarioType.EMERGENCY } },
    { id: 'three_tactics', name: 'Pattern Spotter', icon: '👁️', description: 'Encounter 3 different manipulation tactics', earnedAt: null, requirement: { type: 'tactics', value: 3 } },
    { id: 'five_tactics', name: 'Manipulation Master', icon: '🧠', description: 'Encounter 5 different manipulation tactics', earnedAt: null, requirement: { type: 'tactics', value: 5 } },
    { id: 'streak_3', name: 'Consistent Defender', icon: '🔥', description: 'Train for 3 consecutive days', earnedAt: null, requirement: { type: 'streak', value: 3 } },
    { id: 'streak_7', name: 'Weekly Warrior', icon: '⚡', description: 'Train for 7 consecutive days', earnedAt: null, requirement: { type: 'streak', value: 7 } },
];

// Get default empty progress (fallback)
const getDefaultProgress = (): UserProgress => ({
    totalSessions: 0,
    scenariosCompleted: {
        [ScenarioType.BANK]: 0,
        [ScenarioType.JOB]: 0,
        [ScenarioType.GOVERNMENT]: 0,
        [ScenarioType.EMERGENCY]: 0
    },
    totalMentorInterventions: 0,
    tacticsLearned: [],
    totalMessagesExchanged: 0,
    totalTimeSpent: 0,
    dailyStats: [],
    badges: [...DEFAULT_BADGES],
    lastSessionDate: null,
    streak: 0
});

export const UserDataService = {
    /**
     * Load user progress from the backend API.
     * Falls back to empty defaults if not authenticated or on error.
     */
    loadProgress: async (): Promise<UserProgress> => {
        const token = authService.getToken();
        if (!token) return getDefaultProgress();

        try {
            const response = await fetch(`${API_BASE_URL}/`, {
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error('Failed to load progress');
            const data = await response.json();
            return {
                totalSessions: data.totalSessions ?? 0,
                scenariosCompleted: data.scenariosCompleted ?? {
                    [ScenarioType.BANK]: 0,
                    [ScenarioType.JOB]: 0,
                    [ScenarioType.GOVERNMENT]: 0,
                    [ScenarioType.EMERGENCY]: 0,
                },
                totalMentorInterventions: data.totalMentorInterventions ?? 0,
                tacticsLearned: data.tacticsLearned ?? [],
                totalMessagesExchanged: data.totalMessagesExchanged ?? 0,
                totalTimeSpent: data.totalTimeSpent ?? 0,
                dailyStats: data.dailyStats ?? [],
                badges: data.badges ?? [...DEFAULT_BADGES],
                lastSessionDate: data.lastSessionDate ?? null,
                streak: data.streak ?? 0,
            };
        } catch (e) {
            console.error('Error loading user progress from API:', e);
            return getDefaultProgress();
        }
    },

    /**
     * Save a completed training session via the backend API.
     * Returns the updated progress or default progress on error.
     */
    saveSession: async (
        session: Omit<TrainingSession, 'id' | 'date' | 'timestamp'>
    ): Promise<UserProgress> => {
        const token = authService.getToken();
        if (!token) return getDefaultProgress();

        try {
            await fetch(`${API_BASE_URL}/session`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    scenario_type: session.scenarioType,
                    identity: session.identity,
                    age_group: session.ageGroup ?? null,
                    messages_count: session.messagesCount,
                    mentor_interventions: session.mentorInterventions,
                    tactics_encountered: session.tacticsEncountered,
                    completed: session.completed,
                    duration: session.duration,
                }),
            });
            // Reload full progress after save
            return await UserDataService.loadProgress();
        } catch (e) {
            console.error('Error saving session to API:', e);
            return getDefaultProgress();
        }
    },

    /**
     * Get chart data for the last N days from the backend.
     */
    getChartData: async (days: number = 7): Promise<DailyStats[]> => {
        const token = authService.getToken();
        if (!token) return [];

        try {
            const response = await fetch(
                `${API_BASE_URL}/chart-data?days=${days}`,
                { headers: getHeaders() }
            );
            if (!response.ok) throw new Error('Failed to load chart data');
            const json = await response.json();
            return json.data ?? [];
        } catch (e) {
            console.error('Error loading chart data from API:', e);
            return [];
        }
    },

    /**
     * Get the user's safety score from the backend.
     */
    calculateScore: async (): Promise<number> => {
        const token = authService.getToken();
        if (!token) return 0;

        try {
            const response = await fetch(`${API_BASE_URL}/score`, {
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error('Failed to load score');
            const json = await response.json();
            return json.score ?? 0;
        } catch (e) {
            console.error('Error loading score from API:', e);
            return 0;
        }
    },

    /**
     * Get earned badges from the backend.
     */
    getEarnedBadges: async (): Promise<Badge[]> => {
        const token = authService.getToken();
        if (!token) return [];

        try {
            const response = await fetch(`${API_BASE_URL}/badges`, {
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error('Failed to load badges');
            const json = await response.json();
            return (json.badges ?? []).filter((b: Badge) => b.earnedAt !== null);
        } catch (e) {
            console.error('Error loading earned badges from API:', e);
            return [];
        }
    },

    /**
     * Get all badges (earned + unearned) from the backend.
     */
    getAllBadges: async (): Promise<Badge[]> => {
        const token = authService.getToken();
        if (!token) return [...DEFAULT_BADGES];

        try {
            const response = await fetch(`${API_BASE_URL}/badges`, {
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error('Failed to load badges');
            const json = await response.json();
            return json.badges ?? [...DEFAULT_BADGES];
        } catch (e) {
            console.error('Error loading badges from API:', e);
            return [...DEFAULT_BADGES];
        }
    },

    /**
     * No-op for API-backed storage (kept for backwards compatibility).
     */
    saveProgress: (_progress: UserProgress): void => {
        // Progress is now managed server-side. No-op.
    },

    /**
     * No-op for API-backed storage.
     */
    resetProgress: (): void => {
        // Progress reset would need a dedicated API endpoint.
        // For now this is a no-op.
    },
};
