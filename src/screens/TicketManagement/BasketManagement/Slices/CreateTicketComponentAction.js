import { createAsyncThunk } from '@reduxjs/toolkit';
import MyTicketService from '../../../services/TicketService/MyTicketService';

export const PostCreateTicket = createAsyncThunk(
  'PostCreateTicket',
  async (config, thunkapi) => {
    try {
      const service = new MyTicketService();
      const response = await service.postTicket(config);
      return response;
    } catch (error) {
      throw error;
    }
  }
);
