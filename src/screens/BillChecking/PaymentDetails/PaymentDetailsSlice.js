import { createSlice } from "@reduxjs/toolkit";
import { getPaymentDetails } from "./PaymentDetailsAction";

const initialState = {
  status: "",
  err: "",
 paymentDetailsData:[]
};

export const PaymentDetailsSilce = createSlice({
  name: "PaymentDetailsSilce",
  initialState,
  reducers: {
    loaderModal: (state, action) => {
      state.showLoaderModal = action.payload;
      console.log("action of modal", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPaymentDetails.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getPaymentDetails.fulfilled, (state, action) => {
      const { payload } = action;
      if (payload?.status === 200 && payload?.data?.status === 1) {
        let paymentDetailsData = payload.data.data;
        let count = 1;
        for (let i = 0; i < paymentDetailsData.length; i++) {
            paymentDetailsData[i].counter = count++;
        }
       
        state.paymentDetailsData = [...paymentDetailsData];
      }
    });
    builder.addCase(getPaymentDetails.rejected, (state) => {
      state.status = "rejected";
    });

    
  },
});
export default PaymentDetailsSilce.reducer;
