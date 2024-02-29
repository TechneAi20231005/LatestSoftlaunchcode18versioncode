import { createAsyncThunk } from "@reduxjs/toolkit";
import BillPaymentServices from "../../../services/Bill Checking/BillPaymentsServices/BillPaymentsServices";
import BillTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService"

export const getBillPayment = createAsyncThunk(
  "getPaymentDetails",
  async (config, thunkapi) => {
    try {
      const service = new BillPaymentServices();
      const response = await service.getBillPayments(config);
     
      return response;
    } catch (error) {
      throw error;
    }
  }
);


export const getBillDetailsOfPaymentGridData = createAsyncThunk(
    "getBillDetailsOfPaymentGridData",
    async (config, thunkapi) => {
   
      try {
        const service = new BillTransactionService();
        const response = await service.getBillDetailsOfPaymentGrid(config.id, config.payload);
     
        return response;
      } catch (error) {
        throw error;
      }
    }
  );
  
