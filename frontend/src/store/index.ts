import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roadRulesReducer from './slices/roadRulesSlice';
import journeyReducer from './slices/journeySlice';
import achievementsReducer from './slices/achievementsSlice';
import quizReducer from './slices/quizSlice';
import instructorReducer from './slices/instructorSlice';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    roadRules: roadRulesReducer,
    journey: journeyReducer,
    achievements: achievementsReducer,
    quiz: quizReducer,
    instructor: instructorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

