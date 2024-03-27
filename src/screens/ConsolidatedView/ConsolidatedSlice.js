import { createSlice } from "@reduxjs/toolkit";
import { consolidatedData } from "./ConsolidatedAction";
const initialState = {
  status: "",
  err: "",
  showLoaderModal: false,
  consolidatedData:[]
};

export const ConsolidatedSlice = createSlice({
  name: "ConsolidatedSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
   
    },
  },
  extraReducers: (builder) => {
    builder.addCase(consolidatedData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(consolidatedData.fulfilled, (state, action) => {
      const { payload } = action;

      if (payload?.status === 200 && payload?.data?.status === 1) {
        let consolidatedData = payload.data.data;
      
        state.status = "succeded";
        state.showLoaderModal = false;
        let count = 1;
        for (let i = 0; i < consolidatedData.length; i++) {
          consolidatedData[i].counter = count++;
        }
        state.consolidatedData = [...consolidatedData];
      }
    });
    builder.addCase(consolidatedData.rejected, (state) => {
      state.status = "rejected";
    });
  },
});
export default ConsolidatedSlice.reducer;
