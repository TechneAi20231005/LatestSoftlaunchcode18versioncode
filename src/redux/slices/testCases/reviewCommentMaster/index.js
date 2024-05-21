import { createSlice } from "@reduxjs/toolkit";

import {
  addReviewCommentMasterThunk,
  editReviewCommentMasterThunk,
  getReviewCommentMasterListThunk,
} from "../../../services/testCases/reviewCommentMaster";

const initialState = {
  reviewCommentMasetrList: [],
  isLoading: {
    getReviewCommentMasterList: false,
    addReviewCommentMaster: false,
    editReviewCommentMaster: false,
  },
  errorMsg: { getReviewCommentMasterList: "" },
  successMsg: { getReviewCommentMasterList: "" },
};
const reviewCommentMasterSlice = createSlice({
  name: "Review Comment master",
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
        state.reviewCommentMasetrList = action?.payload?.data;
        state.successMsg.getReviewCommentMasterList = action.payload.msg;
      })
      .addCase(getReviewCommentMasterListThunk.rejected, (state, action) => {
        state.isLoading.getReviewCommentMasterList = false;
        state.reviewCommentMasetrList = [];
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
  },
});

export default reviewCommentMasterSlice.reducer;
