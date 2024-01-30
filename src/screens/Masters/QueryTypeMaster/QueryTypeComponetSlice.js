import { createSlice } from "@reduxjs/toolkit";
import { queryTypeData } from "./QueryTypeComponetAction";
import { queryType } from "./QueryTypeComponetAction";

const initialState = {
  status: "",
  err: "",
  queryTypeData: [],
  queryType:[]
};

export const queryTypeSlice = createSlice({
  name: "queryTypeSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(queryTypeData.pending, (state) => {
        state.status = "loading";
      });
  
      builder.addCase(queryTypeData.fulfilled, (state, action) => {
        const { payload } = action;
  
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let queryTypeData = payload.data.data
            .filter((d) => d.is_active == 1)
            .map((d) => ({ value: d.id, label: d.group_name }));
  
          state.status = "succeded";
          state.showLoaderModal = false;
          let count = 1;
          for (let i = 0; i < queryTypeData.length; i++) {
            queryTypeData[i].counter = count++;
          }
          state.queryTypeData = [...queryTypeData];
        }
      });
      builder.addCase(queryTypeData.rejected, (state) => {
        state.status = "rejected";
      });


      builder.addCase(queryType.pending, (state) => {
        state.status = "loading";
      });
  
      builder.addCase(queryType.fulfilled, (state, action) => {
        const { payload } = action;
  
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let queryType = payload.data.data;
  
          state.status = "succeded";
          state.showLoaderModal = false;
          let count = 1;
          for (let i = 0; i < queryType.length; i++) {
            queryType[i].counter = count++;
          }
          state.queryType = [...queryType];
        }
      });
      builder.addCase(queryType.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default queryTypeSlice.reducer;
