import { createSlice } from "@reduxjs/toolkit";
import {
  addTestingGroupMasterThunk,
  editTestingGroupMasterThunk,
  getTestingGroupMasterListThunk,
} from "../../../services/testCases/testingGroupMaster";

const initialState = {
  testingGroupMasterList: [],
  filterTestingGroupMasterList: [],
  isLoading: {
    getTestingGroupMasterList: false,
    addTestingGroupMaster: false,
    editTestingGroupMaster: false,
    filterTestingGroupMasterList: false,
  },
  errorMsg: { getTestingGroupMasterList: "", filterTestingGroupMasterList: "" },
  successMsg: {
    getTestingGroupMasterList: "",
    filterTestingGroupMasterList: "",
  },
};
const testingGroupMasterSlice = createSlice({
  name: "Testing Group master",
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getTestingGroupMasterListThunk.pending, (state, action) => {
        state.isLoading.getTestingGroupMasterList = true;
      })
      .addCase(getTestingGroupMasterListThunk.fulfilled, (state, action) => {
        state.isLoading.getTestingGroupMasterList = false;
        state.testingGroupMasterList = action?.payload?.data;
        state.filterTestingGroupMasterList = action?.payload?.data
          ?.filter((d) => d.is_active === 1)
          .map((d) => ({ value: d.id, label: d.group_name }));
        state.successMsg.getTestingGroupMasterList = action.payload.msg;
      })
      .addCase(getTestingGroupMasterListThunk.rejected, (state, action) => {
        state.isLoading.getTestingGroupMasterList = false;
        state.testingGroupMasterList = [];
        state.errorMsg.getTestingGroupMasterList = action.error.message;
      })

      // // add remark master
      .addCase(addTestingGroupMasterThunk.pending, (state, action) => {
        state.isLoading.addTestingGroupMaster = true;
      })
      .addCase(addTestingGroupMasterThunk.fulfilled, (state, action) => {
        state.isLoading.addTestingGroupMaster = false;
        state.successMsg.addTestingGroupMaster = action.payload;
      })
      .addCase(addTestingGroupMasterThunk.rejected, (state, action) => {
        state.isLoading.addTestingGroupMaster = false;
        state.errorMsg.addTestingGroupMaster = action.error.message;
      })

      // // edit remark master
      .addCase(editTestingGroupMasterThunk.pending, (state, action) => {
        state.isLoading.editTestingGroupMaster = true;
      })
      .addCase(editTestingGroupMasterThunk.fulfilled, (state, action) => {
        state.isLoading.editTestingGroupMaster = false;
        state.successMsg.editTestingGroupMaster = action.payload;
      })
      .addCase(editTestingGroupMasterThunk.rejected, (state, action) => {
        state.isLoading.editTestingGroupMaster = false;
        state.errorMsg.editTestingGroupMaster = action.error.message;
      });
  },
});

export default testingGroupMasterSlice.reducer;
