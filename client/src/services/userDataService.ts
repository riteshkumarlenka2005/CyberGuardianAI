import {
    TrainingSession,
    UserProgress,
    DailyStats,
    Badge,
    ScenarioType
} from '../types';

const STORAGE_KEY = 'cyberguardian_user_progress';

// Default badges that can be earned
const DEFAULT_BADGES: Badge[] = [
    {
        id: 'first_session',
        name: 'First Steps',
        icon: '🎯',
        description: 'Complete your first training session',
        earnedAt: null,
        requirement: { type: 'sessions', value: 1 }
    },
    {
        id: 'five_sessions',
        name: 'Dedicated Learner',
        icon: '📚',
        description: 'Complete 5 training sessions',
        earnedAt: null,
        requirement: { type: 'sessions', value: 5 }
    },
    {
        id: 'ten_sessions',
        name: 'Safety Expert',
        icon: '🛡️',
        description: 'Complete 10 training sessions',
        earnedAt: null,
        requirement: { type: 'sessions', value: 10 }
    },
    {
        id: 'bank_master',
        name: 'Banking Guardian',
        icon: '🏦',
        description: 'Complete 3 bank fraud scenarios',
        earnedAt: null,
        requirement: { type: 'scenario_type', value: 3, scenarioType: ScenarioType.BANK }
    },
    {
        id: 'job_master',
        name: 'Recruitment Shield',
        icon: '💼',
        description: 'Complete 3 job scam scenarios',
        earnedAt: null,
        requirement: { type: 'scenario_type', value: 3, scenarioType: ScenarioType.JOB }
    },
    {
        id: 'govt_master',
        name: 'Authority Detector',
        icon: '🏛️',
        description: 'Complete 3 government impersonation scenarios',
        earnedAt: null,
        requirement: { type: 'scenario_type', value: 3, scenarioType: ScenarioType.GOVERNMENT }
    },
    {
        id: 'emergency_master',
        name: 'Crisis Calm',
        icon: '🚨',
        description: 'Complete 3 family emergency scenarios',
        earnedAt: null,
        requirement: { type: 'scenario_type', value: 3, scenarioType: ScenarioType.EMERGENCY }
    },
    {
        id: 'three_tactics',
        name: 'Pattern Spotter',
        icon: '👁️',
        description: 'Encounter 3 different manipulation tactics',
        earnedAt: null,
        requirement: { type: 'tactics', value: 3 }
    },
    {
        id: 'five_tactics',
        name: 'Manipulation Master',
        icon: '🧠',
        description: 'Encounter 5 different manipulation tactics',
        earnedAt: null,
        requirement: { type: 'tactics', value: 5 }
    },
    {
        id: 'streak_3',
        name: 'Consistent Defender',
        icon: '🔥',
        description: 'Train for 3 consecutive days',
        earnedAt: null,
        requirement: { type: 'streak', value: 3 }
    },
    {
        id: 'streak_7',
        name: 'Weekly Warrior',
        icon: '⚡',
        description: 'Train for 7 consecutive days',
        earnedAt: null,
        requirement: { type: 'streak', value: 7 }
    }
];

// Get default empty progress
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

// Get today's date as YYYY-MM-DD
const getToday = (): string => {
    return new Date().toISOString().split('T')[0];
};

// Calculate streak based on last session date
const calculateStreak = (lastSessionDate: string | null, currentStreak: number): number => {
    if (!lastSessionDate) return 1;

    const today = new Date(getToday());
    const lastDate = new Date(lastSessionDate);
    const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return currentStreak; // Same day
    if (diffDays === 1) return currentStreak + 1; // Consecutive day
    return 1; // Streak broken
};

// Check and update badges
const updateBadges = (progress: UserProgress): Badge[] => {
    const now = Date.now();

    return progress.badges.map(badge => {
        if (badge.earnedAt) return badge; // Already earned

        let earned = false;

        switch (badge.requirement.type) {
            case 'sessions':
                earned = progress.totalSessions >= badge.requirement.value;
                break;
            case 'scenario_type':
                if (badge.requirement.scenarioType) {
                    earned = progress.scenariosCompleted[badge.requirement.scenarioType] >= badge.requirement.value;
                }
                break;
            case 'tactics':
                earned = progress.tacticsLearned.length >= badge.requirement.value;
                break;
            case 'streak':
                earned = progress.streak >= badge.requirement.value;
                break;
        }

        return earned ? { ...badge, earnedAt: now } : badge;
    });
};

export const UserDataService = {
    // Load user progress from localStorage
    loadProgress: (): UserProgress => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with default badges in case new badges were added
                const existingBadgeIds = parsed.badges?.map((b: Badge) => b.id) || [];
                const newBadges = DEFAULT_BADGES.filter(b => !existingBadgeIds.includes(b.id));
                return {
                    ...getDefaultProgress(),
                    ...parsed,
                    badges: [...(parsed.badges || []), ...newBadges]
                };
            }
        } catch (e) {
            console.error('Error loading user progress:', e);
        }
        return getDefaultProgress();
    },

    // Save user progress to localStorage
    saveProgress: (progress: UserProgress): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (e) {
            console.error('Error saving user progress:', e);
        }
    },

    // Record a completed training session
    saveSession: (session: Omit<TrainingSession, 'id' | 'date' | 'timestamp'>): UserProgress => {
        const progress = UserDataService.loadProgress();
        const today = getToday();

        // Update totals
        progress.totalSessions += 1;
        progress.scenariosCompleted[session.scenarioType] += 1;
        progress.totalMentorInterventions += session.mentorInterventions;
        progress.totalMessagesExchanged += session.messagesCount;
        progress.totalTimeSpent += session.duration;

        // Update tactics learned (unique)
        session.tacticsEncountered.forEach(tactic => {
            if (!progress.tacticsLearned.includes(tactic)) {
                progress.tacticsLearned.push(tactic);
            }
        });

        // Update streak
        progress.streak = calculateStreak(progress.lastSessionDate, progress.streak);
        progress.lastSessionDate = today;

        // Update daily stats
        const existingDayIndex = progress.dailyStats.findIndex(d => d.date === today);
        if (existingDayIndex >= 0) {
            progress.dailyStats[existingDayIndex].sessionsCompleted += 1;
            progress.dailyStats[existingDayIndex].mistakesCaught += session.mentorInterventions;
            progress.dailyStats[existingDayIndex].correctDecisions += Math.max(0, session.messagesCount - session.mentorInterventions);
        } else {
            progress.dailyStats.push({
                date: today,
                sessionsCompleted: 1,
                mistakesCaught: session.mentorInterventions,
                correctDecisions: Math.max(0, session.messagesCount - session.mentorInterventions)
            });
        }

        // Keep only last 30 days of daily stats
        progress.dailyStats = progress.dailyStats
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 30);

        // Update badges
        progress.badges = updateBadges(progress);

        // Save and return
        UserDataService.saveProgress(progress);
        return progress;
    },

    // Get stats for charts (last 7 days)
    getChartData: (days: number = 7): DailyStats[] => {
        const progress = UserDataService.loadProgress();
        const result: DailyStats[] = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const existing = progress.dailyStats.find(d => d.date === dateStr);
            result.push(existing || {
                date: dateStr,
                sessionsCompleted: 0,
                correctDecisions: 0,
                mistakesCaught: 0
            });
        }

        return result;
    },

    // Get earned badges only
    getEarnedBadges: (): Badge[] => {
        const progress = UserDataService.loadProgress();
        return progress.badges.filter(b => b.earnedAt !== null);
    },

    // Get all badges with earned status
    getAllBadges: (): Badge[] => {
        const progress = UserDataService.loadProgress();
        return progress.badges;
    },

    // Calculate safety score (0-1000)
    calculateScore: (): number => {
        const progress = UserDataService.loadProgress();

        let score = 0;

        // Base score from sessions (up to 300 points)
        score += Math.min(progress.totalSessions * 30, 300);

        // Score from tactics learned (up to 200 points)
        score += Math.min(progress.tacticsLearned.length * 40, 200);

        // Score from earned badges (up to 300 points)
        const earnedBadges = progress.badges.filter(b => b.earnedAt).length;
        score += Math.min(earnedBadges * 30, 300);

        // Score from streak (up to 100 points)
        score += Math.min(progress.streak * 15, 100);

        // Bonus for variety (completing all scenario types) (up to 100 points)
        const scenarioTypesCompleted = Object.values(progress.scenariosCompleted).filter(v => v > 0).length;
        score += scenarioTypesCompleted * 25;

        return Math.min(score, 1000);
    },

    // Reset all progress (for testing)
    resetProgress: (): void => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
