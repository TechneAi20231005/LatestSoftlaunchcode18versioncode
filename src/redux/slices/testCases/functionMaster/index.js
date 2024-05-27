import { createSlice } from "@reduxjs/toolkit";
import {
  addFunctionMasterThunk,
  editFunctionMasterThunk,
  getFunctionMasterListThunk,
} from "../../../services/testCases/functionMaster";

const initialState = {
  functionMasetrList: [],
  isLoading: {
    getFunctionMasterList: false,
    addFunctionMaster: false,
    editFunctionMaster: false,
  },
  errorMsg: { getFunctionMasterList: "" },
  successMsg: { getFunctionMasterList: "" },
};
const functionMasterSlice = createSlice({
  name: "Function master",
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getFunctionMasterListThunk.pending, (state, action) => {
        state.isLoading.getFunctionMasterList = true;
      })
      .addCase(getFunctionMasterListThunk.fulfilled, (state, action) => {
        state.isLoading.getFunctionMasterList = false;
        state.functionMasetrList = action?.payload?.data;
        state.successMsg.getFunctionMasterList = action.payload.msg;
      })
      .addCase(getFunctionMasterListThunk.rejected, (state, action) => {
        state.isLoading.getFunctionMasterList = false;
        state.functionMasetrList = [];
        state.errorMsg.getFunctionMasterList = action.error.message;
      })

      // // add remark master
      .addCase(addFunctionMasterThunk.pending, (state, action) => {
        state.isLoading.addFunctionMaster = true;
      })
      .addCase(addFunctionMasterThunk.fulfilled, (state, action) => {
        state.isLoading.addFunctionMaster = false;
        state.successMsg.addFunctionMaster = action.payload;
      })
      .addCase(addFunctionMasterThunk.rejected, (state, action) => {
        state.isLoading.addFunctionMaster = false;
        state.errorMsg.addFunctionMaster = action.error.message;
      })

      // // edit remark master
      .addCase(editFunctionMasterThunk.pending, (state, action) => {
        state.isLoading.editFunctionMaster = true;
      })
      .addCase(editFunctionMasterThunk.fulfilled, (state, action) => {
        state.isLoading.editFunctionMaster = false;
        state.successMsg.editFunctionMaster = action.payload;
      })
      .addCase(editFunctionMasterThunk.rejected, (state, action) => {
        state.isLoading.editFunctionMaster = false;
        state.errorMsg.editFunctionMaster = action.error.message;
      });
  },
});

export default functionMasterSlice.reducer;
