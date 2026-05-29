import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async ({ projectId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/tasks/project/${projectId}`, getAuthHeader(token));
      return response.data.tasks || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async ({ projectId, data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/tasks/project/${projectId}`, data, getAuthHeader(token));
      return response.data.task;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error creating task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, data, getAuthHeader(token));
      return response.data.task;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, getAuthHeader(token));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTasks: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error fetching tasks';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      });
  }
});

export const { clearError, clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
