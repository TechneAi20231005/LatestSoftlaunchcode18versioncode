import { createSlice } from "@reduxjs/toolkit";
import { departmentData } from "./DepartmentMasterAction";

const initialState = {
  status: "",
  err: "",
  departmentData: [],
};

export const departmentMasterSlice = createSlice({
  name: "departmentMasterSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(departmentData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(departmentData.fulfilled, (state, action) => {
      const { payload } = action;
      console.log("payload",payload);
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let departmentData = payload.data.data;
        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < departmentData.length; i++) {
          departmentData[i].counter = count++;
        }
        state.departmentData = [...departmentData];
      }
    });
    builder.addCase(departmentData.rejected, (state) => {
      state.status = "rejected";
    });
  },
});

export default departmentMasterSlice.reducer;
