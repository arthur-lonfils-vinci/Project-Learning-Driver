export interface Student {
  id: string;
  name: string;
  email: string;
  socialId: string;
  startDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  progress: {
    practiceHours: number;
    completedSessions: number;
    averageRating: number;
    quizzesPassed: number;
  };
}

export interface ScheduledSession {
  id: string;
  studentId: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  recurrenceRule?: string;
  notificationTimes?: string[];
}

export interface StudentGoal {
  id: string;
  studentId: string;
  type: 'PRACTICE_HOURS' | 'SKILL_MASTERY' | 'QUIZ_COMPLETION' | 'SPEED_CONTROL';
  target: number;
  progress: number;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface SessionEvaluation {
  id: string;
  sessionId: string;
  rating: number;
  strengths?: string;
  improvements?: string;
  notes?: string;
}

export interface InstructorState {
  students: Student[];
  scheduledSessions: ScheduledSession[];
  studentGoals: StudentGoal[];
  selectedStudent: string | null;
  isLoading: boolean;
  error: string | null;
}