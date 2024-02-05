import { createSlice } from "@reduxjs/toolkit";
import { paymentTemplate } from "./PaymentTemplateMasterAction";


const initialState = {
  status: "",
  err: "",
  paymentTemplate: [],
};

export const paymentTemplateSlice = createSlice({
  name: "paymentTemplateSlice",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(paymentTemplate.pending, (state) => {
        state.status = "loading";
      });
  
      builder.addCase(paymentTemplate.fulfilled, (state, action) => {
        const { payload } = action;
  
        if (payload?.status === 200 && payload?.data?.status === 1) {
          let paymentTemplate = payload.data.data;
  
          state.status = "succeded";
          state.showLoaderModal = false;
          let count = 1;
          for (let i = 0; i < paymentTemplate.length; i++) {
            paymentTemplate[i].counter = count++;
          }
          state.paymentTemplate = [...paymentTemplate];
        }
      });
      builder.addCase(paymentTemplate.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default paymentTemplateSlice.reducer;
