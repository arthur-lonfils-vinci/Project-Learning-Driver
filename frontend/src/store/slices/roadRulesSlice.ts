import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  RoadRuleCategory,
  RoadRule,
  QuizQuestion,
  RoadRulesState,
} from '@/types/roadRules';
import api from '@/services/api';

// Async thunks
export const fetchCategories = createAsyncThunk(
  'roadRules/fetchCategories',
  async () => {
    const response = await api.get<RoadRuleCategory[]>('/api/rules/categories');
    return response.data;
  }
);

export const fetchRulesByCategory = createAsyncThunk(
  'roadRules/fetchRulesByCategory',
  async (categoryId: string) => {
    const response = await api.get<RoadRule[]>(
      `/api/rules/category/${categoryId}`
    );
    return response.data;
  }
);

export const fetchQuizQuestions = createAsyncThunk(
  'roadRules/fetchQuizQuestions',
  async (ruleId: string) => {
    const response = await api.get<QuizQuestion[]>(
      `/api/rules/rule/${ruleId}/quiz`
    );
    return response.data;
  }
);

const initialState: RoadRulesState = {
  categories: [],
  selectedCategory: null,
  selectedRule: null,
  isLoading: false,
  error: null,
};

const roadRulesSlice = createSlice({
  name: 'roadRules',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.selectedRule = null;
    },
    setSelectedRule: (state, action) => {
      state.selectedRule = action.payload;
    },
    clearSelection: (state) => {
      state.selectedCategory = null;
      state.selectedRule = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      // Handle fetchRulesByCategory
      .addCase(fetchRulesByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRulesByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const category = state.categories.find(
          (c) => c.id === state.selectedCategory
        );
        if (category) {
          category.rules = action.payload;
        }
      })
      .addCase(fetchRulesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch rules';
      });
  },
});

export const { setSelectedCategory, setSelectedRule, clearSelection } =
  roadRulesSlice.actions;
export default roadRulesSlice.reducer;
