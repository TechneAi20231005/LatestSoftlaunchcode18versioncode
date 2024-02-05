import { createSlice } from "@reduxjs/toolkit";
import { templateData } from "./TemplateComponetAction";


const initialState = {
  status: "",
  err: "",
  templateData: [],
};

export const templateSlice = createSlice({
  name: "templateSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
  },
  extraReducers: (builder) => {
  
    builder.addCase(templateData.pending, (state) => {
        state.status = "loading";
      });
  
      builder.addCase(templateData.fulfilled, (state, action) => {
        const { payload } = action;
  
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let templateData = payload.data.data;
  
          state.status = "succeded";
          state.showLoaderModal = false;
          let count = 1;
          for (let i = 0; i < templateData.length; i++) {
            templateData[i].counter = count++;
          }
          state.templateData = [...templateData];
        }
      });
      builder.addCase(templateData.rejected, (state) => {
        state.status = "rejected";
      });
  
  },
});

export default templateSlice.reducer;
