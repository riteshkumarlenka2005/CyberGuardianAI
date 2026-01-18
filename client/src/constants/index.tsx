
import { ScenarioType, Scenario } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: ScenarioType.BANK,
    title: 'Unauthorized Transaction Alert',
    description: 'A suspicious SMS alert from your bank asks you to "verify" your identity via a link.',
    icon: '🏦',
    difficulty: 'Beginner'
  },
  {
    id: ScenarioType.JOB,
    title: 'Executive Assistant Offer',
    description: 'An enticing work-from-home offer with a high salary requires an initial equipment fee.',
    icon: '💼',
    difficulty: 'Intermediate'
  },
  {
    id: ScenarioType.GOVERNMENT,
    title: 'Tax Refund Investigation',
    description: 'The revenue service claims you owe urgent back taxes and threatens legal action.',
    icon: '🏛️',
    difficulty: 'Advanced'
  },
  {
    id: ScenarioType.EMERGENCY,
    title: 'Grandchild in Crisis',
    description: 'A frantic call from a relative claiming they are in jail abroad and need bail money.',
    icon: '🚨',
    difficulty: 'Intermediate'
  }
];

export const BADGES = [
  { id: 'otp', name: 'OTP Protector', icon: '🛡️', description: 'Recognized 5 fake OTP requests.' },
  { id: 'urgency', name: 'Urgency Detector', icon: '⏳', description: 'Stopped 3 scams using urgency tactics.' },
  { id: 'champion', name: 'Safety Champion', icon: '🏆', description: 'Completed all training modules.' }
];
