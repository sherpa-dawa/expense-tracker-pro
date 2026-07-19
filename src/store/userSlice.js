import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials) => {
    // API call here
    return { id: '1', email: credentials.email, name: 'User' };
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    isAuthenticated: false,
    preferences: {
      currency: 'USD',
      theme: 'dark',
      language: 'en',
      notifications: true,
      biometricAuth: false,
      cloudSync: true,
    },
    groups: [],
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    addGroup: (state, action) => {
      state.groups.push(action.payload);
    },
    removeGroup: (state, action) => {
      state.groups = state.groups.filter(g => g.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setUser, logout, updatePreferences, addGroup, removeGroup } = userSlice.actions;
export default userSlice.reducer;
