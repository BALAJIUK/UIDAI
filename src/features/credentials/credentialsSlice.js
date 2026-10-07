import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchCredentials } from './credentialsAPI'

// PART 1 — Credential Dashboard & State Management.
// Redux Toolkit slice: async fetch of credentials with explicit
// loading / success / error / empty states. Keeps only mock identifiers
// (in production, sensitive values would be fetched on demand).
export const loadCredentials = createAsyncThunk(
  'credentials/load',
  async (scenario, { signal, rejectWithValue }) => {
    try {
      return await fetchCredentials(signal, scenario)
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load credentials')
    }
  },
)

const credentialsSlice = createSlice({
  name: 'credentials',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCredentials.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadCredentials.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadCredentials.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Something went wrong'
        state.items = []
      })
  },
})

export const selectCredentialsState = (state) => state.credentials
export const selectCredentials = (state) => state.credentials.items
export const selectStatus = (state) => state.credentials.status
export const selectError = (state) => state.credentials.error

export default credentialsSlice.reducer
