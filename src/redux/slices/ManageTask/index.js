import { createSlice } from '@reduxjs/toolkit';

import {
  getBasketByIdListThunk,
  getSettingByNameListThunk,
  getSprintByTicketIdListThunk,
  getTaskBytTicketListThunk,
  getTicketByIdListThunk
} from '../../services/ManageTask';

const initialState = {
  getTicketById: [],
  getBasketById: [],
  getTaskByTicket: [],
  filterGetTaskByTicket: [],
  getSettingByName: [],
  getSprintByTicketId: [],
  getSprintData: [],
  filterSprintByTicketId: [],
  //   itemCategoryList: [],
  //   karagirKnockOffWtSizeRangeFilterData: [],
  isLoading: {
    getTicketByIdList: false,
    getBasketByIdList: false,
    getTaskBytTicketList: false,
    getSettingByNameList: false,
    getSprintByTicketIdList: false
    // getKaragirKnockOffWtSizeRangeFilterData: false
  },
  errorMsg: {
    getTicketByIdList: '',
    getBasketByIdList: '',
    getTaskBytTicketList: '',
    getSettingByNameList: '',
    getSprintByTicketIdList: ''
    // getKaragirKnockOffWtSizeRangeFilterData: ''
  },
  successMsg: {
    getTicketByIdList: '',
    getBasketByIdList: '',
    getTaskBytTicketList: '',
    getSettingByNameList: '',
    getSprintByTicketIdList: ''
    // getKaragirKnockOffWtSizeRangeFilterData: ''
  }
};
const manageTaskSlices = createSlice({
  name: 'manageTaskSlices',
  initialState,
  reducers: {
    setGetBasketById: (state, action) => {
      state.getBasketById = action.payload;
    },
    resetGetBasketById: (state) => {
      state.getBasketById = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getTicketByIdListThunk.pending, (state, action) => {
        state.isLoading.getTicketByIdList = true;
      })
      .addCase(getTicketByIdListThunk.fulfilled, (state, action) => {
        state.isLoading.getTicketByIdList = false;
        state.getTicketById = action?.payload?.data;

        state.successMsg.getTicketByIdList = action?.payload?.msg;
      })
      .addCase(getTicketByIdListThunk.rejected, (state, action) => {
        state.isLoading.getTicketByIdList = false;
        state.getTicketById = [];
        state.errorMsg.getTicketByIdList = action?.error?.message;
      })

      // // item category list
      .addCase(getBasketByIdListThunk.pending, (state, action) => {
        state.isLoading.getBasketByIdList = true;
      })
      .addCase(getBasketByIdListThunk.fulfilled, (state, action) => {
        state.isLoading.getBasketByIdList = false;
        state.getBasketById = action?.payload?.data;
        state.successMsg.getBasketByIdList = action.payload.msg;
      })
      .addCase(getBasketByIdListThunk.rejected, (state, action) => {
        state.isLoading.getBasketByIdList = false;
        state.getBasketById = [];
        state.errorMsg.getBasketByIdList = action?.error?.message;
      })

      .addCase(getTaskBytTicketListThunk.pending, (state, action) => {
        state.isLoading.getTaskBytTicketList = true;
      })
      .addCase(getTaskBytTicketListThunk.fulfilled, (state, action) => {
        state.isLoading.getTaskBytTicketList = false;
        state.getTaskByTicket = action?.payload?.data;
        state.filterGetTaskByTicket = state.getTaskByTicket.map((item) => ({
          value: item.id,
          label: item.task_name
        }));

        state.successMsg.getTaskBytTicketList = action?.payload?.msg;
      })
      .addCase(getTaskBytTicketListThunk.rejected, (state, action) => {
        state.isLoading.getTaskBytTicketList = false;
        state.getTaskByTicket = [];
        state.errorMsg.getTaskBytTicketList = action?.error?.message;
      })
      //

      .addCase(getSettingByNameListThunk.pending, (state, action) => {
        state.isLoading.getSettingByNameList = true;
      })
      .addCase(getSettingByNameListThunk.fulfilled, (state, action) => {
        state.isLoading.getSettingByNameList = false;
        state.getSettingByName = action?.payload?.data;

        state.successMsg.getSettingByNameList = action?.payload?.msg;
      })
      .addCase(getSettingByNameListThunk.rejected, (state, action) => {
        state.isLoading.getSettingByNameList = false;
        state.getSettingByName = [];
        state.errorMsg.getSettingByNameList = action?.error?.message;
      })
      //

      .addCase(getSprintByTicketIdListThunk.pending, (state, action) => {
        state.isLoading.getSprintByTicketIdList = true;
      })
      .addCase(getSprintByTicketIdListThunk.fulfilled, (state, action) => {
        state.isLoading.getSprintByTicketIdList = false;
        state.getSprintByTicketId = action?.payload?.data;

        state.filterSprintByTicketId = state.getSprintByTicketId.data.map(
          (data) => ({
            label: data.name,
            value: data.id
          })
        );

        state.successMsg.getSprintByTicketIdList = action?.payload?.msg;
      })
      .addCase(getSprintByTicketIdListThunk.rejected, (state, action) => {
        state.isLoading.getSprintByTicketIdList = false;
        state.getSprintByTicketId = [];
        state.errorMsg.getSprintByTicketIdList = action?.error?.message;
      });
  }
});

export const { setGetBasketById, resetGetBasketById } =
  manageTaskSlices.actions;
export default manageTaskSlices.reducer;
