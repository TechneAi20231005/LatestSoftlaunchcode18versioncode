import { createSlice } from '@reduxjs/toolkit';

import { getTaskHistoryListThunk } from '../../services/TaskHistory';

const initialState = {
  taskHistoryList: [],
  getFilterTaskHistoryList: [],
  getTaskHistoryList: [],
  filterTaskData: [],

  isLoading: {
    getTaskHistoryList: false,
    getFilterTaskHistoryList: false,
    filterTaskData: false
    // addReviewCommentMaster: false,
    // editReviewCommentMaster: false
  },
  errorMsg: {
    getTaskHistoryList: '',
    getFilterTaskHistoryList: '',
    editReviewCommentMaster: '',
    filterTaskData: ''
  },
  successMsg: {
    getTaskHistoryList: '',
    getFilterTaskHistoryList: '',
    filterTaskData: ''
    // editReviewCommentMaster: ''
  }
};
const taskHistorySlice = createSlice({
  name: 'taskHistorySlice',
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
        console.log('hh==>', action.payload);
        state.isLoading.getTaskHistoryList = false;
        state.taskHistoryList = action?.payload?.data;

        let counter = 1;
        var temp = [];

        state.taskHistoryList?.forEach((d) => {
          temp.push({
            Sr_No: counter++,
            Task_Id: d.ticket_id,

            task_name: d.task_name,
            basket_name: d.basket_name,
            start_date: d.start_date,
            end_date: d.end_date,
            // id: d.id,
            priority: d.priority,
            status: d.status,
            type_name: d.type_name,

            task_desc: d.task_desc,
            task_hours: d.task_hours,
            created_at: d.created_at,
            updated_at: d.updated_at,

            created_by_name: d.created_by_name,
            updated_by_name: d.updated_by_name
            // ticket_basket_id: d.ticket_basket_id,
            // total_worked_in_min: d.total_worked_in_min,
          });
          state.filterTaskData = temp;
        });

        state.getTaskHistoryListThunk = action?.payload?.data
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
