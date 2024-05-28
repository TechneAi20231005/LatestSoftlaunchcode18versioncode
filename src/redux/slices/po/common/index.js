import { createSlice } from '@reduxjs/toolkit';
import {
  getItemCategoryListThunk,
  getKaragirKnockOffWtSizeRangeFilterListThunk,
  getVenderListThunk,
} from '../../../services/po/common';

const initialState = {
  venderList: [],
  itemCategoryList: [],
  karagirKnockOffWtSizeRangeFilterData: [],
  isLoading: {
    getVenderList: false,
    getItemCategoryList: false,
    getKaragirKnockOffWtSizeRangeFilterData: false,
  },
  errorMsg: {
    getVenderList: '',
    getItemCategoryList: '',
    getKaragirKnockOffWtSizeRangeFilterData: '',
  },
  successMsg: {
    getVenderList: '',
    getItemCategoryList: '',
    getKaragirKnockOffWtSizeRangeFilterData: '',
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

      // // getKaragirKnockOffWtSizeRangeFilterData
      .addCase(getKaragirKnockOffWtSizeRangeFilterListThunk.pending, (state, action) => {
        state.isLoading.getKaragirKnockOffWtSizeRangeFilterData = true;
      })
      .addCase(getKaragirKnockOffWtSizeRangeFilterListThunk.fulfilled, (state, action) => {
        state.isLoading.getKaragirKnockOffWtSizeRangeFilterData = false;
        state.karagirKnockOffWtSizeRangeFilterData = action.payload.data;
        state.successMsg.getKaragirKnockOffWtSizeRangeFilterData = action.payload.msg;
      })
      .addCase(getKaragirKnockOffWtSizeRangeFilterListThunk.rejected, (state, action) => {
        state.isLoading.getKaragirKnockOffWtSizeRangeFilterData = false;
        state.karagirKnockOffWtSizeRangeFilterData = [];
        state.errorMsg.getKaragirKnockOffWtSizeRangeFilterData = action.error.message;
      });
  },
});

export default poCommonSlice.reducer;
