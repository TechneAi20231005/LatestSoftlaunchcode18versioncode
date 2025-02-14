import { createAsyncThunk } from '@reduxjs/toolkit';
import PaymentTemplateService from '../../../../services/Bill Checking/Masters/PaymentTemplateService';
import { errorHandler } from '../../../../utils';

export const paymentTemplate = createAsyncThunk(
  'paymentTemplate',
  async (config, thunkapi) => {
    try {
      const service = new PaymentTemplateService();
      const response = await service.getPaymentTemplate();

      return response;
    } catch (error) {
      errorHandler(error);
    }
  }
);
