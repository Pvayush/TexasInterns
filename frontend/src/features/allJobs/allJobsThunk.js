import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios';


export const getAllJobsThunk = async (_, thunkAPI) => {
  try {
    const resp = await customFetch.get('/jobs');
    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};


export const showStatsThunk = async (_, thunkAPI) => {
  try {
    const resp = await customFetch.get('/jobs/stats');

    return resp.data;
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI);
  }
};
