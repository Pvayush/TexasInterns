import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getAllJobsThunk } from './allJobsThunk';
import customFetch from '../../utils/axios'; // Make sure this path is correct and `axios` is set up properly.

const initialFiltersState = {
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
};

const initialState = {
  isLoading: true,
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [], 
  ...initialFiltersState,
};

// Thunks for fetching jobs
export const getAllJobs = createAsyncThunk('allJobs/getJobs', getAllJobsThunk);

// Thunk for showing statistics with demo user check
export const showStats = createAsyncThunk('allJobs/showStats', async (_, thunkAPI) => {
  const { user } = thunkAPI.getState().user;

  // Proceed with the API call for regular users
  try {
    const resp = await customFetch.get('/jobs/stats');
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue('There was an error fetching stats');
  }
});

const allJobsSlice = createSlice({
  name: 'allJobs',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
    handleChange: (state, { payload: { name, value } }) => {
      state.page = 1; // Reset to the first page when filters change
      state[name] = value;
    },
    clearFilters: (state) => {
      return { ...state, ...initialFiltersState };
    },
    changePage: (state, { payload }) => {
      state.page = payload;
    },
    clearAllJobsState: (state) => initialState,
  },
  extraReducers: {
    [getAllJobs.pending]: (state) => {
      state.isLoading = true;
    },
    [getAllJobs.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.jobs = payload.jobs; // Update jobs list
      state.numOfPages = payload.numOfPages; // Total number of pages
      state.totalJobs = payload.totalJobs; // Total number of jobs
    },
    [getAllJobs.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload); // Show error message
    },
    [showStats.pending]: (state) => {
      state.isLoading = true;
    },
    [showStats.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.stats = payload.defaultStats; // Update stats
      state.monthlyApplications = payload.monthlyApplications; // Update monthly applications
    },
    [showStats.rejected]: (state, { payload }) => {
      state.isLoading = false;
      toast.error(payload); // Show error message
    },
  },
});

export const {
  showLoading,
  hideLoading,
  handleChange,
  clearFilters,
  changePage,
  clearAllJobsState,
} = allJobsSlice.actions;

export default allJobsSlice.reducer;
