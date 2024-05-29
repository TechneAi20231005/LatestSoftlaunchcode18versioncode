import { createSlice } from "@reduxjs/toolkit";
import {
  addTestingTypeMasterThunk,
  editTestingTypeMasterThunk,
  getTestingTypeMasterListThunk,
} from "../../../services/testCases/testingTypeMaster";

const initialState = {
  testingTypeMasterList: [],
  filterTestingTypeMasterList: [],
  isLoading: {
    getTestingTypeMasterList: false,
    addTestingTypeMaster: false,
    editTestingTypeMaster: false,
    filterTestingTypeMasterList: false,
  },
  errorMsg: {
    getTestingTypeMasterList: "",
    addTestingTypeMaster: "",
    editTestingTypeMaster: "",
    filterTestingTypeMasterList: "",
  },
  successMsg: {
    getTestingMasterList: "",
    addTestingTypeMaster: "",
    editTestingTypeMaster: "",
    filterTestingTypeMasterList: "",
  },
};
const testingTypeMasterSlice = createSlice({
  name: "Testing Type master",
  initialState,
  reducers: {
    // ==> normal reducer functions go here
  },
  extraReducers(builder) {
    builder
      .addCase(getTestingTypeMasterListThunk.pending, (state, action) => {
        state.isLoading.getTestingTypeMasterList = true;
      })
      .addCase(getTestingTypeMasterListThunk.fulfilled, (state, action) => {
        state.isLoading.getTestingTypeMasterList = false;
        state.testingTypeMasterList = action?.payload?.data;
        state.filterTestingTypeMasterList = action?.payload?.data
          ?.filter((d) => d.is_active === 1)
          .map((d) => ({ value: d.id, label: d.type_name }));
        state.successMsg.getTestingMasterList = action.payload.msg;
      })
      .addCase(getTestingTypeMasterListThunk.rejected, (state, action) => {
        state.isLoading.getTestingTypeMasterList = false;
        state.testingTypeMasterList = [];
        state.errorMsg.getTestingTypeMasterList = action.error.message;
      })

      // // add remark master
      .addCase(addTestingTypeMasterThunk.pending, (state, action) => {
        state.isLoading.addTestingTypeMaster = true;
      })
      .addCase(addTestingTypeMasterThunk.fulfilled, (state, action) => {
        state.isLoading.addTestingTypeMaster = false;
        state.successMsg.addTestingTypeMaster = action.payload;
      })
      .addCase(addTestingTypeMasterThunk.rejected, (state, action) => {
        state.isLoading.addTestingTypeMaster = false;
        state.errorMsg.addTestingTypeMaster = action.error.message;
      })

      // // edit remark master
      .addCase(editTestingTypeMasterThunk.pending, (state, action) => {
        state.isLoading.editTestingTypeMaster = true;
      })
      .addCase(editTestingTypeMasterThunk.fulfilled, (state, action) => {
        state.isLoading.editTestingTypeMaster = false;
        state.successMsg.editTestingTypeMaster = action.payload;
      })
      .addCase(editTestingTypeMasterThunk.rejected, (state, action) => {
        state.isLoading.editTestingTypeMaster = false;
        state.errorMsg.editTestingTypeMaster = action.error.message;
      });
  },
});

export default testingTypeMasterSlice.reducer;
