import { createAsyncThunk } from '@reduxjs/toolkit';
import { config } from 'webpack';
import { getTaskUser } from '../../../../services/TicketService/TaskService';

export const getUserTaskData = createAsyncThunk(
  'getUserTaskData',
  async (config, thunkapi) => {
    try {
      const service = new getTaskUser(config);
      const response = await service.getCity();
      return response;
    } catch (error) {
      throw error;
    }
  }
);
