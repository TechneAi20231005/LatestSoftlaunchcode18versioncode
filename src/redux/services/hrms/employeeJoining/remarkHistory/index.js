import { createAsyncThunk } from '@reduxjs/toolkit';
import customAxios from '../../../../../http/axios';
import { errorHandler } from '../../../../../utils';

export const getRemarkHistoryListThunk = createAsyncThunk(
  'followUp/getRemarkHistoryList',
  async () => {
    try {
      const response = await customAxios.get(`/remarkHistory`);
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
  },
);
