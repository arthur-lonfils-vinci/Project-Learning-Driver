import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Achievement, AchievementsState } from '@/types/achievements';
import api from '@/services/api';

export const fetchAchievements = createAsyncThunk(
  'achievements/fetchAchievements',
  async () => {
    const response = await api.get('/api/achievements');
    return response.data;
  }
);

export const checkAchievements = createAsyncThunk(
  'achievements/check',
  async (data: { type: string; value: number }) => {
    const response = await api.post('/api/achievements/check', data);
    return response.data;
  }
);

const initialState: AchievementsState = {
  achievements: [],
  isLoading: false,
  error: null,
};

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.achievements = action.payload;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch achievements';
      })
      .addCase(checkAchievements.fulfilled, (state, action) => {
        const newAchievements = action.payload.filter(
          (achievement: Achievement) => !state.achievements.some((a) => a.id === achievement.id)
        );
        state.achievements.push(...newAchievements);
      });
  },
});

export default achievementsSlice.reducer;