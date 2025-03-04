import { createSlice } from '@reduxjs/toolkit';
import {
  deleteItemCategoryListThunk,
  getDeleteRecordsThunk,
  getExportDeleteRecordsThunk,
  getItemCategoryListThunk,
  getKaragirKnockOffWtSizeRangeFilterListThunk,
  getVenderListThunk
} from '../../../services/po/common';
import { toast } from 'react-toastify';

const initialState = {
  venderList: [],
  itemCategoryList: [],
  DeleteRecordsList: [],
  filterItemCategoryList: [],
  filterCategoryList: [],
  exportDeletedRecordsList: [],

  karagirKnockOffWtSizeRangeFilterData: [],
  isLoading: {
    getVenderList: false,
    getItemCategoryList: false,
    getDeleteRecordsList: false,
    getKaragirKnockOffWtSizeRangeFilterData: false
  },
  errorMsg: {
    getVenderList: '',
    getItemCategoryList: '',
    getDeleteRecordsList: '',
    getKaragirKnockOffWtSizeRangeFilterData: ''
  },
  successMsg: {
    getVenderList: '',
    getItemCategoryList: '',
    getDeleteRecordsList: '',
    getKaragirKnockOffWtSizeRangeFilterData: ''
  }
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
        state.itemCategoryList = action?.payload?.data;

        state.filterItemCategoryList = Array?.from(
          new Map(
            action?.payload?.data?.map((i) => [
              i.item,
              { value: i.id, label: i.item }
            ])
          ).values()
        );
        state.filterCategoryList = action.payload.data.map((i) => ({
          value: i.id,
          label: i.category
        }));

        state.successMsg.getItemCategoryList = action.payload.msg;
      })
      .addCase(getItemCategoryListThunk.rejected, (state, action) => {
        state.isLoading.getItemCategoryList = false;
        state.itemCategoryList = [];
        state.errorMsg.getItemCategoryList = action.error.message;
      })

      // // getKaragirKnockOffWtSizeRangeFilterData
      .addCase(
        getKaragirKnockOffWtSizeRangeFilterListThunk.pending,
        (state, action) => {
          state.isLoading.getKaragirKnockOffWtSizeRangeFilterData = true;
        }
      )
      .addCase(
        getKaragirKnockOffWtSizeRangeFilterListThunk.fulfilled,
        (state, action) => {
          state.isLoading.getKaragirKnockOffWtSizeRangeFilterData = false;
          state.karagirKnockOffWtSizeRangeFilterData = action.payload.data;
          state.successMsg.getKaragirKnockOffWtSizeRangeFilterData =
            action.payload.msg;
        }
      )
      .addCase(
        getKaragirKnockOffWtSizeRangeFilterListThunk.rejected,
        (state, action) => {
          state.isLoading.getKaragirKnockOffWtSizeRangeFilterData = false;
          state.karagirKnockOffWtSizeRangeFilterData = [];
          state.errorMsg.getKaragirKnockOffWtSizeRangeFilterData =
            action.error.message;
        }
      )

      //// delete requisition

      .addCase(deleteItemCategoryListThunk.pending, (state, action) => {})
      .addCase(deleteItemCategoryListThunk.fulfilled, (state, action) => {
        toast.success(action.payload.msg);
      })
      .addCase(deleteItemCategoryListThunk.rejected, (state, action) => {
        toast.error(action.payload.msg);
      })

      .addCase(getDeleteRecordsThunk.pending, (state, action) => {
        state.isLoading.getDeleteRecordsList = true;
      })
      .addCase(getDeleteRecordsThunk.fulfilled, (state, action) => {
        state.isLoading.getDeleteRecordsList = false;
        state.DeleteRecordsList = action.payload.data;
        state.successMsg.getDeleteRecordsList = action.payload.msg;
      })
      .addCase(getDeleteRecordsThunk.rejected, (state, action) => {
        state.isLoading.getDeleteRecordsList = false;
        state.DeleteRecordsList = [];
        state.errorMsg.getDeleteRecordsList = action.error.message;
      })

      .addCase(getExportDeleteRecordsThunk.pending, (state, action) => {})
      .addCase(getExportDeleteRecordsThunk.fulfilled, (state, action) => {
        let exportData = action.payload.data;

        let count = 1;

        let exportDeletedRecordsList = [];
        for (const i in exportData) {
          exportDeletedRecordsList.push({
            Sr: count++,
            Item: exportData[i].item,
            Category: exportData[i].category,

            exact_wt: exportData[i].exact_wt,
            weight_range: exportData[i].weight_range,
            size_range: exportData[i].size_range,
            purity_range: exportData[i].purity_range,
            karagir_wt_range: exportData[i].karagir_wt_range,
            knockoff_wt_range: exportData[i].knockoff_wt_range,
            karagir_size_range: exportData[i].karagir_size_range
          });
        }
        state.exportDeletedRecordsList = exportDeletedRecordsList;
      })
      .addCase(getExportDeleteRecordsThunk.rejected, (state, action) => {});
  }
});

export default poCommonSlice.reducer;
