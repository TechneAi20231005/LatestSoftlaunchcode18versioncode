import { createSlice } from '@reduxjs/toolkit';
import { addJobRoleMasterThunk, editJobRoleMasterThunk, getJobRoleMasterListThunk } from '../../services/jobRoleMaster';
// import {
//   addJobRoleMasterThunk,
//   editJobRoleMasterThunk,
//   getJobRoleMasterListThunk
// } from '../../slices/jobRoleMaster';

const initialState = {
  jobRoleMasterList: [],
  filterJobRoleMasterList: [],
  editJobRoleMaster: [],
  isLoading: {
    getJobRoleMasterList: false,
    addJobRoleMaster: false,
    editJobRoleMaster: false,
    filterJobRoleMasterList: false
  },
  errorMsg: {
    getJobRoleMasterList: '',
    filterJobRoleMasterList: '',
    editJobRoleMaster: ''
  },
  successMsg: {
    getJobRoleMasterList: '',
    filterJobRoleMasterList: '',
    editJobRoleMaster: ''
  }
};

const jobRoleMasterSlice = createSlice({
  name: 'Job Role master',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getJobRoleMasterListThunk.pending, (state, action) => {
        state.isLoading.getJobRoleMasterList = true;
      })
      .addCase(getJobRoleMasterListThunk.fulfilled, (state, action) => {
        state.isLoading.getJobRoleMasterList = false;
        state.jobRoleMasterList = action?.payload?.data;
        // state.filterJobRoleMasterList = action?.payload?.data?.filter((d) => d.is_active === 1).map((d) => ({ value: d.id, label: d.function_name }));
        state.successMsg.getJobRoleMasterList = action.payload.msg;
      })
      .addCase(getJobRoleMasterListThunk.rejected, (state, action) => {
        state.isLoading.getJobRoleMasterList = false;
        state.jobRoleMasterList = [];
        state.errorMsg.getJobRoleMasterList = action.error.message;
      })
      .addCase(addJobRoleMasterThunk.pending, (state, action) => {
        state.isLoading.addJobRoleMaster = true;
      })
      .addCase(addJobRoleMasterThunk.fulfilled, (state, action) => {
        state.isLoading.addJobRoleMaster = false;
        state.successMsg.addJobRoleMaster = action.payload;
      })
      .addCase(addJobRoleMasterThunk.rejected,(state,action)=>{
        state.isLoading.addJobRoleMaster=false;
        state.errorMsg.addJobRoleMaster=action.error.message;
      })

      .addCase(editJobRoleMasterThunk.pending,(state,action)=>{
        state.isLoading.editJobRoleMaster=true;
      })
      .addCase(editJobRoleMasterThunk.fulfilled,(state,action)=>{
        state.isLoading.editJobRoleMaster=false;
        state.successMsg.editJobRoleMaster=action.payload;
      })
      .addCase(editJobRoleMasterThunk.rejected,(state,action)=>{
        state.isLoading.editJobRoleMaster=false;
        state.errorMsg.editJobRoleMaster=action.error.message;
      })
  }
})
export default jobRoleMasterSlice.reducer;