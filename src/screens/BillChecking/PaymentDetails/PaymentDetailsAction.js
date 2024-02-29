import { createAsyncThunk } from "@reduxjs/toolkit";
import PaymentDetailsService from "../../../services/Bill Checking/PaymentDetailsService";


export const getPaymentDetails = createAsyncThunk(
  "getPaymentDetails",
  async (config, thunkapi) => {
    try {
      const service = new PaymentDetailsService();
      const response = await service.getPaymentDetails(config);
   
      return response;
    } catch (error) {
      throw error;
    }
  }
);

