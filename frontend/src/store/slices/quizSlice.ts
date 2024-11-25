import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { QuizState, QuizQuestion } from '@/types/roadRules';
import { fetchQuizQuestions } from './roadRulesSlice';

const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  isComplete: false,
  showExplanation: false,
  selectedOption: null,
  isLoading: false,
  error: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    selectOption: (state, action: PayloadAction<number>) => {
      state.selectedOption = action.payload;
      state.showExplanation = true;
      
      if (state.questions[state.currentQuestionIndex].correctOption === action.payload) {
        state.score += 1;
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
        state.selectedOption = null;
        state.showExplanation = false;
      } else {
        state.isComplete = true;
      }
    },
    resetQuiz: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuizQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.currentQuestionIndex = 0;
        state.score = 0;
        state.isComplete = false;
        state.showExplanation = false;
        state.selectedOption = null;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchQuizQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load quiz questions';
      });
  },
});

export const { selectOption, nextQuestion, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;