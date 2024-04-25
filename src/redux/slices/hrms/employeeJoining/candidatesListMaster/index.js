import { createSlice } from '@reduxjs/toolkit';
import {
  addCandidatesMasterThunk,
  editCandidatesMasterThunk,
  getCandidatesMasterListThunk,
  getCandidatesDetailsThunk,
} from '../../../../services/hrms/employeeJoining/candidatesListMaster';

const initialState = {
  candidatesMasterList: [],
  candidateDetailsData: [],
  isLoading: {
    getCandidatesMasterList: false,
    getCandidatesDetailsData: false,
    addCandidatesMaster: false,
    editCandidatesMaster: false,
  },
  errorMsg: {
    getCandidatesMasterList: '',
    addCandidatesMaster: '',
    editCandidatesMaster: '',
    getCandidatesDetailsData: '',
  },
  successMsg: {
    getCandidatesMasterList: '',
    addCandidatesMaster: '',
    editCandidatesMaster: '',
    getCandidatesDetailsData: '',
  },
};
const candidatesMasterSlice = createSlice({
  name: 'Candidates master',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getCandidatesMasterListThunk.pending, (state, action) => {
        state.isLoading.getCandidatesMasterList = true;
      })
      .addCase(getCandidatesMasterListThunk.fulfilled, (state, action) => {
        state.isLoading.getCandidatesMasterList = false;
        state.candidatesMasterList = action?.payload?.data;
        state.successMsg.getCandidatesMasterList = action.payload.msg;
      })
      .addCase(getCandidatesMasterListThunk.rejected, (state, action) => {
        state.isLoading.getCandidatesMasterList = false;
        state.candidatesMasterList = [];
        state.errorMsg.getCandidatesMasterList = action.error.message;
      })

      // // get candidates details slices
      .addCase(getCandidatesDetailsThunk.pending, (state, action) => {
        state.isLoading.getCandidatesDetailsData = true;
      })
      .addCase(getCandidatesDetailsThunk.fulfilled, (state, action) => {
        state.isLoading.getCandidatesDetailsData = false;
        state.candidateDetailsData = action.payload.data;
        state.successMsg.getCandidatesDetailsData = action.payload.msg;
      })
      .addCase(getCandidatesDetailsThunk.rejected, (state, action) => {
        state.isLoading.getCandidatesDetailsData = false;
        state.candidateDetailsData = [];
        state.successMsg.getCandidatesDetailsData = action.error.message;
      })

      // // add candidates master
      .addCase(addCandidatesMasterThunk.pending, (state, action) => {
        state.isLoading.addCandidatesMaster = true;
      })
      .addCase(addCandidatesMasterThunk.fulfilled, (state, action) => {
        state.isLoading.addCandidatesMaster = false;
        state.successMsg.addCandidatesMaster = action.payload;
      })
      .addCase(addCandidatesMasterThunk.rejected, (state, action) => {
        state.isLoading.addCandidatesMaster = false;
        state.errorMsg.addCandidatesMaster = action.error.message;
      })

      // // edit candidates master
      .addCase(editCandidatesMasterThunk.pending, (state, action) => {
        state.isLoading.editCandidatesMaster = true;
      })
      .addCase(editCandidatesMasterThunk.fulfilled, (state, action) => {
        state.isLoading.editCandidatesMaster = false;
        state.successMsg.editCandidatesMaster = action.payload;
      })
      .addCase(editCandidatesMasterThunk.rejected, (state, action) => {
        state.isLoading.editCandidatesMaster = false;
        state.errorMsg.editCandidatesMaster = action.error.message;
      });
  },
});

export default candidatesMasterSlice.reducer;
