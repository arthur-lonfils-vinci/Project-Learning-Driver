import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { InstructorState, Student, ScheduledSession, StudentGoal } from '@/types/instructor';
import api from '@/services/api';

// Async thunks
export const fetchStudents = createAsyncThunk(
  'instructor/fetchStudents',
  async () => {
    const response = await api.get<Student[]>('/api/instructor/students');
    return response.data;
  }
);

export const addStudent = createAsyncThunk(
  'instructor/addStudent',
  async (socialId: string) => {
    const response = await api.post<Student>('/api/instructor/students', { socialId });
    return response.data;
  }
);

export const scheduleSession = createAsyncThunk(
  'instructor/scheduleSession',
  async (session: Omit<ScheduledSession, 'id'>) => {
    const response = await api.post<ScheduledSession>('/api/instructor/sessions', session);
    return response.data;
  }
);

export const setStudentGoal = createAsyncThunk(
  'instructor/setStudentGoal',
  async (goal: Omit<StudentGoal, 'id'>) => {
    const response = await api.post<StudentGoal>('/api/instructor/goals', goal);
    return response.data;
  }
);

const initialState: InstructorState = {
  students: [],
  scheduledSessions: [],
  studentGoals: [],
  selectedStudent: null,
  isLoading: false,
  error: null,
};

const instructorSlice = createSlice({
  name: 'instructor',
  initialState,
  reducers: {
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch students';
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
      })
      .addCase(scheduleSession.fulfilled, (state, action) => {
        state.scheduledSessions.push(action.payload);
      })
      .addCase(setStudentGoal.fulfilled, (state, action) => {
        state.studentGoals.push(action.payload);
      });
  },
});

export const { setSelectedStudent } = instructorSlice.actions;
export default instructorSlice.reducer;