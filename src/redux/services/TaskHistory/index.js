import { createAsyncThunk } from '@reduxjs/toolkit';

// import customAxios from '../../../http/axios';
import customAxios from '../../../http/axios';
import { errorHandler } from '../../../utils';

// import { errorHandler } from '../../../utils';

export const getTaskHistoryListThunk = createAsyncThunk(
  'getTaskHistoryListThunk',
  async ({ taskId }) => {
    try {
      const response = await customAxios.get(
        `/ticketTask/getTaskHistory/${taskId}`
      );
      console.log('getTaskHistoryListThunk', response);
      if (response?.status === 200 || response?.status === 201) {
        if (response?.data?.status === 1) {
          return { data: response?.data?.data, msg: response?.data?.message };
        } else {
          errorHandler(response);
        }
      }
    } catch (error) {
      errorHandler(error?.response);
      return Promise.reject(error?.response?.data?.message);
    }
  }
);
