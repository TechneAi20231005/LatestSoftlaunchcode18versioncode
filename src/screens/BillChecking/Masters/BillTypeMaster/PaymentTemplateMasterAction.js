import { createAsyncThunk } from "@reduxjs/toolkit";
import PaymentTemplateService from "../../../../services/Bill Checking/Masters/PaymentTemplateService";


export const paymentTemplate = createAsyncThunk(
    "paymentTemplate",
    async (config, thunkapi) => {
      try {
        const service = new PaymentTemplateService();
        const response = await service.getPaymentTemplate();
        console.log("resss", response);
        return response;
      } catch (error) {
        throw error;
      }
    }
  );