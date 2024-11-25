export interface Achievement {
  id: string;
  userId: string;
  type: AchievementType;
  title: Record<string, string>;
  description: Record<string, string>;
  earnedAt: string;
  progress?: number;
  maxProgress?: number;
  icon?: string;
}

export type AchievementType =
  | 'practice_hours'
  | 'perfect_speed'
  | 'theory_master'
  | 'night_driver'
  | 'distance_covered'
  | 'quiz_streak';

export interface AchievementsState {
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
}