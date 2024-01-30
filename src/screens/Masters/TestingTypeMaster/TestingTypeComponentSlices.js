
import { createSlice } from "@reduxjs/toolkit";
import { testingData } from "./TestingTypeComponentAction";

const initialState = {
  status: "",
  err: "",
  testingData: [],
};

export const testingtypeSlice = createSlice({
  name: "testingtypeSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
  },
  extraReducers: (builder) => {
    
    builder.addCase(testingData.pending, (state) => {
        state.status = "loading";
      });
  
      builder.addCase(testingData.fulfilled, (state, action) => {
        const { payload } = action;
  
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let testingData = payload.data.data;
          state.status = "succeded";
          state.showLoaderModal = false;
          let count = 1;
          for (let i = 0; i < testingData.length; i++) {
            testingData[i].counter = count++;
          }
          state.testingData = [...testingData];
        }
      });
      builder.addCase(testingData.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default testingtypeSlice.reducer;
