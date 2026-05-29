import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects`, getAuthHeader(token));
      return response.data.projects || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching projects');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/projects`, data, getAuthHeader(token));
      return response.data.project;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error creating project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/projects/${id}`, data, getAuthHeader(token));
      return response.data.project;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/projects/${id}`, getAuthHeader(token));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting project');
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching projects';
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      });
  }
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;
