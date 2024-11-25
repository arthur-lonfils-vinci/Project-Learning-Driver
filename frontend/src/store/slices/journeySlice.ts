import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { JourneyState, DrivingSession, Location, SpeedEvent, SessionNote } from '@/types/journey';
import api from '@/services/api';

// Thunk actions
export const startSession = createAsyncThunk(
  'journey/startSession',
  async (location: Location) => {
    const response = await api.post('/api/sessions', {
      startLocation: location,
      startTime: new Date().toISOString(),
      weather: await getCurrentWeather(location),
    });
    return response.data;
  }
);

export const endSession = createAsyncThunk(
  'journey/endSession',
  async ({ sessionId, endLocation }: { sessionId: string; endLocation: Location }) => {
    const response = await api.post(`/api/sessions/${sessionId}/end`, { endLocation });
    return response.data;
  }
);

export const addSpeedEvent = createAsyncThunk(
  'journey/addSpeedEvent',
  async (event: Omit<SpeedEvent, 'id' | 'timestamp'>) => {
    const response = await api.post('/api/sessions/speed-event', event);
    return response.data;
  }
);

export const addSessionNote = createAsyncThunk(
  'journey/addSessionNote',
  async ({ sessionId, content }: { sessionId: string; content: string }) => {
    const response = await api.post(`/api/sessions/${sessionId}/notes`, { content });
    return response.data;
  }
);

// Helper function to get weather data
async function getCurrentWeather(location: Location): Promise<string> {
  // TODO: Implement actual weather API call
  return 'sunny'; // Placeholder
}

const initialState: JourneyState = {
  activeSession: null,
  sessions: [],
  isLoading: false,
  error: null,
};

const journeySlice = createSlice({
  name: 'journey',
  initialState,
  reducers: {
    updateLocation(state, action: PayloadAction<Location>) {
      if (state.activeSession && state.activeSession.route) {
        state.activeSession.route.waypoints.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeSession = action.payload;
        state.error = null;
      })
      .addCase(startSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to start session';
      })
      .addCase(endSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(endSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeSession = null;
        state.sessions.push(action.payload);
        state.error = null;
      })
      .addCase(endSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to end session';
      })
      .addCase(addSpeedEvent.fulfilled, (state, action) => {
        if (state.activeSession) {
          state.activeSession.speedEvents.push(action.payload);
        }
      })
      .addCase(addSessionNote.fulfilled, (state, action) => {
        if (state.activeSession) {
          state.activeSession.notes.push(action.payload);
        }
      });
  },
});

export const { updateLocation } = journeySlice.actions;
export default journeySlice.reducer;