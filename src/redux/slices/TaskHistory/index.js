import { createSlice } from '@reduxjs/toolkit';

import { getTaskHistoryListThunk } from '../../services/TaskHistory';

const initialState = {
  taskHistoryList: [],
  getFilterTaskHistoryList: [],

  isLoading: {
    getTaskHistoryList: false,
    getFilterTaskHistoryList: false
    // addReviewCommentMaster: false,
    // editReviewCommentMaster: false
  },
  errorMsg: {
    getTaskHistoryList: '',
    getFilterTaskHistoryList: '',
    editReviewCommentMaster: ''
  },
  successMsg: {
    getTaskHistoryList: '',
    getFilterTaskHistoryList: ''
    // editReviewCommentMaster: ''
  }
};
const taskHistorySlice = createSlice({
  name: 'Review Comment master',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getTaskHistoryListThunk.pending, (state, action) => {
        state.isLoading.getTaskHistoryList = true;
      })
      .addCase(getTaskHistoryListThunk.fulfilled, (state, action) => {
        state.isLoading.getTaskHistoryList = false;
        state.taskHistoryList = action?.payload?.data;
        console.log('taskHistoryList', state.taskHistoryList);
        state.getFilterTaskHistoryList = action?.payload?.data
          ?.filter((d) => d.is_active === 1)
          .map((d) => ({ value: d.id, label: d.reviewer_comment }));
        console.log('getFilterTaskHistoryList', state.getFilterTaskHistoryList);
        state.successMsg.getTaskHistoryList = action.payload.msg;
      })
      .addCase(getTaskHistoryListThunk.rejected, (state, action) => {
        state.isLoading.getReviewCommentMasterList = false;
        state.taskHistoryList = [];
        state.errorMsg.getReviewCommentMasterList = action.error.message;
      });

    // // add remark master
    //   .addCase(addReviewCommentMasterThunk.pending, (state, action) => {
    //     state.isLoading.addReviewCommentMaster = true;
    //   })
    //   .addCase(addReviewCommentMasterThunk.fulfilled, (state, action) => {
    //     state.isLoading.addReviewCommentMaster = false;
    //     state.successMsg.addReviewCommentMaster = action.payload;
    //   })
    //   .addCase(addReviewCommentMasterThunk.rejected, (state, action) => {
    //     state.isLoading.addReviewCommentMaster = false;
    //     state.errorMsg.addReviewCommentMaster = action.error.message;
    //   })

    // // edit remark master
    //   .addCase(editReviewCommentMasterThunk.pending, (state, action) => {
    //     state.isLoading.editReviewCommentMaster = true;
    //   })
    //   .addCase(editReviewCommentMasterThunk.fulfilled, (state, action) => {
    //     state.isLoading.editReviewCommentMaster = false;
    //     state.successMsg.editReviewCommentMaster = action.payload;
    //   })
    //   .addCase(editReviewCommentMasterThunk.rejected, (state, action) => {
    //     state.isLoading.editReviewCommentMaster = false;
    //     state.errorMsg.editReviewCommentMaster = action.error.message;
    //   });
  }
});

export default taskHistorySlice.reducer;
