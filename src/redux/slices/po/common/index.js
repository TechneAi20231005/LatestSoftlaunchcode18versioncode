import { createSlice } from '@reduxjs/toolkit';
import {
  getItemCategoryListThunk,
  getKnockoffWtRangeListThunk,
  getSizeRangeListThunk,
  getVenderListThunk,
} from '../../../services/po/common';

const initialState = {
  venderList: [],
  itemCategoryList: [],
  knockoffWtRangeList: [],
  sizeRangeList: [],
  isLoading: {
    getVenderList: false,
    getItemCategoryList: false,
    getKnockoffWtRangeList: false,
    getSizeRangeList: false,
  },
  errorMsg: {
    getVenderList: '',
    getItemCategoryList: '',
    getKnockoffWtRangeList: '',
    getSizeRangeList: '',
  },
  successMsg: {
    getVenderList: '',
    getItemCategoryList: '',
    getKnockoffWtRangeList: '',
    getSizeRangeList: '',
  },
};
const poCommonSlice = createSlice({
  name: 'PO Common Filter',
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getVenderListThunk.pending, (state, action) => {
        state.isLoading.getVenderList = true;
      })
      .addCase(getVenderListThunk.fulfilled, (state, action) => {
        state.isLoading.getVenderList = false;
        state.venderList = action.payload.data;
        state.successMsg.getVenderList = action.payload.msg;
      })
      .addCase(getVenderListThunk.rejected, (state, action) => {
        state.isLoading.getVenderList = false;
        state.venderList = [];
        state.errorMsg.getVenderList = action.error.message;
      })

      // // item category list
      .addCase(getItemCategoryListThunk.pending, (state, action) => {
        state.isLoading.getItemCategoryList = true;
      })
      .addCase(getItemCategoryListThunk.fulfilled, (state, action) => {
        state.isLoading.getItemCategoryList = false;
        state.itemCategoryList = action.payload.data;
        state.successMsg.getItemCategoryList = action.payload.msg;
      })
      .addCase(getItemCategoryListThunk.rejected, (state, action) => {
        state.isLoading.getItemCategoryList = false;
        state.itemCategoryList = [];
        state.errorMsg.getItemCategoryList = action.error.message;
      })

      // // knockoff_wt_range list
      .addCase(getKnockoffWtRangeListThunk.pending, (state, action) => {
        state.isLoading.getKnockoffWtRangeList = true;
      })
      .addCase(getKnockoffWtRangeListThunk.fulfilled, (state, action) => {
        state.isLoading.getKnockoffWtRangeList = false;
        state.knockoffWtRangeList = action.payload.data;
        state.successMsg.getKnockoffWtRangeList = action.payload.msg;
      })
      .addCase(getKnockoffWtRangeListThunk.rejected, (state, action) => {
        state.isLoading.getKnockoffWtRangeList = false;
        state.knockoffWtRangeList = [];
        state.errorMsg.getKnockoffWtRangeList = action.error.message;
      })

      // // size range list
      .addCase(getSizeRangeListThunk.pending, (state, action) => {
        state.isLoading.getSizeRangeList = true;
      })
      .addCase(getSizeRangeListThunk.fulfilled, (state, action) => {
        state.isLoading.getSizeRangeList = false;
        state.sizeRangeList = action.payload.data;
        state.successMsg.getSizeRangeList = action.payload.msg;
      })
      .addCase(getSizeRangeListThunk.rejected, (state, action) => {
        state.isLoading.getSizeRangeList = false;
        state.sizeRangeList = [];
        state.errorMsg.getSizeRangeList = action.error.message;
      });
  },
});

export default poCommonSlice.reducer;
