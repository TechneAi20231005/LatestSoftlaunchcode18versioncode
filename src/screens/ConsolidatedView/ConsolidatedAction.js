import { createAsyncThunk } from '@reduxjs/toolkit';
import ConsolidatedService from '../../services/ProjectManagementService/ConsolidatedService';
import { errorHandler } from '../../utils';

export const consolidatedData = createAsyncThunk(
  'consolidatedData',
  async (config, thunkapi) => {
    try {
      const service = new ConsolidatedService();
      const response = await service.getConsolidatedView();
      return response;
    } catch (error) {
      errorHandler(error);
    }
  }
);
