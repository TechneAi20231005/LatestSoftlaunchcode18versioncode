import { createSlice } from '@reduxjs/toolkit';

import {
  addReviewCommentMasterThunk,
  editReviewCommentMasterThunk,
  getReviewCommentMasterListThunk
} from '../../../services/testCases/reviewCommentMaster';

const initialState = {
  reviewCommentMasterList: [],
  getFilterReviewCommentMasterList: [],

  isLoading: {
    getReviewCommentMasterList: false,
    getFilterReviewCommentMasterList: false,
    addReviewCommentMaster: false,
    editReviewCommentMaster: false
  },
  errorMsg: {
    getReviewCommentMasterList: '',
    getFilterReviewCommentMasterList: '',
    editReviewCommentMaster: ''
  },
  successMsg: {
    getReviewCommentMasterList: '',
    getFilterReviewCommentMasterList: '',
    editReviewCommentMaster: ''
  }
};
const reviewCommentMasterSlice = createSlice({
  name: 'Review Comment master',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getReviewCommentMasterListThunk.pending, (state, action) => {
        state.isLoading.getReviewCommentMasterList = true;
      })
      .addCase(getReviewCommentMasterListThunk.fulfilled, (state, action) => {
        state.isLoading.getReviewCommentMasterList = false;
        state.reviewCommentMasterList = action?.payload?.data;
        state.getFilterReviewCommentMasterList = action?.payload?.data
          ?.filter((d) => d.is_active === 1)
          .map((d) => ({ value: d.id, label: d.reviewer_comment }));
        state.successMsg.getReviewCommentMasterList = action.payload.msg;
      })
      .addCase(getReviewCommentMasterListThunk.rejected, (state, action) => {
        state.isLoading.getReviewCommentMasterList = false;
        state.reviewCommentMasterList = [];
        state.errorMsg.getReviewCommentMasterList = action.error.message;
      })

      // // add remark master
      .addCase(addReviewCommentMasterThunk.pending, (state, action) => {
        state.isLoading.addReviewCommentMaster = true;
      })
      .addCase(addReviewCommentMasterThunk.fulfilled, (state, action) => {
        state.isLoading.addReviewCommentMaster = false;
        state.successMsg.addReviewCommentMaster = action.payload;
      })
      .addCase(addReviewCommentMasterThunk.rejected, (state, action) => {
        state.isLoading.addReviewCommentMaster = false;
        state.errorMsg.addReviewCommentMaster = action.error.message;
      })

      // // edit remark master
      .addCase(editReviewCommentMasterThunk.pending, (state, action) => {
        state.isLoading.editReviewCommentMaster = true;
      })
      .addCase(editReviewCommentMasterThunk.fulfilled, (state, action) => {
        state.isLoading.editReviewCommentMaster = false;
        state.successMsg.editReviewCommentMaster = action.payload;
      })
      .addCase(editReviewCommentMasterThunk.rejected, (state, action) => {
        state.isLoading.editReviewCommentMaster = false;
        state.errorMsg.editReviewCommentMaster = action.error.message;
      });
  }
});

export default reviewCommentMasterSlice.reducer;
