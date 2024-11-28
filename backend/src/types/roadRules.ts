import type { Language } from './i18n.js';

export interface RoadRuleCategory {
  id: string;
  icon: string;
  orderIndex: number;
  translations: Record<Language, CategoryTranslation>;
  rules?: RoadRule[];
}

export interface CategoryTranslation {
  name: string;
  description: string;
}

export interface RoadRule {
  id: string;
  categoryId: string;
  orderIndex: number;
  mediaUrl?: string;
  validFrom?: string;
  validUntil?: string;
  translations: Record<Language, RuleTranslation>;
  quiz?: QuizQuestion[];
}

export interface RuleTranslation {
  title: string;
  content: string;
}

export interface QuizQuestion {
  id: string;
  ruleId: string;
  translations: Record<Language, QuizTranslation>;
  correctOption: number;
}

export interface QuizTranslation {
  question: string;
  options: string[];
  explanation: string;
}

export interface RoadRulesState {
  categories: RoadRuleCategory[];
  selectedCategory: string | null;
  selectedRule: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  isComplete: boolean;
  showExplanation: boolean;
  selectedOption: number | null;
  isLoading: boolean;
  error: string | null;
}
